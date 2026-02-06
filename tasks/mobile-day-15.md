# Mobile Day 15 – Mobile state management and React Query patterns

**Focus:** Consolidate local and server state patterns in the mobile app for clarity, performance, and reliability.

**References:** [docs/mobile/01-architecture-mobile.md](../docs/mobile/01-architecture-mobile.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile state and React Query patterns being refined. |
| ✅ Done | Clear separation of server/client state with consistent mobile-friendly patterns. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 15 is done_

---

## Checklist

### 1. State inventory

- [ ] Identify where global state lives (contexts, stores) and which pieces are server vs. purely client.
- [ ] Note any screens with complex, hard-to-follow state logic.

### 2. Server state with React Query

- [ ] Move server-derived data (courses, enrollments, notifications) into React Query where not already.
- [ ] Use cache and invalidation patterns suited for intermittent mobile connectivity.

### 3. Client-only state

- [ ] Standardize handling of client-only state (auth session, UI flags, feature flags) via a small number of contexts/stores.
- [ ] Avoid prop drilling by introducing focused hooks and context boundaries.

### 4. Refactor and test

- [ ] Refactor at least one complex screen’s state handling using these improved patterns.
- [ ] Add or update tests to ensure behavior remains correct after refactor.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 15 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 15 is complete. Next: [Mobile Day 16](mobile-day-16.md) (Role-based mobile UI and permissions).

