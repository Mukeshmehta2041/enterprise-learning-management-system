# Day 3 – Auth Service: login, JWT, refresh, logout

**Focus:** Implement Auth Service with password grant, JWT access tokens, refresh tokens in Redis, logout (blacklist + revoke), and optional introspect.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/api-specs/auth-service-api.md](../docs/api-specs/auth-service-api.md), [docs/06-redis.md](../docs/06-redis.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | All tasks completed |

**Started:** 4 February 2026  
**Completed:** 4 February 2026

---

## Checklist

### 1. Auth Service setup

- [x] Add to **lms-auth-service** `pom.xml`: `spring-boot-starter-web`, `spring-boot-starter-data-redis` (or `spring-boot-starter-data-redis-reactive` if using WebFlux), JWT library (e.g. `jjwt-api`, `jjwt-impl`, `jjwt-jackson`), and a REST client to call User Service (e.g. `RestClient` / `WebClient` or `spring-boot-starter-web` with `RestTemplate`).
- [x] Configure `application.yml`: Redis host/port (or URL), JWT signing key (secret or PEM), access token expiry (e.g. 15m), refresh token TTL (e.g. 7d), User Service base URL for credential validation.
- [x] (Optional) Add `application-dev.yml` with local Redis or embedded/disabled Redis for dev.

### 2. Credential validation

- [x] Implement a way to validate username/password: call **User Service** `GET /api/v1/users?email=...` or a dedicated internal endpoint, then verify password with BCrypt (User Service stores hash). Alternatively, if Auth and User share the same DB in MVP, query user by email and verify password in Auth Service (not recommended long-term; prefer HTTP call to User Service).
- [x] On invalid credentials return `401 Unauthorized` with no sensitive detail (e.g. "Invalid credentials").

### 3. JWT access token

- [x] Generate JWT with claims: `sub` (userId), `roles` (array or space-separated), `exp`, `iat`, `jti` (unique id for blacklist). Sign with symmetric key (HS256) or asymmetric (RS256) per config.
- [x] Set short expiry (e.g. 15 minutes). Return in response as `access_token` with `token_type: Bearer` and `expires_in` (seconds).

### 4. Refresh token

- [x] On successful login generate an opaque refresh token (e.g. UUID). Store in Redis: key `refresh:{tokenId}`, value JSON with `userId`, `createdAt`, etc.; TTL 7 days.
- [x] Endpoint `POST /api/v1/auth/token` with `grant_type=refresh_token` and `refresh_token=<opaque>`: look up in Redis; if valid, issue new access token and optionally **rotate** refresh token (delete old, create new, return new refresh_token).
- [x] Do not log refresh_token or password in requests.

### 5. Logout (revoke)

- [x] Endpoint `POST /api/v1/auth/logout`. If `Authorization: Bearer <access_token>` present: parse JWT (or decode without verification only to get `jti` and `exp`), add `jti` to Redis blacklist key `jwt:revoked:{jti}` with TTL = remaining token lifetime (so blacklist entry expires when token would have expired).
- [x] If request body contains `refresh_token`: delete Redis key `refresh:{tokenId}` so that refresh token cannot be used again.
- [x] Return `204 No Content` or `200 OK`.

### 6. Optional: introspect / auth/me

- [x] Endpoint `GET /api/v1/auth/me` with `Authorization: Bearer <access_token>`: decode/validate JWT, check blacklist, return `{ "active": true, "sub": "<userId>", "roles": [...], "exp": ... }`. Useful for clients to get current user without calling User Service.

### 7. Gateway and security

- [x] Ensure API Gateway routes `/api/v1/auth/**` to Auth Service and does **not** require JWT for these paths (so login, refresh, logout are callable without a token).
- [x] Apply strict rate limiting on `/api/v1/auth/token` and `/api/v1/auth/logout` (per IP and per user if identified) to prevent abuse.
- [x] Do not log request/response bodies that contain password or tokens.

### 8. Verify and document

- [x] Run Auth Service with Redis and User Service available. Test: login → receive access_token and refresh_token; call a protected endpoint with Bearer token; refresh → receive new tokens; logout → then use old access_token and confirm 401 or rejected.
- [x] Update the **Progress** table at the top of this file when done.

---

## Done?

When all checkboxes above are done, Day 3 is complete. Next: [Day 4](day-4.md) (Course Service: CRUD + DB) or continue with Phase 1 in [docs/11-phase-plan.md](../docs/11-phase-plan.md).
