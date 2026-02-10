# Anomaly Detection & Alerting Refinement

## Overview
As the LMS matures, simple static thresholds for alerting (e.g., "Error rate > 5%") can lead to alert fatigue or missed subtle issues. This document outlines our transition towards **Anomaly Detection** and refined alerting strategies to improve signal-to-noise ratios and responder efficiency.

## 1. Anomaly Detection Strategy

### Dynamic Thresholds
Instead of fixed values, we use Prometheus recording rules to calculate baselines (e.g., 7-day average) and alert when the current value deviates significantly.

**Prometheus recording rule example:**
```yaml
- record: service:request_error_rate:rate5m
  expr: rate(http_server_requests_total{status=~"5.."}[5m]) / rate(http_server_requests_total[5m])

- record: service:request_error_rate:avg_7d
  expr: avg_over_time(service:request_error_rate:rate5m[7d])
```

**Alert rule for anomaly:**
```yaml
- alert: HighErrorRateAnomaly
  expr: service:request_error_rate:rate5m > (service:request_error_rate:avg_7d * 2)
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High error rate anomaly detected on {{ $labels.service }}"
    description: "Current error rate is twice the 7-day average."
```

### Business Metric Anomalies
We monitor business-critical metrics for sudden drops that might indicate silent failures (e.g., a broken payment UI that doesn't trigger backend 500s).
- **Enrollment Drop:** Alert if `lms_enrollments_total` rate drops by >50% compared to same hour/day last week.
- **Payment Success Rate:** Alert if `lms_payments_total{status="SUCCESS"}` ratio drops significantly.

## 2. Alert Refinement (Noise Reduction)

### Alert Grouping
AlertManager is configured to group related alerts into a single notification to avoid "storming" the on-call responder.
- **Group by:** `service`, `cluster`, `env`.
- **Inhibition rules:** If the `ClusterDown` alert is active, suppress all `ServiceDown` alerts for that cluster.

### Alert Severity & Routing
- **Critical (P1):** Immediate action required. Routed to SMS/PagerDuty. (e.g., Database unavailable, Gateway 502 spike).
- **Warning (P2):** Needs attention within business hours. Routed to Slack/Email. (e.g., High memory usage, high Kafka lag).
- **Info (P3):** Interesting but non-actionable. No notification, just visible on dashboards.

## 3. Runbooks
Every alert must include a `runbook_url` in its annotations. A runbook should follow this template:
1. **Description:** What does this alert mean?
2. **Impact:** What is the user experience?
3. **Common Causes:** Previous occurrences and their roots.
4. **Resolution Steps:** Commands to run, logs to check, services to restart.
5. **Escalation:** Who to contact if resolution fails.

## 4. On-Call Escalation Path
1. **Tier 1 (Responder):** Primary on-call engineer (15 min SLA).
2. **Tier 2 (Secondary):** Secondary on-call engineer (30 min SLA if Tier 1 ignores).
3. **Tier 3 (Lead/Manager):** Escalation point for major incidents.

## 5. Continuous Improvement
- **Weekly Alert Audit:** Review all alerts triggered. If >50% were "silent/ignored," the alert is noisy and must be re-tuned or deleted.
- **Post-Mortems:** Any P1 incident requires a post-mortem to determine if an alert was missing or if existing alerts could have given earlier warning.
