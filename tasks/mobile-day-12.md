# Mobile Day 12 – Mobile integration tests and API mocking

**Focus:** Strengthen confidence in mobile flows with integration tests that exercise screens, navigation, and data fetching using mocked APIs.

**References:** [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile integration tests and mocks being added. |
| ✅ Done | Core learner and instructor journeys covered by mobile integration tests. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 12 is done_

---

## Checklist

### 1. Test harness and API mocking

- [ ] Ensure Jest + React Native Testing Library are configured for integration-style tests.
- [ ] Add an API mocking layer (e.g. MSW or custom mock handlers) for mobile tests.
- [ ] Create utilities for rendering screens wrapped in providers (navigation, auth, React Query).

### 2. Core learner journeys

- [ ] Write tests for login → browse courses → open course → start lesson.
- [ ] Assert correct loading states, error states, and empty states on mobile UI.
- [ ] Cover at least one negative scenario (invalid credentials or failing API).

### 3. Navigation and state

- [ ] Test navigation between auth stack and main tabs when auth state changes.
- [ ] Verify that deep navigation (e.g. course → module → lesson) behaves correctly in tests.

### 4. CI integration

- [ ] Wire mobile Jest tests into CI, or ensure they run as part of an existing test job.
- [ ] Fix flakiness and document expected runtime and basic troubleshooting.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 12 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 12 is complete. Next: [Mobile Day 13](mobile-day-13.md) (Global error handling, banners, and empty states on mobile).

