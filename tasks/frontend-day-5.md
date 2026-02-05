# Frontend Day 5 – Course details and content player

**Focus:** Build the course details page with modules and lessons, and implement a basic content player UI for videos, documents, and quizzes.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/api-specs/course-service-api.md](../docs/api-specs/course-service-api.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 5 implemented (course details and content player UI) |

**Started:** Frontend Day 5  
**Completed:** -

---

## Checklist

### 1. Course details route

- [x] Implement `/courses/:courseId` route that fetches course details, modules, and lessons.
- [x] Show course overview (title, description, instructor, key stats).
- [x] Render modules and nested lessons list using domain components (`LessonList`, etc.).

### 2. Content player route

- [x] Implement `/courses/:courseId/lesson/:lessonId` route.
- [x] Build a content player layout with main content area and side panel for lesson navigation.
- [x] Add placeholders or basic handling for different content types (video, PDF, quiz).

### 3. Data fetching and navigation

- [x] Create hooks for fetching course details and lesson content via React Query.
- [x] Integrate navigation between lessons (previous/next).
- [x] Ensure loading, error, and empty states are handled gracefully.

### 4. Motion and polish

- [x] Use Framer Motion for subtle page transitions between course list, course details, and player.
- [x] Add small micro-interactions (hover, press states) following `02-design-system.md`.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 5 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 5 is complete. Next: [Frontend Day 6](frontend-day-6.md) (Enrollment flows and progress views).

