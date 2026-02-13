# Course Day 11 – Instructor course editing experience

**Focus:** Provide a smooth instructor experience for editing courses—sections, lectures, and metadata—using bulk operations and intuitive UIs.

**References:** [docs/frontend/02-ux-principles.md](../docs/frontend/02-ux-principles.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Instructor course-editing flows implemented for structure and key metadata. |

**Started:** February 12, 2026
**Completed:** February 12, 2026

---

## Checklist

### Backend

- [x] **Bulk operations**: Implement bulk update endpoints to reorder sections and lectures and update multiple items in a single request.
- [x] **Draft vs published states**: Ensure courses and lectures support draft vs published states and that edits can be staged safely.
- [x] **Validation rules**: Define validation for course structure edits (e.g. required fields, max counts) and return clear errors.

### Frontend

- [x] **Course editor shell**: Build an instructor course-editor page with clear layout for sections, lectures, and settings.
- [x] **Drag-and-drop builder**: Implement drag-and-drop (or equivalent) to manage sections and lectures, integrated with bulk APIs.
- [x] **Inline editing**: Support inline editing of titles, descriptions, and key lecture attributes without full-page reloads.
- [x] **Draft/publish controls**: Provide controls to publish/unpublish courses and show state clearly in the UI.

### Mobile

- [x] **Instructor editing scope**: Decide the supported subset of editing on mobile (Titles, Description, Price, Category, Level).
- [x] **Simplified editing UI**: Implement mobile-appropriate editing forms and flows based on the decided scope.
- [x] **State sync**: Ensure edits performed on mobile are immediately reflected on web (and vice versa) via shared APIs.

---

## Done?

When all checklists above are done, Course Day 11 is complete. Next: [Course Day 12 – Discoverability & featured content](course-day-12-discoverability-and-featured-content.md).

