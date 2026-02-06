# Frontend Day 39 – E2E testing (Cypress/Playwright) for key journeys

**Focus:** Add end-to-end tests that exercise real user flows against a running backend or realistic mocks.

**References:** [docs/frontend/06-testing-and-observability.md](../docs/frontend/06-testing-and-observability.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | E2E tests for key journeys being implemented. |
| ✅ Done | Critical LMS flows are covered by E2E tests in CI. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 39 is done_

---

## Checklist

### 1. E2E framework setup

- [ ] Configure Cypress, Playwright, or similar with base URLs for dev/staging.
- [ ] Add helpers for login, test data seeding, and cleanup where needed.

### 2. Core learner journeys

- [ ] Write E2E tests for: login → browse courses → enroll → consume content.
- [ ] Include assertions for key UI elements and error handling.

### 3. Instructor/admin journeys

- [ ] Cover at least one instructor flow (e.g. create course, publish, view analytics).
- [ ] Optionally cover a basic admin flow (if such a role exists) like managing users or tenants.

### 4. CI integration

- [ ] Run E2E tests in CI against a suitable environment (ephemeral, dev, or staging).
- [ ] Make the suite reliable and document expected runtime and flakiness mitigation.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 39 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 39 is complete. Next: [Frontend Day 40](frontend-day-40.md) (Frontend security hardening and threat modeling).

