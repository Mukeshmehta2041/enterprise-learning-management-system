# Event Replay & Audit Trail Query

## Overview
The LMS uses an event-driven architecture, making events the source of truth for many state changes. This document outlines how we query the audit trail and perform safe event replays for recovery and data consistency.

## 1. Audit Trail Query API
An administrative API is provided to query historical events for auditing and troubleshooting purposes.

- **Endpoint:** `GET /api/v1/admin/events`
- **Filters:** `startTime`, `endTime`, `eventType`, `userId`, `aggregateId`, `tenantId`.
- **RBAC:** Requires `ROLE_ADMIN` or `ROLE_AUDITOR`.

### Data Source
- **Short-term:** Kafka topics (retained for 7 days).
- **Long-term:** Immutable **Audit Table** in the analytics database (Day 25), populated via a Kafka Connect sink or dedicated consumer.

## 2. Event Replay Strategy

### Why Replay?
1. **Recovery:** Reprocess events after a bug fix in a consumer.
2. **Rehydration:** Build a new read model or service that needs historical data.
3. **Recovery from Failure:** Reprocessing events that ended up in the Dead Letter Queue (DLQ).

### Safe Replay Procedure
1. **Idempotency:** All consumers MUST be idempotent. Replaying the same event twice should not lead to duplicate side effects (e.g., charging a payment twice).
2. **Consumer Group Management:** Use a *new* consumer group ID for replays to avoid disrupting the production consumer's current offset.
3. **Offset Reset:** Use `kafka-consumer-groups --reset-offsets --to-datetime ...` or a custom admin tool.

## 3. Dead Letter Queue (DLQ) Management
Events that fail processing after N retries are moved to a DLQ (e.g., `lms-course-events-dlq`).

### DLQ Handling Loop
1. **Inspect:** Analyze the DLQ to identify the failure pattern (e.g., NullPointerException).
2. **Fix:** Deploy a fix to the consumer service.
3. **Reprocess:** Trigger a replay from the DLQ back to the main topic or directly to the consumer's internal retry queue.
4. **Log:** All DLQ replay actions must be logged in the audit trail.

## 4. Replay Limitations
- **Ordering:** Replaying events might violate strict ordering if external state has changed.
- **Side Effects:** Be careful with external integrations (e.g., sending emails) during replay. Disable notifications during bulk replays.
