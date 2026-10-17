---

description: "Task list for Quote of the Day"
---

# Tasks: Quote of the Day

**Input**: Design documents from `/specs/001-quote-of-the-day/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/modules.md, contracts/storage.md, quickstart.md

**Tests**: Included. The constitution (Principle II) requires automated tests for core logic and persistence, written before the code they verify. Layout and interaction feel are checked manually (see T020).

**Organization**: Tasks are grouped by user story. All paths are relative to the repository root.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story the task belongs to (US1, US2, US3)

## Conventions for every task

- Classic scripts, no ES modules (research.md, Decision 1). Each logic file in `js/` attaches its functions to one browser global and sets `module.exports` when `module` exists, so Node tests can `require` it.
- Tests use `node:test` and `node:assert` only. Run with `node --test`.
- Only `js/storage.js` may reference `localStorage` (constitution Principle III).
- Logic files (`quotes.js`, `favorites.js`, `storage.js`) MUST NOT touch the DOM.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project skeleton

- [X] T001 Create the directories `css/`, `js/`, and `tests/` at the repository root (layout in plan.md "Source Code")
- [X] T002 Create `package.json` at the repository root with `"name": "quote-of-the-day"`, `"private": true`, and a single script `"test": "node --test"`; no dependencies or devDependencies

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Page shell and base styling that every user story renders into

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Create `index.html` using semantic HTML with: a `<main>`; a `<blockquote>` with an element for the quote text (`id="quote-text"`) and the author (`id="quote-author"`); a `<button id="new-quote-button" type="button">New quote</button>`; a `<button id="favorite-button" type="button" aria-pressed="false">` with a visible label; a notice element (`id="notice"`, `role="status"`, empty by default); and, at the end of `<body>`, classic `<script>` tags in this order: `js/quotes.js`, `js/favorites.js`, `js/storage.js`, `js/app.js` (UI contract in contracts/modules.md)
- [X] T004 [P] Create `css/styles.css` and link it from `index.html`: readable centered layout, legible type, visible focus outlines, a clearly different look for the favorite button when `aria-pressed="true"`, and a layout that works at phone width

**Checkpoint**: Opening `index.html` shows the empty shell with working styles.

---

## Phase 3: User Story 1 - See a random quote (Priority: P1) 🎯 MVP

**Goal**: Opening the page shows exactly one random quote with its author.

**Independent Test**: Open the page several times; a quote with an author always appears and varies across visits. `node --test` passes for `quotes.test.js`.

### Tests for User Story 1 ⚠️

> Write first and confirm they FAIL before implementing.

- [X] T005 [P] [US1] Create `tests/quotes.test.js` covering: `QUOTES` has at least 10 entries, each with non-empty string `id`, `text`, and `author`, and all `id` values unique; `pickRandomQuote(quotes, null, random)` returns the quote at index `Math.floor(random() * quotes.length)` using an injected `random`; it returns `null` for an empty list (contracts/modules.md)

### Implementation for User Story 1

- [X] T006 [US1] Create `js/quotes.js` exporting `QUOTES` (at least 10 entries of `{ id, text, author }`, ids `q01`, `q02`, … never reused; `text` and `author` non-empty) and `pickRandomQuote(quotes, excludeId, random = Math.random)` that returns a random quote or `null` for an empty list; `excludeId` is accepted but not yet applied (added in US2)
- [X] T007 [US1] Create `js/app.js` with a single `state` object (`currentQuote`, `favoriteIds`, `notice`) and a `render()` function that writes the current quote's text and author into `#quote-text` and `#quote-author`; on `DOMContentLoaded`, set `state.currentQuote` using `pickRandomQuote(QUOTES, null)` and call `render()`

**Checkpoint**: User Story 1 works on its own: one random quote appears on every load.

---

## Phase 4: User Story 2 - Get a new quote (Priority: P2)

**Goal**: "New quote" replaces the displayed quote with a different random one.

**Independent Test**: Click "New quote" 20 times; every click changes the quote and none repeats the previous one.

### Tests for User Story 2 ⚠️

- [X] T008 [US2] Add to `tests/quotes.test.js`: `pickRandomQuote` never returns the quote whose id equals `excludeId` when the list has more than one quote (check for every possible injected `random` value in `[0, 1)` stepped across the list, including values near 1); with a one-quote list it returns that quote even when it is excluded; 20 consecutive calls with the real `Math.random`, each excluding the previous result, never return the same id twice in a row

### Implementation for User Story 2

- [X] T009 [US2] Update `pickRandomQuote` in `js/quotes.js` to choose uniformly from the list with the quote matching `excludeId` removed, falling back to the only quote when exactly one exists (research.md, Decision 4)
- [X] T010 [US2] In `js/app.js`, add a click handler on `#new-quote-button` that sets `state.currentQuote = pickRandomQuote(QUOTES, state.currentQuote.id)`, clears `state.notice`, and calls `render()`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Favorite quotes that persist (Priority: P3)

**Goal**: A visitor can favorite and unfavorite the displayed quote; the saved state is restored whenever the quote appears again, including after a reload; only one quote is shown and there is no favorites page or list.

