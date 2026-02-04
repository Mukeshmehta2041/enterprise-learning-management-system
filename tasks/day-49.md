# Day 49 – Dependency and platform upgrades

**Focus:** Upgrade dependencies (Spring Boot, Java, libraries) and platform components (K8s, Kafka, PostgreSQL); test and document upgrade path.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 49 is done_

---

## Checklist

### 1. Dependency upgrades

- [ ] Upgrade Spring Boot and Spring Cloud to current stable (or LTS); resolve deprecated API usage and config. Upgrade Java to supported LTS (e.g. 21). Update other libraries (JWT, DB drivers, Kafka client); run full test suite and fix breakages.
- [ ] Document breaking changes and config migration; update README and runbooks if needed.

### 2. Platform components

- [ ] Plan upgrade for Kubernetes (if managed, follow provider timeline), Kafka, PostgreSQL, and Redis to supported versions. Check compatibility with client libraries; test in staging first.
- [ ] Document upgrade order (e.g. DB minor, then Kafka, then apps); backup before each; rollback steps.

### 3. Security and maintenance

- [ ] Address any CVEs from dependency scan; apply security patches. Schedule recurring upgrade window (e.g. quarterly) and assign owner.
- [ ] Pin versions in CI and deployment; avoid “latest” in prod; document how to propose and test upgrades.

### 4. Verify

- [ ] Full build and tests pass on upgraded stack; deploy to staging and run smoke tests. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 49 is complete. Next: [Day 50](day-50.md) (LMS 50-day summary and roadmap).
