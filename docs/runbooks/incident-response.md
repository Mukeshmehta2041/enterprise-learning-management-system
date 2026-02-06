# LMS Incident Response Playbook

## 1. Detection
Incidents are detected via:
- **Grafana Alerts**: CPU/Memory spikes, high error rates.
- **Sentry/Logging**: Sudden influx of `ForbiddenException` or `ResourceNotFoundException`.
- **Customer Support**: Reports of "system down".

## 2. Severity Levels
- **P0 (Critical)**: Full system outage, data loss, or security breach.
- **P1 (High)**: Major functionality broken (e.g., Cannot enroll, Payment failing).
- **P2 (Medium)**: Degraded performance, minor features broken.

## 3. Immediate Actions (Triage)
1. **Verify Magnitude**: Is it one user, one service, or the whole system?
2. **Assign Incident Commander (IC)**: One person to coordinate communications.
3. **Capture State**: Export logs and metrics before taking destructive actions (like restarts).

## 4. Remediation Strategies
- **Connectivity Issue**: Check Redis/Kafka health via `/actuator/health`.
- **Performance Degradation**: Hot-toggle feature flags (Day 18) to disable heavy features.
- **Data Corruption**: Use the [Disaster Recovery Runbook](disaster-recovery.md) for restore steps.
- **Security Breach**: Rotate JWT Secrets immediately and invalidate all sessions.

## 5. Post-Mortem
For every P0/P1 incident:
- Document the root cause.
- Create Jira/Tasks for long-term fixes.
- Update this playbook with new learnings.
