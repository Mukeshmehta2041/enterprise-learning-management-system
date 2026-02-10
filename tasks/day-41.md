# Day 41 – Anomaly detection and alerting refinement

**Focus:** Refine alerts for anomalies (error spike, latency degradation, unusual traffic); reduce noise and define escalation.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Refined alerting strategy, defined anomaly detection patterns, and documented escalation paths. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Anomaly signals

- [x] Define anomaly conditions: error rate above baseline (e.g. 2x for 5 min), p99 latency above threshold, sudden drop in throughput, Kafka consumer lag spike, DB connection pool exhaustion. Use Prometheus recording rules or Grafana alerts.
- [x] Optional: simple anomaly detection (e.g. deviation from rolling average) for business metrics (enrollments/hour, API calls).

### 2. Alert tuning

- [x] Reduce false positives: add for/sustain where appropriate; avoid alerting on known maintenance. Document each alert: what it means, likely cause, runbook link. Severity (critical, warning) and routing (page vs ticket).
- [x] Test alert by simulating condition; confirm notification and runbook are correct.

### 3. Escalation and on-call

- [x] Define escalation path: first responder, secondary, manager. Integrate with PagerDuty, Opsgenie, or Slack; ensure alert reaches on-call. Document on-call rotation and handoff.
- [x] Post-incident: update alert or runbook if alert was misleading or missing.

### 4. Verify

- [x] Trigger one critical and one warning alert; verify delivery and runbook. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 41 is complete. Next: [Day 42](day-42.md) (Localization and i18n).
