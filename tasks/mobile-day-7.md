# Mobile Day 7 – Enrollments and progress on mobile

**Focus:** Implement enrollment actions and a mobile dashboard showing a learner’s enrollments and progress.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/enrollment-service-api.md](../docs/api-specs/enrollment-service-api.md), [docs/04-database.md](../docs/04-database.md), [docs/06-redis.md](../docs/06-redis.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Day 7 implemented (enrollments and progress views on mobile) |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Enrollment actions

- [x] Add an \"Enroll\" CTA on the course detail screen for eligible users.
- [x] Implement a mutation to call the Enrollment Service enroll endpoint.
- [x] Handle loading, success, and error states (including duplicate enroll attempts in the UI).

### 2. \"My learning\" / dashboard

- [x] Implement a Home or Dashboard screen listing current enrollments with progress.
- [x] Show course title, status, progress percentage, and quick access to continue learning.
- [x] Use React Query to fetch the learner’s enrollments.

### 3. Progress visualization

- [x] Implement small, mobile-friendly progress indicators (bars, badges).
- [x] Ensure layout remains clear on smaller devices.

### 4. Progress update

- [x] Update the **Progress** table at the top of this file when Day 7 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 7 is complete. Next: [Mobile Day 8](mobile-day-8.md) (Assignments & submissions on mobile).

