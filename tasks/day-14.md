# Day 14 – Audit logging and compliance

**Focus:** Audit trail for sensitive actions (login, role change, payment, grade change); structured logs and optional retention policy.

**References:** [docs/07-security.md](../docs/07-security.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 14 is done_

---

## Checklist

### 1. Audit events

- [ ] Define audit events for: user login/logout, role assignment/removal, user deactivation, course publish, enrollment, payment, grade change, content publish. Include actor (userId), resource, action, timestamp, and outcome (success/failure).
- [ ] Emit audit events from each service (log and/or Kafka topic `audit.events`) in a consistent schema; no passwords or tokens in audit payload.

### 2. Storage and query

- [ ] Persist audit records: either append to dedicated audit store (e.g. table per service or central audit service consuming Kafka) or ensure log aggregation retains them. Define retention (e.g. 90 days, 1 year for payments).
- [ ] (Optional) Expose read-only API for admins to query audit log by user, resource, or time range; protect with ADMIN role.

### 3. Compliance and PII

- [ ] Ensure audit logs do not contain PII beyond what is necessary (e.g. userId, resource id); redact email in logs if required by policy.
- [ ] Document retention and access to audit data for compliance (e.g. GDPR, SOC2).

### 4. Verify

- [ ] Trigger sensitive actions and confirm audit entries; verify no secrets in logs. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 14 is complete. Next: [Day 15](day-15.md) (Performance testing and optimization).
