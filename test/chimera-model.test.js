const test = require('node:test');
const assert = require('node:assert/strict');
const ChimeraField = require('../assets/js/chimera-model.js');

function bruteForceVelocity(field, x, y) {
  let sumCos = 0, sumSin = 0, neighbours = 0;
  for (let row = 0; row < field.rows; row++) {
    for (let column = 0; column < field.columns; column++) {
      if ((column - x) ** 2 + (row - y) ** 2 > field.radius ** 2) continue;
      sumCos += field.cos[row * field.columns + column];
      sumSin += field.sin[row * field.columns + column];
      neighbours++;
    }
  }
  const phase = field.phase[y * field.columns + x] + field.lag;
  return (sumSin * Math.cos(phase) - sumCos * Math.sin(phase)) / neighbours;
}

test('a step matches the direct sum over each disc, including clipped edges', () => {
  const field = new ChimeraField(3, 0.7, 13, 9, 3);
  const expected = [];
  for (let y = 0; y < field.rows; y++) {
    for (let x = 0; x < field.columns; x++) {
      expected.push(field.phase[y * field.columns + x] + ChimeraField.dt * bruteForceVelocity(field, x, y));
    }
  }
  field.step();
  for (let i = 0; i < field.count; i++) {
    const difference = field.phase[i] - expected[i];
    assert.ok(Math.abs(difference - 2 * Math.PI * Math.round(difference / (2 * Math.PI))) < 1e-12);
  }
});

test('a synchronized grid stays coherent and turns at -sin(lag)', () => {
  const field = new ChimeraField(3, 0.7, 20, 12, 4);
  for (let i = 0; i < field.count; i++) field.setPhase(i, 1);
  for (let step = 0; step < 10; step++) field.step();
  const expected = 1 - field.time * Math.sin(field.lag);
  for (let i = 0; i < field.count; i++) assert.ok(Math.abs(field.phase[i] - expected) < 1e-12);
  assert.equal(field.measures().incoherent, 0);
});

test('random phases smooth into synchronized patches with small incoherent cores', () => {
  const field = new ChimeraField(7, 0.7);
  assert.ok(field.measures().incoherent > 0.9);
  while (field.time < 30) field.step();
  assert.ok(field.measures().incoherent < 0.1, `incoherent = ${field.measures().incoherent}`);
});

test('the lag is clamped to the slider range', () => {
  const field = new ChimeraField(7, 5, 10, 10, 2);
  assert.equal(field.lag, ChimeraField.maxLag);
  field.setLag(-1);
  assert.equal(field.lag, ChimeraField.minLag);
});
