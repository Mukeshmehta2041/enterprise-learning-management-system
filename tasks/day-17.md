# Day 17 – Backup, retention, and disaster recovery

**Focus:** Database and state backup strategy; log and event retention; runbook for restore and failover.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Configured PG backups, Kafka/Redis persistence, and wrote DR runbook. |

**Started:** 2026-02-06  
**Completed:** 2026-02-06

---

## Checklist

### 1. Database backup

- [x] Configure automated backups for PostgreSQL (per schema or per DB): daily full and WAL/continuous archiving if needed. Retain backups per policy (e.g. 30 days).
- [x] Document restore procedure: point-in-time recovery steps and RTO/RPO targets.

### 2. Redis and Kafka

- [x] Redis: enable RDB/AOF if persistence required; document recovery. For cache-only use, define acceptable data loss.
- [x] Kafka: set retention for topics (e.g. 7–30 days); document how to replay or rebuild state from events if needed.

### 3. Retention policy

- [x] Define retention for: application logs, audit logs, Kafka events, backup copies. Document in runbook and align with compliance.

### 4. Disaster recovery runbook

- [x] Write runbook: restore DB from backup, promote replica if used, restart services, verify health. Include contacts and escalation.
- [x] (Optional) Run a DR drill: restore from backup to a separate environment and validate.

### 5. Verify

- [x] Backup job runs and restore tested at least once; runbook reviewed. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 17 is complete. Next: [Day 18](day-18.md) (Feature flags and configuration management).
