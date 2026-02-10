# Day 38 – Database read replicas and read scaling

**Focus:** Use read replicas for read-heavy services; routing read vs write; replication lag handling and health checks.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented dynamic datasource routing in lms-common and configured Course Service with primary/replica support. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Replica setup

- [x] Configure PostgreSQL read replica(s) (managed or self-hosted); ensure replication is streaming and lag is monitored. Document promotion to primary in DR runbook.
- [x] Separate datasource URLs: primary (write) and replica (read); or use provider that supports read/write splitting (e.g. RDS read endpoint, PgBouncer with routing).

### 2. Application routing

- [x] In Course and Enrollment services (and others with read-heavy traffic): route read-only queries to replica datasource. Use `@Transactional(readOnly = true)` and datasource routing (Spring abstract routing or two DataSources) so writes go to primary.
- [x] List courses, get course, list enrollments, get progress: read from replica. Create/update/delete: write to primary.

### 3. Replication lag

- [x] Monitor replica lag (e.g. Prometheus); alert when lag exceeds threshold (e.g. 5s). Optional: after write, use primary for next read of same resource (read-your-writes) for critical paths; document eventual consistency for list views.
- [x] Health check: replica must be available and lag within limit for readiness; otherwise fail readiness to avoid serving stale data if strict consistency required.

### 4. Verify

- [x] Run read traffic against replica and write to primary; confirm no write to replica. Measure lag and document behaviour. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 38 is complete. Next: [Day 39](day-39.md) (A/B testing infrastructure).
