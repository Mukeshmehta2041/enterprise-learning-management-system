# Day 31 – Multi-region and DR (active-passive)

**Focus:** Design and document multi-region or active-passive DR; replication for DB and Kafka; failover runbook.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | DR strategy and runbook documented in docs/12-disaster-recovery.md. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. DR design

- [x] Document RTO/RPO targets; choose active-passive (secondary region on standby) or active-active if needed. List dependencies: PostgreSQL replication, Redis replication or failover, Kafka mirroring or multi-region cluster.
- [x] Identify data stores that must replicate (user, course, enrollment DBs); document replication lag and consistency trade-offs.

### 2. Database and state

- [x] Configure PostgreSQL streaming replication or managed cross-region replica; document failover and promotion steps. Test restore from replica.
- [x] Kafka: use MirrorMaker 2 or Confluent replicator for topic replication; document offset and consumer group handling on failover.

### 3. Failover runbook

- [x] Write runbook: when to declare DR (who decides), DNS or traffic manager switch to secondary, DB promotion, service restart in DR region, verification steps. Include rollback if primary recovers.
- [x] Schedule DR drill at least annually; record results and update runbook.

### 4. Verify

- [x] Documentation and runbook complete; one failover test (staging or planned outage) executed. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 31 is complete. Next: [Day 32](day-32.md) (Caching strategy and CDN).
