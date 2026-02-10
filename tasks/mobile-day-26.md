# Mobile Day 26 – Mobile-specific caching, background sync, and app lifecycle

**Focus:** Handle app lifecycle events and background behavior so data stays fresh without draining battery.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), platform lifecycle docs (AppState, background tasks).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | The app behaves well across foreground/background and limited connectivity. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. App lifecycle awareness

- [x] Use React Native’s AppState (or equivalent) to track foreground/background transitions.
- [x] Pause or throttle certain network or polling behaviors when in background.

### 2. Caching and refresh

- [x] Review existing caches to ensure they are persisted appropriately between app launches.
- [x] Configure background or on-focus refresh for key data (e.g. notifications, enrollments) without excessive requests.

### 3. Background tasks (if in scope)

- [x] Evaluate use of background fetch or scheduled sync for important lightweight updates.
- [x] Respect platform limitations and user battery/data considerations.

### 4. Testing

- [ ] Manually test switching apps, locking device, and returning to app to confirm correct behavior.
- [ ] Add tests or simulation for lifecycle events if your stack allows it.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 26 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 26 is complete. Next: [Mobile Day 27](mobile-day-27.md) (Real-time features on mobile – websockets/SSE/RTC).

