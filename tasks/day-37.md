# Day 37 – Mobile API optimization

**Focus:** Field selection (sparse fieldsets), compression, and payload tuning for mobile and low-bandwidth clients.

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 37 is done_

---

## Checklist

### 1. Sparse fieldsets

- [ ] Support optional query param (e.g. `fields=id,name,slug` or `fields[courses]=id,title,thumbnail`) so clients request only needed fields; reduce payload size. Apply to list and get endpoints where useful.
- [ ] Validate requested fields against allowed set; ignore unknown to avoid breaking clients. Document in API spec.

### 2. Compression and encoding

- [ ] Enable gzip (or Brotli) for responses at gateway or service; ensure clients send `Accept-Encoding: gzip`. Optional: support `Accept: application/json` vs minimal JSON (e.g. strip nulls) for mobile.
- [ ] Keep default JSON compact (no pretty-print in prod); document any alternative representations.

### 3. Pagination and payload

- [ ] Ensure list endpoints use cursor or offset pagination with sensible default page size (e.g. 20); allow `page_size` cap (e.g. 100) to avoid huge responses. Return total count only when requested if expensive.
- [ ] Optional: embed related resources (e.g. first instructor) via `include` param to reduce round-trips; document and limit depth.

### 4. Verify

- [ ] Call with `fields` and confirm smaller payload; verify compression and pagination. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 37 is complete. Next: [Day 38](day-38.md) (Database read replicas and read scaling).
