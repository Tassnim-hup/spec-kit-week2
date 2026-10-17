const test = require('node:test');
const assert = require('node:assert');
const { isFavorite, toggleFavorite } = require('../js/favorites.js');

test('isFavorite is true only for ids in the list', () => {
  assert.strictEqual(isFavorite(['q01', 'q02'], 'q01'), true);
  assert.strictEqual(isFavorite(['q01', 'q02'], 'q03'), false);
  assert.strictEqual(isFavorite([], 'q01'), false);
});

test('toggleFavorite adds an id that is absent', () => {
  assert.deepStrictEqual(toggleFavorite(['q01'], 'q02'), ['q01', 'q02']);
});

test('toggleFavorite removes an id that is present', () => {
  assert.deepStrictEqual(toggleFavorite(['q01', 'q02'], 'q01'), ['q02']);
});

test('toggleFavorite does not mutate its input', () => {
  const original = ['q01'];
  const result = toggleFavorite(original, 'q02');
  assert.deepStrictEqual(original, ['q01']);
  assert.notStrictEqual(result, original);
});

test('toggling twice returns an equal list', () => {
  const original = ['q01', 'q02'];
  assert.deepStrictEqual(toggleFavorite(toggleFavorite(original, 'q03'), 'q03'), original);
});
