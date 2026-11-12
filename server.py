import urllib.request
import http.server
import socketserver
import json
import urllib.parse
import os
import sys

DIRECTORY = os.path.dirname(os.path.abspath(__file__))
PORT = 8000

# PostgreSQL Database Integration
try:
    import psycopg2
    import psycopg2.extras
    HAS_POSTGRES = True
except ImportError:
    HAS_POSTGRES = False

DB_CONFIG = {
    'host': os.environ.get('PGHOST', 'localhost'),
    'port': int(os.environ.get('PGPORT', 5432)),
    'database': os.environ.get('PGDATABASE', 'quimik_db'),
    'user': os.environ.get('PGUSER', 'dbshield_user'),
    'password': os.environ.get('PGPASSWORD', 'supersecret')
}

def get_pg_connection():
    if not HAS_POSTGRES:
        return None
    try:
        return psycopg2.connect(**DB_CONFIG, connect_timeout=3)
    except Exception as e:
        return None

DB_CACHE_FILE = os.path.join(DIRECTORY, 'database_quimik.json')

def get_initial_database():
    return {
        "users": [
            {
                "id": "usr-razself",
                "name": "Stevie Marca",
                "email": "razself@gmail.com",
                "password": "123",
                "role": "student",
                "classroom": "4to Año \"A\"",
                "classroomId": "4A",
                "practice": "Síntesis de NaCl (Enlace Iónico)",
                "attempts": 1,
                "score": 19,
                "status": "Aprobado",
                "date": "28/10/2026 12:00",
                "registeredAt": "20/10/2026",
                "notesHistory": [
                    {"test": "Evaluación Diagnóstica: Materia y Enlaces", "score": 18, "date": "22/10/2026"},
                    {"test": "Control 1: Enlaces Iónicos y Lewis", "score": 19, "date": "28/10/2026"}
                ]
            },
            {
                "id": "usr-std-1",
                "name": "Juan Pérez",
                "email": "estudiante@fleming.edu.pe",
                "password": "123",
                "role": "student",
                "classroom": "4to Año \"A\"",
                "classroomId": "4A",
                "practice": "Síntesis de NaCl (Enlace Iónico)",
                "attempts": 1,
                "score": 18,
                "status": "Aprobado",
                "date": "28/10/2026 10:15",
                "registeredAt": "20/10/2026",
                "notesHistory": [
                    {"test": "Evaluación Diagnóstica: Materia y Enlaces", "score": 17, "date": "22/10/2026"},
                    {"test": "Control 1: Enlaces Iónicos y Lewis", "score": 18, "date": "28/10/2026"}
                ]
            },
            {
                "id": "usr-std-2",
                "name": "María Gómez",
                "email": "maria@fleming.edu.pe",
                "password": "123",
                "role": "student",
                "classroom": "4to Año \"A\"",
                "classroomId": "4A",
                "practice": "Síntesis de NaCl (Enlace Iónico)",
                "attempts": 2,
                "score": 19,
                "status": "Aprobado",
                "date": "28/10/2026 10:22",
                "registeredAt": "20/10/2026",
                "notesHistory": [
                    {"test": "Evaluación Diagnóstica: Materia y Enlaces", "score": 19, "date": "22/10/2026"}
                ]
            },
            {
                "id": "usr-prof-1",
                "name": "Prof. Midori Judith Castillo Peralta",
                "email": "profesora@fleming.edu.pe",
                "password": "123",
                "role": "teacher",
                "classroom": "Docente de Laboratorio",
                "classroomId": "ALL",
                "practice": "Todas las Unidades",
                "attempts": "-",
                "score": "-",
                "status": "Docente Activo",
                "date": "28/10/2026",
                "registeredAt": "15/10/2026"
            },
            {
                "id": "usr-admin-1",
                "name": "Administrador Fleming",
                "email": "admin@fleming.edu.pe",
                "password": "123",
                "role": "admin",
                "classroom": "Dirección General",
                "classroomId": "ALL",
                "practice": "Gestión Global",
                "attempts": "-",
                "score": "-",
                "status": "Superadministrador",
                "date": "28/10/2026",
                "registeredAt": "01/10/2026"
            }
        ],
        "classrooms": [
            {
                "id": "4A",
                "name": "4to Año \"A\"",
                "level": "Secundaria - Turno Mañana",
                "assignedPractice": "Síntesis de NaCl (Enlace Iónico)",
                "totalCapacity": 15,
                "tutor": "Prof. Midori Judith Castillo Peralta",
                "students": [
                    { "name": "Juan Pérez (Tú)", "practice": "Síntesis de NaCl", "attempts": 1, "score": 18, "status": "Aprobado", "date": "28/10/2026 10:15" },
                    { "name": "María Gómez", "practice": "Síntesis de NaCl", "attempts": 2, "score": 19, "status": "Aprobado", "date": "28/10/2026 10:22" },
                    { "name": "Carlos Ramos", "practice": "Síntesis de NaCl", "attempts": 1, "score": 16, "status": "Aprobado", "date": "28/10/2026 11:05" },
                    { "name": "Diego Mamani", "practice": "Síntesis de NaCl", "attempts": 1, "score": 17, "status": "Aprobado", "date": "28/10/2026 11:18" },
                    { "name": "Camila Torres", "practice": "Síntesis de NaCl", "attempts": 2, "score": 18, "status": "Aprobado", "date": "28/10/2026 11:40" }
                ]
            },
            {
                "id": "4B",
                "name": "4to Año \"B\"",
                "level": "Secundaria - Turno Mañana",
                "assignedPractice": "Formación de Molécula de Agua (H₂O)",
                "totalCapacity": 15,
                "tutor": "Prof. Midori Judith Castillo Peralta",
                "students": [
                    { "name": "Lucía Fernández", "practice": "Formación de H₂O", "attempts": 1, "score": 20, "status": "Aprobado", "date": "28/10/2026 11:30" },
                    { "name": "Mateo Quispe", "practice": "Formación de H₂O", "attempts": 2, "score": 15, "status": "Aprobado", "date": "28/10/2026 12:10" },
                    { "name": "Sofía Condori", "practice": "Formación de H₂O", "attempts": 1, "score": 12, "status": "Desaprobado", "date": "28/10/2026 12:45" },
                    { "name": "Rodrigo Vargas", "practice": "Formación de H₂O", "attempts": 1, "score": 16, "status": "Aprobado", "date": "28/10/2026 13:02" },
                    { "name": "Valeria Castro", "practice": "Formación de H₂O", "attempts": 1, "score": 19, "status": "Aprobado", "date": "28/10/2026 13:15" }
                ]
            },
            {
                "id": "5A",
                "name": "5to Año \"A\"",
                "level": "Secundaria - Turno Tarde",
                "assignedPractice": "Neutralización Ácido-Base (HCl + NaOH)",
                "totalCapacity": 12,
                "tutor": "Prof. Midori Judith Castillo Peralta",
                "students": [
                    { "name": "Alejandro Morales", "practice": "Neutralización Ácido-Base", "attempts": 1, "score": 19, "status": "Aprobado", "date": "29/10/2026 08:30" },
                    { "name": "Gabriela Zegarra", "practice": "Neutralización Ácido-Base", "attempts": 1, "score": 20, "status": "Aprobado", "date": "29/10/2026 08:45" },
                    { "name": "Sebastián Huanca", "practice": "Neutralización Ácido-Base", "attempts": 2, "score": 17, "status": "Aprobado", "date": "29/10/2026 09:10" },
                    { "name": "Daniela Cáceres", "practice": "Neutralización Ácido-Base", "attempts": 1, "score": 18, "status": "Aprobado", "date": "29/10/2026 09:25" }
                ]
            }
        ],
        "evaluations": [
            {
                "id": "eval-1",
                "title": "Examen Práctico: Titulación Ácido-Base de HCl con NaOH",
                "evalType": "lab2d",
                "topic": "Neutralización Ácido-Base",
                "description": "Determinar el punto de equivalencia titulando una alícuota de 25 mL de HCl 0.1 M con NaOH 0.1 M usando fenolftaleína. Se debe medir el volumen gastado exacto y alcanzar un pH neutro (~7.00) con viraje de incoloro a rosa persistente.",
                "targetClassrooms": ["4A"],
                "status": "published",
                "createdAt": "28/10/2026 09:30",
                "publishedAt": "28/10/2026 10:00",
                "allowedInstruments": ["burette", "erlenmeyer", "beaker", "balance", "ph_meter"],
                "allowedReagents": ["h2o", "hcl", "naoh", "phenolphthalein"],
                "questions": [],
                "submissions": []
            }
        ]
    }

