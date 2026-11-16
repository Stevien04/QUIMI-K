"""Pruebas del servidor real con archivos temporales; no modifica la demo."""
import copy
import importlib.util
import json
import pathlib
import tempfile
import threading
import unittest
from unittest.mock import patch

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('quimik_server', ROOT / 'server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


class ScorePersistenceTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.file = pathlib.Path(self.temp.name) / 'db.json'
        self.cache_patch = patch.object(server, 'DB_CACHE_FILE', str(self.file))
        self.cache_patch.start()
        self.addCleanup(self.cache_patch.stop)
        self.pg_patch = patch.object(server, 'get_pg_connection', return_value=None)
        self.pg_patch.start()
        self.addCleanup(self.pg_patch.stop)
        self.initial = {
            'users': [{'id': 'usr-std-1', 'name': 'Juan Pérez', 'score': 18}],
            'classrooms': [{'id': '4A', 'students': [
                {'name': 'Juan Pérez (Tú)', 'score': 18},
                {'id': 'other', 'name': 'María Gómez', 'score': 19}
            ]}],
            'evaluations': [{'id': 'exam', 'submissions': []}]
        }
        self.payload = {
            'userId': 'usr-std-1', 'classroomId': '4A', 'score': 5,
            'attempts': 3, 'status': 'Pendiente', 'date': 'test',
            'practice': 'Examen de prueba',
            'notesHistory': [{'test': 'Examen de prueba', 'score': 5, 'letterGrade': 'C'}]
        }
        server.save_local_db_cache(copy.deepcopy(self.initial))

    def test_legacy_student_survives_reload_with_final_grade(self):
        self.assertTrue(server.save_score_to_pg(self.payload))
        data = json.loads(self.file.read_text())
        self.assertEqual(data['users'][0]['score'], 5)
        self.assertEqual(data['users'][0]['notesHistory'][0]['score'], 5)
        student = data['classrooms'][0]['students'][0]
        self.assertEqual(student['score'], 5)
        self.assertEqual(student['id'], 'usr-std-1')
        self.assertEqual(student['status'], 'Pendiente')
        self.assertEqual(student['attempts'], 3)
        self.assertEqual(data['classrooms'][0]['students'][1], self.initial['classrooms'][0]['students'][1])

    def test_id_takes_priority_and_ambiguous_names_are_not_updated(self):
        students = [{'id': 'different', 'name': 'Juan Pérez'},
                    {'name': 'Juan Pérez'}, {'name': 'Juan Pérez (Tú)'}]
        self.assertIsNone(server.find_classroom_student(students, 'usr-std-1', 'Juan Pérez'))
        students.append({'id': 'usr-std-1', 'name': 'Otro nombre'})
        self.assertIs(server.find_classroom_student(students, 'usr-std-1', 'Juan Pérez'), students[-1])
        self.assertIsNone(server.find_classroom_student(students, None, None))
        self.assertIsNone(server.find_classroom_student([{'name': 'Juan Pérez Otro'}], 'usr-std-1', 'Juan Pérez'))

    def test_concurrent_score_and_evaluation_preserve_both_writes(self):
        # Varias entregas simultáneas fuerzan la ruta de lectura/modificación/escritura.
        for _ in range(20):
            server.save_local_db_cache(copy.deepcopy(self.initial))
            start = threading.Barrier(3)
            def save_score():
                start.wait()
                server.save_score_to_pg(self.payload)
            def save_evaluation():
                start.wait()
                server.save_evaluation_to_pg({'id': 'exam', 'submissions': [{'studentId': 'usr-std-1', 'score': 5}]})
            workers = [threading.Thread(target=save_score), threading.Thread(target=save_evaluation)]
            for worker in workers:
                worker.start()
            start.wait()
            for worker in workers:
                worker.join(timeout=5)
                self.assertFalse(worker.is_alive(), 'el bloqueo no debe producir un interbloqueo')
            data = server.load_local_db_cache()
            self.assertEqual(data['users'][0]['score'], 5)
            self.assertEqual(data['classrooms'][0]['students'][0]['score'], 5)
            self.assertEqual(data['evaluations'][0]['submissions'][0]['score'], 5)

    def test_postgres_classroom_uses_the_same_legacy_matching(self):
        class Cursor:
            def execute(self, sql, args):
                self.sql = sql
                self.args = args
                if sql.startswith('UPDATE classrooms'):
                    self.saved_students = json.loads(args[0])
            def fetchone(self):
                return (copy.deepcopy(self.initial_students),)
            def close(self):
                pass
        cursor = Cursor()
        cursor.initial_students = self.initial['classrooms'][0]['students']
        connection = unittest.mock.Mock()
        connection.cursor.return_value = cursor
        with patch.object(server, 'get_pg_connection', return_value=connection):
            self.assertTrue(server.save_score_to_pg(self.payload))
        self.assertEqual(cursor.saved_students[0]['score'], 5)
        self.assertEqual(cursor.saved_students[0]['id'], 'usr-std-1')
        self.assertEqual(cursor.saved_students[1]['score'], 19)
        connection.commit.assert_called_once()

    def test_other_database_operations_preserve_existing_scores(self):
        server.save_user_to_pg({'id': 'new-user', 'name': 'Alumna nueva', 'score': 12})
        server.save_classroom_to_pg({'id': '4B', 'name': 'Otro salón', 'students': []})
        server.save_evaluation_to_pg({'id': 'new-exam', 'title': 'Evaluación nueva'})
        data = server.load_local_db_cache()
        self.assertEqual(next(u for u in data['users'] if u['id'] == 'new-user')['score'], 12)
        self.assertEqual(next(u for u in data['users'] if u['id'] == 'usr-std-1')['score'], 18)
        self.assertEqual(next(c for c in data['classrooms'] if c['id'] == '4A')['students'], self.initial['classrooms'][0]['students'])
        self.assertTrue(any(c['id'] == '4B' for c in data['classrooms']))
        server.delete_evaluation_from_pg('new-exam')
        data = server.load_local_db_cache()
        self.assertEqual([e['id'] for e in data['evaluations']], ['exam'])

    def test_zero_grade_and_existing_id_do_not_reassign_another_student(self):
        data = copy.deepcopy(self.initial)
        data['classrooms'][0]['students'] = [
            {'id': 'other', 'name': 'Juan Pérez', 'score': 19},
            {'id': 'usr-std-1', 'name': 'Nombre actualizado', 'score': 18}
        ]
        server.save_local_db_cache(data)
        payload = {**self.payload, 'score': 0}
        server.save_score_to_pg(payload)
        data = server.load_local_db_cache()
        self.assertEqual(data['users'][0]['score'], 0)
        self.assertEqual(data['classrooms'][0]['students'][0]['score'], 19)
        self.assertEqual(data['classrooms'][0]['students'][1]['score'], 0)

    def test_postgres_can_resolve_name_when_user_is_missing_from_json(self):
        data = copy.deepcopy(self.initial)
        data['users'] = []
        server.save_local_db_cache(data)
        class Cursor:
            def execute(self, sql, args):
                self.sql = sql
                if sql.startswith('UPDATE classrooms'):
                    self.saved_students = json.loads(args[0])
            def fetchone(self):
                if self.sql.startswith('SELECT name'):
                    return ('Juan Pérez',)
                return ([{'name': 'Juan Pérez (Tú)', 'score': 18}],)
            def close(self):
                pass
        cursor = Cursor()
        connection = unittest.mock.Mock()
        connection.cursor.return_value = cursor
        with patch.object(server, 'get_pg_connection', return_value=connection):
            self.assertTrue(server.save_score_to_pg(self.payload))
        self.assertEqual(cursor.saved_students[0]['score'], 5)
        self.assertEqual(cursor.saved_students[0]['id'], 'usr-std-1')


if __name__ == '__main__':
    unittest.main()
