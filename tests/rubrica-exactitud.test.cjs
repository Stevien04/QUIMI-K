const assert = require('node:assert/strict');
const test = require('node:test');
const ChemEngine = require('../ChemEngine.js');

function accuracy(volume, target = 25, action = 'exam_submission') {
  return ChemEngine.evaluateProceduralRubric({ targetVolume: target }, [
    { action, value: volume }
  ]).details[3];
}

test('aplicar la escala acordada a ambos lados del objetivo, incluidos sus límites', () => {
  for (const [volume, score] of [
    [25, 5], [24, 5], [23.75, 5], [26.25, 5],
    [23.7499, 4], [26.2501, 4], [22.5, 4], [27.5, 4],
    [22.4999, 2], [27.5001, 2], [20, 2], [30, 2],
    [19.9999, 0], [30.0001, 0], [50, 0], [0, 0]
  ]) {
    const result = accuracy(volume);
    assert.equal(result.score, score, `${volume} mL`);
    assert.equal(result.measuredVolumeMl, volume);
    assert.equal(result.expectedVolumeMl, 25);
    assert.equal(result.errorPercent, Math.abs(volume - 25) / 25 * 100);
  }
});

test('informar el error real sin exigir error cero para obtener 5/5', () => {
  const result = accuracy(24);
  assert.equal(result.score, 5);
  assert.match(result.feedback, /esperado: 25.00 mL/);
  assert.match(result.feedback, /obtenido: 24.00 mL/);
  assert.match(result.feedback, /Error: 4.00 %/);
  assert.match(result.feedback, /dentro del margen aceptado/);
});

test('50 mL frente a 25 mL es un error de 100 % y cero puntos de exactitud', () => {
  const result = accuracy(50);
  assert.equal(result.errorPercent, 100);
  assert.equal(result.score, 0);
  assert.match(result.feedback, /Error: 100.00 %/);
  assert.match(result.feedback, /más volumen/);
  assert.match(accuracy(0).feedback, /menos volumen/);
});

test('evaluar la última entrega sin reutilizar el volumen de un intento anterior', () => {
  for (const [first, last] of [['finish_titration', 'exam_submission'], ['exam_submission', 'finish_titration']]) {
    const events = [{ action: first, value: 25 }, { action: last, value: 50 }];
    const before = JSON.stringify(events);
    const result = ChemEngine.evaluateProceduralRubric({ targetVolume: 25 }, events).details[3];
    assert.equal(result.score, 0);
    assert.equal(result.errorPercent, 100);
    assert.equal(JSON.stringify(events), before, 'no reordenar ni modificar el historial');
  }
});

test('sin medición no inventar 25 mL ni conceder puntos de exactitud', () => {
  for (const value of [undefined, null, NaN, Infinity, -1, '25', '', false]) {
    const result = accuracy(value);
    assert.equal(result.score, 0);
    assert.equal(result.errorPercent, null);
    assert.equal(result.measuredVolumeMl, null);
    assert.match(result.feedback, /Sin datos suficientes/);
  }
  const result = ChemEngine.evaluateProceduralRubric({ targetVolume: 25 }, []).details[3];
  assert.equal(result.score, 0);
  assert.equal(result.errorPercent, null);
});

test('una entrega sin medición no hereda la medición válida del intento anterior', () => {
  const result = ChemEngine.evaluateProceduralRubric({ targetVolume: 25 }, [
    { action: 'finish_titration', value: 25 }, { action: 'exam_submission', value: null }
  ]).details[3];
  assert.equal(result.score, 0);
  assert.equal(result.measuredVolumeMl, null);
});

test('sin objetivo válido no suponer el objetivo de 25 mL', () => {
  const missing = ChemEngine.evaluateProceduralRubric({}, [{ action: 'exam_submission', value: 25 }]).details[3];
  assert.equal(missing.score, 0);
  assert.equal(missing.expectedVolumeMl, null);
  for (const target of [null, NaN, Infinity, -1, 0, '25']) {
    const result = accuracy(25, target);
    assert.equal(result.score, 0);
    assert.equal(result.errorPercent, null);
    assert.match(result.feedback, /objetivo válido/);
  }
});

test('usar el objetivo configurado y tolerar el pequeño error numérico de las gotas', () => {
  assert.equal(accuracy(21, 20).score, 5);
  assert.equal(accuracy(33, 30).score, 4);
  let volume = 0;
  for (let i = 0; i < 525; i++) volume += 0.05;
  assert.equal(accuracy(volume).score, 5, '26.25 mL acumulados en gotas');
});

test('el cambio de exactitud conserva el puntaje de los otros cuatro criterios', () => {
  const procedure = [
    { action: 'read_sga' }, { action: 'select_instrument', target: 'burette' },
    { action: 'purge_burette' }, { action: 'titration_drop' }, { action: 'stir_flask' },
    { action: 'inspect_meniscus' }, { action: 'tare_balance' },
    { action: 'theory_submission', value: { correct: 3, total: 3 } }
  ];
  const evaluate = value => ChemEngine.evaluateProceduralRubric({ targetVolume: 25 }, [...procedure, { action: 'exam_submission', value }]);
  const good = evaluate(25);
  const bad = evaluate(50);
  assert.equal(good.vigesimalScore, 20);
  assert.equal(bad.vigesimalScore, 15, 'solo pierde los 5 puntos de exactitud');
  assert.deepEqual(good.details.filter((_, i) => i !== 3), bad.details.filter((_, i) => i !== 3));
});
