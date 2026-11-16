const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup() {
  const elements = new Map();
  const downloads = [];
  const blobs = [];
  const context = {
    document: {
      addEventListener() {},
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { value: '', style: {}, innerText: '', disabled: false });
        return elements.get(id);
      },
      createElement(tag) {
        return { click() { downloads.push({ filename: this.download, href: this.href }); }, remove() {} };
      },
      body: { appendChild() {} }
    },
    Blob: class { constructor(parts, options) { blobs.push({ parts, options }); } },
    URL: { createObjectURL() { return 'blob:test'; }, revokeObjectURL() {} },
    setTimeout(callback) { callback(); }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8') + '\nglobalThis.app = App;', context);
  const app = context.app;
  app.state.currentUser = { role: 'teacher' };
  app.classrooms = [{ id: '4A', name: '4to Año "A"', students: [
    { id: 'juan', name: 'Juan Pérez', score: 19 },
    { name: 'María Gómez (Tú)', score: 18 },
    { id: 'luis', name: 'Luis', score: 20 }
  ] }];
  app.registeredUsers = [{ id: 'maria', name: 'María Gómez', classroomId: '4A' }];
  app.evaluations = [{ id: 'exam', title: 'Titulación', status: 'published', evalType: 'lab2d', targetClassrooms: ['4A', '4B'], submissions: [
    { studentId: 'juan', studentName: 'Juan Pérez', classroomId: '4A', score: 5, proceduralScore: 7, quizScore: 0, letterGrade: 'C', date: '16/11/2026 09:54' },
    { studentId: 'maria', studentName: 'María Gómez', classroomId: '4A', score: 0, proceduralScore: 0, quizScore: 0, date: '16/11/2026' },
    { studentId: 'other', studentName: 'Otro salón', classroomId: '4B', score: 20 }
  ] }];
  app.teacherExportClassroomId = '4A';
  context.document.getElementById('teacherExportEvaluation').value = 'exam';
  app.showDialog = message => { context.message = message; };
  return { app, context, downloads, blobs };
}

function report(h) { return h.app.buildTeacherEvaluationReport(h.app.classrooms[0], h.app.evaluations[0]); }

test('exportar la entrega seleccionada sin reemplazarla por la nota del perfil', () => {
  const h = setup();
  const before = JSON.stringify([h.app.classrooms, h.app.evaluations, h.app.registeredUsers]);
  const r = report(h);
  assert.equal(r.rows.length, 3);
  assert.equal(r.rows[0][4], 7);
  assert.equal(r.rows[0][5], 0);
  assert.equal(r.rows[0][6], 5);
  assert.equal(r.rows[0][8], 'Desaprobado');
  assert.equal(r.rows[0][9], '16/11/2026 09:54');
  assert.equal(r.rows[0][10], 11);
  assert.equal(JSON.stringify([h.app.classrooms, h.app.evaluations, h.app.registeredUsers]), before);
});

test('distinguir nota cero, ausencia de entrega y filas antiguas sin ID', () => {
  const r = report(setup());
  assert.equal(r.rows[1][3], 'maria');
  assert.equal(r.rows[1][6], 0);
  assert.equal(r.rows[1][8], 'Desaprobado');
  assert.equal(r.rows[2][6], '');
  assert.equal(r.rows[2][8], 'Sin entrega registrada');
  assert.equal(r.submitted, 2);
  assert.equal(r.missing, 1);
});

test('no incluir entregas de otro salón y conservar entregas de alumnos retirados', () => {
  const h = setup();
  h.app.evaluations[0].submissions.push({ studentId: 'retirado', studentName: 'Alumno retirado', classroomId: '4A', score: 12 });
  const r = report(h);
  assert.equal(r.rows.length, 4);
  assert.equal(r.rows[3][2], 'Alumno retirado');
  assert.ok(!r.rows.some(row => row[2] === 'Otro salón'));
});

test('no inferir una entrega a partir de nombres ambiguos ni usar notas generales', () => {
  const h = setup();
  h.app.classrooms[0].students.push({ name: 'María Gómez' });
  h.app.evaluations[0].submissions = [];
  const r = report(h);
  assert.ok(r.rows.every(row => row[6] === '' && row[8] === 'Sin entrega registrada'));
});

test('un cuestionario teórico mantiene la nota guardada y su mínimo de 14', () => {
  const h = setup();
  const e = h.app.evaluations[0];
  e.evalType = 'quiz';
  e.submissions[0].score = 13;
  const r = report(h);
  assert.equal(r.rows[0][4], '');
  assert.equal(r.rows[0][5], 13);
  assert.equal(r.rows[0][6], 13);
  assert.equal(r.rows[0][10], 14);
  assert.equal(r.rows[0][8], 'Desaprobado');
  delete e.submissions[0].quizScore;
  assert.equal(report(h).rows[0][5], 13);
});

test('no recalcular una nota guardada aunque el desglose no coincida', () => {
  const h = setup();
  h.app.evaluations[0].submissions[0].score = 9;
  assert.equal(report(h).rows[0][6], 9);
});

test('si hay duplicados antiguos, usar la misma primera entrega que Ver Ficha', () => {
  const h = setup();
  h.app.evaluations[0].submissions.push({ studentId: 'juan', classroomId: '4A', score: 20 });
  const shown = h.app.evaluations[0].submissions.find(s => s.studentId === 'juan');
  assert.equal(report(h).rows[0][6], shown.score);
});

test('una entrega sin nota no se convierte en cero', () => {
  const h = setup();
  delete h.app.evaluations[0].submissions[0].score;
  assert.equal(report(h).rows[0][6], '');
  assert.equal(report(h).rows[0][8], 'Nota no registrada');
});

test('CSV conserva tildes, comillas, separadores y saltos de línea; bloquea fórmulas', () => {
  const h = setup();
  const csv = h.app.teacherReportCsv({ headers: ['Nombre', 'Nota'], rows: [['María; "Gómez"\nsegunda línea', 0], [' =1+1', 5]] });
  assert.ok(csv.startsWith('\uFEFF'));
  assert.ok(csv.includes('"María; ""Gómez""\nsegunda línea";"0"'));
  assert.ok(csv.includes('"\' =1+1";"5"'));
  assert.ok(csv.endsWith('\r\n'));
});

test('descargar un CSV real con la entrega seleccionada', () => {
  const h = setup();
  h.app.downloadTeacherReport();
  assert.equal(h.downloads.length, 1);
  assert.equal(h.downloads[0].filename, 'acta-4A-exam.csv');
  assert.equal(h.blobs[0].options.type, 'text/csv;charset=utf-8;');
  assert.ok(h.blobs[0].parts[0].includes('"Juan Pérez";"juan";"7";"0";"5"'));
});

for (const invalid of ['student', 'other-classroom', 'draft', 'missing-classroom']) {
  test(`impedir descarga para selección inválida: ${invalid}`, () => {
    const h = setup();
    if (invalid === 'student') h.app.state.currentUser.role = 'student';
    if (invalid === 'other-classroom') h.app.evaluations[0].targetClassrooms = ['4B'];
    if (invalid === 'draft') h.app.evaluations[0].status = 'draft';
    if (invalid === 'missing-classroom') h.app.teacherExportClassroomId = 'unknown';
    h.app.downloadTeacherReport();
    assert.equal(h.downloads.length, 0);
    assert.ok(h.context.message);
  });
}
