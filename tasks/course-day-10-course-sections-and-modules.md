# Course Day 10 – Course sections/modules modeling

**Focus:** Model course sections/modules and their relationship to lectures and assignments so courses can be structured hierarchically.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Sections/modules modeled and wired into course and lecture structure across stack. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [ ] **Section/module entities**: Introduce section/module entities with fields like title, description, order, and course linkage.
- [ ] **Associations**: Define associations between sections, lectures, and assignments (e.g. foreign keys or mapping tables).
- [ ] **CRUD endpoints**: Implement section/module CRUD endpoints and ordering APIs within a course.
- [ ] **Migration plan**: Plan and implement data migrations for existing courses to adopt sections/modules where needed.

### Frontend

- [ ] **Hierarchical course view**: Update course detail pages to show sections/modules and nested lectures.
- [ ] **Section-level progress**: Show progress at the section/module level based on completed lectures and assignments.
- [ ] **Editing UI**: Provide an instructor UI for adding, editing, and reordering sections/modules.

### Mobile

- [ ] **Mobile section navigation**: Design and implement a mobile-friendly UI for navigating sections/modules within a course.
- [ ] **Progress cues**: Show progress indicators per section/module on mobile (e.g. checkmarks, progress bars).
- [ ] **Consistency with web**: Ensure the mobile structure matches the web ordering and associations.

---

## Done?

When all checklists above are done, Course Day 10 is complete. Next: [Course Day 11 – Instructor course editing experience](course-day-11-instructor-course-editing-experience.md).

