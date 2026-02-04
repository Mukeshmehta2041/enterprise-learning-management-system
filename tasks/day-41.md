# Day 41 – Anomaly detection and alerting refinement

**Focus:** Refine alerts for anomalies (error spike, latency degradation, unusual traffic); reduce noise and define escalation.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 41 is done_

---

## Checklist

### 1. Anomaly signals

- [ ] Define anomaly conditions: error rate above baseline (e.g. 2x for 5 min), p99 latency above threshold, sudden drop in throughput, Kafka consumer lag spike, DB connection pool exhaustion. Use Prometheus recording rules or Grafana alerts.
- [ ] Optional: simple anomaly detection (e.g. deviation from rolling average) for business metrics (enrollments/hour, API calls).

### 2. Alert tuning

- [ ] Reduce false positives: add for/sustain where appropriate; avoid alerting on known maintenance. Document each alert: what it means, likely cause, runbook link. Severity (critical, warning) and routing (page vs ticket).
- [ ] Test alert by simulating condition; confirm notification and runbook are correct.

### 3. Escalation and on-call

- [ ] Define escalation path: first responder, secondary, manager. Integrate with PagerDuty, Opsgenie, or Slack; ensure alert reaches on-call. Document on-call rotation and handoff.
- [ ] Post-incident: update alert or runbook if alert was misleading or missing.

### 4. Verify

- [ ] Trigger one critical and one warning alert; verify delivery and runbook. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 41 is complete. Next: [Day 42](day-42.md) (Localization and i18n).
