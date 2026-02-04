# Day 1 – Monorepo structure and project skeleton

**Focus:** Set up the root build and module layout so you can add services incrementally.

**References:** [docs/11-phase-plan.md](../docs/11-phase-plan.md) (Phase 1), [docs/01-architecture.md](../docs/01-architecture.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | |
| ✅ Done | Day 1 implemented (monorepo + all module skeletons) |

**Started:** Day 1  
**Completed:** Day 1

---

## Checklist

### 1. Root build (Maven)

- [x] Create root `pom.xml` (parent or BOM) with:
  - Java 17
  - Spring Boot 3.x parent (or dependency management for Spring Boot 3.x)
  - Maven compiler plugin
  - Common properties: `project.build.sourceEncoding`, `java.version`
- [x] Define modules: `lms-gateway`, `lms-user-service`, `lms-auth-service`, `lms-course-service`, `lms-enrollment-service`, and optionally `lms-common` (shared DTOs / event envelope).

### 2. Module skeletons

- [x] **lms-common** (optional): Create module with empty or minimal shared code (e.g. one DTO or event envelope class) so other modules can depend on it.
- [x] **lms-gateway**: Spring Cloud Gateway app; `application.yml` with placeholder routes (e.g. `/api/v1/users` → user-service). Service does not need to be running yet.
- [x] **lms-user-service**: Spring Boot app with `spring-boot-starter-web`, actuator; one health endpoint working.
- [x] **lms-auth-service**: Spring Boot app with web, actuator; health endpoint working.
- [x] **lms-course-service**: Spring Boot app with web, actuator; health endpoint working.
- [x] **lms-enrollment-service**: Spring Boot app with web, actuator; health endpoint working.

### 3. Local run (no Docker yet)

- [x] From root: `mvn clean install` (all modules build).
- [ ] Run each service on a different port (e.g. gateway 8080, user 8081, auth 8082, course 8083, enrollment 8084). Confirm actuator health (e.g. `GET http://localhost:8081/actuator/health`).

### 4. Progress update

- [x] Update the **Progress** table at the top of this file: set “In progress” or “Done” and fill **Started** / **Completed** dates.

---

## Done?

When all checkboxes above are done, Day 1 is complete. Next: [Day 2](day-2.md) (User Service: database + CRUD API), or continue with Phase 1 in [docs/11-phase-plan.md](../docs/11-phase-plan.md).
