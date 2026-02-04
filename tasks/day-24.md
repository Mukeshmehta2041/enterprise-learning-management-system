# Day 24 – Kubernetes production deployment

**Focus:** Production-grade K8s manifests: Deployments, Services, Ingress, HPA, PDB; secrets and config; optional GitOps.

**References:** [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 24 is done_

---

## Checklist

### 1. Workload manifests

- [ ] Create Deployment for each service (gateway, user, auth, course, enrollment, etc.): resource requests/limits, liveness/readiness probes, env from ConfigMap/Secret. Use single namespace or split (e.g. `lms-app`, `lms-data`).
- [ ] Service (ClusterIP) for each deployment; headless if needed for stateful. Ingress for gateway with TLS and host; backend to gateway Service.

### 2. Scaling and availability

- [ ] HorizontalPodAutoscaler for gateway and core services (CPU or RPS-based); min/max replicas. PodDisruptionBudget to allow voluntary disruption without dropping all replicas (e.g. minAvailable 1).
- [ ] Consider topology spread or affinity for multi-zone; document node requirements (e.g. no Kafka on spot).

### 3. Config and secrets

- [ ] ConfigMaps for non-sensitive config (URLs, feature flags); Secrets for DB passwords, JWT keys, API keys. Prefer external secret operator or sealed secrets; never commit raw secrets.
- [ ] Document how to rotate secrets and roll pods to pick up new config.

### 4. Optional: GitOps and rollout

- [ ] Store manifests in Git; use Argo CD or Flux to sync cluster. Optional: Kustomize or Helm for env overlays (staging vs prod). Document deploy and rollback steps.
- [ ] Verify: deploy to staging K8s; run smoke tests; document production deploy process. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 24 is complete. Next: [Day 25](day-25.md) (Blue-green and canary deployment).
