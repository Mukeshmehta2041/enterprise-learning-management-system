# Course Day 9 – Access rules edge cases & auditing

**Focus:** Handle tricky access scenarios (unpublished courses, revoked enrollments, role changes) and record lecture access in auditable logs.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/06-audit-logging.md](../docs/06-audit-logging.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Edge-case access rules implemented and lecture access events auditable. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Course publish state**: Ensure lectures in unpublished or archived courses are not accessible to learners, even with old URLs/tokens.
- [ ] **Enrollment revocation**: Enforce playback denial when enrollments are revoked or expire; ensure tokens issued before revocation are handled.
- [ ] **Role changes**: Handle instructor removal or role downgrades correctly so they no longer manage or access restricted lectures.
- [ ] **Audit events**: Emit audit events for sensitive lecture access (e.g. staff access, admin overrides) and store them per audit policy.

### Frontend

- [ ] **Unpublished course UX**: Show appropriate UI when a course or lecture is no longer available due to unpublishing or removal.
- [ ] **Revoked access states**: Ensure learners see clear messaging when their access has been revoked and any actions they can take.
- [ ] **Admin/teacher views**: Ensure UIs that show audit-relevant actions (e.g. admin access) are appropriately labelled or separated.

### Mobile

- [ ] **Consistent access behaviour**: Mirror web behaviour for unpublished courses or revoked access; avoid showing stale or inaccessible lectures.
- [ ] **Graceful error handling**: Provide clear, concise error messages on mobile instead of generic failures when access is revoked.
- [ ] **Audit-triggering actions**: Confirm that any mobile actions which should generate audit events are correctly wired to backend endpoints.

---

## Done?

When all checkboxes above are done, Course Day 9 is complete. Next: [Course Day 10 – Course sections/modules modeling](course-day-10-course-sections-and-modules.md).

