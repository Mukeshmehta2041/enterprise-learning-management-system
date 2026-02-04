# Day 32 – Caching strategy and CDN

**Focus:** HTTP cache headers, CDN for static assets and optional API responses; cache invalidation and consistency.

**References:** [docs/06-redis.md](../docs/06-redis.md), [docs/03-api-gateway.md](../docs/03-api-gateway.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 32 is done_

---

## Checklist

### 1. Cache headers

- [ ] Set appropriate `Cache-Control`, `ETag`, and `Last-Modified` on public or semi-public GET responses (e.g. course list, course by slug). Use short TTL for list pages, longer for stable content; no cache for user-specific or sensitive data.
- [ ] Support conditional requests (`If-None-Match`, `If-Modified-Since`) where beneficial to reduce payload.

### 2. CDN and static assets

- [ ] Serve static assets (images, PDFs, video URLs) via CDN or object store with CDN in front; use presigned or time-limited URLs. Document how content URLs are generated and invalidated.
- [ ] Optional: cache public API responses at edge (e.g. list published courses) with short TTL; invalidate on course publish event.

### 3. Invalidation

- [ ] When course or content is updated, invalidate Redis cache (existing) and document CDN purge or TTL for edge cache. Ensure user-specific data is never cached at edge.
- [ ] Document cache layers: app Redis, CDN, browser; and invalidation flow for each.

### 4. Verify

- [ ] Verify cache headers on key endpoints; confirm CDN or asset delivery works; test invalidation. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 32 is complete. Next: [Day 33](day-33.md) (Batch jobs and scheduled tasks).
