# Course Day 1 – Media domain & API design

**Focus:** Define the core media and lecture domain model, storage strategy, and API surface needed to support secure video upload and playback for courses.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Media/lecture domain and API surface designed, documented, and aligned across services. |

**Started:**  
**Completed:**  

---

## Checklist

### Backend

- [x] **Media & lecture entities**: Model lecture/media entities (IDs, ownership, course linkage, duration, status, visibility) in the course/media services, including DB schema changes where needed.
- [x] **Storage strategy**: Decide on storage backend (e.g. S3/MinIO bucket layout, folder structure, naming convention) and document how media objects are addressed.
- [x] **Access rules**: Define ownership and access rules (which instructors can upload/manage, which users can view) and how they map to existing auth/roles.
- [x] **API surface**: Draft REST endpoints for media and lectures (create lecture, attach media, list lectures, get lecture details) and capture them in OpenAPI or design docs.
- [x] **Status lifecycle**: Define lecture/media status lifecycle (draft, uploading, processing, ready, failed, archived) and how status transitions are triggered.

### Frontend

- [x] **Flows for “Add lecture”**: Sketch and document the UI flow for instructors to add a lecture to a course, including required fields and validation rules.
- [x] **API contracts**: List the frontend expectations for lecture and media fields (IDs, titles, descriptions, duration, status) and align them with backend contracts.
- [x] **Course detail structure**: Decide how lectures will appear in course detail pages (ordering, grouping, metadata) and capture in a lightweight UX doc or wireframes.

### Mobile

- [x] **Navigation flows**: Outline navigation for viewing course lectures in the mobile app (course list → course detail → lecture detail/player).
- [x] **API usage plan**: Document which lecture/media APIs the mobile app will consume and any mobile-specific constraints (pagination, offline caching, minimal payloads).
- [x] **Metadata display**: Decide which lecture metadata (duration, status, preview indicators) will be shown in mobile lecture lists and details.

---

## Done?

When all checkboxes above are done, Course Day 1 is complete. Next: [Course Day 2 – Upload endpoints & security](course-day-02-upload-endpoints-and-security.md).

