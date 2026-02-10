# Day 4 – Course Service: database and CRUD API

**Focus:** Implement Course Service with PostgreSQL schema, entities, REST API (courses, modules, lessons), validation, and exception handling.

**References:** [docs/04-database.md](../docs/04-database.md) (Course schema), [docs/api-specs/course-service-api.md](../docs/api-specs/course-service-api.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Course Service implemented with PostgreSQL schema and initial CRUD APIs. |

**Started:** 2026-02-04  
**Completed:** 2026-02-04

---

## Checklist

### 1. Database setup (Course Service)

- [x] Add to **lms-course-service** `pom.xml`: `spring-boot-starter-data-jpa`, `postgresql`, Flyway (and H2 for dev if desired).
- [x] Configure `application.yml`: datasource, schema `lms_course`, Flyway locations.
- [x] Create migrations: schema `lms_course`; tables `courses`, `modules`, `lessons`, `course_instructors`; indexes on `status`, `slug`, `created_at`, FKs.

### 2. Domain and persistence

- [x] JPA entities: `Course`, `Module`, `Lesson`, `CourseInstructor` (or similar); map to schema `lms_course`.
- [x] Repositories: `CourseRepository` (findBySlug, findByStatus), `ModuleRepository`, `LessonRepository`.

### 3. Application layer and REST API

- [x] Service: create/update/delete course; CRUD modules and lessons; enforce instructor/admin for writes.
- [x] Controller `/api/v1/courses`: list (with cursor/offset), get by ID, create, update, delete; list modules/lessons; create/update module and lesson. Use `X-User-Id` and `X-Roles` for authorization.
- [x] Validation and global exception handling; no sensitive data in responses.

### 4. Verify

- [x] Run Course Service; test create course, add module/lessons, list courses. Update Progress when done.

---

## Done?

Next: [Day 5](day-5.md) (Enrollment Service).
