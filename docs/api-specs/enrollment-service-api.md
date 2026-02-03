# Enrollment Service API (Phase 1)

Base path: `/api/v1/enrollments`. All endpoints require authentication. Gateway forwards `X-User-Id` and `X-Roles`. Students can only access own enrollments; instructors can access enrollments for their courses; admin can access all.

## Enroll in course

- **Method:** `POST /api/v1/enrollments`
- **Auth:** Required (typically Student or Instructor).
- **Request body:** `courseId` (UUID or string).
- **Response:** `201 Created`; body: `id`, `userId`, `courseId`, `status`, `progressPct`, `enrolledAt`, `completedAt` (null).
- **Errors:** `400` validation; `404` course not found or not published; `409` already enrolled.

**Note:** Use distributed lock per (courseId, userId) to avoid duplicate enrollment (see [06-redis.md](../06-redis.md)).

## List my enrollments

- **Method:** `GET /api/v1/enrollments?status=&cursor=&limit=`
- **Auth:** Required; returns only current user’s enrollments (or filtered by role for instructor/admin).
- **Query:** `status` (e.g. ACTIVE, COMPLETED); `cursor`; `limit` (default 20).
- **Response:** `200 OK`; body: `items` (array of enrollment), `nextCursor`.
- **Enrollment:** `id`, `courseId`, `courseTitle` (optional, from course service or cache), `status`, `progressPct`, `enrolledAt`, `completedAt`.

## Get enrollment by ID

- **Method:** `GET /api/v1/enrollments/{enrollmentId}`
- **Auth:** Required; user must own enrollment or have instructor/admin access to the course.
- **Response:** `200 OK`; body: full enrollment + optional `lessonProgress` (array of lesson id and completedAt).
- **Errors:** `404` not found; `403` no access.

## Update progress (lesson completed)

- **Method:** `POST /api/v1/enrollments/{enrollmentId}/progress` or `PATCH /api/v1/enrollments/{enrollmentId}/lessons/{lessonId}/complete`
- **Auth:** Required; user must own enrollment.
- **Request body (for bulk):** `lessonIds` (array) or `completedLessonIds`.  
  Or for single: no body when path includes `lessonId`.
- **Response:** `200 OK`; body: updated enrollment with `progressPct` and `lessonProgress`.
- **Side effect:** If all lessons completed, set enrollment `status` to COMPLETED and `completedAt`; optionally publish event.
- **Errors:** `400` validation (e.g. lesson not in course); `403` not owner; `404` enrollment or lesson not found.

## Get progress for enrollment

- **Method:** `GET /api/v1/enrollments/{enrollmentId}/progress`
- **Auth:** Required; user must own enrollment or have instructor/admin access.
- **Response:** `200 OK`; body: `enrollmentId`, `progressPct`, `lessons` (array of `lessonId`, `completedAt`), `totalLessons`, `completedLessons`.

## List enrollments for course (instructor / admin)

- **Method:** `GET /api/v1/courses/{courseId}/enrollments?status=&cursor=&limit=`
- **Auth:** Instructor (own course) or Admin.
- **Response:** `200 OK`; body: `items` (enrollments with user summary if available), `nextCursor`.
- **Errors:** `403` not instructor/admin; `404` course not found.

---

**Status codes:** `400` validation, `401` unauthorized, `403` forbidden, `404` not found, `409` conflict (already enrolled). Use cursor-based pagination for list endpoints (see [04-database.md](../04-database.md)).
