# Day 7 – Content Service

**Focus:** Content items (video, PDF, quiz), versions, metadata; REST API and Kafka producer for `content.events`.

**References:** [docs/04-database.md](../docs/04-database.md) (Content schema), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 7 is done_

---

## Checklist

### 1. Database and domain (Content Service)

- [ ] Add **lms-content-service** (or extend repo): JPA, Flyway, schema `lms_content`. Tables: `content_items`, `content_versions`, `quiz_questions`, `content_metadata` per [04-database.md](../docs/04-database.md).
- [ ] Entities and repositories; service layer for CRUD.

### 2. REST API

- [ ] Controller `/api/v1/content`: CRUD content items and versions; optional presigned URL endpoint for upload/download (or placeholder). Enforce course ownership (instructor/admin) for writes.

### 3. Kafka producer

- [ ] Publish to `content.events` (or single topic with event type): e.g. `ContentPublished`, `ContentVersionAdded`. Use canonical envelope from [05-events-kafka.md](../docs/05-events-kafka.md).

### 4. Verify

- [ ] Create content, publish event; consumer or log confirms event. Update Progress when done.

---

## Done?

Next: [Day 8](day-8.md) (Assignment Service, Redis, Search).
