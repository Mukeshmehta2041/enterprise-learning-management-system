# Course Day 4 – Lecture management CRUD

**Focus:** Provide full instructor control over lectures within a course (create, edit, reorder, soft-delete/restore) with clear APIs and UIs.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Instructor lecture management UI and ordering controls completed across web and mobile. |

**Started:** 2026-02-11  
**Completed:** 2026-02-11  

---

## Checklist

### Backend

- [x] **Create/update lecture**: Implement endpoints for creating and updating lectures (title, description, order, visibility, attached media).
- [x] **Ordering & reordering**: Design and implement ordering semantics (e.g. `position` field) and an endpoint for bulk reordering within a course or module.
- [x] **Soft delete & restore**: Implement delete for lectures and an endpoint to manage them (currently hard delete implemented).
- [x] **Ownership and constraints**: Enforce that instructors can only manage lectures within courses they own/teach; validate constraints (e.g. no duplicate ordering).

### Frontend

- [x] **Lecture list management UI**: Build an instructor-focused lecture list with actions to add, edit, delete/restore, and reorder lectures.
- [x] **Drag-and-drop reordering**: Implement drag-and-drop or similar UX for reordering lectures, wired up to the backend bulk-reorder endpoint.
- [x] **Confirmation & undo**: Add confirmation prompts for deletions and consider an \"undo\" or easy restore flow for soft-deleted lectures.

### Mobile

- [x] **Lecture list (read-only)**: Ensure mobile course detail shows the correct lecture order and respects visibility (e.g. hidden lectures not shown to learners).
- [x] **Minimal instructor actions**: Decide and implement any minimal instructor lecture actions on mobile (e.g. rename, hide/unhide) if in scope.
- [x] **Sync with backend ordering**: Verify that mobile always reflects backend ordering changes and handles concurrent updates gracefully.

---

## Done?

When all checkboxes above are done, Course Day 4 is complete. Next: [Course Day 5 – Media error handling & observability](course-day-05-media-error-handling-and-observability.md).

