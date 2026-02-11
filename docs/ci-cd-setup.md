# LMS CI/CD Setup Guide

This document describes the CI/CD pipeline, required secrets, and how to configure deployment.

## Overview

The pipeline ([`.github/workflows/ci-cd.yml`](../.github/workflows/ci-cd.yml)) provides:

- **Change detection**: Only build, test, and deploy components that changed
- **Backend**: Selective Maven build/test, Docker images to AWS ECR, blue-green deploy to Kubernetes
- **Frontend**: Build, deploy to S3, CloudFront invalidation
- **Blue-green deployments**: Zero-downtime rollouts for backend services

## Triggers

- **Push** to `main`: Full CD pipeline (build, Docker push to ECR, K8s deploy, frontend S3/CloudFront)
- **Pull request** to `main`: See [pr-ci.yml](../.github/workflows/pr-ci.yml) for build and test only (change-tracked, no deploy)
- **Manual**: `workflow_dispatch` on ci-cd.yml for on-demand deploys

## Change Detection

Uses [dorny/paths-filter](https://github.com/dorny/paths-filter) to detect changes:

- `lms-common/` or `pom.xml` → Full backend rebuild (all services)
- `lms-gateway/**` → Gateway only
- `services/lms-{service}/**` → That service only
- `frontend/**` → Frontend only
- `mobile/**` → Mobile (Expo/React Native) app
- `k8s/**` → Deployment manifests

## Required Secrets

Configure in **Settings → Secrets and variables → Actions**:

| Secret | Required | Description |
|--------|----------|-------------|
| `AWS_ACCESS_KEY_ID` | For deploy | AWS credentials for ECR, S3, CloudFront |
| `AWS_SECRET_ACCESS_KEY` | For deploy | AWS secret key |
| `ECR_REGISTRY` | For ECR push | e.g. `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `KUBE_CONFIG` or `KUBECONFIG` | For K8s deploy | Base64-encoded kubeconfig for VPS cluster |
| `S3_BUCKET` | For frontend deploy | S3 bucket name for static assets |
| `CLOUDFRONT_DISTRIBUTION_ID` | Optional | For cache invalidation after frontend deploy |
| `STAGING_URL` | Optional | URL for smoke tests after deploy |
| `EXPO_TOKEN` | For mobile EAS | Expo access token for EAS Build (`eas login` then create token) |
| `AWS_REGION` | Optional | Default: `us-east-1` |

## Optional Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL for frontend build (e.g. `https://api.lms-example.com`) |

## ECR Setup

Before the first deploy, create ECR repositories:

```bash
./scripts/setup-ecr-repos.sh us-east-1
```

Or create manually via AWS Console/Terraform. Repos: `lms-gateway`, `lms-auth-service`, `lms-user-service`, etc.

## Kubernetes Blue-Green

Blue-green manifests are in [`k8s/blue-green/`](../k8s/blue-green/). Each service has:

- `{service}-blue.yaml` / `{service}-green.yaml` (Deployments)
- `{service}-svc.yaml` (Service with version selector)

Deploy logic ([`scripts/deploy-blue-green.sh`](../scripts/deploy-blue-green.sh)):

1. Detect active color from Service selector
2. Deploy new image to inactive color
3. Wait for rollout
4. Patch Service selector to switch traffic

## Local Testing

```bash
# Deploy script (requires kubectl + kubeconfig)
./scripts/deploy-blue-green.sh '["lms-user-service"]' latest "" lms
```

## Mobile (Expo/React Native)

- **PR CI** ([pr-ci.yml](../.github/workflows/pr-ci.yml)): When `mobile/**` changes, runs lint, typecheck, and Jest tests.
- **CD** (ci-cd.yml): When `mobile/**` changes on push to main, runs validation then **EAS Build** (staging profile, iOS + Android). Requires `EXPO_TOKEN` secret.
- To get `EXPO_TOKEN`: Run `eas login`, then create an access token from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens).

## Deprecation Notice

The legacy [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) remains for backward compatibility but is superseded by `ci-cd.yml` and `pr-ci.yml`. Consider disabling or removing `ci.yml` to avoid duplicate runs.
