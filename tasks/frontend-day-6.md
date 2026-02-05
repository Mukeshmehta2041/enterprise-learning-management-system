# Frontend Day 6 – Enrollment flows and progress views

**Focus:** Implement enrollment actions and learner progress views, wired to the Enrollment Service API.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/api-specs/enrollment-service-api.md](../docs/api-specs/enrollment-service-api.md), [docs/04-database.md](../docs/04-database.md), [docs/06-redis.md](../docs/06-redis.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 6 implemented (enrollment and progress views) |

**Started:** Frontend Day 6  
**Completed:** -

---

## Checklist

### 1. Enrollment actions

- [x] Add enrollment CTA (button) on course details page for eligible users.
- [x] Implement mutation to call Enrollment Service enroll endpoint.
- [x] Handle success (show confirmation, update UI) and failure (errors, retry).

### 2. \"My learning\" dashboard

- [x] Implement `/enrollments` or `/dashboard` section listing the learner’s enrollments.
- [x] Show key fields: course title, status, progress percentage, last activity.
- [x] Use React Query to fetch enrollments; define stable query keys.

### 3. Progress visualization

- [x] Build progress UI components (e.g. progress bar, status badges).
- [x] Integrate per-course progress details, potentially using lesson completion data.

### 4. UX and edge cases

- [x] Prevent duplicate enroll actions in the UI (disable button while request in flight).
- [x] Show reasonable empty state when there are no enrollments yet.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 6 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 6 is complete. Next: [Frontend Day 7](frontend-day-7.md) (Assignments UI and submission flows).

