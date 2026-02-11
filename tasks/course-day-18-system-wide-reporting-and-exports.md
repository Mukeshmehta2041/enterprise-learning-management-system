# Course Day 18 – System-wide reporting & exports

**Focus:** Enable instructors and admins to generate course and lecture reports (e.g. engagement, completion) and export them in common formats.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Reporting and export flows implemented for key course and lecture metrics. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Report definitions**: Define which standard reports are supported (e.g. course overview, learner progress, lecture engagement).
- [ ] **Export formats**: Implement endpoints that generate CSV/JSON exports for selected reports.
- [ ] **Security & limits**: Ensure only authorized users can access reports; apply size/time limits and background processing where needed.

### Frontend

- [ ] **Report request UI**: Add UI to request and download reports from the instructor/admin areas.
- [ ] **Export status**: Show status for long-running exports and surface links when ready.
- [ ] **Permissions handling**: Hide or disable reporting UI for users who lack the required roles.

### Mobile

- [ ] **Mobile access to reports**: Decide and implement how (or if) instructors can view or download reports on mobile.
- [ ] **Lightweight summaries**: Offer lightweight in-app summaries of key metrics even if full exports are web-only.
- [ ] **Deep links**: If exports are primarily web-based, consider deep links or handoff from mobile to web for advanced reporting.

---

## Done?

When all checklists above are done, Course Day 18 is complete. Next: [Course Day 19 – Security review & load testing for media/course flows](course-day-19-security-review-and-load-testing.md).

