# Day 46 – Service mesh or advanced routing (optional)

**Focus:** Evaluate or adopt service mesh (Istio, Linkerd) for mTLS, advanced traffic routing, and observability; or implement gateway-level routing rules.

**References:** [docs/09-devops.md](../docs/09-devops.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Evaluated service mesh options and documented the selection of Istio for mTLS and advanced traffic management. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Evaluation

- [x] Decide if service mesh is required: mTLS between services, canary routing, retry/timeout at mesh level, or standard observability. If not required, document decision and rely on gateway + app-level resilience.
- [x] If evaluating: pilot in staging with one or two services; measure overhead (latency, resource) and operational complexity.

### 2. mTLS and routing

- [x] If mesh adopted: enable mTLS for service-to-service; gateway to service can stay TLS termination at gateway. Configure VirtualService or equivalent for canary (subset by label) and retry/timeout.
- [x] Document how to add new service to mesh and how to debug (access logs, trace).

### 3. Observability and ops

- [x] Use mesh telemetry (if any) for span and metrics; correlate with app metrics. Ensure certificate rotation and lifecycle are automated; document troubleshooting (e.g. cert expiry).
- [x] Optional: fault injection for chaos (delay, abort) via mesh for testing.

### 4. Verify

- [x] If mesh in use: deploy and verify mTLS and one routing rule; run smoke tests. Document mesh architecture. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 46 is complete. Next: [Day 47](day-47.md) (Post-launch review and iteration backlog).
