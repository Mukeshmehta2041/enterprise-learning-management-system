# 7. Security

## Authentication Flow (OAuth2 + JWT)

### Step 1: Login (resource owner password or similar)

1. Client sends `POST /api/v1/auth/token` (or `/oauth/token`) with `grant_type=password`, `username`, `password` (or in body as per OAuth2).
2. Auth Service (or User Service) validates credentials (e.g. bcrypt compare).
3. If valid: generate access token (JWT, short-lived, e.g. 15 min) and refresh token (opaque, store in Redis with 7d TTL).
4. Response: `access_token`, `refresh_token`, `expires_in`, `token_type=Bearer`.

### Step 2: Accessing protected APIs

1. Client sends `Authorization: Bearer <access_token>` on each request.
2. Gateway validates JWT (signature, expiry, issuer); checks blacklist (Redis `jwt:revoked:{jti}`).
3. Gateway adds `X-User-Id` and `X-Roles` from JWT and forwards to backend. Backend trusts these headers (gateway is only entry).

### Step 3: Refresh

1. Client sends `POST /api/v1/auth/token` with `grant_type=refresh_token`, `refresh_token=<token>`.
2. Auth Service looks up `refresh:{tokenId}` in Redis; if missing or invalid → 401.
3. Issue new access token (and optionally new refresh token with rotation). Delete old refresh key, store new one.

### Step 4: Logout / revoke

1. Client calls e.g. `POST /api/v1/auth/logout` with `Authorization: Bearer <access_token>` (and optionally refresh_token in body).
2. Auth Service adds current JWT’s `jti` to blacklist in Redis (TTL = remaining token lifetime). If refresh_token provided, delete `refresh:{tokenId}` from Redis.

## RBAC: Roles and Permissions

### Roles

| Role | Description |
|------|-------------|
| `STUDENT` | Enroll in courses, view content, submit assignments, view own progress. |
| `INSTRUCTOR` | Create/edit own courses, manage content and assignments, view analytics for own courses, grade submissions. |
| `ADMIN` | Full access: user management, all courses, system settings, global analytics. |

### Permission Matrix (examples)

| Permission | STUDENT | INSTRUCTOR | ADMIN |
|------------|---------|------------|-------|
| `user:read_own` | Yes | Yes | Yes |
| `user:read_any` | No | No | Yes |
| `user:write` | Own profile | Own profile | Any |
| `course:read` | Published | Own + published | All |
| `course:create` | No | Yes | Yes |
| `course:update` | No | Own | Any |
| `course:delete` | No | Own | Any |
| `enrollment:create` | Yes | Yes | Yes |
| `enrollment:read` | Own | Own + course students | All |
| `assignment:create` | No | Own course | Any |
| `assignment:grade` | No | Own course | Any |
| `analytics:read` | Own | Own courses | All |

### Enforcement

- **Method-level:** Use annotations (e.g. `@PreAuthorize("hasAuthority('course:create')")`) for coarse checks.
- **Resource-level:** In application code, verify ownership (e.g. course belongs to current user for INSTRUCTOR) or enrollment before returning or updating. Use custom evaluators or service-layer checks.

## Token Lifecycle

- **Access token:** Short-lived (e.g. 15 min); used for API calls; stateless except blacklist on logout.
- **Refresh token:** Long-lived (e.g. 7 d); stored in Redis; rotate on use; revoke on logout and password change.
- **Sensitive actions:** Optionally require re-auth or step-up (e.g. password again) for password change, payment, or role change.

## Secure API Checklist

| Item | Description |
|------|-------------|
| HTTPS only | TLS in production; no plain HTTP for APIs. |
| Input validation | Bean Validation on all DTOs; sanitize strings; reject unknown fields if needed. |
| Output encoding | Do not expose internal errors or stack traces; use stable error codes. |
| No PII in logs | Do not log passwords, tokens, or full payment data. |
| Rate limiting | Per IP and per user at gateway (see [03-api-gateway.md](03-api-gateway.md)). |
| CORS | Restrict to known front-end origins; no wildcard in prod. |
| Secrets | Store DB and API keys in a secret manager; never commit to repo. |
