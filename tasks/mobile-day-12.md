# Mobile Day 12 – Mobile integration tests and API mocking

**Focus:** Strengthen confidence in mobile flows with integration tests that exercise screens, navigation, and data fetching using mocked APIs.

**References:** [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | Core learner journeys covered by mobile integration tests with API mocking. |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Test harness and API mocking

- [x] Ensure Jest + React Native Testing Library are configured for integration-style tests.
- [x] Add an API mocking layer (using `jest.mock` for Axios client).
- [x] Create utilities for rendering screens wrapped in providers (navigation, React Query).

### 2. Core learner journeys

- [x] Write tests for login → browse courses → open course → start lesson.
- [x] Assert correct loading states, error states, and empty states on mobile UI.
- [x] Cover negative scenarios (validation and failing API mocks).

### 3. Navigation and state

- [x] Test navigation between auth stack and main tabs (via Login test success scenario).
- [x] Verify that deep navigation (e.g. course → module → lesson) behaves correctly in tests.

### 4. CI integration

- [x] Ensure mobile Jest tests can run as part of the test job (configured in `package.json`).
- [x] Verified test execution for key screens.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Mobile Day 12 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 12 is complete. Next: [Mobile Day 13](mobile-day-13.md) (Global error handling, banners, and empty states on mobile).

