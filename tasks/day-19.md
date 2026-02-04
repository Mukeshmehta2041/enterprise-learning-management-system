# Day 19 – Admin APIs and operational tooling

**Focus:** Admin-only endpoints for support and ops: user lookup, course moderation, Kafka lag, health details; internal tooling and scripts.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 19 is done_

---

## Checklist

### 1. Admin API surface

- [ ] Secure admin routes (e.g. `/admin/**` or `/internal/**`): allow only ADMIN role or internal network; never expose on public gateway without auth.
- [ ] Endpoints as needed: user search by email (User Service), course list with filters and bulk status update (Course Service), enrollment stats per course (Enrollment Service), DLQ depth or consumer lag (Search/Notification).

### 2. Operational endpoints

- [ ] Read-only admin: list failed events in DLQ, view consumer group lag. Optional: trigger replay or reset offset (with safeguards and audit).
- [ ] Health and info: `/actuator/health` with details for DB, Redis, Kafka; expose only on management port or to internal IPs.

### 3. Scripts and tooling

- [ ] Document or add scripts: seed data for staging, export audit log for date range, invalidate cache for a course. Prefer idempotent, logged operations.
- [ ] Runbook entries for common ops tasks: scale deployment, clear DLQ, rotate secret.

### 4. Verify

- [ ] Admin endpoints return 403 for non-admin; ops runbook tested. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 19 is complete. Next: [Day 20](day-20.md) (Production rollout checklist and documentation).
