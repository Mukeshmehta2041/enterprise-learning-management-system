# 5. Events and Kafka

## Topic Summary

| Topic | Partitions | Key | Producers | Consumers | Retention |
|-------|------------|-----|-----------|-----------|-----------|
| `user.events` | 12 | userId | User Service | Notification, Analytics, Search (if needed) | 7d |
| `course.events` | 24 | courseId | Course Service | Enrollment, Search, Analytics, Notification | 7d |
| `enrollment.events` | 24 | enrollmentId | Enrollment Service | Notification, Analytics, Payment | 7d |
| `content.events` | 24 | contentId | Content Service | Search, Analytics | 7d |
| `assignment.events` | 24 | assignmentId | Assignment Service | Notification, Analytics | 7d |
| `payment.events` | 12 | paymentId | Payment Service | Enrollment (unlock), Notification, Analytics | 14d |
| `notification.requests` | 12 | userId | Any service | Notification Service | 1d |
| `dlq.<source_topic>` | 6 | original key | Consumers (on failure) | Ops / replay | 14d |

## Canonical Event Envelope

Every event message should follow a single envelope shape so consumers can parse generically:

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | UUID | Unique per event; used for idempotency. |
| `eventType` | string | e.g. `UserCreated`, `CoursePublished`. |
| `aggregateId` | string | ID of the entity (user id, course id, etc.). |
| `version` | int | Schema version of the payload. |
| `timestamp` | ISO-8601 | When the event occurred. |
| `payload` | JSON | Domain-specific data. |
| `metadata` | object | Optional: `source` (service name), `traceId`, `userId`. |

**Example:**

```json
{
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "eventType": "EnrollmentCreated",
  "aggregateId": "enrollment-uuid",
  "version": 1,
  "timestamp": "2025-02-03T10:00:00Z",
  "payload": {
    "enrollmentId": "enrollment-uuid",
    "userId": "user-uuid",
    "courseId": "course-uuid",
    "status": "ACTIVE"
  },
  "metadata": {
    "source": "enrollment-service",
    "traceId": "abc123"
  }
}
```

## Event Types (Examples)

| Domain | Event types |
|--------|-------------|
| User | `UserCreated`, `UserUpdated`, `UserDeactivated`, `RoleAssigned` |
| Course | `CourseCreated`, `CoursePublished`, `CourseUpdated`, `ModuleAdded` |
| Enrollment | `EnrollmentCreated`, `EnrollmentCompleted`, `ProgressUpdated` |
| Content | `ContentPublished`, `ContentVersionAdded` |
| Assignment | `AssignmentCreated`, `SubmissionReceived`, `AssignmentGraded` |
| Payment | `PaymentCompleted`, `PaymentFailed`, `InvoiceCreated` |

## Idempotency (Consumers)

- **Key:** Store `eventId` (and optionally consumer group/consumer id) so the same event is not processed twice.
- **Storage:** Redis preferred: key `idem:{consumerName}:{eventId}`, value e.g. `1`, TTL 24h. Alternatively a DB table with unique constraint on `(consumer_id, event_id)`.
- **Logic:** Before processing, check if `eventId` is already seen. If yes, skip (and optionally ack). If no, process then record `eventId`.

## Retry and Dead-Letter Queue (DLQ)

- **Retries:** On processing failure, retry up to 3 times with exponential backoff (e.g. 1s, 2s, 4s).
- **After max retries:** Publish the same message (or envelope + failure reason) to `dlq.<source_topic>` (e.g. `dlq.enrollment.events`). Then acknowledge the original message so the consumer does not block.
- **DLQ consumer:** Log, alert, and optionally support manual replay or repair. Retention 14d.

## MVP (Phase 1) Simplification

- You can start with a single topic `lms.events` and route by `eventType` or a `domain` field. When scaling, split into per-domain topics as in the table above.
