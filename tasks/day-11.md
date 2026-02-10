# Day 11 – Contract testing and API documentation

**Focus:** OpenAPI/Swagger specs for all services, contract tests (consumer/provider), and API versioning headers.

**References:** [docs/03-api-gateway.md](../docs/03-api-gateway.md), [docs/10-best-practices.md](../docs/10-best-practices.md), [docs/api-specs/](../docs/api-specs/).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented basic OpenAPI, API versioning, and initial Contract tests. |

**Started:** February 5, 2026  
**Completed:** February 5, 2026

---

## Checklist

### 1. OpenAPI specs

- [x] Add SpringDoc OpenAPI (or Swagger) to gateway and each service; generate specs from controllers or maintain YAML in repo.
- [x] Document all public endpoints: request/response schemas, auth (Bearer), error responses, and deprecation where applicable.
- [x] Expose `/v3/api-docs` and optional Swagger UI behind dev/staging only (or secured); no docs in prod if policy requires.

### 2. Contract tests

- [x] Introduce contract tests: consumer contracts (gateway or frontend expectations) and provider tests (each service fulfills contract). Use Pact, Spring Cloud Contract, or OpenAPI-based assertions.
- [x] Run contract tests in CI on PR; fail build if contract broken.

### 3. API versioning and headers

- [x] Add `X-API-Version` or `Accept` versioning per [03-api-gateway.md](../docs/03-api-gateway.md); gateway forwards version to services.
- [x] Document deprecation policy and `Sunset` / `Deprecation` response headers for deprecated endpoints.

### 4. Verify

- [x] Generate client SDKs or verify docs match live behaviour; run full contract test suite. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 11 is complete. Next: [Day 12](day-12.md) (Integration tests and Testcontainers).
