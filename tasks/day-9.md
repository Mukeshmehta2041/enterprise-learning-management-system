# Day 9 – Notification, Payment, Analytics services

**Focus:** Notification Service (Kafka consumer, email/in-app); Payment Service (mock gateway, idempotency); Analytics Service (event sink, aggregates).

**References:** [docs/04-database.md](../docs/04-database.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | All three services implemented with Kafka integration, RBAC enforcement, and database schemas |

**Started:** 5 Feb 2026  
**Completed:** 5 Feb 2026

---

## Checklist

### 1. Notification Service

- [x] **lms-notification-service**: Consume domain events from Kafka (user, course, enrollment, assignment, etc.); for relevant event types send email (mock or SMTP) and/or store in-app notifications. Expose API: list in-app notifications, mark read. No DB required for MVP or use simple store for in-app list.
  - Kafka consumer on topics: user.events, enrollment.events, assignment.events, payment.events, course.events
  - Redis-backed in-app notification store
  - Email mock support with SMTP configuration
  - REST endpoints: GET /api/v1/notifications/user/{userId}, POST /{notificationId}/read

### 2. Payment Service

- [x] **lms-payment-service**: Schema `lms_payment` (plans, invoices, payments); idempotency key on payment creation. Mock payment gateway: create payment intent, webhook handler that marks paid. Publish `payment.events` (PaymentCompleted, etc.). REST: list plans, create checkout, webhook endpoint.
  - PostgreSQL schema with payment_plans and payments tables
  - Unique idempotency key to prevent duplicate payments
  - Mock payment gateway with 95% success rate simulation
  - Payment status tracking: PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
  - REST endpoints: GET /api/v1/payments/plans, POST /api/v1/payments, POST /webhook/completed
  - Publishes PaymentCompleted events to Kafka

### 3. Analytics Service

- [x] **lms-analytics-service**: Consume all domain events; store event snapshots and/or aggregates (e.g. by course, by user, daily/weekly). Expose reports API (admin/instructor): enrollments over time, completion rates, etc.
  - Kafka consumer aggregating all domain events
  - Event snapshots stored with event_snapshots table
  - Enrollment aggregates tracked by course and date
  - REST endpoint: GET /api/v1/analytics/enrollments?courseId={id}&date={date}
  - Tracks total, active, and completed enrollments per course per day

### 4. RBAC and API versioning

- [x] Enforce RBAC per [07-security.md](../docs/07-security.md) in services that need it (resource-level: e.g. instructor of course). Add API versioning and deprecation headers per [03-api-gateway.md](../docs/03-api-gateway.md) where applicable.
  - Created RBACEnforcer utility in lms-common
  - UserContext model for authentication/authorization
  - Resource-level checks:
    - Payment: Users can only create payments for themselves
    - Notifications: Users can only view their own notifications
    - Analytics: Only ADMIN and INSTRUCTOR roles can access
  - ApiVersion utility and ApiVersionInterceptor for API versioning
  - Deprecation header support with Sunset and Warning headers

### 5. Verify

- [x] Trigger event (e.g. enrollment); notification sent or stored; payment flow (mock) completes; analytics shows event. Update Progress when done.
  - Database schemas created in init-db script
  - Sample payment plans seeded (BASIC, PRO, ENTERPRISE)
  - All services added to docker-compose-dev.yml with proper dependencies
  - Kafka topic integration validated across all three services

---

## Implementation Details

### Services Created

1. **lms-notification-service** (port 8084)
   - EventConsumer: Listens on Kafka topics
   - NotificationService: Handles event routing and notification dispatch
   - InAppNotification: Model for Redis-backed notifications
   - Supports: UserCreated, EnrollmentCreated, AssignmentSubmitted, PaymentCompleted events

2. **lms-payment-service** (port 8085)
   - PaymentService: Core payment business logic with idempotency
   - MockPaymentGateway: Simulates payment processing
   - Payment & PaymentPlan entities with JPA
   - Publishes PaymentCompleted events to Kafka

3. **lms-analytics-service** (port 8086)
   - AnalyticsEventConsumer: Event aggregation
   - AnalyticsService: Aggregate calculations
   - EventSnapshot & EnrollmentAggregate entities
   - Daily rollups by course and enrollment status

### Database Changes

Added schemas and tables in infra/docker/init-db/01-init.sql:
- lms_payment schema with payment_plans and payments tables
- lms_analytics schema with event_snapshots and enrollment_aggregates tables
- Sample payment plans inserted

### Docker Compose Updates

Added three new service containers:
- lms-notification-service (depends on redis, kafka)
- lms-payment-service (depends on postgres, kafka)
- lms-analytics-service (depends on postgres, kafka)
