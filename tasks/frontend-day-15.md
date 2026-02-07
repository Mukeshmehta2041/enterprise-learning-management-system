# Frontend Day 15 – Global state management and React Query patterns

**Focus:** Consolidate global state patterns and make best use of React Query for server state, minimizing ad-hoc state.

**References:** [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Separated server (React Query) and client (UI/Auth contexts) state. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Inventory existing state

- [x] Identify where global state is stored today (contexts, Redux/Zustand, component-level state).
- [x] List which pieces of state are truly global, which are per-screen, and which are derived from the backend.

### 2. Server vs client state

- [x] Move server-derived state to React Query where appropriate (courses, enrollments, analytics).
- [x] Use React Query features (caching, invalidation, refetching) instead of manual loading flags and effects.

### 3. Global client state

- [x] Standardize how global client-only state is managed (e.g. auth session, theme, feature flags).
- [x] Ensure contexts or stores have clear APIs and are not overused.

### 4. Refactor hot spots

- [x] Refactor at least one complex screen to follow the improved patterns (less prop drilling, clearer hooks).
- [x] Add or update tests to cover the new state flows.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 15 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 15 is complete. Next: [Frontend Day 16](frontend-day-16.md) (Role-based UI and permissions guards).

