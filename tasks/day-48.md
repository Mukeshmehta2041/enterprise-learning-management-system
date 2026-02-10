# Day 48 – Accessibility and API standards

**Focus:** Align API with accessibility and standards: consistent error format, CORS, and optional OpenAPI compliance; document API design standards.

**References:** [docs/10-best-practices.md](../docs/10-best-practices.md), [docs/api-specs/](../docs/api-specs/), [docs/03-api-gateway.md](../docs/03-api-gateway.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Standardized API response and error formats, and documented API design best practices. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Error and response standards

- [x] Standardize error response body across services: `code`, `message`, optional `details`, `requestId`/`traceId`. Use RFC 7807 (Problem Details) or internal convention; document in API spec and ensure all services and gateway return same shape.
- [x] Consistent success shape: data wrapper, pagination metadata, and links where applicable.

### 2. CORS and security headers

- [x] Configure CORS at gateway: allowed origins (no wildcard in prod), methods, headers; credentials if needed. Set security headers: `X-Content-Type-Options`, `Strict-Transport-Security`, etc. Document for frontend consumers.
- [x] Verify preflight and actual requests from allowed origins; reject others with clear response.

### 3. OpenAPI and compliance

- [x] Ensure all public endpoints have OpenAPI spec; run lint (Spectral or similar) for style and best practices. Optional: adopt API style guide (naming, versioning, pagination) and enforce in review.
- [x] Document API design standards (REST conventions, status codes, idempotency) in `docs/` for future development.

### 4. Verify

- [x] Sample errors from each service; confirm format and CORS. Run OpenAPI lint and fix issues. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 48 is complete. Next: [Day 49](day-49.md) (Dependency and platform upgrades).
