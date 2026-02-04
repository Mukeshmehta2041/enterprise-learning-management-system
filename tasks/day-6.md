# Day 6 – API Gateway and Docker Compose

**Focus:** JWT validation at gateway, rate limiting, route all services; Docker Compose for local run (PostgreSQL, Redis, Kafka, gateway, services).

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** 2026-02-04  
**Completed:** 2026-02-04

---

## Checklist

### 1. Gateway JWT validation

- [x] Add JWT library and Redis client to **lms-gateway**. Custom filter or predicate: for routes that require auth, validate `Authorization: Bearer <token>` (signature, expiry, issuer); check blacklist `jwt:revoked:{jti}` in Redis.
- [x] On success: set `X-User-Id` and `X-Roles` from JWT claims and forward; strip or do not forward `Authorization` to backend if backend uses headers only. On failure: return 401.

### 2. Public routes

- [x] Exclude `/api/v1/auth/**` (and optionally `/api/v1/users` for register) from JWT validation; do not add user headers for unauthenticated requests.

### 3. Rate limiting

- [x] Implement rate limiting (Redis sliding-window or token bucket): per IP and optionally per user for auth endpoints. Return 429 with `Retry-After` when exceeded.

### 4. Docker Compose

- [x] Create `docker-compose.yml` (or `docker-compose.dev.yml`): PostgreSQL (one instance with schemas or one per service), Redis, Kafka (+ Zookeeper or KRaft), then gateway, user-service, auth-service, course-service, enrollment-service. Use env vars for DB URLs and service URLs. Document how to run (`docker-compose up`) and required env.

### 5. Verify

- [x] Start stack with Compose; call gateway for login then protected endpoint; confirm JWT validated and headers set. Update Progress when done.

---

## Done?

Next: [Day 7](day-7.md) (Content Service).
