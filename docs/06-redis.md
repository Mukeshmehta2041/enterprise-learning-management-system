# 6. Redis Usage

## Pattern Summary

| Use case | Pattern | Key example | TTL / notes |
|----------|---------|-------------|-------------|
| JWT blacklist | Set (or String) | `jwt:revoked:{jti}` | Set until token expiry (e.g. 15m); check on every validated request at gateway. |
| Refresh token store | String (JSON) | `refresh:{tokenId}` | 7d; rotate on use; delete on logout. |
| Rate limiting | Sliding window or token bucket | `ratelimit:ip:{ip}:{route}` or `ratelimit:user:{userId}:{route}` | 1m or 1h window; increment and compare to limit. |
| Distributed lock | Redisson lock (or SET NX) | `lock:enrollment:{courseId}:{userId}` | 30s lease; retry with backoff; release after enroll. |
| Cache – course by ID | String (JSON) | `course:{id}` | 5m; invalidate on CourseUpdated/CourseDeleted event. |
| Cache – user session | Hash | `session:{sessionId}` | 24h; store user id, roles, last activity. |
| Idempotency (Kafka) | String | `idem:{consumerName}:{eventId}` | 24h; set after successful process. |

## JWT Blacklist

- When a user logs out or token is revoked, add the JWT’s `jti` to Redis: e.g. `SET jwt:revoked:{jti} 1 EX <seconds_until_expiry>`.
- Gateway (or Auth Service): after validating JWT, check if `jti` exists in blacklist; if yes, treat as invalid (401).

## Refresh Token Store

- After login, create a refresh token (opaque UUID), store payload in Redis: `SET refresh:{tokenId} "<json>" EX 604800` (7d). JSON can include userId, scope, createdAt.
- On refresh: validate token, issue new access (and optionally new refresh), delete old key, write new key (rotation).

## Rate Limiting

- **Sliding window:** e.g. Redis sorted set with timestamp as score; add current request, remove entries older than window, count; if count > limit → 429.
- **Token bucket:** increment key per time window; if over limit → 429. Use `Retry-After` header with seconds until window reset.

## Distributed Lock (Enrollment)

- Before creating enrollment, acquire lock `lock:enrollment:{courseId}:{userId}` (e.g. Redisson lock or SET key NX EX 30).
- If acquired: create enrollment, publish event, release lock.
- If not acquired: return 409 or retry with backoff.

## Cache Invalidation

- On course update/delete: publish event; Course Service (or a consumer) deletes `course:{id}` from Redis.
- Alternatively, use short TTL (e.g. 5m) so stale data is bounded.

## Redis Cluster and Connection

- For high availability and scaling, use **Redis Cluster**; single-node Redis is fine for dev.
- In application: use Spring Data Redis or Redisson; configure connection to cluster or single node via env (e.g. `spring.redis.cluster.nodes` or `spring.redis.host`/`port`).
