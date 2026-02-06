# Day 22 – Webhooks and external integrations

**Focus:** Outbound webhooks for domain events (enrollment, payment, grade); signing, retries, and idempotency for subscribers.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Webhooks implemented with signing, retries and history. |

**Started:** February 6, 2026
**Completed:** February 6, 2026

---

## Checklist

### 1. Webhook design

- [x] Define webhook events and payload schema: e.g. `enrollment.created`, `payment.completed`, `assignment.graded`. Include event id, timestamp, resource type and id, and relevant payload; no sensitive secrets.
- [x] Document subscription model: how integrators register endpoint URL and select events; store in DB (webhook_subscriptions) with secret for signing.

### 2. Delivery and signing

- [x] Implement delivery service: on Kafka event (or from service), fan out to subscribed endpoints. Sign payload (e.g. HMAC) with subscriber secret; send `X-Webhook-Signature` and `X-Webhook-Id` for idempotency.
- [x] Use retries with backoff (e.g. 3–5 attempts); on failure send to DLQ or mark subscription as failing; optional dead-letter notification to owner.

### 3. Idempotency and security

- [x] Subscribers can deduplicate by `X-Webhook-Id`. Do not send PII beyond what is necessary; allow per-event type filtering. Validate callback URLs (e.g. HTTPS only, no internal IPs).
- [x] Admin API to list subscriptions, view delivery history, and disable subscription.

### 4. Verify

- [x] Register test endpoint; trigger event and confirm delivery with valid signature; simulate failure and confirm retry/DLQ. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 22 is complete. Next: [Day 23](day-23.md) (Rate limiting and quota per tenant/user).
