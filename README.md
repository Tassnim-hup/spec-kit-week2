# Quote of the Day

A single static page that shows one random quote from a built-in list. A "New quote" button
shows a different quote, and a favorite button marks quotes you like. Favorites are saved in
your browser and are still marked when a quote comes back, even after a reload.

There is no backend and nothing to install or build.

## Run it

Open `index.html` in a browser (double-click it, or serve the folder with any static server).

## Run the tests

Requires Node.js 20 or newer. No packages to install.

```bash
node --test
```

The tests cover quote selection, the favorites logic, and storage handling using an in-memory
fake instead of the real browser storage. Layout and interaction are checked by hand with the
steps in `specs/001-quote-of-the-day/quickstart.md`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `css/styles.css` | Styling |
| `js/quotes.js` | Built-in quotes and random selection |
| `js/favorites.js` | Favorite add/remove logic |
| `js/storage.js` | The only code that touches `localStorage` |
| `js/app.js` | Connects the page to the logic |
| `tests/` | Automated tests |

## Saved data

Favorites are stored under the `localStorage` key `quoteOfTheDay.favorites` as a JSON array of
quote ids, for example `["q03","q07"]`. Missing or corrupted data is treated as "no favorites".
Quote ids in `js/quotes.js` must never change, or saved favorites will stop matching.
