# Frontend Day 15 – Global state management and React Query patterns

**Focus:** Consolidate global state patterns and make best use of React Query for server state, minimizing ad-hoc state.

**References:** [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Global state and React Query patterns being refined. |
| ✅ Done | Clear separation of server/client state with consistent patterns. |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 15 is done_

---

## Checklist

### 1. Inventory existing state

- [ ] Identify where global state is stored today (contexts, Redux/Zustand, component-level state).
- [ ] List which pieces of state are truly global, which are per-screen, and which are derived from the backend.

### 2. Server vs client state

- [ ] Move server-derived state to React Query where appropriate (courses, enrollments, analytics).
- [ ] Use React Query features (caching, invalidation, refetching) instead of manual loading flags and effects.

### 3. Global client state

- [ ] Standardize how global client-only state is managed (e.g. auth session, theme, feature flags).
- [ ] Ensure contexts or stores have clear APIs and are not overused.

### 4. Refactor hot spots

- [ ] Refactor at least one complex screen to follow the improved patterns (less prop drilling, clearer hooks).
- [ ] Add or update tests to cover the new state flows.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 15 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 15 is complete. Next: [Frontend Day 16](frontend-day-16.md) (Role-based UI and permissions guards).

