# Quickstart: Quote of the Day

## Prerequisites

- Any current browser.
- Node.js 20+ (tests only).

## Run the page

Open `index.html` in a browser (double-click, or serve the folder with any static server).
No install or build step.

## Run the tests

```bash
node --test
```

Expected: all tests pass for quote selection, favorites logic, and storage handling.

## Manual validation (maps to spec acceptance scenarios)

1. **Random quote (US1)**: Open the page several times. Each time one quote with an author
   appears; over several loads the quote varies.
2. **New quote (US2)**: Click "New quote" 20 times. Each click changes the quote and no
   quote repeats twice in a row.
3. **Favorite (US3, scenarios 1–2)**: Click the favorite control; it shows as favorited.
   Click again; it shows as not favorited.
4. **Restore (US3, scenarios 3–4)**: Favorite a quote, click "New quote" until it comes back
   (or reload until it appears); it is shown as favorited.
5. **Removal persists (US3, scenario 5)**: Unfavorite a quote, reload, wait for it to
   reappear; it is shown as not favorited.
6. **One quote only (US3, scenario 6)**: With several favorites saved, confirm the page shows
   one quote and has no favorites list or page.
7. **Bad data (edge case)**: In browser dev tools set `quoteOfTheDay.favorites` to `not json`
   and reload; the page works and shows no favorites.
8. **Save failure (edge case)**: Disable site storage in the browser and click the favorite
   control; a message explains the favorite could not be saved and the control reverts.

See [contracts/](contracts/) for interfaces and [data-model.md](data-model.md) for the data.
