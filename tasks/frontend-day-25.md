# Frontend Day 25 – Offline-friendly patterns and optimistic UI

**Focus:** Make key flows resilient to flaky networks with offline-aware patterns and optimistic updates.

**References:** [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Offline-friendly patterns and optimistic UI being added. |
| ✅ Done | Important actions feel fast and degrade gracefully when offline. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 25 is done_

---

## Checklist

### 1. Network awareness

- [ ] Detect online/offline status in the frontend (e.g. using the browser `navigator.onLine` and events).
- [ ] Display subtle indicators when the app is offline or reconnecting.

### 2. Optimistic UI for key actions

- [ ] Implement optimistic updates for at least one important action (e.g. enroll, mark lesson complete, submit assignment).
- [ ] Provide clear feedback and rollback behavior when the backend rejects an optimistic update.

### 3. Local caching and retries

- [ ] Tune React Query (or your data layer) to handle transient network failures with retries and backoff.
- [ ] Consider caching recent data locally so users can see last-known state while offline.

### 4. Tests and scenarios

- [ ] Add tests for optimistic update logic and error rollback.
- [ ] Manually test offline scenarios (turn off network, toggle airplane mode) for selected flows.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 25 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 25 is complete. Next: [Frontend Day 26](frontend-day-26.md) (PWA basics, install prompts, and caching strategy).

