# Deployment Runbook

This document describes the procedures for zero-downtime deployments using Blue-Green and Canary strategies in the LMS project.

## Blue-Green Deployment (Standard K8s)

### Strategy Overview
1.  Maintain two identical deployments: `blue` (current) and `green` (new).
2.  Deploy the new version to the `green` environment.
3.  Perform smoke tests on the `green` version via a temporary service or port-forward.
4.  Switch the production Service selector to point to `green`.
5.  Keep `blue` running for a period for instant rollback if needed.
6.  Decommission `blue` once stability is confirmed.

### Traffic Shift Procedure

To shift traffic from Blue to Green:
```bash
kubectl patch service lms-user-service -n lms -p '{"spec":{"selector":{"app":"lms-user-service","version":"green"}}}'
```

### Rollback Procedure

To shift traffic back to Blue:
```bash
kubectl patch service lms-user-service -n lms -p '{"spec":{"selector":{"app":"lms-user-service","version":"blue"}}}'
```

## Canary Deployment (NGINX Ingress)

### Strategy Overview
1.  Deploy a second, smaller deployment (the Canary) alongside the production version.
2.  Route a small percentage of traffic to the Canary using Ingress annotations.
3.  Monitor metrics (error rate, latency) for both versions.
4.  Gradually increase Canary traffic until it reaches 100%, then update the main deployment and remove the Canary.

### Example Ingress Annotation for 10% Canary:
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: lms-gateway-canary
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "10"
...
```

## Database Migrations (Liquibase/Flyway)

All migrations MUST be backward-compatible (N+1 compatibility).
-   **Safe:** Adding a column, creating a new table, adding an index.
-   **Unsafe:** Renaming a column, deleting a column, changing a column type.
-   **Procedure:** 
    1.  Add new column/field.
    2.  Deploy new code that writes to both or transitionally.
    3.  Data migration for old records.
    4.  Update code to use only new column.
    5.  Remove old column in a later release.
