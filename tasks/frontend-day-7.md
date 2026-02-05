# Frontend Day 7 – Assignments UI and submission flows

**Focus:** Implement learner-facing assignment lists and details, plus submission flows and basic instructor views.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 7 implemented (assignments UI and submissions) |

**Started:** Frontend Day 7  
**Completed:** -

---

## Checklist

### 1. Learner assignment list and detail

- [ ] Implement `/assignments` route listing current assignments for the logged-in user.
- [ ] Implement `/assignments/:assignmentId` route showing assignment details, due date, and requirements.
- [ ] Use React Query hooks to fetch assignments and details.

### 2. Submission flows

- [ ] Build submission form(s) for supported types (file upload, text, or both).
- [ ] Implement mutation to submit work to the Assignment Service.
- [ ] Show submission status and grade (if available) on the detail page.

### 3. Basic instructor view (optional/minimal)

- [ ] Implement an instructor-only list or detail view to review submissions (even if read-only).
- [ ] Protect instructor routes using role checks.

### 4. Feedback and UX

- [ ] Show clear error and success messages during submission.
- [ ] Provide visual indicators for overdue assignments and graded vs. pending submissions.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 7 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 7 is complete. Next: [Frontend Day 8](frontend-day-8.md) (Notifications & basic payments UI).

