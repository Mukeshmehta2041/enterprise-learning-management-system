# Day 28 – API v2 and backward compatibility

**Focus:** Design and implement a second API version (v2) for selected resources; maintain v1; deprecation and migration path.

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/api-specs/](../docs/api-specs/), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | API v2 implemented for Course and Enrollment services with deprecation headers on v1. |

**Started:** 2024-05-28  
**Completed:** 2024-05-28  

---

## Checklist

### 1. v2 scope and design

- [x] Choose one or two domains for v2 (e.g. courses and enrollments): define new URLs (`/api/v2/courses`), request/response shapes, and improvements (e.g. consistent pagination, embedded resources, better error codes).
- [x] Document differences from v1 and migration guide (field mapping, behaviour changes). Keep v1 stable; no breaking changes to v1.

### 2. Implementation

- [x] Implement v2 endpoints in respective services; gateway routes `/api/v2/*` to same services with version header or path. Reuse domain logic where possible; separate DTOs and controllers for v2.
- [x] OpenAPI spec for v2; contract tests for v2. Version in `Accept` or URL path consistently.

### 3. Deprecation and sunset

- [x] Add `Deprecation: true` and `Sunset: <date>` headers to v1 endpoints when v2 is ready; document sunset date and communicate to consumers. Optional: v1 read-only period before removal.
- [x] Monitor v1 usage; plan removal or long-term support.

### 4. Verify

- [x] v2 endpoints work; v1 still works; deprecation headers present on v1. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 28 is complete. Next: [Day 29](day-29.md) (Security audit and penetration testing).
