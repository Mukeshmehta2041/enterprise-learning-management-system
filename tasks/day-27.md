# Day 27 – Usage metering and cost visibility

**Focus:** Meter API usage, enrollments, and storage; expose metrics for billing or cost allocation; dashboards and alerts.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 27 is done_

---

## Checklist

### 1. Business metrics

- [ ] Emit or aggregate metrics: API calls per user/tenant, enrollments per course/period, active users (DAU/MAU), storage or content size. Use Prometheus counters/gauges or push to analytics store.
- [ ] Ensure metrics are labeled by tenant/org if multi-tenant for cost allocation; avoid high-cardinality labels that blow up storage.

### 2. Dashboards and reports

- [ ] Grafana (or equivalent) dashboards: usage over time, top courses by enrollment, API usage by service and status. Optional: export to CSV or report API for finance/admin.
- [ ] Alerts when usage spikes anomalously (e.g. abuse or unexpected load).

### 3. Billing and quotas

- [ ] If billing: feed usage into billing system or store for invoice generation (e.g. enrollments per plan, API overage). Document how metering ties to plans and overage rules.
- [ ] Quota enforcement (from Day 23) should use same or linked counters where possible.

### 4. Verify

- [ ] Dashboards show correct counts; test user/course usage appears; document how to interpret and use for cost/billing. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 27 is complete. Next: [Day 28](day-28.md) (API v2 and backward compatibility).
