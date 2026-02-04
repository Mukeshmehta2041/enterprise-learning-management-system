# Day 2 – User Service: database and CRUD API

**Focus:** Implement User Service with PostgreSQL schema, entities, REST API (CRUD + roles), validation, and global exception handling.

**References:** [docs/04-database.md](../docs/04-database.md) (User schema), [docs/api-specs/user-service-api.md](../docs/api-specs/user-service-api.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | |
| ✅ Done | Day 2 complete: DB, domain, application layer, REST API, exception handling, verified |

**Started:** Day 2  
**Completed:** Day 2

---

## Checklist

### 1. Database setup (User Service)

- [x] Add to **lms-user-service** `pom.xml`: `spring-boot-starter-data-jpa`, `postgresql` (or H2 for local dev only), and Flyway or Liquibase for migrations.
- [x] Configure in `application.yml`: datasource URL (e.g. `jdbc:postgresql://localhost:5432/lms`), schema `lms_user` (or default), username/password (or env vars).
- [x] Create migration script(s) for `lms_user` schema:
  - [x] Table `users`: id (UUID PK), email (unique, not null), password_hash (not null), status (e.g. ACTIVE, DEACTIVATED), created_at, updated_at.
  - [x] Table `profiles`: id (PK), user_id (FK to users, unique), display_name, avatar_url, created_at, updated_at.
  - [x] Table `roles`: id (PK), name (unique, e.g. STUDENT, INSTRUCTOR, ADMIN), description.
  - [x] Table `user_roles`: user_id (FK), role_id (FK), assigned_at; PK (user_id, role_id).
  - [x] Indexes: `users(email)`, `users(status)`, `profiles(user_id)`, `user_roles(user_id)`.
- [x] Seed at least roles: STUDENT, INSTRUCTOR, ADMIN (via migration or data.sql).

### 2. Domain and persistence (User Service)

- [x] Create JPA entities (or map to the schema above): `User`, `Profile`, `Role`, `UserRole` in a `domain` or `entity` package.
- [x] Create Spring Data JPA repositories: `UserRepository` (findByEmail, existsByEmail), `ProfileRepository`, `RoleRepository`, `UserRoleRepository`.
- [x] Use UUID for user id; ensure `created_at` / `updated_at` are set (e.g. `@EntityListeners(AuditingEntityListener.class)` and `@CreatedDate` / `@LastModifiedDate`).

### 3. Application layer (User Service)

- [x] Implement service/use-case classes (e.g. `UserApplicationService` or `UserService`): create user (hash password, e.g. BCrypt), get by id, get by email, update profile, list users (paginated), assign role.
- [x] Enforce business rules: duplicate email → conflict; user can update only own profile (accept `X-User-Id` from gateway); admin can list/assign roles.
- [x] Do not return `password_hash` in any API response.

### 4. REST API (User Service)

- [x] Create REST controller(s) under `api` package, base path `/api/v1/users`.
- [x] Implement endpoints per [api-specs/user-service-api.md](../docs/api-specs/user-service-api.md):
  - [x] `POST /api/v1/users` – create user (register); request/response DTOs with validation.
  - [x] `GET /api/v1/users/me` – current user (use `X-User-Id` header).
  - [x] `GET /api/v1/users/{userId}` – get by ID (own or admin).
  - [x] `PATCH /api/v1/users/{userId}` or `PATCH /api/v1/users/me` – update profile.
  - [x] `GET /api/v1/users?page=&size=&status=&role=` – list users (admin), paginated.
  - [x] `POST /api/v1/users/{userId}/roles` – assign role (admin).
  - [x] `DELETE /api/v1/users/{userId}` or PATCH to deactivate (admin).
- [x] Use Bean Validation on request DTOs (`@NotNull`, `@Email`, `@Size`, etc.); return `400` for validation errors.

### 5. Exception handling and security (User Service)

- [x] Add global `@RestControllerAdvice`: map domain exceptions (e.g. `UserNotFound`, `EmailAlreadyExists`) to HTTP status (404, 409) and stable error body (e.g. `code`, `message`); no stack traces in response.
- [x] For “list users” and “assign role” / “delete user”: resolve `X-User-Id` and `X-Roles`; allow only if user has ADMIN (or document that gateway enforces; service can double-check).

### 6. Verify and document

- [x] Run User Service locally (with PostgreSQL or H2); call endpoints (e.g. via curl or Postman): create user, get me, update profile, list (as admin).
- [x] Update the **Progress** table at the top of this file when done.

---

## Done?

When all checkboxes above are done, Day 2 is complete. Next: [Day 3](day-3.md) (Auth Service: login, JWT, refresh, logout), or continue with Phase 1 in [docs/11-phase-plan.md](../docs/11-phase-plan.md).
