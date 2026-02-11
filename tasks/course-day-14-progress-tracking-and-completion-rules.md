# Course Day 14 – Progress tracking & completion rules

**Focus:** Track learner progress at the lecture and course level and define completion rules that power progress UIs and certificates/badges.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Progress tracking and completion rules implemented and visible to learners and instructors. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Progress schema**: Define schema for lecture-level progress (e.g. last position, completed flag) and course-level summaries.
- [ ] **Event ingestion**: Implement APIs or event consumers that record playback and assignment completion events into progress storage.
- [ ] **Completion rules**: Define course completion logic (e.g. watch N% of lectures and complete key assignments) and expose via API.
- [ ] **Summaries API**: Provide efficient endpoints for fetching progress summaries for dashboards and course views.

### Frontend

- [ ] **Progress indicators**: Add lecture and course-level progress indicators (e.g. progress bars, checkmarks) to course UIs.
- [ ] **Continue watching**: Implement a \"continue watching\" entrypoint on the dashboard or home that jumps to the next relevant lecture.
- [ ] **Completion UX**: Show completion states and any rewards (e.g. badges, certificates) when rules are met.

### Mobile

- [ ] **Progress visuals**: Add concise progress visuals to mobile course cards and lecture lists.
- [ ] **Sync behaviour**: Ensure mobile progress stays in sync with backend even if user switches devices frequently.
- [ ] **Completion experience**: Implement a mobile-friendly completion experience (e.g. modal or dedicated screen) when a course is finished.

---

## Done?

When all checklists above are done, Course Day 14 is complete. Next: [Course Day 15 – Notifications around lectures & assignments](course-day-15-notifications-around-lectures-and-assignments.md).

