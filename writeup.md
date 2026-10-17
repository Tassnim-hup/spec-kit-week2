# Week 2 Writeup: Spec-Driven Development with Spec Kit

**Project:** Quote of the Day, a static page that shows one random quote from a built-in list,
with a "New quote" button and favoriting that persists across reloads (plain HTML/CSS/JavaScript,
`localStorage`, no backend).
**Artifacts:** `.specify/memory/constitution.md`, `specs/001-quote-of-the-day/`
(`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`,
`tasks.md`), plus the app in `index.html`, `css/`, `js/`, and `tests/`.

## 1. Skill Prompts

Exact text typed after each slash command. Where a skill was run with no text, that is stated.

| # | Skill | Prompt given |
|---|-------|--------------|
| 1 | `/speckit-constitution` | `Create principles focused on code quality, testing, and maintainability.` |
| 2 | `/speckit-specify` | `A quote-of-the-day page: one random quote from a built-in list, a "New quote" button, and favoriting that persists across reloads.` |
| 3 | `/speckit-plan` | `Use plain HTML/CSS/JavaScript, no backend; persist favorites in localStorage.` |
| 4 | `/speckit-tasks` | *(none: run with an empty argument)* |
| 5 | `/speckit-implement` | *(none: run with an empty argument)* |
| 6 | `/speckit-converge` | *(none: run with an empty argument)* |

**Follow-up prompts between skills.** Two plain-chat instructions (not slash commands) shaped the
result. Their full text is in the collapsed blocks.

<details>
<summary>Constitution follow-up (run after skill 1, before specify)</summary>

> Before proceeding, review `.specify/memory/constitution.md` for completeness, consistency, and unresolved placeholders.
>
> Keep the constitution focused on code quality, meaningful testing, and maintainability, as required by the assignment.
>
> Since this is a small HTML/CSS/JavaScript application, remove unnecessary enterprise-level requirements such as mandatory 80% code coverage, rigid function-length limits, quarterly governance reviews, and CI requirements that are not explicitly needed.
>
> Preserve practical standards for readable code, testing core functionality, localStorage persistence, and simple maintainable architecture.
>
> Verify that the final file contains no unresolved placeholders. Report the final principles and any changes made.
>
> Do not proceed to the specification stage yet.

Effect: the first constitution (v1.0.0) was written with enterprise-style rules (80% coverage,
50-line function limit, CI gates, quarterly reviews). This follow-up cut it down to v1.1.0 with
five principles scoped to a small app.
</details>

<details>
<summary>Specification refinement (run after skill 2, before plan). See section 2.</summary>

> Before proceeding to planning, refine the existing specification in `specs/001-quote-of-the-day/spec.md`.
> The current specification requires favorites to persist across reloads, but it should explicitly define how the favorite state is restored when a previously favorited quote reappears.
> Update the relevant functional requirement and acceptance criteria to clarify that:
>
> * Favoriting a quote saves its selected state.
> * When a previously favorited quote appears again, its favorite state is correctly restored.
> * Removing a favorite updates the stored state, including after a page reload.
> * The page still displays only one quote at a time, without adding a separate favorites page.
>
> Preserve the existing feature scope and avoid implementation-specific details.
> Before editing, show the original requirement wording. After editing, show the revised wording and explain precisely what changed and why.
> Re-run the specification quality checklist and update it if necessary.
> Do not proceed to planning or implementation yet.
</details>

## 2. Specification Refinement (Before / After)

### Before (original `spec.md`)

- **FR-005**: Visitors MUST be able to mark the displayed quote as a favorite and remove that mark.
- **FR-006**: The page MUST clearly show whether the displayed quote is currently a favorite.
- **FR-007**: Favorites MUST persist across page reloads and later visits on the same device and browser.
- **User Story 3** had three scenarios: favorite it, unfavorite it, and "still shown as favorited" after a reload.
- **SC-004**: 100% of quotes marked as favorites are still marked after a page reload.
- The "no favorites list" rule appeared only as an assumption.

### After (current `spec.md`)

