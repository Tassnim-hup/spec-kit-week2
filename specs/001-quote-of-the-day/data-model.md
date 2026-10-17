# Data Model: Quote of the Day

## Quote (built-in, read-only)

| Field | Type | Rules |
|-------|------|-------|
| `id` | string | Required, unique within the list, never changed once assigned (e.g., `q01`) |
| `text` | string | Required, non-empty |
| `author` | string | Required, non-empty |

- The list is a constant in `js/quotes.js` with at least 10 entries (spec assumption).
- Visitors cannot add, edit, or delete quotes.

## Favorites (persisted)

A set of quote IDs. Stored form is defined in [contracts/storage.md](contracts/storage.md).

| Rule | Source |
|------|--------|
| Contains each quote ID at most once | Set semantics |
| An ID in the set means that quote is a favorite | FR-005 |
| IDs not matching any current quote are ignored when displayed and may be dropped on save | Robustness for edited lists |
| Missing, empty, or malformed stored data is treated as an empty set | FR-008 |

## Application state (in memory, owned by `js/app.js`)

| Field | Description |
|-------|-------------|
| `currentQuote` | The quote being displayed (exactly one at a time, FR-002, FR-010) |
| `favorites` | The favorites set, loaded once at start and updated on each toggle |
| `notice` | Current user-facing message, e.g., "Couldn't save favorite" (empty normally) |

## State transitions

- **Page load**: load favorites (empty set on any problem) → choose random quote → render.
- **New quote**: choose random quote ≠ `currentQuote` → render with that quote's saved state.
- **Toggle favorite**: flip membership of `currentQuote.id` → save → on success render the new
  state; on failure revert to the previous state and show a notice.
