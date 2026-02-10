# Mobile Day 25 – Offline-first patterns and optimistic UI on mobile

**Focus:** Make key mobile flows resilient to offline and flaky connections using offline-first and optimistic UI patterns.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | Critical actions feel fast and degrade gracefully when offline. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Connectivity awareness

- [x] Detect online/offline status in the app and expose it via a hook or context.
- [x] Show subtle indicators when offline and when reconnecting.

### 2. Optimistic updates

- [x] Implement optimistic updates for at least one key action (e.g. mark lesson complete, submit progress).
- [x] Provide clear feedback when optimistic updates fail and roll back gracefully.

### 3. Local storage and sync

- [x] Cache important data locally (e.g. enrolled courses, last-viewed lessons) for offline read access.
- [x] Design a simple sync strategy for queued actions when connectivity returns.

### 4. Testing

- [ ] Add tests for optimistic update flows and offline queues where applicable.
- [ ] Manually test offline scenarios by toggling network while using the app.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 25 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 25 is complete. Next: [Mobile Day 26](mobile-day-26.md) (Mobile-specific caching, background sync, and app lifecycle).

