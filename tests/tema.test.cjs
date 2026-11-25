const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'theme.js'), 'utf8');

function openPage(storage = new Map(), blocked = false) {
  const ready = [];
  const root = { dataset: {} };
  const buttons = [0, 1].map(() => ({
    attributes: {}, label: { textContent: '' }, listeners: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    querySelector() { return this.label; },
    addEventListener(event, callback) { this.listeners[event] = callback; }
  }));
  vm.runInNewContext(source, {
    document: {
      documentElement: root,
      querySelectorAll() { return buttons; },
      addEventListener(event, callback) { if (event === 'DOMContentLoaded') ready.push(callback); }
    },
    localStorage: {
      getItem(key) { if (blocked) throw Error('Almacenamiento bloqueado'); return storage.get(key) || null; },
      setItem(key, value) { if (blocked) throw Error('Almacenamiento bloqueado'); storage.set(key, value); }
    }
  }, { filename: 'theme.js' });
  return { root, buttons, storage, ready() { ready.forEach(callback => callback()); } };
}

test('cargar en claro por defecto y aplicar una preferencia oscura antes de iniciar la interfaz', () => {
  assert.equal(openPage().root.dataset.theme, 'light');
  const h = openPage(new Map([['quimik-theme', 'dark']]));
  assert.equal(h.root.dataset.theme, 'dark');
  h.ready();
  assert.ok(h.buttons.every(button => button.attributes['aria-pressed'] === 'true'));
});

test('elegir oscuro y conservar la elección al recargar la página', () => {
  const h = openPage();
  h.ready();
  h.buttons[0].listeners.click();
  assert.equal(h.root.dataset.theme, 'dark');
  assert.ok(h.buttons.every(button => button.label.textContent === 'Modo oscuro'));
  const reloaded = openPage(h.storage);
  assert.equal(reloaded.root.dataset.theme, 'dark');
});

test('volver a claro desde el otro control y conservarlo al recargar', () => {
  const h = openPage(new Map([['quimik-theme', 'dark']]));
  h.ready();
  h.buttons[1].listeners.click();
  assert.equal(openPage(h.storage).root.dataset.theme, 'light');
  assert.ok(h.buttons.every(button => button.attributes['aria-pressed'] === 'false'));
});

test('el tema no modifica notas, usuarios ni otras preferencias guardadas', () => {
  const storage = new Map([['quimik-users', '[{"score":17}]'], ['otra-preferencia', 'valor']]);
  const before = [...storage.entries()];
  const h = openPage(storage);
  h.ready();
  h.buttons[0].listeners.click();
  assert.deepEqual([...storage.entries()].filter(([key]) => key !== 'quimik-theme'), before);
});

test('una preferencia desconocida no añade valores arbitrarios al documento', () => {
  const h = openPage(new Map([['quimik-theme', 'otro-tema']]));
  assert.equal(h.root.dataset.theme, 'light');
});

test('si el navegador bloquea el almacenamiento, el botón funciona sin detener la aplicación', () => {
  const h = openPage(new Map(), true);
  h.ready();
  h.buttons[0].listeners.click();
  assert.equal(h.root.dataset.theme, 'dark');
  assert.ok(h.buttons.every(button => button.title.includes('solo en esta ventana')));
});
