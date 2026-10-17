const test = require('node:test');
const assert = require('node:assert');
const { loadFavorites, saveFavorites } = require('../js/storage.js');

const KEY = 'quoteOfTheDay.favorites';

function createFakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); }
  };
}

test('loadFavorites returns [] when the key is missing', () => {
  assert.deepStrictEqual(loadFavorites(createFakeStorage()), []);
});

test('loadFavorites returns [] for invalid JSON', () => {
  assert.deepStrictEqual(loadFavorites(createFakeStorage({ [KEY]: 'not json' })), []);
});

test('loadFavorites returns [] for valid JSON that is not an array', () => {
  assert.deepStrictEqual(loadFavorites(createFakeStorage({ [KEY]: '{"a":1}' })), []);
  assert.deepStrictEqual(loadFavorites(createFakeStorage({ [KEY]: '"q01"' })), []);
});

test('loadFavorites drops non-string entries and duplicates', () => {
  const storage = createFakeStorage({ [KEY]: '["q01", 5, null, "q02", "q01"]' });
  assert.deepStrictEqual(loadFavorites(storage), ['q01', 'q02']);
});

test('loadFavorites returns [] when reading throws', () => {
  const storage = { getItem() { throw new Error('blocked'); } };
  assert.deepStrictEqual(loadFavorites(storage), []);
});

test('saveFavorites writes a JSON array under the documented key and returns true', () => {
  const storage = createFakeStorage();
  assert.strictEqual(saveFavorites(['q01', 'q02'], storage), true);
  assert.deepStrictEqual(JSON.parse(storage.data[KEY]), ['q01', 'q02']);
});

test('saveFavorites returns false without throwing when writing fails', () => {
  const storage = { setItem() { throw new Error('quota exceeded'); } };
  assert.strictEqual(saveFavorites(['q01'], storage), false);
});
