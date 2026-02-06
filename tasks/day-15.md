# Day 15 – Performance testing and optimization

**Focus:** Load and stress tests, identify bottlenecks, tune DB and cache; connection pooling and query optimization.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/06-redis.md](../docs/06-redis.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Database tuning, HikariCP config, Redis TTL, and k6 load tests implemented. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Load testing

- [x] Add load tests (e.g. Gatling, k6, or JMeter): login flow, list courses, enroll, get progress. Define target RPS and p95/p99 latency; run against staging.
- [x] Document baseline metrics and run periodically in CI or before releases.

### 2. Database tuning

- [x] Review slow queries (logs or APM); add or adjust indexes per [04-database.md](../docs/04-database.md). Ensure cursor-based pagination queries use indexes.
- [x] Configure connection pool (HikariCP) per service: max pool size, idle timeout; align with DB max_connections.

### 3. Cache and Redis

- [x] Verify Redis cache hit ratio for course by ID; tune TTL and invalidation. Use Redis for rate-limiting counters; avoid large values.
- [x] Consider caching read-heavy, non-personalized data (e.g. course list for anonymous or first page).

### 4. Resilience under load

- [x] Run stress test beyond capacity; confirm graceful degradation (e.g. 503, circuit open) and no cascade failure. Tune timeouts and circuit breaker thresholds.

### 5. Verify

- [x] Record baseline and document how to run load tests; address critical bottlenecks. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 15 is complete. Next: [Day 16](day-16.md) (Staging environment and env parity).
