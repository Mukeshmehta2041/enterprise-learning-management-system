# Course Day 13 – Assignments linked to lectures

**Focus:** Tie assignments to specific lectures or modules so learners see the right work at the right time in their learning flow.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Assignments correctly linked to lectures/modules and surfaced contextually. |

**Started:** 2026-02-12  
**Completed:** 2026-02-12  

---

## Checklist

### Backend

- [x] **Linking model**: Extend assignment models to link to a lecture and/or section/module, including cardinality and constraints.
- [x] **APIs for contextual assignments**: Add endpoints to fetch assignments by lecture or module and update existing list endpoints accordingly.
- [x] **Consistency rules**: Define rules for what happens when a linked lecture is deleted, moved, or hidden.

### Frontend

- [x] **Inline assignment display**: Show relevant assignments alongside or immediately after the associated lecture in the course view.
- [x] **Assignment navigation**: Provide navigation from an assignment detail back to its related lecture/module.
- [x] **Due date and status cues**: Display due dates, completion status, and grading state near the lecture context.

### Mobile

- [x] **Contextual assignments in mobile UI**: Surface assignments in the lecture detail screen and/or module view on mobile.
- [x] **Notifications entrypoint**: Ensure mobile notifications about assignments deep-link into the correct lecture context.
- [x] **Offline considerations**: Decide how much assignment metadata is cached locally and how it stays in sync with lecture changes.

---

## Done?

When all checklists above are done, Course Day 13 is complete. Next: [Course Day 14 – Progress tracking & completion rules](course-day-14-progress-tracking-and-completion-rules.md).

