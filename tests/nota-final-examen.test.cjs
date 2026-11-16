const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const appSource = fs.readFileSync(process.env.QUIMIK_APP_PATH || path.join(root, 'app.js'), 'utf8');
const chemSource = fs.readFileSync(path.join(root, 'ChemEngine.js'), 'utf8');

// Ejecuta los archivos reales sin iniciar App.init(), abrir una ventana ni usar una BD real.
function setup({ practical = 20, existingStudent = true, realEngine = false } = {}) {
  const storage = new Map();
  const requests = [];
  const elements = new Map();
  const context = {
    console: { log() {}, warn() {}, error() {} },
    document: {
      addEventListener() {},
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, { style: {}, innerText: '', innerHTML: '' });
        return elements.get(id);
      },
      querySelector() { return { value: '1' }; }
    },
    window: {},
    localStorage: {
      setItem(key, value) { storage.set(key, value); },
      getItem(key) { return storage.get(key) || null; }
    },
    fetch: async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body) });
      return { ok: true, json: async () => ({ saved: true }) };
    },
    setTimeout() {},
    confirm() { return true; }
  };
  vm.createContext(context);
  vm.runInContext(chemSource, context, { filename: 'ChemEngine.js' });
  if (!realEngine) {
    context.window.ChemEngine.evaluateProceduralRubric = () => ({
      vigesimalScore: practical,
      letterGrade: practical >= 17 ? 'AD (Logro Destacado)' : 'C (En Inicio)',
      details: []
    });
  }
  vm.runInContext(appSource + '\nglobalThis.testApp = App;', context, { filename: 'app.js' });
  const app = context.testApp;
  const user = {
    id: 'test-student', name: 'Estudiante de prueba', role: 'student',
    classroomId: 'test-classroom', classroom: 'Salón de prueba', attempts: 2,
    notesHistory: [{ test: 'Evaluación anterior', score: 12 }]
  };
  const otherUser = { id: 'other-student', name: 'Otro estudiante', score: 16 };
  const exam = {
    id: 'test-exam', title: 'Examen de prueba', description: 'Prueba de regresión',
    topic: 'Titulación', submissions: [], questions: [
      { question: 'Pregunta 1', options: ['Correcta', 'Incorrecta'], answer: 0 },
      { question: 'Pregunta 2', options: ['Correcta', 'Incorrecta'], answer: 0 }
    ]
  };
  app.state.currentUser = user;
  // Usa objetos distintos para comprobar la actualización del catálogo de usuarios.
  app.registeredUsers = [JSON.parse(JSON.stringify(user)), otherUser];
  app.classrooms = [{ id: user.classroomId, students: [
    ...(existingStudent ? [{ id: user.id, name: user.name, score: 12 }] : []),
    { id: otherUser.id, name: otherUser.name, score: 16 }
  ] }];
  app.evaluations = [exam];
  app.practiceConfig2026 = { targetVolume: 25 };
  app.activePracticalExam = exam;
  app.labBench = {
    buretteStand: { volumeAddedMl: 25, tipX: 565 },
    vessels: [{ x: 550, width: 70, temp: 25 }],
    getVesselPH() { return 7; }
  };
  let displayed;
  for (const method of ['updateUserUI', 'renderInstrumentsRack', 'renderReagentsShelf', 'renderStudentSalonView']) {
    app[method] = () => {};
  }
  app.viewSubmissionReport = submission => { displayed = submission; };
  return { app, user, exam, context, storage, requests, displayed: () => displayed };
}

