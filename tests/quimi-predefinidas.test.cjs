const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function setup() {
  const elements = new Map();
  const timers = [];
  const notices = [];
  const requests = [];
  function element() {
    return {
      style: {}, children: [], innerHTML: '', innerText: '',
      appendChild(child) { this.children.push(child); },
      classList: { toggle() {} }, click() {}
    };
  }
  const context = vm.createContext({
    console, window: {},
    document: {
      addEventListener() {}, querySelectorAll() { return []; },
      querySelector() { return element(); }, createElement: element,
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, element());
        return elements.get(id);
      }
    },
    localStorage: { getItem() { return null; }, setItem() { throw Error('Escritura inesperada'); } },
    fetch(...args) { requests.push(args); throw Error('Petición inesperada'); },
    setTimeout(callback) { timers.push(callback); }
  });
  for (const file of ['ChemEngine.js', 'reaction_engine.js', 'app.js']) {
    const expose = file === 'app.js' ? '\nglobalThis.app = App;' : '';
    vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8') + expose, context, { filename: file });
  }
  const app = context.app;
  app.showToast = message => notices.push(message);
  app.activeAssistantSubtab = 'contextual';
  app.labBench = null;
  return {
    app, elements, notices, requests,
    flush() { while (timers.length) timers.shift()(); },
    count() { return [...elements.values()].reduce((sum, el) => sum + el.children.length, 0); }
  };
}

const channels = [
  ['general', 'askQuimiPreset', 'quimiChatHistory'],
  ['contextual', 'askContextualQuestion', 'quimiContextualChatHistory'],
  ['lab', 'sendLabConsultPreset', 'labConsultHistoryContainer']
];

test('todos los botones existentes mantienen una pregunta autorizada y una respuesta real', () => {
  const h = setup();
  for (const [channel, handler, history] of channels) {
    const pattern = new RegExp("App\\." + handler + "\\('([^']*)'\\)", 'g');
    const questions = [...html.matchAll(pattern)].map(match => match[1]);
    assert.ok(questions.length > 0);
    for (const question of questions) {
      assert.equal(h.app.validateQuimiQuestion(channel, question), true);
      const count = h.elements.get(history)?.children.length || 0;
      h.app[handler](question);
      h.flush();
      const bubbles = h.elements.get(history).children;
      assert.equal(bubbles.length, count + 2);
      assert.ok(bubbles.at(-1).innerHTML.length > 30);
    }
  }
  assert.equal(h.notices.length, 0);
  assert.equal(h.requests.length, 0);
});

test('las preguntas contextuales funcionan en las tres prácticas sin cambiar sus datos', () => {
  const h = setup();
  for (let index = 0; index < 3; index++) {
    h.app.state.currentPracticeIndex = index;
    const before = JSON.stringify([h.app.state, h.app.evaluations, h.app.registeredUsers]);
    for (const question of h.app.assistantLabQuestions[index]) {
      h.app.askContextualQuestion(question);
      h.flush();
    }
    assert.equal(JSON.stringify([h.app.state, h.app.evaluations, h.app.registeredUsers]), before);
  }
  assert.equal(h.count(), 24);
  assert.equal(h.notices.length, 0);
  assert.equal(h.requests.length, 0);
});

test('rechazar texto libre incluso al invocar directamente los manejadores', () => {
  const h = setup();
  for (const [, handler] of channels) {
    for (const question of ['¿Qué es el pH?', '', null, {}, '<img src=x onerror=alert(1)>']) {
      h.app[handler](question);
    }
  }
  h.app.processLabConsultQuestion('Una consulta fuera del catálogo');
  h.flush();
  assert.equal(h.count(), 0);
  assert.equal(h.notices.length, 16);
  assert.equal(h.requests.length, 0);
});

test('rechazar preguntas de otra práctica y texto agregado a una opción permitida', () => {
  const h = setup();
  h.app.state.currentPracticeIndex = 0;
  h.app.askContextualQuestion(h.app.assistantLabQuestions[1][0]);
  h.app.askQuimiPreset(h.app.assistantPresetQuestions.general[0] + ' Otra pregunta');
  h.flush();
  assert.equal(h.count(), 0);
  assert.equal(h.notices.length, 2);
});