**Independent Test**: Favorite a quote, reload and click "New quote" until it returns: it shows as favorited. Unfavorite it, reload, and when it returns it shows as not favorited. `node --test` passes for the favorites, storage, and persistence tests.

### Tests for User Story 3 ⚠️

- [X] T011 [P] [US3] Create `tests/favorites.test.js` covering: `isFavorite` is `true` only for ids in the list; `toggleFavorite` adds an absent id and removes a present id; `toggleFavorite` returns a new array and does not mutate its input; toggling twice returns an equal list (contracts/modules.md)
- [X] T012 [P] [US3] Create `tests/storage.test.js` using an in-memory fake storage object (`getItem`, `setItem`) covering `loadFavorites`/`saveFavorites` for key `quoteOfTheDay.favorites`: missing key returns `[]`; invalid JSON returns `[]`; valid JSON that is not an array returns `[]`; non-string entries are dropped and duplicates removed; a `getItem` that throws returns `[]`; `saveFavorites` writes a JSON array string under the key and returns `true`; a `setItem` that throws makes it return `false` without throwing (contracts/storage.md)
- [X] T013 [P] [US3] Create `tests/persistence.test.js` using the same kind of fake storage to cover the restoration rules (FR-007): toggle on → `saveFavorites` → `loadFavorites` → `isFavorite` is `true` (simulating a reload); toggle off → save → load → `isFavorite` is `false`; a favorite on one id leaves other ids not favorited; a favorite is still reported after loading when other quotes are picked in between

### Implementation for User Story 3

- [X] T014 [P] [US3] Create `js/favorites.js` exporting `isFavorite(favoriteIds, quoteId)` and `toggleFavorite(favoriteIds, quoteId)` as pure functions (the latter returns a new array; no mutation)
- [X] T015 [P] [US3] Create `js/storage.js` exporting `loadFavorites(storage = localStorage)` and `saveFavorites(favoriteIds, storage = localStorage)` with key `quoteOfTheDay.favorites` and the read/write rules in contracts/storage.md; neither function throws; this is the only file that references `localStorage`
- [X] T016 [US3] In `js/app.js`, on `DOMContentLoaded` load `state.favoriteIds` with `loadFavorites()` before the first render, and make `render()` set `#favorite-button`'s `aria-pressed` and visible label from `isFavorite(state.favoriteIds, state.currentQuote.id)` so a previously favorited quote is shown as favorited each time it appears
- [X] T017 [US3] In `js/app.js`, add a click handler on `#favorite-button`: compute `next = toggleFavorite(state.favoriteIds, state.currentQuote.id)`, call `saveFavorites(next)`; on `true` set `state.favoriteIds = next` and clear `state.notice`; on `false` leave `state.favoriteIds` unchanged and set `state.notice` to a clear message that the favorite could not be saved; then `render()`, which writes `state.notice` into `#notice`

**Checkpoint**: All three user stories work independently and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final checks against the constitution

- [X] T018 [P] Create `README.md` at the repository root describing the app, how to open it (`index.html`), how to run the tests (`node --test`, Node 20+), the file layout, and the localStorage key and format (Principle V)
- [X] T019 Review all files in `js/`, `css/`, `index.html`, and `tests/` against the constitution: descriptive names, consistent style, no dead or commented-out code, comments explain why, `localStorage` referenced only in `js/storage.js` (verify with a search), core logic free of DOM access, and no dependencies added
- [X] T020 Run the manual checks in `specs/001-quote-of-the-day/quickstart.md` (steps 1–8) in a browser, including keyboard-only use of both buttons, and fix any failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories
- **User Stories (Phases 3–5)**: Depend on Foundational; best done in priority order because all three edit `js/app.js` and US2 edits `js/quotes.js`
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; no dependency on other stories
- **US2 (P2)**: Builds on US1's `quotes.js` and `app.js`, and is testable on its own once US1 exists
- **US3 (P3)**: Uses US1's `app.js` and render path; its modules and tests (T011–T015) do not depend on US1 or US2

### Within Each User Story

- Tests are written and seen to fail before the implementation they cover
- Logic modules before `app.js` wiring

### Parallel Opportunities

- T004 can run alongside T003 (different files) once T001 is done
- US3 tests T011, T012, T013 can be written in parallel; so can modules T014 and T015
- T011–T015 can start in parallel with US1/US2 work because they touch different files
- T018 can run in parallel with T019

---

## Parallel Example: User Story 3

```text
# Write all three test files together:
Task: "Create tests/favorites.test.js"
Task: "Create tests/storage.test.js"
Task: "Create tests/persistence.test.js"

# Then implement both logic modules together:
Task: "Create js/favorites.js"
Task: "Create js/storage.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational)
2. Complete Phase 3 (User Story 1)
3. **Stop and validate**: open the page repeatedly; a random quote with an author appears each time

### Incremental Delivery

1. Setup + Foundational → page shell ready
2. Add US1 → random quote (MVP)
3. Add US2 → "New quote" without repeats
4. Add US3 → persistent favorites
5. Polish: README, constitution review, manual quickstart run

---

## Notes

- [P] tasks touch different files and have no unfinished dependencies
- Commit after each task or logical group, referencing the task ID (Principle V)
- Do not add a favorites page or list (FR-010)
