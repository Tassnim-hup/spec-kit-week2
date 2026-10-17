# Contract: localStorage

| Item | Value |
|------|-------|
| Key | `quoteOfTheDay.favorites` |
| Value | JSON array of quote ID strings, e.g. `["q03","q07"]` |
| Empty state | Key absent, or `[]` |

## Read rules (`loadFavorites`)

- Key absent, value not valid JSON, value not an array, or localStorage unavailable → return
  an empty list.
- Array entries that are not strings are dropped; duplicates are removed.
- Never throws.

## Write rules (`saveFavorites`)

- Writes the full list as JSON under the key.
- Returns `true` on success and `false` if the write throws (storage full, disabled, or
  blocked). Never throws.

## Ownership

Only `js/storage.js` may reference `localStorage` (constitution Principle III). The storage
object is passed in, defaulting to the browser's `localStorage`, so tests can substitute an
in-memory fake.
