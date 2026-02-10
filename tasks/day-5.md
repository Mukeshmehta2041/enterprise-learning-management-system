# Day 5 – Enrollment Service: database and API

**Focus:** Implement Enrollment Service with schema, enroll, list enrollments, update progress; validate course via Course Service.

**References:** [docs/04-database.md](../docs/04-database.md) (Enrollment schema), [docs/api-specs/enrollment-service-api.md](../docs/api-specs/enrollment-service-api.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Enrollment Service implemented with schema and APIs for tracking course progress. |

**Started:** 2026-02-04  
**Completed:** 2026-02-04

---

## Checklist

### 1. Database setup (Enrollment Service)

- [x] Add JPA, Flyway, PostgreSQL (and optional H2 dev) to **lms-enrollment-service**. Schema `lms_enrollment`.
- [x] Migrations: `enrollments` (user_id, course_id, status, progress_pct, completed_at), `lesson_progress`; unique (user_id, course_id); indexes per [04-database.md](../docs/04-database.md).

### 2. Domain, persistence, and Course Service client

- [x] Entities: `Enrollment`, `LessonProgress`; repositories.
- [x] HTTP client to Course Service: check course exists and is published before enroll; optionally get total lessons for progress %.

### 3. Application layer and REST API

- [x] Service: enroll (with distributed lock per course+user if using Redis), list enrollments (paginated), update progress (lesson completed), get progress.
- [x] Controller `/api/v1/enrollments`: POST enroll, GET my enrollments, GET by id, PATCH progress, GET progress; GET course enrollments (instructor/admin). Use `X-User-Id` and `X-Roles`.

### 4. Verify

- [x] Run with User and Course services; test enroll, list, update progress. Update Progress when done.

---

## Done?

Next: [Day 6](day-6.md) (API Gateway and Docker Compose).
