# Day 45 – Event replay and audit trail query

**Focus:** Query and replay events from Kafka or event store; admin API for audit trail with filters; safe replay procedure for DLQ or recovery.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Defined audit trail query API and established event replay and DLQ management procedures. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Audit trail query

- [x] Expose read-only API (admin): query audit or domain events by time range, event type, user id, or resource id. Backed by event log table, Kafka (with retention), or search index. Paginate; restrict to ADMIN.
- [x] Return event id, type, timestamp, actor, resource, payload (redact sensitive fields); support export for compliance.

### 2. Event replay (read path)

- [x] Document how to replay events from Kafka: reset consumer group offset to point in time or beginning; run consumer to reprocess. Ensure consumers are idempotent so replay does not duplicate side effects. Use separate consumer group for replay to avoid affecting production.
- [x] Optional: tool or script to trigger replay for specific topic and offset range; with confirmation and audit log.

### 3. DLQ replay

- [x] Runbook for DLQ: inspect failed messages, fix cause (e.g. bug, schema), then replay from DLQ to main topic or re-invoke handler. Document idempotency and ordering assumptions. Do not replay without understanding failure reason.
- [x] Limit who can trigger replay; log replay actions in audit.

### 4. Verify

- [x] Query audit API with filters; run one replay in test env; document replay and DLQ process. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 45 is complete. Next: [Day 46](day-46.md) (Service mesh or advanced routing).
