# Day 23 – Rate limiting and quota per tenant/user

**Focus:** Granular rate limits by user and by tenant/plan; quota for enrollments or API calls; Redis-backed counters and limits.

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/06-redis.md](../docs/06-redis.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Rate limiting and quotas implemented. |

**Started:** February 6, 2026
**Completed:** February 6, 2026

---

## Checklist

### 1. Per-user rate limits

- [x] At gateway or auth layer: limit requests per user (from JWT `sub`) per window (e.g. 100 req/min). Use Redis key `ratelimit:user:{userId}:{window}` with sliding or fixed window; return 429 and `Retry-After` when exceeded.
- [x] Apply to expensive or write endpoints (enroll, submit assignment, create course); optionally relax for read-heavy list endpoints.

### 2. Per-tenant or plan quotas

- [x] If multi-tenant or plan-based: store plan limits (e.g. max enrollments per org, max API calls/month). Check quota before enroll or before expensive operation; return 403 with clear message when quota exceeded.
- [x] Optional: usage metering (count enrollments, API calls) and expose via admin or billing API for upgrade prompts.

### 3. Configuration and headers

- [x] Make limits configurable (env or config server); document default limits and how to adjust per environment. Include `X-RateLimit-Limit`, `X-RateLimit-Remaining` in response where applicable.
- [x] Ensure rate-limit logic does not rely on client-supplied identifiers for authenticated users; use server-side user id from token.

### 4. Verify

- [x] Exceed user rate limit and confirm 429; exceed enrollment quota and confirm 403. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 23 is complete. Next: [Day 24](day-24.md) (Kubernetes production deployment).
