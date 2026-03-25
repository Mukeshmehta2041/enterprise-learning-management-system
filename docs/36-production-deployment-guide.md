# 36. Production Deployment Guide (Helm + ArgoCD)

This guide is the production-ready deployment flow for LMS backend and optional frontend in Kubernetes.

## 1) Prerequisites

- Kubernetes cluster with ingress controller (Nginx or compatible).
- ArgoCD installed and connected to this repository.
- Container registry credentials configured in cluster as `ghcr-secret`.
- DNS and TLS prepared for production hosts.
- External Secrets Operator installed (recommended for production).

## 2) Required Kubernetes Resources

Create production namespace:

```bash
kubectl create namespace lms-production
```

Create image pull secret (if not already present):

```bash
kubectl -n lms-production create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username="${GHCR_USERNAME}" \
  --docker-password="${GHCR_TOKEN}" \
  --docker-email="${GHCR_EMAIL}"
```

## 3) External Secrets Setup (Recommended)

The chart supports two modes:

- `externalSecrets.enabled=true`: secrets come from external secret store.
- `externalSecrets.enabled=false`: chart renders static Kubernetes Secret from values.

For production, use external secrets.

Example `ClusterSecretStore` (AWS Secrets Manager shown as reference; adjust for your provider):

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ClusterSecretStore
metadata:
  name: lms-cluster-secret-store-prod
spec:
  provider:
    aws:
      service: SecretsManager
      region: ap-south-1
      auth:
        secretRef:
          accessKeyIDSecretRef:
            name: awssm-creds
            key: access-key
            namespace: external-secrets
          secretAccessKeySecretRef:
            name: awssm-creds
            key: secret-access-key
            namespace: external-secrets
```

Update [infra/helm/lms-backend/values-production.yaml](infra/helm/lms-backend/values-production.yaml) to point to your store and remote keys.

## 4) Production Values Checklist

Verify [infra/helm/lms-backend/values-production.yaml](infra/helm/lms-backend/values-production.yaml):

- Ingress hosts and TLS secret names are correct.
- `externalSecrets.enabled: true` and secret mappings are valid.
- Resource requests/limits fit expected load.
- Dependency persistence (`storageSize`, `storageClassName`) is set for your cluster.
- Frontend section enabled only if you deploy frontend in-cluster.

## 5) Validate Helm Before Deploy

```bash
helm lint infra/helm/lms-backend
helm template lms-backend-prod infra/helm/lms-backend \
  -f infra/helm/lms-backend/values-production.yaml \
  --set global.imageTag=v1.0.0 >/tmp/lms-prod-rendered.yaml
```

## 6) CI/CD and Release Flow

1. Build and push backend images via backend release workflow.
2. Build and push frontend image via frontend release workflow (if frontend enabled).
3. Trigger Kubernetes deploy workflow with release tag (e.g., `v1.0.0`).
4. ArgoCD syncs production app with `global.imageTag=<tag>`.

Workflow files:

- [backend-release.yml](.github/workflows/backend-release.yml)
- [frontend-release.yml](.github/workflows/frontend-release.yml)
- [deploy-k8s.yml](.github/workflows/deploy-k8s.yml)

## 7) Post-Deploy Verification

Automated gates in pipeline:

- ArgoCD sync + health verification.
- Deployment readiness checks for critical services.
- Endpoint checks.
- Probe validation on gateway.
- Smoke tests and optional Prometheus SLO checks.

Manual spot checks:

```bash
kubectl get pods -n lms-production
kubectl get ingress -n lms-production
kubectl logs -n lms-production -l app.kubernetes.io/name=lms-gateway --tail=100
```

## 8) Rollback Procedure

- Preferred: ArgoCD rollback to previous successful revision.
- Alternative: redeploy previous image tag through deploy workflow input.

Example (ArgoCD CLI):

```bash
argocd app history <production-app-name>
argocd app rollback <production-app-name> <history-id>
```

## 9) Security and Reliability Notes

- Non-root runtime is used for backend containers.
- Rolling updates and readiness probes are enabled.
- PDBs and NetworkPolicies are enabled for app and dependencies.
- Externalized secrets are recommended for production.

## 10) Known Limits / Next Hardening

- Current dependency NetworkPolicy allows same-namespace egress; tighten to explicit destinations if your platform requires stricter zero-trust controls.
- For mission-critical persistence, consider managed PostgreSQL/Kafka/Elasticsearch outside the app chart.
