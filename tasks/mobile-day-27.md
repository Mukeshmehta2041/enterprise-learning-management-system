# Mobile Day 27 – Real-time features on mobile (websockets/SSE/RTC)

**Focus:** Bring real-time capabilities to the mobile app for use cases like live sessions, chat, or instant updates.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), backend realtime docs if available.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Real-time features being wired into the mobile app. |
| ✅ Done | Selected LMS features update in real time on mobile where appropriate. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 27 is done_

---

## Checklist

### 1. Real-time client setup

- [ ] Configure the chosen real-time transport (websockets, SSE, or provider SDK) in the mobile app.
- [ ] Wrap connection logic in a hook or service that handles connect, disconnect, and errors.

### 2. Real-time use cases

- [ ] Implement at least one real-time feature (e.g. live classroom chat, real-time notifications, or presence indicators).
- [ ] Ensure UI updates are efficient and don’t cause jank on low-end devices.

### 3. Resilience and fallbacks

- [ ] Handle reconnection with backoff and sane limits.
- [ ] Fall back to periodic polling or manual refresh when real-time connection cannot be maintained.

### 4. Testing

- [ ] Simulate connection drops and reconnections in development and verify behavior.
- [ ] Add basic tests for the realtime hook/service if feasible.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 27 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 27 is complete. Next: [Mobile Day 28](mobile-day-28.md) (Mobile analytics, tracking, and event funnels).

