# 3. API Gateway Design

## Route Table

Route by path prefix. All routes are under `/api/v1/` (path-based versioning).

| Path prefix | Target service | Auth required |
|-------------|----------------|---------------|
| `/api/v1/users` | User Service | Yes (except public register if offered) |
| `/api/v1/auth` or `/api/v1/oauth` | Auth Service | No (login, refresh, logout) |
| `/api/v1/courses` | Course Service | Yes for write; optional for public catalog read |
| `/api/v1/enrollments` | Enrollment Service | Yes |
| `/api/v1/content` | Content Service | Yes |
| `/api/v1/assignments` | Assignment Service | Yes |
| `/api/v1/notifications` | Notification Service | Yes |
| `/api/v1/payments` | Payment Service | Yes |
| `/api/v1/search` | Search Service | Yes (or optional for public search) |
| `/api/v1/analytics` | Analytics Service | Yes (admin/instructor) |

**Example:** `GET /api/v1/courses` → Gateway forwards to Course Service (e.g. `http://course-service:8080/api/v1/courses`). Same path can be preserved (strip prefix = false) or rewritten per your convention.

## JWT Validation (Gateway)

1. **Extract:** Read `Authorization: Bearer <access_token>` (or fallback header if used).
2. **Validate:** Verify JWT signature (e.g. with public key or shared secret), `exp`, `iss`, and optionally `aud`.
3. **Reject:** If invalid or expired → `401 Unauthorized` (and do not forward to backend).
4. **Forward:** Set headers from JWT claims (e.g. `X-User-Id`, `X-Roles`) and forward request to the target service. Do not forward the raw token unless the backend needs it.
5. **Public routes:** For `/api/v1/auth/**` (and any unauthenticated path), skip JWT validation and do not add user headers.

## Headers Forwarded to Backend

| Header | Source | Example |
|--------|--------|---------|
| `X-User-Id` | JWT `sub` or dedicated claim | `uuid` |
| `X-Roles` | JWT roles claim (e.g. array or comma-separated) | `STUDENT` or `INSTRUCTOR,ADMIN` |
| `X-Trace-Id` | Generated or from client (for tracing) | W3C Trace Context |

Backend services authorize using these headers; they should not trust client-sent `X-User-Id` or `X-Roles` unless the gateway is the only entry and always overwrites them.

## Rate Limiting

- **Storage:** Redis (sliding window or token bucket).
- **Key examples:**  
  - Per IP: `ratelimit:ip:{clientIp}:{routeId}`  
  - Per user (when authenticated): `ratelimit:user:{userId}:{routeId}`
- **Response:** When limit exceeded → `429 Too Many Requests` and `Retry-After` header (seconds).
- **Scopes:** Apply different limits for auth endpoints (stricter) vs read-only vs write; document limits in API docs.

## API Versioning

- **Path:** `/api/v1/`, `/api/v2/` for breaking changes.
- **Gateway:** Routes map to the correct service/version; v2 can point to a new service or same service with version in path.
- **Deprecation:** For v1 endpoints that are deprecated, add response header e.g. `X-API-Deprecated: true` and `X-API-Sunset: <date>`.

## CORS, Timeouts, Logging

- **CORS:** Allow only configured origins (and methods/headers). No wildcard in production.
- **Timeouts:** Configure connect and response timeouts for gateway → backend calls to avoid hanging requests.
- **Logging:** Log request (method, path, status, duration); do not log PII (no body, no tokens). Use trace ID for correlation.
