const test = require('node:test');
const assert = require('node:assert');
const { QUOTES, pickRandomQuote } = require('../js/quotes.js');

test('QUOTES has at least 10 entries', () => {
  assert.ok(QUOTES.length >= 10);
});

test('every quote has a non-empty id, text, and author', () => {
  for (const quote of QUOTES) {
    for (const field of ['id', 'text', 'author']) {
      assert.strictEqual(typeof quote[field], 'string');
      assert.ok(quote[field].trim().length > 0, `${quote.id || '?'} has empty ${field}`);
    }
  }
});

test('quote ids are unique', () => {
  const ids = QUOTES.map((quote) => quote.id);
  assert.strictEqual(new Set(ids).size, ids.length);
});

test('pickRandomQuote uses the injected random value to choose an index', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.strictEqual(pickRandomQuote(list, null, () => 0).id, 'a');
  assert.strictEqual(pickRandomQuote(list, null, () => 0.5).id, 'b');
  assert.strictEqual(pickRandomQuote(list, null, () => 0.99).id, 'c');
});

test('pickRandomQuote returns null for an empty list', () => {
  assert.strictEqual(pickRandomQuote([], null, () => 0), null);
});

test('pickRandomQuote never returns the excluded quote when others exist', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  for (let step = 0; step < 100; step++) {
    const random = () => step / 100;
    assert.notStrictEqual(pickRandomQuote(list, 'b', random).id, 'b');
  }
  assert.notStrictEqual(pickRandomQuote(list, 'c', () => 0.999999).id, 'c');
});

test('pickRandomQuote can still reach every non-excluded quote', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.strictEqual(pickRandomQuote(list, 'b', () => 0).id, 'a');
  assert.strictEqual(pickRandomQuote(list, 'b', () => 0.99).id, 'c');
});

test('pickRandomQuote returns the only quote even when it is excluded', () => {
  const list = [{ id: 'a' }];
  assert.strictEqual(pickRandomQuote(list, 'a', () => 0).id, 'a');
});

test('20 consecutive picks with real randomness never repeat the previous quote', () => {
  let current = pickRandomQuote(QUOTES, null);
  for (let i = 0; i < 20; i++) {
    const next = pickRandomQuote(QUOTES, current.id);
    assert.notStrictEqual(next.id, current.id);
    current = next;
  }
});
