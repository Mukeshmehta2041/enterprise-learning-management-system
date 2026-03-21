# Kubernetes Deployment Assets

This directory contains GitOps-oriented deployment assets for the backend services.

## Structure

- `helm/lms-backend/`: Helm chart for gateway + backend microservices.
- `argocd/app-staging.yaml`: ArgoCD Application manifest for staging.
- `argocd/app-production.yaml`: ArgoCD Application manifest for production.

## Required GitHub Secrets for deploy workflow

- `ARGOCD_SERVER`
- `ARGOCD_AUTH_TOKEN`
- `ARGOCD_APP_STAGING`
- `ARGOCD_APP_PRODUCTION`

## Workflow behavior

- `.github/workflows/deploy-k8s.yml` validates Helm templates for staging and production.
- On semantic tags (`v*.*.*`), the workflow syncs staging first and then production.
- Image tag is injected dynamically via `global.imageTag` Helm value.

## Pre-flight checklist

1. Replace `repoURL` placeholders in ArgoCD application manifests.
2. Create ArgoCD applications in cluster:
   - `kubectl apply -f infra/argocd/app-staging.yaml`
   - `kubectl apply -f infra/argocd/app-production.yaml`
3. Ensure ArgoCD token has `app get`, `app set`, `app sync`, and `app wait` permissions.
4. Ensure images are published to `global.imageRegistry` path in Helm values.
