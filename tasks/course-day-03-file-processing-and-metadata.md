# Course Day 3 – File processing & metadata

**Focus:** Define and wire up post-upload processing for lecture videos (transcoding hooks, thumbnails, duration extraction) and the metadata needed for rich playback experiences.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Processing pipeline designed via Kafka consumer, mock metadata extraction implemented, and DTOs updated to reflect processing status. |
| ✅ Done | |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [x] **Processing pipeline design**: Design how uploads transition into a processing pipeline (events, queues, or cron), including failure handling.
- [ ] **Transcoding hooks**: Define integration points for transcoding (internal service, external provider) and store resulting renditions/paths.
- [x] **Metadata extraction**: Automatically extract duration, resolution, codecs, and file size; persist them on the lecture/media entity.
- [ ] **Thumbnail generation**: Define and implement thumbnail generation flow (frame selection, multiple sizes) and storage layout.
- [x] **Status updates**: Ensure processing results update lecture/media status (e.g. `processing` → `ready` or `failed`) and emit relevant events.

### Frontend

- [ ] **Processing states in UI**: Show clear status indicators for lectures (e.g. \"processing\", \"ready\", \"failed\") on instructor course pages.
- [ ] **Metadata display**: Display duration and other key metadata (e.g. resolution, file size where useful) in lecture lists and details.
- [ ] **Fallbacks for failures**: Define what the UI shows when processing fails and how instructors can retry or re-upload.

### Mobile

- [ ] **Status and metadata**: Show lecture status and duration in mobile course detail and lecture lists.
- [ ] **Graceful degradation**: Handle missing metadata gracefully (e.g. show placeholders) while processing is ongoing.
- [ ] **Refresh behaviour**: Ensure pull-to-refresh or equivalent updates lecture statuses and metadata after processing completes.

---

## Done?

When all checkboxes above are done, Course Day 3 is complete. Next: [Course Day 4 – Lecture management CRUD](course-day-04-lecture-management-crud.md).