test('conservar la ayuda del paso actual en todas las prácticas, incluido el último paso', () => {
  const h = setup();
  let count = 0;
  h.app.practices.forEach((practice, index) => {
    h.app.state.currentPracticeIndex = index;
    for (let step = 0; step <= practice.steps.length; step++) {
      h.app.state.currentStepIndex = step;
      h.app.askQuimiAboutCurrentStep();
      h.flush();
      count += 2;
    }
  });
  assert.equal(h.count(), count);
  assert.equal(h.notices.length, 0);
});

test('un examen con Quimi desactivado bloquea las tres entradas y la ayuda del paso', () => {
  const h = setup();
  h.app.activePracticalExam = { allowAiAssistant: false };
  for (const [channel, handler] of channels) h.app[handler](h.app.assistantPresetQuestions[channel][0]);
  h.app.askQuimiAboutCurrentStep();
  h.app.openLabConsultModal();
  h.flush();
  assert.equal(h.count(), 0);
  assert.equal(h.notices.length, 5);
});

test('no mostrar respuestas pendientes si empieza un examen sin asistente', () => {
  const h = setup();
  for (const [channel, handler] of channels) h.app[handler](h.app.assistantPresetQuestions[channel][0]);
  assert.equal(h.count(), 3);
  h.app.activePracticalExam = { allowAiAssistant: false };
  h.flush();
  assert.equal(h.count(), 3);
});

test('un examen que permite Quimi conserva las consultas guiadas', () => {
  const h = setup();
  h.app.activePracticalExam = { allowAiAssistant: true, title: 'Titulación', topic: 'Neutralización' };
  for (const [channel, handler] of channels) h.app[handler](h.app.assistantPresetQuestions[channel][0]);
  h.flush();
  assert.equal(h.count(), 6);
  assert.equal(h.notices.length, 0);
});

test('retirar las tres entradas libres y conservar búsqueda y formularios ajenos a Quimi', () => {
  for (const id of ['quimiGeneralInput', 'quimiContextualInput', 'labConsultInput']) {
    assert.equal(html.includes(`id="${id}"`), false);
  }
  for (const id of ['guideSearchInput', 'regFullName', 'regEmail', 'regPassword']) {
    assert.ok(html.includes(`id="${id}"`));
  }
});

test('cambiar el laboratorio de consulta actualiza sus preguntas sin reiniciar la simulación', () => {
  const h = setup();
  h.app.state.currentStepIndex = 2;
  h.app.state.heatActive = true;
  h.app.selectPractice = () => { throw Error('No debe cambiar la práctica experimental'); };
  h.app.resetSimulation = () => { throw Error('No debe reiniciar la mesa'); };
  const before = JSON.stringify([h.app.state, h.app.evaluations, h.app.registeredUsers]);
  for (const index of [1, 2, 0]) {
    h.app.changeContextualLabPractice(String(index));
    assert.equal(h.app.getContextualPracticeIndex(), index);
    assert.ok(h.elements.get('quimiActiveLabBannerTitle').innerText.includes(h.app.practices[index].title));
    assert.ok(h.elements.get('quimiLabDynamicChips').innerHTML.includes(h.app.assistantLabQuestions[index][0]));
    h.app.askContextualQuestion(h.app.assistantLabQuestions[index][0]);
    h.flush();
    assert.equal(JSON.stringify([h.app.state, h.app.evaluations, h.app.registeredUsers]), before);
  }
  assert.equal(h.notices.length, 0);
});

test('una respuesta pendiente conserva el laboratorio de consulta con que se solicitó', () => {
  const h = setup();
  h.app.changeContextualLabPractice('1');
  h.app.askContextualQuestion('¿En qué consiste mi laboratorio asignado y cuáles son sus pasos?');
  h.app.changeContextualLabPractice('2');
  h.flush();
  const response = h.elements.get('quimiContextualChatHistory').children.at(-1).innerHTML;
  assert.ok(response.includes(h.app.practices[1].title));
});
