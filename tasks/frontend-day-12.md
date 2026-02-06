# Frontend Day 12 – Frontend integration tests and API mocking

**Focus:** Strengthen confidence in frontend flows with integration tests that exercise components, routing, and data fetching using mocked APIs.

**References:** [docs/frontend/06-testing-and-observability.md](../docs/frontend/06-testing-and-observability.md), [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [tasks/day-12.md](day-12.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Frontend integration tests and mocks being added. |
| ✅ Done | Core learner and instructor journeys covered by frontend integration tests. |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 12 is done_

---

## Checklist

### 1. Test harness and mocking

- [ ] Ensure you have a testing setup (e.g. React Testing Library + Jest/Vitest) configured for the frontend.
- [ ] Add an API mocking layer (e.g. MSW) for frontend tests to simulate backend responses.
- [ ] Create reusable test utilities for rendering with providers (router, AuthContext, React Query).

### 2. Core learner journeys

- [ ] Write integration tests for login → browse courses → enroll → view course content.
- [ ] Include assertions for loading states, error states, and empty states.
- [ ] Cover both happy path and a couple of failure scenarios (e.g. invalid credentials, API failures).

### 3. Instructor and admin flows

- [ ] Add tests for key instructor flows (e.g. view analytics, manage courses, review enrollments).
- [ ] Ensure role-based routes correctly redirect unauthorized users.

### 4. CI integration

- [ ] Ensure frontend integration tests run in CI (or are wired into the existing CI workflow from Day 10).
- [ ] Make tests stable and deterministic to avoid flaky builds.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 12 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 12 is complete. Next: [Frontend Day 13](frontend-day-13.md) (Global error handling, toasts, and empty states).

