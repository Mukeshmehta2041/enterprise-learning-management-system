# Day 9 – Notification, Payment, Analytics services

**Focus:** Notification Service (Kafka consumer, email/in-app); Payment Service (mock gateway, idempotency); Analytics Service (event sink, aggregates).

**References:** [docs/04-database.md](../docs/04-database.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 9 is done_

---

## Checklist

### 1. Notification Service

- [ ] **lms-notification-service**: Consume domain events from Kafka (user, course, enrollment, assignment, etc.); for relevant event types send email (mock or SMTP) and/or store in-app notifications. Expose API: list in-app notifications, mark read. No DB required for MVP or use simple store for in-app list.

### 2. Payment Service

- [ ] **lms-payment-service**: Schema `lms_payment` (plans, invoices, payments); idempotency key on payment creation. Mock payment gateway: create payment intent, webhook handler that marks paid. Publish `payment.events` (PaymentCompleted, etc.). REST: list plans, create checkout, webhook endpoint.

### 3. Analytics Service

- [ ] **lms-analytics-service**: Consume all domain events; store event snapshots and/or aggregates (e.g. by course, by user, daily/weekly). Expose reports API (admin/instructor): enrollments over time, completion rates, etc.

### 4. RBAC and API versioning

- [ ] Enforce RBAC per [07-security.md](../docs/07-security.md) in services that need it (resource-level: e.g. instructor of course). Add API versioning and deprecation headers per [03-api-gateway.md](../docs/03-api-gateway.md) where applicable.

### 5. Verify

- [ ] Trigger event (e.g. enrollment); notification sent or stored; payment flow (mock) completes; analytics shows event. Update Progress when done.

---

## Done?

Next: [Day 10](day-10.md) (Observability and resilience).
