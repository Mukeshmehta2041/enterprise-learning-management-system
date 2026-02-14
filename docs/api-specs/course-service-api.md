# Course Service API (Phase 1)

Base path: `/api/v1/courses`. All endpoints require authentication unless noted. Gateway forwards `X-User-Id` and `X-Roles`. Authorization: students read published only; instructors read own + published; admin read all.

## List courses (catalog)

- **Method:** `GET /api/v1/courses?status=&cursor=&limit=`
- **Auth:** Optional for public catalog; required for draft/private if implemented.
- **Query:** `status` (e.g. PUBLISHED); `cursor` (opaque, for next page); `limit` (default 20, max 100).
- **Response:** `200 OK`; body: `items` (array of course summary), `nextCursor` (absent if last page).
- **Course summary:** `id`, `title`, `slug`, `description`, `category`, `level`, `price`, `currency`, `isFree`, `status`, `createdAt`, `instructorIds` (optional).

## Get course by ID

- **Method:** `GET /api/v1/courses/{courseId}`
- **Auth:** Required; user must have access (published or instructor/admin).
- **Response:** `200 OK`; body: `id`, `title`, `slug`, `description`, `category`, `level`, `price`, `currency`, `isFree`, `status`, `modules` (array of module with lessons), `createdAt`, `updatedAt`.
- **Lesson summary:** `id`, `title`, `type`, `durationMinutes`, `sortOrder`, `isPreview`, `canWatch`.
- **Errors:** `404` not found; `403` no access.

## Create course

- **Method:** `POST /api/v1/courses`
- **Auth:** Instructor or Admin.
- **Request body:** `id` (optional UUID), `title`, `slug` (optional), `description`, `category` (optional), `level` (optional), `price` (optional), `currency` (optional), `isFree` (optional), `thumbnailUrl` (optional), `status` (optional).
- **Response:** `201 Created`; body: full course.
- **Errors:** `400` validation; `409` slug exists.

## Update course

- **Method:** `PATCH /api/v1/courses/{courseId}` or `PUT`
- **Auth:** Instructor (own course) or Admin.
- **Request body:** `title`, `description`, `status` (optional).
- **Response:** `200 OK`; body: updated course.
- **Errors:** `400` validation; `403` not owner; `404` not found.

## Delete course

- **Method:** `DELETE /api/v1/courses/{courseId}`
- **Auth:** Instructor (own) or Admin.
- **Response:** `204 No Content`.
- **Errors:** `403` not owner; `404` not found.

## List modules

- **Method:** `GET /api/v1/courses/{courseId}/modules`
- **Auth:** Same as get course.
- **Response:** `200 OK`; body: array of `id`, `title`, `sortOrder`, `lessons` (array of lesson summary).

## Create module

- **Method:** `POST /api/v1/courses/{courseId}/modules`
- **Auth:** Instructor (own course) or Admin.
- **Request body:** `title`, `sortOrder` (optional).
- **Response:** `201 Created`; body: module with id.

## Update / reorder module

- **Method:** `PATCH /api/v1/courses/{courseId}/modules/{moduleId}`
- **Auth:** Instructor (own) or Admin.
- **Request body:** `title`, `sortOrder` (optional).
- **Response:** `200 OK`.

## Add lesson to module

- **Method:** `POST /api/v1/courses/{courseId}/modules/{moduleId}/lessons`
- **Auth:** Instructor (own course) or Admin.
- **Request body:** `title`, `type` (e.g. VIDEO, READING, QUIZ), `durationMinutes` (optional), `sortOrder` (optional).
- **Response:** `201 Created`; body: lesson with id.

## Update lesson

- **Method:** `PATCH /api/v1/courses/{courseId}/modules/{moduleId}/lessons/{lessonId}`
- **Auth:** Instructor (own) or Admin.
- **Request body:** `title`, `type`, `durationMinutes`, `sortOrder`.
- **Response:** `200 OK`.

---

**Status codes:** `400` validation, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict. Use cursor-based pagination for list courses (see [04-database.md](../04-database.md)).
