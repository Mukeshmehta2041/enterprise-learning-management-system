# Day 43 – Cost optimization and rightsizing

**Focus:** Review resource usage; rightsize instances and pools; reserved capacity and spot where appropriate; cost dashboards.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 43 is done_

---

## Checklist

### 1. Resource review

- [ ] Collect CPU, memory, and connection usage per service (Prometheus or cloud metrics). Identify over-provisioned: consistently low utilization; under-provisioned: near limit or throttling. Adjust requests/limits in K8s or instance sizes.
- [ ] DB: review connection pool usage and max_connections; right-size instance. Redis: memory and connection usage; eviction policy and TTLs to avoid unbounded growth.

### 2. Reserved and spot

- [ ] For stable baseline load: use reserved instances or committed use for DB and core services to reduce cost. For batch or non-critical workers: consider spot/preemptible with graceful shutdown and retry.
- [ ] Document which workloads are spot-eligible and recovery procedure.

### 3. Cost visibility

- [ ] Tag resources by service, env, and tenant; feed to cost allocation or billing. Dashboard: cost by service, trend over time; alert on unexpected spike.
- [ ] Review storage: retention policy for logs, backups, and Kafka; archive or delete per policy.

### 4. Verify

- [ ] Apply rightsizing changes in staging; validate performance. Document cost baseline and review cadence. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 43 is complete. Next: [Day 44](day-44.md) (Compliance and certification prep).
