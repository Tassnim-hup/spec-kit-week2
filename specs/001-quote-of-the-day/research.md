# Research: Quote of the Day

All technical context items were resolved from the user's input and the constitution; there
were no open NEEDS CLARIFICATION items.

## Decision 1: Plain HTML/CSS/JavaScript with classic scripts

- **Decision**: Use `<script>` tags (not ES modules). Each logic file attaches to one global
  namespace in the browser and sets `module.exports` when run in Node.
- **Rationale**: ES modules are blocked from `file://` in several browsers, which would stop
  the page from opening by double-click. Classic scripts work everywhere and still allow
  Node tests without a build step.
- **Alternatives considered**: ES modules (needs a local server; breaks double-click use);
  a bundler (violates the no-build-tools rule in Principle IV).

## Decision 2: Favorites stored as one localStorage key with a JSON array of quote IDs

- **Decision**: Key `quoteOfTheDay.favorites`, value a JSON array of strings (see
  [contracts/storage.md](contracts/storage.md)).
- **Rationale**: A set of IDs is all the spec needs (FR-005–FR-007), is easy to inspect and
  validate, and survives edits to quote text because IDs are stable.
- **Alternatives considered**: Storing full quote objects (duplicates data, goes stale);
  one key per quote (harder to read and validate as a whole); IndexedDB or cookies
  (needlessly complex for a handful of IDs).

## Decision 3: Stable string IDs on every quote

- **Decision**: Each built-in quote has a hand-assigned unique `id` (e.g., `q01`).
- **Rationale**: Position in the list or the text would break saved favorites if the list is
  reordered or a typo is fixed.
- **Alternatives considered**: Array index (fragile); hash of the text (breaks on edits).

## Decision 4: Random choice that excludes the current quote

- **Decision**: Pick a random index from the list with the current quote removed; if only one
  quote exists, return it.
- **Rationale**: Guarantees FR-004 and SC-003 deterministically, rather than re-rolling until
  different. The random source is injectable so tests are deterministic (Principle II).
- **Alternatives considered**: Re-roll loop (non-deterministic runtime); shuffle-bag
  (more state than the spec requires).

## Decision 5: Node's built-in test runner

- **Decision**: Use `node --test` with `node:assert`; `package.json` holds only the test
  script and has no dependencies.
- **Rationale**: Satisfies "tests for core logic" with zero installed packages.
- **Alternatives considered**: Jest or Vitest (large dependency trees for a tiny app);
  in-browser test page (harder to automate).

## Decision 6: Failure handling for storage

- **Decision**: Reads of missing, malformed, or wrongly shaped data return an empty favorites
  set; invalid entries are dropped. Writes return a success/failure result, and on failure
  the page shows a visible message and reverts the toggle so the display matches what is
  actually saved (FR-006, FR-008, FR-009).
- **Rationale**: Prevents crashes and keeps the indicator truthful.
- **Alternatives considered**: Silent failure (violates FR-009); keeping an in-memory favorite
  that is not saved (indicator would lie after reload).
