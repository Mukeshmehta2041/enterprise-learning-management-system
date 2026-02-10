# Mobile Day 5 – Courses list and details screens

**Focus:** Build mobile-friendly courses list and detail screens, backed by the Course Service API.

**References:** [docs/mobile/02-navigation-and-ux-flows.md](../docs/mobile/02-navigation-and-ux-flows.md), [docs/mobile/04-data-and-offline.md](../docs/mobile/04-data-and-offline.md), [docs/api-specs/course-service-api.md](../docs/api-specs/course-service-api.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ⬜ In progress | |
| ✅ Done | Day 5 implemented (courses list & details screens) |

**Started:** 2026-02-07  
**Completed:** 2026-02-07  

---

## Checklist

### 1. Courses list screen

- [x] Implement a `CoursesScreen` under the `Courses` tab that fetches and displays a list of courses using `FlatList`.
- [x] Create a `CourseListItem` component showing title, instructor, and key metadata.
- [x] Add loading, error, and empty states.

### 2. Course detail screen

- [x] Implement a `CourseDetailScreen` accessible from the list (tap a course).
- [x] Show course overview and modules/lessons list.
- [x] Integrate React Query hooks for course detail and related data.

### 3. Pagination/scrolling

- [x] Support pagination or infinite scrolling if the Course Service requires it.
- [x] Ensure smooth scrolling performance on mobile.

### 4. Progress update

- [x] Update the **Progress** table at the top of this file when Day 5 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 5 is complete. Next: [Mobile Day 6](mobile-day-6.md) (Content player & basic offline behavior).

