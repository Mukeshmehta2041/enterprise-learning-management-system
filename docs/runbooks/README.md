# Operational Runbooks Index

This folder contains step-by-step procedures for managing the LMS system in production.

| Runbook | Description | Owner |
|---------|-------------|-------|
| [deployment.md](deployment.md) | Blue-Green deployment and traffic switching instructions | DevOps |
| [resilience-drills.md](resilience-drills.md) | Chaos Engineering scenarios and how to run drills | Resilience |
| [incident-response.md](incident-response.md) | Standard Operating Procedure (SOP) for handling production incidents | Ops |
| [disaster-recovery.md](disaster-recovery.md) | Backup, restore, and multi-region failover procedures | DevOps |
| [go-live-playbook.md](go-live-playbook.md) | Pre-flight check and day-0 release steps | Release |
| [ops-runbook.md](ops-runbook.md) | General day-to-day operations (DB tuning, cache clearing) | Platform |

---

## Escalation

1. Check Grafana/Kibana for symptoms.
2. Follow the relevant runbook above.
3. If issue persists > 15 mins, escalate to the #incident-war-room channel.
