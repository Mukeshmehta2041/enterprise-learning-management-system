# Frontend Day 14 – Advanced routing, nested layouts, and URL state

**Focus:** Enhance navigation with nested layouts, route groups, and URL-driven state for filters and views.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Nested layouts and URL-based state patterns in place. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Nested layouts and sections

- [x] Review existing route structure for learner, instructor, and admin areas.
- [x] Introduce nested layouts (e.g. `/app/learner/*`, `/app/instructor/*`) to share navigation, sidebars, and headers.
- [x] Ensure layout components are clean, reusable, and follow the design system.

### 2. URL state and query parameters

- [x] Move key UI state (filters, search, sort, pagination) into the URL using query params.
- [x] Ensure that sharing a URL reproduces the same view (deep linking).
- [x] Add helpers/hooks for reading/writing URL params in a type-safe way.

### 3. Route guards and redirects

- [x] Centralize route guarding logic (auth + role checks) where possible instead of duplicating it in each page.
- [x] Ensure users are redirected to appropriate dashboards on login based on role.

### 4. Progress update

- [x] Update the **Progress** table at the top of this file when Day 14 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 14 is complete. Next: [Frontend Day 15](frontend-day-15.md) (Global state management and React Query patterns).

