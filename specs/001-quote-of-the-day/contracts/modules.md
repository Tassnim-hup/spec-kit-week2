# Contract: Logic Module Interfaces

Public functions each module exposes in the browser (one global namespace) and via
`module.exports` in Node. None of these touch the DOM.

## `js/quotes.js`

| Function | Behavior |
|----------|----------|
| `QUOTES` | Built-in array of `{ id, text, author }`; see [data-model.md](../data-model.md) |
| `pickRandomQuote(quotes, excludeId, random)` | Returns one quote from `quotes`, never the one with `excludeId` when more than one quote exists; returns the only quote if the list has one; `random` is a function returning a number in `[0, 1)` (defaults to `Math.random`); returns `null` for an empty list |

## `js/favorites.js`

| Function | Behavior |
|----------|----------|
| `isFavorite(favoriteIds, quoteId)` | `true` if the ID is in the list |
| `toggleFavorite(favoriteIds, quoteId)` | Returns a new list with the ID added if absent or removed if present; does not mutate the input |

## `js/storage.js`

| Function | Behavior |
|----------|----------|
| `loadFavorites(storage)` | See read rules in [storage.md](storage.md) |
| `saveFavorites(favoriteIds, storage)` | See write rules in [storage.md](storage.md) |

`storage` defaults to the browser's `localStorage`.

## UI contract (`index.html` / `js/app.js`)

| Element | Requirement |
|---------|-------------|
| Quote text and author | Exactly one quote shown at all times (FR-002, FR-010) |
| "New quote" button | Labelled, keyboard reachable (FR-003) |
| Favorite control | A toggle button with an accessible name and a pressed/not-pressed state that mirrors the saved state (FR-005, FR-006) |
| Notice area | Announces save failures to the visitor (FR-009) |
| No favorites page or list | FR-010 |
