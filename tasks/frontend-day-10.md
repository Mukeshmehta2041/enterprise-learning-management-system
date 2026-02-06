# Frontend Day 10 – Polishing, accessibility, performance, and frontend CI

**Focus:** Harden the frontend with an accessibility pass, performance tuning, improved test coverage, and CI integration.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/frontend/06-testing-and-observability.md](../docs/frontend/06-testing-and-observability.md), [docs/frontend/07-devops-frontend.md](../docs/frontend/07-devops-frontend.md), [docs/08-observability.md](../docs/08-observability.md), `.github/workflows/ci.yml`.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 10 implemented (frontend a11y, performance, tests, CI) |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Accessibility (a11y) pass

- [x] Ensure all interactive elements are keyboard accessible and have visible focus states.
- [x] Add appropriate ARIA attributes where needed (e.g. modals, dialogs, navigation landmarks).
- [x] Run basic accessibility checks (browser devtools or tooling) on key pages (auth, courses, player, assignments).

### 2. Performance tuning

- [x] Audit bundle size and enable route-based code splitting for major sections.
- [x] Optimize images and static assets used in the UI.
- [x] Tune React Query cache and refetch settings for heavy lists and analytics views.

### 3. Testing

- [x] Add or expand unit tests for critical components and hooks (auth, courses, enrollments, assignments).
- [x] Add integration tests for at least the main learner journey (login → browse courses → enroll → view content).

### 4. CI integration

- [x] Update `.github/workflows/ci.yml` (or add a new job) to run frontend lint, tests, and build in CI.
- [x] Ensure the build artifacts are produced successfully and any failures block merges.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 10 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 10 is complete. Continue with longer-term improvements or additional days as needed, using `docs/frontend/` and backend docs as guidance.

