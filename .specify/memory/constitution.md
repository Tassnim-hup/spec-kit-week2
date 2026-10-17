# Spec Kit Week 2 Constitution

## Core Principles

### I. Readable, Consistent Code
Code MUST be easy for a newcomer to read and change.
- Names for variables, functions, CSS classes, and files MUST describe intent.
- Formatting MUST be consistent across HTML, CSS, and JavaScript (indentation, quotes,
  naming case); one style is used throughout.
- Functions SHOULD do one thing; dead code and commented-out code MUST NOT be committed.
- Comments MUST explain why, not restate what the code does.
- Use semantic HTML and plain, standards-based CSS/JavaScript; avoid clever tricks.

Rationale: a small app stays easy to change only if its code stays easy to read.

### II. Meaningful Testing of Core Functionality
Tests MUST target behaviour that matters, not coverage numbers.
- Core logic (e.g., adding, editing, deleting, filtering, and computing data) MUST have
  automated tests, written before or together with the code they verify.
- Core logic MUST live in functions separate from DOM manipulation so it can be tested
  without a browser.
- Every bug fix MUST include a test that fails without the fix.
- Tests MUST be deterministic and independent; they MUST NOT depend on real stored data or
  on each other's order.
- Behaviour that cannot be reasonably automated (visual layout, interaction feel) MUST be
  checked manually against the spec's acceptance scenarios before the work is done.

Rationale: a few tests of the right things protect users better than many tests of trivia.

### III. Reliable localStorage Persistence
User data MUST survive page reloads and MUST NOT be silently lost or corrupted.
- All localStorage access MUST go through one small storage module/set of functions; other
  code MUST NOT call `localStorage` directly.
- Stored data MUST use a single documented key naming scheme and JSON shape.
- Reading MUST tolerate missing, empty, or malformed data by falling back to a safe default
  and MUST NOT crash the app.
- Writes MUST handle failure (e.g., storage full or unavailable) and tell the user.
- Persistence logic MUST be covered by tests using a mock or in-memory storage substitute.

Rationale: persistence is the app's only backend; bugs there cost users their data.

### IV. Simple, Maintainable Architecture
Keep the structure as small as the problem allows.
- Separate concerns into distinct files: HTML for structure, CSS for style, JavaScript for
  behaviour; within JavaScript, keep data/logic, storage, and UI rendering apart.
- Build only what the spec requires (YAGNI); no frameworks, build tools, or dependencies
  unless a spec requirement cannot reasonably be met without them.
- Any added dependency or layer MUST be justified in the plan.
- Avoid global mutable state beyond a single, clearly named application state.

Rationale: simplicity is the cheapest form of maintainability in a small project.

### V. Understandable, Traceable Change
Changes MUST be small and tied to the spec.
- Each commit SHOULD address one concern and reference the spec, task, or feature it
  implements.
- Errors MUST be handled explicitly with clear user-facing messages; failures MUST NOT be
  silently swallowed.
- The README MUST describe how to run the app and its tests, and MUST be updated when that
  changes.

Rationale: small, labelled changes are easy to review, understand, and undo.

## Definition of Done

A feature is done when:
1. It satisfies its spec's acceptance scenarios.
2. Core-logic and persistence tests pass.
3. The code follows Principles I and IV, and the README is current.

## Governance

This constitution supersedes other practices for this project. If a spec, plan, or task
conflicts with it, the conflicting artifact MUST be corrected or the constitution amended.

- **Amendments**: edit this file, state the reason in the commit message, and update the
  version and date below.
- **Versioning**: semantic versioning. MAJOR for removing or redefining principles; MINOR for
  adding principles or materially expanding guidance; PATCH for wording clarifications.
- **Compliance**: the plan's Constitution Check and a self-review before finishing each
  feature MUST confirm these principles are met.

**Version**: 1.1.0 | **Ratified**: 2026-10-17 | **Last Amended**: 2026-10-17
