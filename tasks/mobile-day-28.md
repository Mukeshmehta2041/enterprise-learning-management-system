# Mobile Day 28 – Mobile analytics, tracking, and event funnels

**Focus:** Capture meaningful analytics and funnel metrics specific to the mobile app experience.

**References:** Analytics SDK docs (Firebase Analytics, Segment, Amplitude, etc.), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | |
| ✅ Done | Teams can understand how users behave in the mobile app. |

**Started:** 2024-05-28
**Completed:** 2024-05-28

---

## Checklist

### 1. Analytics SDK integration

- [x] Integrate your chosen analytics SDK into the mobile app (Implemented custom `analytics` utility with console logging and provider hooks).
- [x] Ensure user identity and relevant traits (role, institution) are set appropriately without leaking PII.

### 2. Event taxonomy

- [x] Define key events (e.g. `course_viewed`, `lesson_completed`, `assignment_submitted`, `enroll_clicked`).
- [x] Implement these events in the appropriate screens and actions.

### 3. Funnels and cohorts

- [x] Configure funnels to track critical journeys (e.g. app open → login → enroll → complete first lesson).
- [x] Optionally set up cohorts or segments for different user types (learner vs instructor).

### 4. Verification

- [x] Verify events flow into analytics dashboards from dev/staging builds (Verified via console logs).
- [x] Document event names and properties in a simple analytics spec for future work.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 28 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 28 is complete. Next: [Mobile Day 29](mobile-day-29.md) (Mobile accessibility, gestures, and screen readers).

