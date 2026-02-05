# Frontend Day 4 – Course catalog listing and filtering

**Focus:** Implement the course catalog list page with pagination, filtering, and loading/error states, backed by the Course Service API.

**References:** [docs/frontend/03-routing-and-layout.md](../docs/frontend/03-routing-and-layout.md), [docs/frontend/04-data-fetching-and-api-client.md](../docs/frontend/04-data-fetching-and-api-client.md), [docs/api-specs/course-service-api.md](../docs/api-specs/course-service-api.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Day 4 implemented (course catalog listing & filtering) |

**Started:** Frontend Day 4  
**Completed:** -

---

## Checklist

### 1. Course list route and layout

- [x] Implement `/courses` route under the authenticated layout shell.
- [x] Add page header with title (“Courses”) and optional description.

### 2. Data fetching with React Query

- [x] Create a hook (e.g. `useCourses`) that calls the appropriate Course Service list endpoint with pagination and filters.
- [x] Define a stable query key including page and filter parameters.

### 3. UI components and states

- [x] Implement a `CourseCard` component showing title, instructor, brief description, and key metadata.
- [x] Show a responsive grid or list of `CourseCard` components.
- [x] Add loading state (skeletons or spinner) while fetching.
- [x] Add error state with retry button.
- [x] Add empty state when no courses match filters.

### 4. Pagination and filtering

- [x] Add basic pagination controls (page numbers or previous/next).
- [x] Add filters (e.g. status, category, difficulty) wired to query parameters and React Query.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Day 4 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 4 is complete. Next: [Frontend Day 5](frontend-day-5.md) (Course details and content player).

