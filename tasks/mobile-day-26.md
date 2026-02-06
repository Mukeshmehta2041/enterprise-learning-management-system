# Mobile Day 26 – Mobile-specific caching, background sync, and app lifecycle

**Focus:** Handle app lifecycle events and background behavior so data stays fresh without draining battery.

**References:** [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), platform lifecycle docs (AppState, background tasks).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Caching, background sync, and lifecycle handling being tuned. |
| ✅ Done | The app behaves well across foreground/background and limited connectivity. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 26 is done_

---

## Checklist

### 1. App lifecycle awareness

- [ ] Use React Native’s AppState (or equivalent) to track foreground/background transitions.
- [ ] Pause or throttle certain network or polling behaviors when in background.

### 2. Caching and refresh

- [ ] Review existing caches to ensure they are persisted appropriately between app launches.
- [ ] Configure background or on-focus refresh for key data (e.g. notifications, enrollments) without excessive requests.

### 3. Background tasks (if in scope)

- [ ] Evaluate use of background fetch or scheduled sync for important lightweight updates.
- [ ] Respect platform limitations and user battery/data considerations.

### 4. Testing

- [ ] Manually test switching apps, locking device, and returning to app to confirm correct behavior.
- [ ] Add tests or simulation for lifecycle events if your stack allows it.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 26 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 26 is complete. Next: [Mobile Day 27](mobile-day-27.md) (Real-time features on mobile – websockets/SSE/RTC).

