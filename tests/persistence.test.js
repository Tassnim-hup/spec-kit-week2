const test = require('node:test');
const assert = require('node:assert');
const { isFavorite, toggleFavorite } = require('../js/favorites.js');
const { loadFavorites, saveFavorites } = require('../js/storage.js');

function createFakeStorage() {
  const data = {};
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); }
  };
}

test('a favorited quote is still a favorite after a simulated reload', () => {
  const storage = createFakeStorage();
  saveFavorites(toggleFavorite(loadFavorites(storage), 'q03'), storage);

  const afterReload = loadFavorites(storage);
  assert.strictEqual(isFavorite(afterReload, 'q03'), true);
});

test('a removed favorite stays removed after a simulated reload', () => {
  const storage = createFakeStorage();
  saveFavorites(toggleFavorite(loadFavorites(storage), 'q03'), storage);
  saveFavorites(toggleFavorite(loadFavorites(storage), 'q03'), storage);

  const afterReload = loadFavorites(storage);
  assert.strictEqual(isFavorite(afterReload, 'q03'), false);
});

test('favoriting one quote does not favorite any other quote', () => {
  const storage = createFakeStorage();
  saveFavorites(toggleFavorite(loadFavorites(storage), 'q03'), storage);

  const afterReload = loadFavorites(storage);
  assert.strictEqual(isFavorite(afterReload, 'q04'), false);
});

test('a favorite is restored when its quote appears again after other quotes', () => {
  const storage = createFakeStorage();
  saveFavorites(toggleFavorite(loadFavorites(storage), 'q03'), storage);

  const favorites = loadFavorites(storage);
  const shownInOrder = ['q03', 'q07', 'q01', 'q03'];
  const flags = shownInOrder.map((id) => isFavorite(favorites, id));
  assert.deepStrictEqual(flags, [true, false, false, true]);
});
