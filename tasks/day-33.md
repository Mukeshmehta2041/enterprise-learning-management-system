# Day 33 – Batch jobs and scheduled tasks

**Focus:** Scheduled jobs for cleanup, reports, and async processing; idempotency and observability; avoid overlapping runs.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/04-database.md](../docs/04-database.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 33 is done_

---

## Checklist

### 1. Job types

- [ ] Identify batch needs: token/refresh cleanup, audit log archival, report generation (daily enrollment summary), reminder emails, DLQ replay or alert. Implement with Spring `@Scheduled`, Quartz, or separate worker service.
- [ ] Each job: single responsibility, idempotent where possible, and bounded (paginate or limit scope) to avoid long-running transactions.

### 2. Scheduling and locking

- [ ] Use distributed lock (Redis or DB) so only one instance runs a job in a multi-replica deployment; release lock on completion or timeout. Document cron expression and timezone.
- [ ] Optional: use job scheduler (e.g. SchedulerX, Temporal) for complex DAGs or cross-service jobs.

### 3. Observability

- [ ] Log job start, end, and outcome (success, rows processed, errors); expose metrics (job duration, success/failure count). Alert on job failure or prolonged duration.
- [ ] Do not log PII in job logs; use job id for correlation.

### 4. Verify

- [ ] Run each job manually and on schedule; confirm no duplicate work with multiple replicas; alerts fire on failure. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 33 is complete. Next: [Day 34](day-34.md) (Reporting and exports).
