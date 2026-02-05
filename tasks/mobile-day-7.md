# Mobile Day 7 – Enrollments and progress on mobile

**Focus:** Implement enrollment actions and a mobile dashboard showing a learner’s enrollments and progress.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/enrollment-service-api.md](../docs/api-specs/enrollment-service-api.md), [docs/04-database.md](../docs/04-database.md), [docs/06-redis.md](../docs/06-redis.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 7 implemented (enrollments and progress views on mobile) |

**Started:** Mobile Day 7  
**Completed:** -

---

## Checklist

### 1. Enrollment actions

- [ ] Add an \"Enroll\" CTA on the course detail screen for eligible users.
- [ ] Implement a mutation to call the Enrollment Service enroll endpoint.
- [ ] Handle loading, success, and error states (including duplicate enroll attempts in the UI).

### 2. \"My learning\" / dashboard

- [ ] Implement a Home or Dashboard screen listing current enrollments with progress.
- [ ] Show course title, status, progress percentage, and quick access to continue learning.
- [ ] Use React Query to fetch the learner’s enrollments.

### 3. Progress visualization

- [ ] Implement small, mobile-friendly progress indicators (bars, badges).
- [ ] Ensure layout remains clear on smaller devices.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 7 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 7 is complete. Next: [Mobile Day 8](mobile-day-8.md) (Assignments & submissions on mobile).

