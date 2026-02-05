# Frontend Day 2 – Design system and layout shell

**Focus:** Define core UI primitives with Tailwind and implement the authenticated layout shell (header, sidebar, content area).

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 2 implemented (design system primitives and layout shell ready) |

**Started:** 2026-02-05
**Completed:** 2026-02-05

---

## Checklist

### 1. Shared UI primitives

- [x] Create a `src/shared/ui` (or similar) folder for UI components.
- [x] Implement `Button` and `IconButton` components using Tailwind variants (primary, secondary, danger).
- [x] Implement form controls: `Input`, `Textarea`, `Select`, `Checkbox` with consistent sizing and error display.
- [x] Implement `Card`, `PageHeader`, and `Container` layout primitives.

### 2. Typography and tokens

- [x] Define heading and body text styles using Tailwind utility classes and apply them via small helpers or components.
- [x] Ensure spacing, border-radius, and shadow usage follow the design tokens from `02-design-system.md`.

### 3. Layout shell

- [x] Implement the main authenticated layout shell with header, optional sidebar (on `md+`), and scrollable content area.
- [x] Add placeholder navigation links (e.g. Dashboard, Courses, Assignments, Analytics).
- [x] Make the layout responsive (sidebar collapse on small screens).

### 4. Hook up layout to routes

- [x] Wrap authenticated routes (e.g. `/dashboard`, `/courses`) in the layout shell.
- [x] Keep public routes (`/login`, `/register`) on a separate, simpler layout.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 2 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 2 is complete. Next: [Frontend Day 3](frontend-day-3.md) (Auth screens and session management).

