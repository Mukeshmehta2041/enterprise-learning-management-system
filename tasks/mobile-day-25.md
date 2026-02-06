# Mobile Day 25 – Offline-first patterns and optimistic UI on mobile

**Focus:** Make key mobile flows resilient to offline and flaky connections using offline-first and optimistic UI patterns.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Offline-first patterns and optimistic UI being added on mobile. |
| ✅ Done | Critical actions feel fast and degrade gracefully when offline. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 25 is done_

---

## Checklist

### 1. Connectivity awareness

- [ ] Detect online/offline status in the app and expose it via a hook or context.
- [ ] Show subtle indicators when offline and when reconnecting.

### 2. Optimistic updates

- [ ] Implement optimistic updates for at least one key action (e.g. mark lesson complete, submit progress).
- [ ] Provide clear feedback when optimistic updates fail and roll back gracefully.

### 3. Local storage and sync

- [ ] Cache important data locally (e.g. enrolled courses, last-viewed lessons) for offline read access.
- [ ] Design a simple sync strategy for queued actions when connectivity returns.

### 4. Testing

- [ ] Add tests for optimistic update flows and offline queues where applicable.
- [ ] Manually test offline scenarios by toggling network while using the app.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 25 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 25 is complete. Next: [Mobile Day 26](mobile-day-26.md) (Mobile-specific caching, background sync, and app lifecycle).