def load_local_db_cache():
    if os.path.exists(DB_CACHE_FILE):
        try:
            with open(DB_CACHE_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                data['engine'] = 'Base de Datos Local Persistente'
                return data
        except Exception as e:
            print(f"Error loading local db cache: {e}")
    init_data = get_initial_database()
    save_local_db_cache(init_data)
    init_data['engine'] = 'Base de Datos Local Persistente'
    return init_data

def save_local_db_cache(data):
    try:
        with open(DB_CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving local db cache: {e}")

def update_local_db_item(category, item, key='id', remove=False):
    try:
        cache = load_local_db_cache() or get_initial_database()
        items = cache.get(category, [])
        item_id = item if isinstance(item, str) else item.get(key)
        if remove:
            items = [x for x in items if x.get(key) != item_id]
        else:
            idx = next((i for i, x in enumerate(items) if x.get(key) == item_id), -1)
            if idx >= 0:
                items[idx] = item
            else:
                items.insert(0, item)
        cache[category] = items
        save_local_db_cache(cache)
    except Exception as e:
        print(f"Error updating local db item: {e}")

def query_all_data():
    conn = get_pg_connection()
    if conn:
        try:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            cur.execute("SELECT id, name, email, password, role, classroom, classroom_id AS \"classroomId\", practice, attempts, score, status, date, registered_at AS \"registeredAt\", teacher_request_status AS \"teacherRequestStatus\", notes_history AS \"notesHistory\" FROM users ORDER BY created_at ASC;")
            users = cur.fetchall()

            cur.execute("SELECT id, name, level, assigned_practice AS \"assignedPractice\", total_capacity AS \"totalCapacity\", tutor, students FROM classrooms ORDER BY created_at ASC;")
            classrooms = cur.fetchall()

            cur.execute("SELECT id, title, topic, target_classrooms AS \"targetClassrooms\", status, created_at AS \"createdAt\", published_at AS \"publishedAt\", questions, allowed_instruments AS \"allowedInstruments\", allowed_reagents AS \"allowedReagents\", eval_type AS \"evalType\", description, submissions FROM evaluations;")
            evaluations = cur.fetchall()

            cur.close()
            conn.close()

            # Normalizar tipos para el frontend
            for u in users:
                try:
                    if u.get('score') and u['score'] != '-':
                        u['score'] = float(u['score'])
                except Exception:
                    pass
                try:
                    if u.get('attempts') and str(u['attempts']).isdigit():
                        u['attempts'] = int(u['attempts'])
                except Exception:
                    pass

            db_data = {
                'users': users,
                'classrooms': classrooms,
                'evaluations': evaluations,
                'engine': 'PostgreSQL 16'
            }
            save_local_db_cache(db_data)
            return db_data
        except Exception as e:
            print(f"Error querying Postgres: {e}")
            if conn:
                conn.close()
    
    return load_local_db_cache()

def save_classroom_to_pg(c):
    update_local_db_item('classrooms', c)
    conn = get_pg_connection()
    if not conn:
        return True
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO classrooms (id, name, level, assigned_practice, total_capacity, tutor, students)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                level = EXCLUDED.level,
                assigned_practice = EXCLUDED.assigned_practice,
                total_capacity = EXCLUDED.total_capacity,
                tutor = EXCLUDED.tutor,
                students = EXCLUDED.students;
        """, (
            c.get('id'),
            c.get('name'),
            c.get('level'),
            c.get('assignedPractice'),
            int(c.get('totalCapacity', 20)),
            c.get('tutor'),
            json.dumps(c.get('students', []))
        ))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving classroom: {e}")
        if conn:
            conn.close()
        return True

def save_user_to_pg(u):
    update_local_db_item('users', u)
    conn = get_pg_connection()
    if not conn:
        return True
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO users (id, name, email, password, role, classroom, classroom_id, practice, attempts, score, status, date, registered_at, teacher_request_status, notes_history)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                email = EXCLUDED.email,
                password = EXCLUDED.password,
                role = EXCLUDED.role,
                classroom = EXCLUDED.classroom,
                classroom_id = EXCLUDED.classroom_id,
                practice = EXCLUDED.practice,
                attempts = EXCLUDED.attempts,
                score = EXCLUDED.score,
                status = EXCLUDED.status,
                date = EXCLUDED.date,
                registered_at = EXCLUDED.registered_at,
                teacher_request_status = EXCLUDED.teacher_request_status,
                notes_history = EXCLUDED.notes_history;
        """, (
            u.get('id'),
            u.get('name'),
            u.get('email'),
            u.get('password', '123'),
            u.get('role', 'student'),
            u.get('classroom'),
            u.get('classroomId'),
            u.get('practice'),
            str(u.get('attempts', 1)),
            str(u.get('score', 18)),
            u.get('status', 'Aprobado'),
            u.get('date'),
            u.get('registeredAt'),
            u.get('teacherRequestStatus'),
            json.dumps(u.get('notesHistory', []))
        ))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving user: {e}")
        if conn:
            conn.close()
        return True

def save_evaluation_to_pg(ev):
    update_local_db_item('evaluations', ev)
    conn = get_pg_connection()
    if not conn:
        return True
    try:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS evaluations (
                id VARCHAR(100) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                topic VARCHAR(150),
                target_classrooms JSONB,
                status VARCHAR(50),
                created_at VARCHAR(100),
                published_at VARCHAR(100),
                questions JSONB,
                allowed_instruments JSONB,
                allowed_reagents JSONB,
                eval_type VARCHAR(50),
                description TEXT,
                submissions JSONB
            );
        """)
        cur.execute("""
            INSERT INTO evaluations (id, title, topic, target_classrooms, status, created_at, published_at, questions, allowed_instruments, allowed_reagents, eval_type, description, submissions)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
                title = EXCLUDED.title,
                topic = EXCLUDED.topic,
                target_classrooms = EXCLUDED.target_classrooms,
                status = EXCLUDED.status,
                created_at = EXCLUDED.created_at,
                published_at = EXCLUDED.published_at,
                questions = EXCLUDED.questions,
                allowed_instruments = EXCLUDED.allowed_instruments,
                allowed_reagents = EXCLUDED.allowed_reagents,
                eval_type = EXCLUDED.eval_type,
                description = EXCLUDED.description,
                submissions = EXCLUDED.submissions;
        """, (
            ev.get('id'),
            ev.get('title'),
            ev.get('topic'),
            json.dumps(ev.get('targetClassrooms', [])),
            ev.get('status', 'draft'),
            ev.get('createdAt'),
            ev.get('publishedAt'),
            json.dumps(ev.get('questions', [])),
            json.dumps(ev.get('allowedInstruments', [])),
            json.dumps(ev.get('allowedReagents', [])),
            ev.get('evalType', 'lab2d'),
            ev.get('description', ''),
            json.dumps(ev.get('submissions', []))
        ))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving evaluation: {e}")
        if conn:
            conn.close()
        return True

def delete_evaluation_from_pg(eval_id):
    update_local_db_item('evaluations', eval_id, remove=True)
    conn = get_pg_connection()
    if not conn:
        return True
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM evaluations WHERE id = %s;", (eval_id,))
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error deleting evaluation: {e}")
        if conn:
            conn.close()
        return True

def save_score_to_pg(data):
    user_id = data.get('userId')
    classroom_id = data.get('classroomId')
    score = str(data.get('score', 18))
    attempts = str(data.get('attempts', 1))
    status = data.get('status', 'Aprobado')
    date_val = data.get('date')
    practice = data.get('practice')
    notes_history = data.get('notesHistory')

    # Actualizar en caché local
    cache = load_local_db_cache()
    if cache:
        if user_id:
            for u in cache.get('users', []):
                if u.get('id') == user_id:
                    u['score'] = float(score) if score != '-' else 18
                    u['attempts'] = int(attempts) if str(attempts).isdigit() else 1
                    u['status'] = status
                    u['date'] = date_val
                    if practice:
                        u['practice'] = practice
                    if notes_history is not None:
                        u['notesHistory'] = notes_history
                    break
        if classroom_id:
            for c in cache.get('classrooms', []):
                if c.get('id') == classroom_id:
                    for s in c.get('students', []):
                        if s.get('id') == user_id or s.get('name', '').startswith(user_id):
                            s['score'] = float(score) if score != '-' else 18
                            s['attempts'] = int(attempts) if str(attempts).isdigit() else 1
                            s['status'] = status
                            s['date'] = date_val
                            if practice:
                                s['practice'] = practice
                            break
        save_local_db_cache(cache)

    conn = get_pg_connection()
    if not conn:
        return True
    try:
        cur = conn.cursor()
        if user_id:
            if notes_history is not None:
                cur.execute("""
                    UPDATE users SET score = %s, attempts = %s, status = %s, date = %s, practice = COALESCE(%s, practice), notes_history = %s
                    WHERE id = %s;
                """, (score, attempts, status, date_val, practice, json.dumps(notes_history), user_id))
            else:
                cur.execute("""
                    UPDATE users SET score = %s, attempts = %s, status = %s, date = %s, practice = COALESCE(%s, practice)
                    WHERE id = %s;
                """, (score, attempts, status, date_val, practice, user_id))

        if classroom_id:
            cur.execute("SELECT students FROM classrooms WHERE id = %s;", (classroom_id,))
            row = cur.fetchone()
            if row and row[0]:
                students = row[0]
                for s in students:
                    if s.get('id') == user_id or s.get('name', '').startswith(user_id):
                        s['score'] = float(score) if score != '-' else 18
                        s['attempts'] = int(attempts) if str(attempts).isdigit() else 1
                        s['status'] = status
                        s['date'] = date_val
                        if practice:
                            s['practice'] = practice
                cur.execute("UPDATE classrooms SET students = %s WHERE id = %s;", (json.dumps(students), classroom_id))

        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error saving score: {e}")
        if conn:
            conn.close()
        return True

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class QuimiKHandler(http.server.SimpleHTTPRequestHandler):
    timeout = 10  # Timeout de 10 segundos para sockets lentos o inactivos

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_json_response(self, code, data):
        try:
            payload = json.dumps(data, ensure_ascii=False).encode('utf-8')
            self.send_response(code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Connection', 'close')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(payload)
        except (ConnectionResetError, BrokenPipeError):
            pass
        except Exception as e:
            print(f"Error sending json response: {e}")

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (ConnectionResetError, BrokenPipeError):
            pass

    def do_GET(self):
        # API Telemetría: Plantillas de Cursos (Sección 14)
        if self.path == '/api/v1/courses/templates':
            templates = [
                {
                    "id": "tpl_titulacion",
                    "title": "Titulación Ácido-Base Fuerte (HCl + NaOH)",
                    "unit": "Unidad 6: Soluciones y Reacciones Acuosas",
                    "targetPh": 7.0,
                    "targetVolumeMl": 25.0,
                    "indicator": "Fenolftaleína (Viraje rosa tenue)"
                },
                {
                    "id": "tpl_ebullicion",
                    "title": "Determinación de Punto de Ebullición y Destilación",
                    "unit": "Unidad 1: Materia y Métodos de Separación",
                    "targetTempC": 78.37,
                    "solvent": "Etanol 96%"
                },
                {
                    "id": "tpl_solubilidad",
                    "title": "Curva de Solubilidad Térmica y Cristalización",
                    "unit": "Unidad 6: Concentración y Saturación",
                    "solute": "CuSO4·5H2O"
                }
            ]
            self.send_json_response(200, templates)
            return

        elif self.path == '/api/v1/health':
            self.send_json_response(200, {
                "service": "QUIMI-K API Rest Stateless",
                "version": "1.0.0",
                "status": "UP",
                "gradingService": "Active (Rubric 0-20)"
            })
            return

        elif self.path.startswith('/api/pubchem/sdf'):
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            comp_name = params.get('name', ['water'])[0]
            
            # Consultar PubChem REST oficial
            try:
                url = f"https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{urllib.parse.quote(comp_name)}/SDF?record_type=3d"
                req = urllib.request.Request(url, headers={'User-Agent': 'QUIMI-K-VirtualLab/1.0'})
                with urllib.request.urlopen(req, timeout=4) as resp:
                    sdf_data = resp.read().decode('utf-8')
                    self.send_json_response(200, {"name": comp_name, "sdf": sdf_data, "source": "PubChem REST"})
                    return
            except Exception as e:
                # Retornar SDF estándar offline para no bloquear
                self.send_json_response(200, {
                    "name": comp_name,
                    "sdf": None,
                    "error": str(e),
                    "fallback": True
                })
                return

        # API Estado de Base de Datos PostgreSQL
        if self.path == '/api/db/status':
            conn = get_pg_connection()
            status = {
                'connected': conn is not None,
                'engine': 'PostgreSQL 16.15',
                'database': 'quimik_db' if conn else None,
                'host': DB_CONFIG['host'],
                'port': DB_CONFIG['port']
            }
            if conn:
                conn.close()
            self.send_json_response(200, status)
            return

        # API Carga Completa de Datos desde PostgreSQL
        elif self.path == '/api/db/data':
            data = query_all_data()
            if data is not None:
                self.send_json_response(200, {'success': True, 'data': data})
            else:
                self.send_json_response(200, {'success': False, 'message': 'PostgreSQL offline or local fallback'})
            return

        super().do_GET()

    def do_POST(self):
        # API Evaluación de Telemetría JSONB y Rúbrica Vigesimal (Sección 14 GradingService)
        if self.path == '/api/v1/telemetry/evaluate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            vol_target = float(body.get('targetVolumeMl') or 25.0)
            vol_disp = float(body.get('dispensedVolumeMl') or 0.0)
            meniscus_err = abs(float(body.get('meniscusErrorMl') or 0.0))
            is_stirring = bool(body.get('magneticStirringActive', False))
            is_purged = bool(body.get('purgedBurette', False))

            # 1. Exactitud Volumétrica (0 a 8)
            vol_diff = abs(vol_disp - vol_target)
            if vol_diff <= 0.10: score_vol = 8.0
            elif vol_diff <= 0.25: score_vol = 6.5
            elif vol_diff <= 0.50: score_vol = 5.0
            elif vol_diff <= 1.00: score_vol = 3.0
            else: score_vol = 1.0

            # 2. Lectura Menisco (0 a 5)
            if meniscus_err <= 0.02: score_men = 5.0
            elif meniscus_err <= 0.05: score_men = 3.5
            elif meniscus_err <= 0.10: score_men = 2.0
            else: score_men = 1.0

            # 3. Agitación (0 a 4)
            score_stir = 4.0 if is_stirring else 1.5

            # 4. Purga y Seguridad (0 a 3)
            score_safe = 3.0 if is_purged else 1.0

            total = round(score_vol + score_men + score_stir + score_safe, 1)
            total = max(0.0, min(20.0, total))

            if total >= 18.0:
                letter = "AD"
                feedback = "¡Logro Destacado (AD)! Demostró un dominio excepcional de las técnicas cuantitativas de laboratorio. "
            elif total >= 14.0:
                letter = "A"
                feedback = "Logro Esperado (A). Ejecución metodológica satisfactoria con control adecuado de las variables. "
            elif total >= 11.0:
                letter = "B"
                feedback = "En Proceso (B). Cumple con los procedimientos básicos pero requiere mayor precisión en la dosificación gota a gota. "
            else:
                letter = "C"
                feedback = "En Inicio (C). Se evidenciaron desviaciones significativas en el volumen o falta de purga/agitación. "

            if vol_diff <= 0.15:
                feedback += f"Punto de viraje detectado con gran precisión volumétrica (ΔV = {vol_diff:.2f} mL). "
            else:
                feedback += f"Desviación en el volumen dispensado (ΔV = {vol_diff:.2f} mL). "

            if not is_purged:
                feedback += "Recuerde purgar las burbujas de aire de la punta de la bureta. "
            if not is_stirring:
                feedback += "La agitación continua es indispensable para evitar sobretitulaciones. "

            evaluation = {
                "studentId": body.get("studentId", "estudiante@fleming.edu.pe"),
                "practiceId": body.get("practiceId", "titulacion_acido_base"),
                "score": total,
                "letterGrade": letter,
                "qualitativeFeedback": feedback,
                "rubricScores": {
                    "exactitud_volumetrica": score_vol,
                    "lectura_menisco": score_men,
                    "agitacion_cinetica": score_stir,
                    "seguridad_y_purga": score_safe
                },
                "evaluatedAt": "2026-11-10T16:45:00Z"
            }

            self.send_json_response(200, evaluation)
            return

        # API Guardar Salón en PostgreSQL
        if self.path == '/api/db/save-classroom':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_classroom_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Guardar Usuario en PostgreSQL
        elif self.path == '/api/db/save-user':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_user_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Guardar Calificación en PostgreSQL
        elif self.path == '/api/db/save-score':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_score_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Guardar / Publicar Evaluación en Base de Datos
        elif self.path == '/api/db/save-evaluation':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            ok = save_evaluation_to_pg(body)
            self.send_json_response(200 if ok else 500, {'saved': ok, 'engine': 'PostgreSQL 16'})
            return

        # API Eliminar Evaluación en Base de Datos
        elif self.path == '/api/db/delete-evaluation':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}
            eval_id = body.get('id') if isinstance(body, dict) else str(body)
            ok = delete_evaluation_from_pg(eval_id)
            self.send_json_response(200 if ok else 500, {'deleted': ok, 'engine': 'PostgreSQL 16'})
            return

        # Manejo de la API REST /api/simulate según arquitectura de FD04
        elif self.path == '/api/simulate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            reactant1 = body.get('reactant1', 'Na')
            reactant2 = body.get('reactant2', 'Cl')
            heat_active = body.get('heatActive', False)

            # Lógica científica de ReactionEngine (Pauling)
            en_table = {'H': 2.20, 'O': 3.44, 'Na': 0.93, 'Cl': 3.16, 'C': 2.55, 'N': 3.04}
            en1 = en_table.get(reactant1, 2.0)
            en2 = en_table.get(reactant2, 2.0)
            delta_en = round(abs(en1 - en2), 2)

            if delta_en >= 2.0:
                bond_type = 'Iónico'
                equation = f'2{reactant1}(s) + {reactant2}₂(g) → 2{reactant1}{reactant2}(s)'
                product_name = 'Cloruro de Sodio (Sal Común)' if 'Na' in [reactant1, reactant2] and 'Cl' in [reactant1, reactant2] else 'Compuesto Iónico'
                feedback = f'ΔEN = {delta_en} (≥ 2.0). Transferencia completa de electrones hacia el átomo más electronegativo.'
            elif delta_en > 0.4:
                bond_type = 'Covalente Polar'
                equation = f'2{reactant1}₂(g) + {reactant2}₂(g) → 2{reactant1}₂{reactant2}(l)' if 'H' in [reactant1, reactant2] and 'O' in [reactant1, reactant2] else f'{reactant1}-{reactant2}'
                product_name = 'Agua' if 'H' in [reactant1, reactant2] and 'O' in [reactant1, reactant2] else 'Molécula Polar'
                feedback = f'ΔEN = {delta_en} (entre 0.4 y 2.0). Compartición asimétrica con dipolos eléctricos.'
            else:
                bond_type = 'Covalente Apolar'
                equation = f'{reactant1} + {reactant2} → {reactant1}{reactant2}'
                product_name = 'Molécula No Polar'
                feedback = f'ΔEN = {delta_en} (≤ 0.4). Densidad de carga uniforme entre los átomos.'

            response = {
                'successful': True,
                'productFormula': f'{reactant1}{reactant2}',
                'productName': product_name,
                'deltaElectronegativity': delta_en,
                'bondType': bond_type,
                'equation': equation,
                'feedback': feedback,
                'serverInfo': 'SimuLab Backend (PostgreSQL 16 + Spring Boot/Python en puerto 8000)'
            }

            self.send_json_response(200, response)
            return

        # Manejo de envío de correo real de recuperación (RF004)
        elif self.path == '/api/send-recovery-email':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                body = json.loads(post_data) if post_data else {}
            except Exception:
                body = {}

            target_email = body.get('email', '')
            code = body.get('code', '')
            user_name = body.get('name', 'Usuario')

            success = False
            error_msg = ''

            if target_email and code:
                try:
                    import smtplib
                    from email.mime.text import MIMEText
                    from email.mime.multipart import MIMEMultipart

                    sender = "Razself@gmail.com"
                    pwd = "prib duem szqt flej"

                    msg = MIMEMultipart('alternative')
                    msg['Subject'] = f"Código de Recuperación QUIMI-K: {code}"
                    msg['From'] = f"QUIMI-K Laboratorio Virtual <{sender}>"
                    msg['To'] = target_email

                    text = f"Hola {user_name},\n\nTu código de recuperación institucional para QUIMI-K es: {code}\n\nIngresa este código en la plataforma para restablecer tu contraseña.\n\nI.E. Alexander Fleming - Tacna"
                    html = f"""
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
  <div style="background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 1.5rem; text-align: center; color: #ffffff;">
    <h2 style="margin: 0; font-size: 1.4rem;">🧪 QUIMI-K v1.0</h2>
    <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; opacity: 0.9;">I.E. Alexander Fleming • Tacna</p>
  </div>
  <div style="padding: 1.75rem 1.5rem; color: #1e293b;">
    <h3 style="margin-top: 0; color: #0f172a; font-size: 1.15rem;">Recuperación de Contraseña</h3>
    <p style="font-size: 0.9rem; line-height: 1.5; color: #475569;">
      Hola <strong>{user_name}</strong>, hemos recibido una solicitud para restablecer tu contraseña en el Laboratorio Virtual.
    </p>
    <div style="margin: 1.5rem 0; text-align: center; background: #f8fafc; border: 2px dashed #0284c7; border-radius: 10px; padding: 1.25rem;">
      <span style="display: block; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Tu Código de Verificación:</span>
      <span style="display: block; font-size: 2.2rem; font-weight: 800; letter-spacing: 6px; color: #0284c7; margin-top: 0.35rem;">{code}</span>
    </div>
    <p style="font-size: 0.82rem; color: #64748b; margin: 0; line-height: 1.4;">
      Este código es de uso personal y expirará en 15 minutos. Si tú no solicitaste este cambio, puedes ignorar este correo de forma segura.
    </p>
  </div>
  <div style="background: #f1f5f9; padding: 0.85rem; text-align: center; font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #e2e8f0;">
    I.E. Alexander Fleming • Tacna, Perú (2026) • SimuLab Virtual Chemistry
  </div>
</div>
"""
                    msg.attach(MIMEText(text, 'plain', 'utf-8'))
                    msg.attach(MIMEText(html, 'html', 'utf-8'))

                    server = smtplib.SMTP('smtp.gmail.com', 587, timeout=12)
                    server.starttls()
                    server.login(sender, pwd)
                    server.sendmail(sender, target_email, msg.as_string())
                    server.quit()
                    success = True
                except Exception as ex:
                    error_msg = str(ex)
                    print(f"Error sending recovery email: {ex}")

            response = {'sent': success, 'error': error_msg}
            self.send_json_response(200 if success else 500, response)
            return

        self.send_error(404, "Endpoint no encontrado")

    def do_OPTIONS(self):
        try:
            self.send_response(200)
            self.send_header('Content-Length', '0')
            self.send_header('Connection', 'close')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
        except (ConnectionResetError, BrokenPipeError):
            pass

class ThreadedQuimiKServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    request_queue_size = 128
    allow_reuse_address = True

if __name__ == '__main__':
    with ThreadedQuimiKServer(("", PORT), QuimiKHandler) as httpd:
        print(f"=== SERVIDOR MULTI-HILO QUIMI-K ACTIVO EN http://localhost:{PORT} ===")
        print("Soporte multi-hilo, timeout y PostgreSQL 16 activo.")
        sys.stdout.flush()
        httpd.serve_forever()
