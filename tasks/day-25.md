# Day 25 – Blue-green and canary deployment

**Focus:** Zero-downtime deployment strategies: blue-green and canary; traffic shift and rollback; feature-flag–driven rollout.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/10-best-practices.md](../docs/10-best-practices.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ~~⬜ Not started~~ | |
| ~~🔄 In progress~~ | |
| ✅ Done | Blue-green manifests created and deployment runbook documented. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09

---

## Checklist

### 1. Blue-green

- [x] Define blue-green for at least gateway and one critical service: two identical environments (blue, green); deploy new version to inactive env; switch traffic (Ingress or load balancer) in one step; keep previous env for instant rollback.
- [x] Document switch and rollback procedure; ensure DB migrations are backward-compatible so both versions can run briefly if needed.

### 2. Canary (optional)

- [x] Optional: canary deployment—route a small % of traffic (e.g. 5%) to new version; monitor errors and latency; gradually increase or roll back. Use service mesh (Istio) or ingress canary rules if available.
- [x] Define success criteria (error rate, p99) and automated rollback trigger (e.g. alert plus manual or auto-rollback.

### 3. Feature flags and versioning

- [x] Use feature flags to hide new behaviour until canary is stable; enable for canary cohort first. Document process: deploy with flag off → enable for canary → full rollout → remove flag.
- [x] API versioning: support v1 and v2 during transition; deprecation headers and sunset date.

### 4. Verify

- [x] Execute blue-green switch once in staging; roll back and confirm. Document in runbook. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 25 is complete. Next: [Day 26](day-26.md) (Chaos engineering and resilience drills).