- **FR-005**: ...mark the displayed quote as a favorite and remove that mark; **each action MUST immediately save the quote's new favorite state.**
- **FR-006**: ...clearly show whether the displayed quote is currently a favorite, **and this indicator MUST always reflect the saved state for that quote.**
- **FR-007**: Favorite state MUST persist across page reloads and later visits on the same device and browser. **Whenever a previously favorited quote appears again (after a reload, a later visit, or via "New quote"), it MUST be shown as a favorite; a quote whose favorite mark was removed MUST be shown as not a favorite, including after a reload.**
- **FR-010 (new)**: The page MUST show only one quote at a time and MUST NOT include a separate favorites page or list.
- **User Story 3** grew from 3 to 6 scenarios: saved on favorite (1), saved on unfavorite (2), restored after reload (3), **restored when the quote reappears via "New quote" (4), removal survives a reload (5), one quote only and no favorites page (6).**
- **SC-004** now covers both directions: favorites restored, and removed favorites staying removed after a reload.
- The assumption about a favorites list now points to FR-010.

### Why it was necessary

"Favorites persist across reloads" was ambiguous in three ways. It never said when state is
saved. It never covered the same quote reappearing within one visit through "New quote". It said
nothing about un-favoriting being permanent. Each gap is a place where an implementation could
look correct on a quick check but lose or resurrect a favorite. The "no separate favorites page"
rule was also only an assumption, so it could not be tested.

### How it carried through

- **Plan:** `plan.md` states favorites are "restored whenever a quote appears".
  `data-model.md` defines the "New quote" transition as "render with that quote's saved state".
  `contracts/storage.md` and `contracts/modules.md` require the toggle indicator to mirror the
  saved state, and `quickstart.md` has manual steps for restore, removal-persists, and one-quote-only.
- **Tasks:** US3 in `tasks.md` states its goal as restoring state whenever the quote appears
  again. T013 creates a dedicated `tests/persistence.test.js` for the restoration rules (FR-007).
  T016 renders the toggle from saved state each time a quote appears. T017 saves on each action
  and reverts on failure.
- **Tests:** `tests/persistence.test.js` (4 tests) simulates reloads with a fake storage. It
  covers favorite then reload, unfavorite then reload, favoriting one id leaving others
  untouched, and a favorite restored when its quote reappears after other quotes.
- **Implementation:** `render()` in `js/app.js` sets the button state from
  `isFavorite(state.favoriteIds, state.currentQuote.id)` on every render. A failed save keeps
  the old list, so the indicator never shows an unsaved favorite. There is no favorites list in
  `index.html`.

## 3. Convergence Outcome

`/speckit-converge` result: **"✅ Converged — the implementation satisfies the spec, plan, and
tasks."** `tasks.md` was left unchanged, with no Convergence phase added.

| Gap type | Findings |
|----------|----------|
| missing | 0 |
| partial | 0 |
| contradicts | 0 |
| unrequested | 0 |

- **Checked:** 10 functional requirements, 5 success criteria, all user-story scenarios and
  edge cases, the plan's 6 research decisions, and constitution principles I–V.
- **Automated tests:** `node --test` reports 25 tests, 25 pass, 0 fail
  (quotes 9, favorites 5, storage 7, persistence 4).
- **Keyboard verification:** during the converge run, in a browser, Tab then Enter on
  "New quote" changed the quote, and Tab then Space on the favorite button favorited it
  (saved list became `["q04"]`). Both controls work from the keyboard alone.
- **Constitution spot-checks:** `localStorage` is referenced only in `js/storage.js`, and the
  logic files contain no DOM access.
- **Other browser checks (during implement):** 20 "New quote" clicks produced no repeats, a
  favorite persisted across a real reload, corrupt stored data was handled, and a failed save
  showed a message and reverted the toggle.

**Caveat:** converge caught that task T020 ("run manual checks, including keyboard-only use")
had been ticked before keyboard use was actually tested. It was tested during the converge run,
so the final result stands, but the earlier tick was ahead of the evidence.

**One deviation from the written plan:** `node --test tests/` fails on newer Node versions
(this machine runs Node 24), so the documents and `package.json` use plain `node --test`.

## 4. Reflection

Spec-driven development initially felt like overhead because I had to define principles, write
specifications, review design decisions, and organize tasks before implementing a relatively
small application. However, refining the favorites requirement demonstrated its value by making
persistence and state restoration explicit, which directly informed the implementation and
automated tests. The convergence stage provided an additional benefit by revealing that
keyboard-only interaction had been marked complete before being verified, reinforcing the
importance of checking evidence rather than relying solely on completed task lists.
