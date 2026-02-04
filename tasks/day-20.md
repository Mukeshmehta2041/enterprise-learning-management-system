# Day 20 – Production rollout checklist and documentation

**Focus:** Final production readiness checklist, runbooks, and documentation for launch and ongoing operations.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/07-security.md](../docs/07-security.md), [docs/08-observability.md](../docs/08-observability.md), [docs/11-phase-plan.md](../docs/11-phase-plan.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 20 is done_

---

## Checklist

### 1. Production readiness checklist

- [ ] Security: no default credentials; secrets from vault/env; dependency and image scans; rate limiting and WAF in place; token blacklist and expiry verified.
- [ ] Observability: tracing, metrics, logs, and alerts configured; dashboards and runbooks linked; on-call or escalation defined.
- [ ] Resilience: circuit breakers and retries; Kafka DLQ and idempotent consumers; DB connection limits and backup/restore tested.
- [ ] Performance: load test baseline met; cache and DB indexes in place; HPA or scaling strategy documented.

### 2. Runbooks and playbooks

- [ ] Runbooks: deploy, rollback, scale, restore from backup, clear DLQ, rotate secrets, incident response. Each with steps and owners.
- [ ] Playbook for go-live: pre-flight checks, cutover steps, rollback criteria, and post-launch verification.

### 3. Documentation

- [ ] Architecture diagram and service list up to date; API docs (OpenAPI) published for consumers.
- [ ] Ops doc: how to access staging/prod, required credentials, logging and monitoring URLs, contact list.
- [ ] README or CONTRIBUTING: how to build, test, and run locally; link to task days and phase plan.

### 4. Launch and post-launch

- [ ] Execute go-live playbook; monitor errors, latency, and business metrics for 24–48 hours.
- [ ] Schedule post-mortem if issues occur; capture lessons and update runbooks. Define success criteria for “production ready.”

### 5. Verify

- [ ] All checklist items signed off; documentation reviewed; first production release completed. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 20 is complete. Next: [Day 21](day-21.md) (Data subject requests – GDPR/privacy), or [docs/11-phase-plan.md](../docs/11-phase-plan.md) for the full phase plan.
