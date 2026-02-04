# Day 12 – Integration tests and Testcontainers

**Focus:** Integration tests with real dependencies (PostgreSQL, Redis, Kafka) using Testcontainers; service-to-service and end-to-end flows.

**References:** [docs/10-best-practices.md](../docs/10-best-practices.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 12 is done_

---

## Checklist

### 1. Testcontainers setup

- [ ] Add Testcontainers (PostgreSQL, Redis, Kafka) to root or each service `pom.xml`; use JUnit 5 and `@Testcontainers` / `@Container`.
- [ ] Create shared test base or profile (e.g. `application-test.yml`) that points to container URLs; reuse containers where possible for speed.

### 2. Service integration tests

- [ ] User Service: integration test with PostgreSQL container; Flyway runs; test create user, get by email, assign role.
- [ ] Auth Service: with Redis and User Service (or mock); test login, refresh, logout and blacklist.
- [ ] Course and Enrollment services: with DB and optional Kafka; test CRUD and enroll flow.
- [ ] Ensure tests are idempotent and do not depend on execution order.

### 3. Cross-service flows

- [ ] Add at least one end-to-end test (e.g. register → login → list courses → enroll) via gateway or direct service calls with containers for DB, Redis, Kafka.
- [ ] Document how to run integration tests locally and in CI (Docker available).

### 4. Verify

- [ ] All integration tests pass; CI runs them on PR. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 12 is complete. Next: [Day 13](day-13.md) (RBAC refinement and resource-level authorization).
