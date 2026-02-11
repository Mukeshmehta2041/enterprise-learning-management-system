# Feature: Lecture & Media Management

This document outlines the UX flows and API usage for both Frontend and Mobile applications regarding lectures and media.

## UX Flow: Instructor - Add Lesson & Media

1.  **Navigate to Curriculum**: Instructor opens a course and goes to the "Curriculum" or "Modules" tab.
2.  **Add Lesson**: Instructor clicks "Add Lesson" in a module, enters the title and selects type (e.g., VIDEO).
    - API Call: `POST /api/v1/courses/{courseId}/modules/{moduleId}/lessons`
3.  **Upload Media**: Instructor clicks on the new lesson to expand/edit and sees an "Upload Video" button.
4.  **Initiate Content**: Upon selecting a file, the frontend initializes a content item.
    - API Call: `POST /api/v1/content` (returns `contentId`)
5.  **Get Presigned URL**:
    - API Call: `POST /api/v1/content/{contentId}/upload-url` (returns S3 URL)
6.  **Upload to Storage**: Frontend uploads the file directly to S3/MinIO using the presigned URL.
7.  **Confirm Upload**: Once finished, frontend notifies the backend.
    - API Call: `POST /api/v1/content/{contentId}/complete-upload`
8.  **Wait for Processing**: Frontend polls or listens via websocket/notifications as the status moves from `UPLOADING` -> `PROCESSING` -> `READY`.

## Frontend Course Detail Structure

- **Module List**: Accordion style.
- **Lesson List**: Each item shows:
    - Type icon (Video, Reading, Quiz).
    - Title.
    - Duration (if `VIDEO`).
    - Status badge (e.g., `Processing` or `Draft` for instructors).
    - Preview indicator (if `is_preview: true`).

## Mobile Navigation & Playback

- **Navigation**: `Course List` -> `Course Home` -> `Module/Lesson List` -> `Player Screen`.
- **API Usage**:
    - Mobile app uses `GET /api/v1/courses/{id}` to listing modules and lessons.
    - When a lesson is tapped, the app calls `GET /api/v1/content/lesson/{lessonId}` to get the media URL.
- **Constraints**:
    - **Offline Caching**: Mobile app should support downloading lessons for offline viewing (requires `size_bytes` metadata).
    - **Minimal Payloads**: Use pagination for large course curriculums.

## Media Status Lifecycle (Refined)

- `DRAFT`: Record created, no file attached.
- `UPLOADING`: Instructor is currently uploading.
- `PROCESSING`: File is being transcoded or scanned for viruses.
- `READY`: Available for all authorized users.
- `FAILED`: Processing failed (e.g., corrupted file).
- `ARCHIVED`: Soft-deleted.

## API Contracts Alignment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier. |
| `title` | String | User-facing title. |
| `type` | Enum | `VIDEO`, `PDF`, `READING`, `QUIZ`. |
| `status` | Enum | See lifecycle above. |
| `duration_secs`| Integer| Length of audio/video. |
| `url` | String | Presigned URL (short-lived). |
| `is_preview` | Boolean| If students can view without enrolling. |
