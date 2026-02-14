# Content Service API (Phase 1)

Base path: `/api/v1/content`. All endpoints require authentication. Gateway forwards `X-User-Id` and `X-Roles`.

## Content Item & Media Lifecycle

1.  **Create Content Item**: Initialize a content record for a lesson.
2.  **Request Upload URL**: Get a presigned URL for S3/MinIO to upload the actual media file.
3.  **Confirm Upload**: Inform the service that the upload is complete (or wait for S3 event if integrated).
4.  **Processing**: The service (or an external processor) updates status while processing (e.g., transcoding video).
5.  **Ready**: Content is available for playback/streaming.

## Get content by ID

- **Method:** `GET /api/v1/content/{contentId}`
- **Auth:** Required; user must have access to the course/lesson.
- **Response:** `200 OK`; body: `id`, `lessonId`, `type`, `title`, `status`, `metadata` (duration, size, etc.), `url` (presigned playback URL).
- **Errors:** `404` not found; `403` no access.

## Get content for lesson

- **Method:** `GET /api/v1/content/lesson/{lessonId}`
- **Auth:** Required.
- **Response:** `200 OK`; body: array of content items.

## Initialize Content Item

- **Method:** `POST /api/v1/content`
- **Auth:** Instructor (course owner) or Admin.
- **Request body:** `courseId`, `lessonId` (optional for course-level media), `type` (VIDEO, PDF, QUIZ, IMAGE), `title`.
- **Response:** `201 Created`; body: content item with `id` and `status: DRAFT`.

## Request Upload Presigned URL

- **Method:** `POST /api/v1/content/{contentId}/upload-url`
- **Auth:** Instructor (owner) or Admin.
- **Request body:** `fileName`, `contentType`, `contentLength`.
- **Response:** `200 OK`; body: `uploadUrl` (presigned S3 URL), `fields` (for POST uploads if applicable).
- **Behavior:** Transitions status to `UPLOADING`.

## Confirm Upload Completion

- **Method:** `POST /api/v1/content/{contentId}/complete-upload`
- **Auth:** Instructor (owner) or Admin.
- **Response:** `200 OK`.
- **Behavior:** Transitions status to `PROCESSING` or `READY` depending on type.

## Update Content Metadata

- **Method:** `PATCH /api/v1/content/{contentId}`
- **Auth:** Instructor (owner) or Admin.
- **Request body:** `title`, `metadata` (JSON).
- **Response:** `200 OK`.

## Delete Content

- **Method:** `DELETE /api/v1/content/{contentId}`
- **Auth:** Instructor (owner) or Admin.
- **Response:** `204 No Content`.
- **Behavior:** Marks as `ARCHIVED` and eventually deletes from storage.

---

**Status codes:** `400` validation, `401` unauthorized, `403` forbidden, `404` not found.
