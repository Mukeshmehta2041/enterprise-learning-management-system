# Mobile Day 5 – Courses list and details screens

**Focus:** Build mobile-friendly courses list and detail screens, backed by the Course Service API.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/course-service-api.md](../docs/api-specs/course-service-api.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 5 implemented (courses list & details screens) |

**Started:** Mobile Day 5  
**Completed:** -

---

## Checklist

### 1. Courses list screen

- [ ] Implement a `CoursesScreen` under the `Courses` tab that fetches and displays a list of courses using `FlatList`.
- [ ] Create a `CourseListItem` component showing title, instructor, and key metadata.
- [ ] Add loading, error, and empty states.

### 2. Course detail screen

- [ ] Implement a `CourseDetailScreen` accessible from the list (tap a course).
- [ ] Show course overview and modules/lessons list.
- [ ] Integrate React Query hooks for course detail and related data.

### 3. Pagination/scrolling

- [ ] Support pagination or infinite scrolling if the Course Service requires it.
- [ ] Ensure smooth scrolling performance on mobile.

### 4. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 5 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 5 is complete. Next: [Mobile Day 6](mobile-day-6.md) (Content player & basic offline behavior).

