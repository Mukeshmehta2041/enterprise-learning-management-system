# Frontend Day 18 – Search, sorting, filtering, and pagination UX

**Focus:** Make large lists (courses, users, enrollments, submissions) fast to explore with good search, filter, and pagination patterns.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Search, filter, and pagination UX improved with reusable components and URL state. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. UX patterns and components

- [x] Define a standard pattern for search bars, filter panels, and sort controls across the app.
- [x] Build reusable components for common controls (search input, filter chips, sort dropdown).
- [x] Ensure these components integrate well with the design system and are responsive.

### 2. Wiring to APIs and URL state

- [x] Connect search, filter, and sort controls to backend APIs using query parameters, aligned with API contracts.
- [x] Persist search and filter state in the URL so users can deep-link specific views.
- [x] Implement pagination (page-based or cursor-based) consistently, with visible current page indicators.

### 3. Performance and feedback

- [x] Debounce search input to avoid spamming the backend while typing.
- [x] Show loading indicators when filters or pages change, and retain prior content until new data arrives when possible.
- [x] Provide “Clear filters” actions and indicate when filters are active.

### 4. Validation and testing

- [x] Add tests for at least one large list (e.g. courses) covering search, filtering, sorting, and pagination interactions.
- [x] Verify accessibility for all interactive controls (labels, focus, keyboard use).

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 18 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 18 is complete. Next: [Frontend Day 19](frontend-day-19.md) (Instructor authoring tools and content workflows).

