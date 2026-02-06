# Mobile Day 39 – E2E flows on devices/emulators (Detox/Appium or similar)

**Focus:** Add end-to-end tests that exercise mobile user flows on real devices or emulators.

**References:** Detox/Appium docs (or chosen E2E framework), [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile E2E tests being implemented. |
| ✅ Done | Critical LMS mobile flows are covered by automated device/emulator tests. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 39 is done_

---

## Checklist

### 1. E2E framework setup

- [ ] Configure Detox, Appium, or a similar framework to run against your mobile app.
- [ ] Set up build scripts to produce test-ready builds (debug/release as needed).

### 2. Core learner journeys

- [ ] Write E2E tests for: app launch → login → browse courses → view lesson.
- [ ] Include assertions for important UI elements and error handling.

### 3. Instructor/admin flows

- [ ] Cover at least one instructor use case (e.g. open teaching dashboard, edit course, view stats).
- [ ] Optionally cover an admin flow if the mobile app exposes any admin features.

### 4. CI integration

- [ ] Integrate E2E tests into CI or a dedicated pipeline, possibly running on device farms or emulators.
- [ ] Monitor test runtime and flakiness; adjust scope as needed.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 39 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 39 is complete. Next: [Mobile Day 40](mobile-day-40.md) (Mobile security hardening and secure storage).

