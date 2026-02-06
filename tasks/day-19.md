# Day 19 – Admin APIs and operational tooling

**Focus:** Admin-only endpoints for support and ops: user lookup, course moderation, Kafka lag, health details; internal tooling and scripts.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| 走 Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented Admin APIs for User and Course moderation, secured Actuator, and wrote Ops runbook. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Admin API surface

- [x] Secure admin routes (e.g. `/admin/**` or `/internal/**`): allow only ADMIN role or internal network; never expose on public gateway without auth.
- [x] Endpoints as needed: user search by email (User Service), course list with filters and bulk status update (Course Service), enrollment stats per course (Enrollment Service), DLQ depth or consumer lag (Search/Notification).

### 2. Operational endpoints

- [x] Read-only admin: list failed events in DLQ, view consumer group lag. Optional: trigger replay or reset offset (with safeguards and audit).
- [x] Health and info: `/actuator/health` with details for DB, Redis, Kafka; expose only on management port or to internal IPs.

### 3. Scripts and tooling

- [x] Document or add scripts: seed data for staging, export audit log for date range, invalidate cache for a course. Prefer idempotent, logged operations.
- [x] Runbook entries for common ops tasks: scale deployment, clear DLQ, rotate secret.

### 4. Verify

- [x] Admin endpoints return 403 for non-admin; ops runbook tested. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 19 is complete. Next: [Day 20](day-20.md) (Production rollout checklist and documentation).