function verify(h, { final, letter, practical, quiz }) {
  const { app, user, exam, storage, requests } = h;
  const submission = exam.submissions[0];
  const status = final >= 11 ? 'Aprobado' : 'Pendiente';
  assert.equal(submission.score, final, 'nota de la entrega');
  assert.equal(submission.proceduralScore, practical, 'conservar desglose práctico');
  assert.equal(submission.quizScore, quiz, 'conservar desglose del cuestionario');
  assert.equal(user.score, final, 'nota del perfil');
  assert.equal(user.status, status, 'estado según la nota final');
  assert.equal(user.notesHistory[0].score, final, 'nota del historial');
  assert.equal(user.notesHistory[0].letterGrade, letter, 'letra del historial');
  assert.equal(user.notesHistory[0].status, status);
  assert.equal(submission.letterGrade, letter);
  assert.equal(app.registeredUsers[0].score, final, 'catálogo de usuarios');
  assert.equal(app.classrooms[0].students.find(s => s.id === user.id).score, final, 'nota del salón');
  assert.equal(app.classrooms[0].students.find(s => s.id === user.id).status, status);
  assert.equal(JSON.parse(storage.get('quimik_registered_users'))[0].score, final, 'perfil persistido');
  assert.equal(JSON.parse(storage.get('quimik_evaluations'))[0].submissions[0].score, final, 'entrega persistida');
  assert.equal(JSON.parse(storage.get('quimik_classrooms'))[0].students.find(s => s.id === user.id).score, final);
  const scoreRequest = requests.find(r => r.url === '/api/db/save-score');
  assert.equal(scoreRequest.body.score, final, 'nota enviada al servidor');
  assert.equal(scoreRequest.body.notesHistory[0].score, final);
  assert.equal(scoreRequest.body.notesHistory[0].letterGrade, letter);
  assert.equal(scoreRequest.body.status, status);
  assert.equal(requests.find(r => r.url === '/api/db/save-evaluation').body.submissions[0].score, final);
  assert.equal(h.displayed().score, final, 'resultado mostrado');
  assert.equal(user.notesHistory.at(-1).score, 12, 'conservar historial previo');
  assert.equal(app.registeredUsers[1].score, 16, 'conservar otro usuario');
  assert.equal(app.classrooms[0].students.find(s => s.id === 'other-student').score, 16);
  assert.equal(app.activePracticalExam, null, 'finalizar modo examen');
}

for (const c of [
  { practical: 20, quiz: 0, final: 14, letter: 'A' },
  { practical: 20, quiz: 10, final: 17, letter: 'A' },
  { practical: 20, quiz: 20, final: 20, letter: 'AD' },
  { practical: 7, quiz: 20, final: 11, letter: 'B' },
  { practical: 11, quiz: 0, final: 8, letter: 'C' },
  { practical: 0, quiz: 0, final: 0, letter: 'C' },
  { practical: 17, quiz: 20, final: 18, letter: 'AD' },
  { practical: 17.5, quiz: null, final: 17.5, letter: 'A' }
]) {
  test(`práctica ${c.practical}, cuestionario ${c.quiz}: guardar ${c.final} en todos los destinos`, () => {
    const h = setup(c);
    h.app.executeOfficialExamSubmission(h.exam, h.user, 25, 7, '25 °C', c.quiz);
    verify(h, c);
    assert.equal(h.user.attempts, 3);
    assert.equal(h.user.notesHistory.length, 2);
  });
}

test('agregar alumno al salón cuando aún no tiene una fila', () => {
  const h = setup({ existingStudent: false });
  h.app.executeOfficialExamSubmission(h.exam, h.user, 25, 7, '25 °C', 0);
  verify(h, { practical: 20, quiz: 0, final: 14, letter: 'A' });
  assert.equal(h.app.classrooms[0].students.filter(s => s.id === h.user.id).length, 1);
});

test('un nuevo intento reemplaza la entrega y conserva el historial', () => {
  const h = setup();
  h.app.executeOfficialExamSubmission(h.exam, h.user, 25, 7, '25 °C', 0);
  h.app.executeOfficialExamSubmission(h.exam, h.user, 25, 7, '25 °C', 20);
  assert.equal(h.exam.submissions.length, 1);
  assert.equal(h.exam.submissions[0].score, 20);
  assert.equal(h.user.score, 20);
  assert.equal(h.user.attempts, 4);
  assert.deepEqual(h.user.notesHistory.map(n => n.score), [20, 14, 12]);
});

test('flujo de entrega y cuestionario con el motor químico real', () => {
  const h = setup({ realEngine: true });
  for (const [action, target, value] of [
    ['read_sga', 'HCl'], ['select_instrument', 'erlenmeyer'],
    ['purge_burette', 'burette'], ['titration_drop', 'burette'],
    ['stir_flask', 'flask'], ['inspect_meniscus', 'burette'],
    ['tare_balance', 'balance'], ['finish_titration', 'submission', 25],
    ['theory_submission', 'theory', { correct: 3, total: 3 }]
  ]) h.context.window.ChemEngine.logTelemetry(action, target, value);
  h.app.submitPracticalExam();
  assert.equal(h.exam.submissions.length, 0, 'esperar al cuestionario');
  h.app.submitPostSimulationQuiz();
  verify(h, { practical: 20, quiz: 0, final: 14, letter: 'A' });
  assert.equal(h.app._pendingPostSimSubmission, null);
});
