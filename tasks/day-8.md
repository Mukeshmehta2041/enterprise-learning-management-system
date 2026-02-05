# Day 8 – Assignment Service, Redis cache, Search Service

**Focus:** Assignments, submissions, grades; Kafka producer; Redis cache for courses and distributed lock for enrollment; Search Service consuming events.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/06-redis.md](../docs/06-redis.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Completed Assignment and Search services with Redis caching/locking and cursor pagination. |

**Started:** 2023-10-27  
**Completed:** 2023-10-27

---

## Checklist

### 1. Assignment Service

- [x] **lms-assignment-service**: DB schema `lms_assignment` (assignments, submissions, grades); JPA entities and repositories; service and REST API (create assignment, submit, grade). Publish `assignment.events` (e.g. SubmissionReceived, AssignmentGraded).

### 2. Redis in Course and Enrollment services

- [x] Course Service: cache course by ID in Redis (`course:{id}`), TTL e.g. 5m; invalidate on course update/delete (or on event).
- [x] Enrollment Service: use distributed lock `lock:enrollment:{courseId}:{userId}` before creating enrollment to avoid duplicates; release after save.

### 3. Gateway rate limiting with Redis

- [x] If not done in Day 6: implement Redis-based rate limiting at gateway; key pattern per [06-redis.md](../docs/06-redis.md).

### 4. Search Service

- [x] New **lms-search-service** or module: consume `course.events` and `content.events`; index into Elasticsearch or OpenSearch. Expose search API (query, filters, facets). Idempotent consumption by `eventId`.

### 5. Cursor-based pagination

- [x] Add cursor-based pagination for list courses and list enrollments per [04-database.md](../docs/04-database.md); indexes in place.

### 6. Verify

- [x] Assignment flow works; cache and lock behave correctly; search returns indexed data. Update Progress when done.

---

## Done?

Next: [Day 9](day-9.md) (Notification, Payment, Analytics).
