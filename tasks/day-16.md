# Day 16 – Staging environment and env parity

**Focus:** Dedicated staging environment (infra and config); parity with production for config, secrets, and data shape; smoke tests.

**References:** [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 16 is done_

---

## Checklist

### 1. Staging infrastructure

- [ ] Provision staging environment: same topology as production (gateway, services, PostgreSQL, Redis, Kafka). Use smaller instance sizes if acceptable; same versions for runtimes and DB.
- [ ] Separate staging DBs/schemas and Redis/Kafka clusters (or namespaces) so staging and prod never mix.

### 2. Configuration and secrets

- [ ] Staging-specific `application-staging.yml` or env vars: DB URLs, Redis, Kafka, JWT keys, feature flags. Use same config structure as prod (secrets from Vault or env, never in repo).
- [ ] Document required env vars and how to rotate secrets for staging and prod.

### 3. Deployment and smoke tests

- [ ] Deploy to staging on merge to main (or release branch); run smoke tests after deploy: health checks, login, one course list, one enrollment.
- [ ] Optional: seed staging with anonymized or synthetic data for realistic testing.

### 4. Parity checklist

- [ ] Checklist: same API versioning, same CORS and security headers, same rate limits (or relaxed for staging); no dev-only endpoints in prod. Document differences explicitly.

### 5. Verify

- [ ] Full deploy to staging and smoke tests pass; team can use staging for UAT. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 16 is complete. Next: [Day 17](day-17.md) (Backup, retention, and disaster recovery).
