const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup() {
  const elements = new Map([
    ['btnSimulationPause', { attributes: {}, setAttribute(key, value) { this.attributes[key] = value; } }],
    ['simulationRunStatus', {}]
  ]);
  const frames = new Map();
  let nextFrame = 1;
  const context = vm.createContext({
    console, window: {}, document: {
      getElementById(id) { return elements.get(id) || null; },
      addEventListener() {}
    },
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); }
  });
  for (const file of ['ChemEngine.js', 'simulation_canvas.js', 'app.js']) {
    const expose = file === 'app.js' ? '\nglobalThis.app = App;' : '';
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8') + expose, context, { filename: file });
  }
  const bench = new context.window.SimulationCanvas.InteractiveLabBench('bench', 'meniscus', 'graph');
  const app = context.app;
  app.labBench = bench;
  app.updateDigitalSensorsUI = () => {};
  app.refreshTelemetryUI = () => {};
  return { app, bench, elements, frames, engine: context.window.ChemEngine,
    frame() {
      const [id, callback] = frames.entries().next().value;
      frames.delete(id);
      callback();
    }
  };
}

function state(bench) {
  return JSON.stringify({
    vessels: bench.vessels, burette: bench.buretteStand, bunsen: bench.bunsen,
    balance: bench.balance, pouring: bench.pouringState,
    curve: bench.titrationHistory, dripAnimY: bench.dripAnimY
  });
}

test('pausar congela la dosificación, el pH y la curva; reanudar conserva el avance', () => {
  const { bench } = setup();
  bench.buretteStand.isDripping = true;
  for (let i = 0; i < 8; i++) bench.update();
  assert.ok(bench.buretteStand.volumeAddedMl > 0);
  bench.setPaused(true);
  const before = state(bench);
  const ph = bench.getVesselPH(bench.vessels[0]);
  for (let i = 0; i < 100; i++) bench.update();
  assert.equal(state(bench), before);
  assert.equal(bench.getVesselPH(bench.vessels[0]), ph);
  const volume = bench.buretteStand.volumeAddedMl;
  bench.setPaused(false);
  bench.update();
  assert.ok(bench.buretteStand.volumeAddedMl > volume);
  assert.equal(bench.buretteStand.isDripping, true);
});

test('pausar congela calentamiento, enfriamiento y burbujas; reanudar permite continuar', () => {
  const { bench } = setup();
  const flask = bench.vessels[0];
  flask.x = bench.bunsen.tripodX;
  flask.y = bench.bunsen.tripodY - flask.height + 10;
  bench.bunsen.isOn = true;
  bench.vessels[1].temperature = 70;
  bench.update();
  assert.ok(flask.temperature > 22.5);
  assert.ok(bench.vessels[1].temperature < 70);
  flask.bubbles.push({ x: 1, y: 400, radius: 2, vy: 1 });
  bench.setPaused(true);
  const before = state(bench);
  for (let i = 0; i < 50; i++) bench.update();
  assert.equal(state(bench), before);
  const temperature = flask.temperature;
  bench.setPaused(false);
  bench.update();
  assert.ok(flask.temperature > temperature);
});

test('un trasvase se detiene sin perder su estado y continúa al reanudar', () => {
  const { bench } = setup();
  bench.startPouring(bench.vessels[1], bench.vessels[0], 25);
  bench.update();
  const progress = bench.pouringState.transferredSoFar;
  assert.ok(progress > 0);
  bench.setPaused(true);
  const before = state(bench);
  for (let i = 0; i < 20; i++) bench.update();
  assert.equal(state(bench), before);
  bench.setPaused(false);
  bench.update();
  assert.ok(bench.pouringState.transferredSoFar > progress);
});

test('reiniciar restaura la mesa completa y cancela referencias al trasvase anterior', () => {
  const { bench } = setup();
  const original = state(bench);
  const oldFlask = bench.vessels[0];
  bench.startPouring(bench.vessels[1], oldFlask);
  bench.update();
  bench.balance.x = 800;
  bench.balance.tareOffset = 33;
  bench.bunsen.isOn = true;
  bench.bunsen.visible = false;
  bench.buretteStand.volumeAddedMl = 40;
  bench.buretteStand.isPurged = true;
  bench.buretteStand.reagentId = 'hcl';
  bench.titrationHistory.push({ v: 40, ph: 12 });
  bench.draggedVessel = oldFlask;
  bench.setPaused(true);
  const oldContents = JSON.stringify(oldFlask.contents);
  bench.reset();
  assert.equal(state(bench), original);
  assert.equal(bench.isPaused, false);
  assert.equal(bench.draggedVessel, null);
  bench.update();
  assert.equal(JSON.stringify(oldFlask.contents), oldContents);
});

test('pausar conserva el dibujo y volver a abrir la mesa no elimina la pausa ni duplica el bucle', () => {
  const h = setup();
  h.bench.buretteStand.isDripping = true;
  h.bench.start();
  h.frame();
  h.bench.setPaused(true);
  const before = state(h.bench);
  h.bench.start();
  h.bench.start();
  assert.equal(h.frames.size, 1);
  for (let i = 0; i < 5; i++) h.frame();
  assert.equal(state(h.bench), before);
  assert.equal(h.frames.size, 1);
  h.bench.stop();
  assert.equal(h.frames.size, 0);
});

test('los controles reflejan pausa y reanudación y no cambian las notas ni el examen', () => {
  const h = setup();
  h.app.activePracticalExam = { id: 'exam-test', allowAiAssistant: false, submissions: [{ score: 14 }] };
  h.app.state.currentUser = { id: 'student-test', score: 17, notesHistory: [{ score: 17 }] };
  const before = JSON.stringify([h.app.activePracticalExam, h.app.state.currentUser]);
  h.app.toggleSimulationPause();
  assert.equal(h.bench.isPaused, true);
  assert.equal(h.elements.get('btnSimulationPause').attributes['aria-pressed'], 'true');
  assert.equal(h.elements.get('btnSimulationPause').innerText, 'Reanudar simulación');
  h.app.toggleSimulationPause();
  assert.equal(h.bench.isPaused, false);
  h.engine.logTelemetry('purge_burette', 'burette', 0);
  h.app.resetBenchObjects();
  assert.equal(h.elements.get('simulationRunStatus').innerText, 'Simulación en curso');
  assert.equal(JSON.stringify([h.app.activePracticalExam, h.app.state.currentUser]), before);
  assert.equal(h.engine.getTelemetryJSONB().events.length, 1);
  assert.equal(h.engine.getTelemetryJSONB().events[0].action, 'session_start');
});
