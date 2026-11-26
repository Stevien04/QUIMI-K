const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function setup() {
  const elements = new Map();
  const doc = { addEventListener() {}, getElementById(id) { return elements.get(id) || null; } };
  function element(tag = 'div') {
    const classes = new Set();
    const el = {
      tagName: tag.toUpperCase(), attributes: {}, style: {}, children: [], isConnected: true, visible: true,
      setAttribute(key, value) { this.attributes[key] = value; },
      appendChild(child) { this.children.push(child); },
      getClientRects() { return this.visible ? [{}] : []; },
      focus() { doc.activeElement = this; },
      classList: { add(c) { classes.add(c); }, remove(c) { classes.delete(c); }, contains(c) { return classes.has(c); } }
    };
    let html = '';
    Object.defineProperty(el, 'innerHTML', { get() { return html; }, set(value) { html = value; this.children = []; } });
    return el;
  }
  doc.createElement = element;
  for (const id of ['reagentsShelf','instrumentsRack','customDialogBackdrop','customDialogBtn','customDialogMessage','customDialogTitle','customDialogIcon']) elements.set(id, element());
  const opener = element('button');
  const navigation = element('button');
  doc.activeElement = opener;
  doc.querySelector = () => navigation;
  const context = vm.createContext({ document: doc, window: {}, console });
  for (const file of ['ChemEngine.js','app.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8') + (file === 'app.js' ? '\nglobalThis.app = App;' : ''), context, { filename: file });
  }
  return { app: context.app, engine: context.window.ChemEngine, elements, doc, opener, navigation };
}

test('los reactivos son botones nativos con nombre y mantienen la acción y las restricciones del examen', () => {
  const h = setup();
  const ids = ['h2o','hcl'];
  h.app.activePracticalExam = { allowedReagents: ids };
  const calls = [];
  h.app.onReagentClick = id => calls.push(id);
  const before = JSON.stringify(h.app.registeredUsers);
  h.app.renderReagentsShelf();
  const buttons = h.elements.get('reagentsShelf').children;
  assert.equal(buttons.length, 2);
  for (const button of buttons) {
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.type, 'button');
    assert.ok(button.attributes['aria-label'].startsWith('Agregar '));
    button.onclick();
  }
  assert.deepEqual(calls.sort(), ids.sort());
  assert.equal(JSON.stringify(h.app.registeredUsers), before);
});

test('los instrumentos conservan su acción y el filtro del examen al usarlos como botones', () => {
  const h = setup();
  const instruments = Object.values(h.engine.instruments).slice(0,2);
  const ids = instruments.map(item => item.id);
  h.app.activePracticalExam = { allowedInstruments: ids };
  const calls = [];
  h.app.onInstrumentClick = id => calls.push(id);
  h.app.renderInstrumentsRack();
  const buttons = h.elements.get('instrumentsRack').children;
  assert.equal(buttons.length, 2);
  buttons.forEach(button => {
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.type, 'button');
    assert.ok(button.attributes['aria-label'].startsWith('Colocar '));
    button.onclick();
  });
  assert.deepEqual(calls.sort(), ids.sort());
});

test('abrir un aviso lleva el foco a Aceptar y cerrarlo lo devuelve al control de origen', () => {
  const h = setup();
  h.app.showDialog('Mensaje de prueba', 'Aviso de prueba');
  assert.equal(h.doc.activeElement, h.elements.get('customDialogBtn'));
  assert.equal(h.elements.get('customDialogMessage').innerText, 'Mensaje de prueba');
  h.app.closeDialog();
  assert.equal(h.doc.activeElement, h.opener);
});

test('Tab y Mayús+Tab permanecen en el aviso, y Escape permite cerrarlo', () => {
  const h = setup();
  h.app.showDialog('Prueba de teclado');
  let prevented = 0;
  for (const shiftKey of [false,true]) {
    h.app.handleDialogKeydown({ key:'Tab', shiftKey, preventDefault() { prevented++; } });
    assert.equal(h.doc.activeElement, h.elements.get('customDialogBtn'));
  }
  h.app.handleDialogKeydown({ key:'Escape', preventDefault() { prevented++; } });
  assert.equal(prevented, 3);
  assert.equal(h.elements.get('customDialogBackdrop').classList.contains('open'), false);
  assert.equal(h.doc.activeElement, h.opener);
});

test('actualizar un aviso abierto conserva el control original para devolver el foco', () => {
  const h = setup();
  h.app.showDialog('Primer mensaje');
  h.app.showDialog('Mensaje actualizado');
  h.app.closeDialog();
  assert.equal(h.doc.activeElement, h.opener);
});

test('si el control original se ocultó, cerrar el aviso devuelve el foco a la navegación activa', () => {
  const h = setup();
  h.app.showDialog('Ingreso completado');
  h.opener.visible = false;
  h.app.closeDialog();
  assert.equal(h.doc.activeElement, h.navigation);
});

test('las fórmulas de los reactivos mantienen al menos 4.5:1 de contraste en la paleta clara', () => {
  const h = setup();
  h.app.renderReagentsShelf();
  function luminance(hex) {
    const c = hex.replace('#','').match(/../g).map(value => parseInt(value,16)/255).map(value =>
      value <= 0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4);
    return c[0]*0.2126 + c[1]*0.7152 + c[2]*0.0722;
  }
  for (const card of h.elements.get('reagentsShelf').children) {
    const formula = card.innerHTML.match(/class="reagent-formula" style="color: (#[a-f0-9]+);/i)[1];
    const a = luminance(formula), b = luminance(card.style.background);
    const ratio = (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
    assert.ok(ratio >= 4.5, `${card.attributes['aria-label']}: ${ratio.toFixed(2)}:1`);
  }
});
