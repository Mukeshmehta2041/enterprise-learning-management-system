# 4. Data Fetching and API Client

The frontend uses **React Query** (TanStack Query) for all data fetching and caching, with a small API client abstraction layered on top of `fetch` or `axios`.

## API Client

Create a base API client module (e.g. `src/shared/api/client.ts`) that:

- Reads `VITE_API_BASE_URL` from environment.
- Automatically attaches `Authorization: Bearer <access_token>` when a user is authenticated.
- Normalizes errors into a consistent shape (e.g. `{ message, code, status }`).
- Adds correlation/trace ID headers to requests if provided by the backend (optional).

All feature-specific clients (users, courses, enrollments, etc.) should call this base client.

## React Query Configuration

Centralize React Query configuration (e.g. `QueryClient` in `src/app/providers`):

- Reasonable defaults: `staleTime`, `cacheTime`, retry policy.
- Global error handling hooks (e.g. show toast for unexpected errors).
- Devtools enabled in development only.

Use **query keys** that are:

- Predictable and hierarchical, e.g.:
  - `['user', 'me']`
  - `['courses', 'list', { page, filters }]`
  - `['course', courseId]`
  - `['enrollments', 'me']`
  - `['assignments', assignmentId]`
  - `['notifications', 'list']`
  - `['payments', 'plans']`
  - `['analytics', 'enrollments', { courseId, dateRange }]`

## Patterns per Feature

- **Users/Auth**
  - Use mutations for login/register/logout, invalidating `['user', 'me']` on success.
  - Keep access token and user session in a dedicated auth store/context.
- **Courses**
  - Queries for course list and course details.
  - Invalidate course list when creating/updating/deleting a course.
- **Enrollments**
  - Queries for current user enrollments and per-course enrollment.
  - Mutations for enrolling; invalidate related enrollment and course queries.
- **Assignments**
  - Queries for learner assignments and submissions.
  - Mutations for submissions and grading; carefully choose optimistic or pessimistic updates.
- **Notifications**
  - Queries for unread/all notifications.
  - Mutations to mark notifications as read (optimistic updates are acceptable).
- **Payments**
  - Queries for plans; mutations for starting checkout.
  - Avoid optimistic updates for payment completion; rely on backend confirmations.
- **Analytics**
  - Queries for analytics summaries and charts; use longer `staleTime` for heavy data.

## Pagination

Support both **offset pagination** and **cursor-based pagination** according to backend responses:

- For offset:
  - Use query keys that include `page` and `size`.
  - Display page controls; refetch when these parameters change.
- For cursor:
  - Use `useInfiniteQuery` with `getNextPageParam` wired to backend `nextCursor` values.
  - Use \"Load more\" buttons or infinite scroll where appropriate.

