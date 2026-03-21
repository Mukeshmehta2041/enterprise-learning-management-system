# DigitalOcean Kubernetes (DOKS) Setup Guide

This guide walks you through setting up your LMS on DigitalOcean Kubernetes Service (DOKS).

---

## **Phase 1: Create DigitalOcean Account & Cluster**

### Step 1: Sign Up for DigitalOcean
1. Go to [DigitalOcean.com](https://digitalocean.com)
2. Create free account (get $200 credit if using referral)
3. Verify email

### Step 2: Create Kubernetes Cluster
**Via DigitalOcean Dashboard:**
1. Go to **Manage → Kubernetes**
2. Click **Create Kubernetes Cluster**
3. Configure:
   - **Name:** `lms-prod-cluster`
   - **Region:** Choose closest to your users (us-east-1, eu-west-1, etc.)
   - **Kubernetes Version:** Latest (v1.29+)
   - **Node Pool:**
     - **Machine Type:** Basic (Standard - $6/month per node)
     - **Nodes:** 3 nodes minimum (for HA)
   - **VPC:** Default
4. Click **Create Cluster**
   - ⏱️ Takes ~5-10 minutes

### Step 3: Download kubeconfig
1. Once cluster is ready, click **Download Configuration File**
2. Save as: `~/.kube/config-doks`
3. Or use `doctl` CLI:
```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Create kubeconfig
doctl kubernetes cluster kubeconfig save lms-prod-cluster
```

---

## **Phase 2: Install Required Tools**

### Install `kubectl`
```bash
brew install kubectl
```

### Install `helm` (Package manager for K8s)
```bash
brew install helm
```

### Install `doctl` (DigitalOcean CLI)
```bash
brew install doctl
doctl auth init
```

### Verify Cluster Connection
```bash
kubectl cluster-info
kubectl get nodes
```

Expected output:
```
NAME                        STATUS   ROLES    AGE
lms-prod-cluster-1-xxxxx    Ready    <none>   5m
lms-prod-cluster-2-xxxxx    Ready    <none>   5m
lms-prod-cluster-3-xxxxx    Ready    <none>   5m
```

---

## **Phase 3: Install ArgoCD**

### Step 1: Create ArgoCD Namespace
```bash
kubectl create namespace argocd
```

### Step 2: Install ArgoCD
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Step 3: Access ArgoCD UI
```bash
# Get ArgoCD password (admin user)
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port-forward (keep this terminal open)
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Visit: `http://localhost:8080`
- Username: `admin`
- Password: (from above command)

### Step 4: Get ArgoCD API Token
```bash
# Login via CLI
argocd login localhost:8080 --username admin --password <your-password>

# Get API token
argocd account generate-token --account ci
```

---

## **Phase 4: Create Docker Registry Secret**

Your images in GHCR need credentials to pull on DOKS.

```bash
# Create secret in BOTH namespaces
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<YOUR_GITHUB_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n lms-staging

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<YOUR_GITHUB_USERNAME> \
  --docker-password=<YOUR_GITHUB_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n lms-production
```

**To get GitHub token:**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Create new token with `read:packages` scope
3. Copy token

---

## **Phase 5: Update GitHub Secrets**

Go to **GitHub Repo → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value |
|---|---|
| `ARGOCD_SERVER` | `http://your-argocd-ip:6443` (get from: `kubectl get svc -n argocd argocd-server`) |
| `ARGOCD_AUTH_TOKEN` | (from Phase 3.4) |
| `ARGOCD_APP_STAGING` | `lms-backend-staging` |
| `ARGOCD_APP_PRODUCTION` | `lms-backend-production` |
| `ARGOCD_NAMESPACE` | `argocd` |

**To get ArgoCD Server:**
```bash
kubectl get svc -n argocd argocd-server
# Use ClusterIP or port-forward
```

---

## **Phase 6: Configure Helm Values for DigitalOcean**

Update your Helm values files:

**File:** `infra/helm/lms-backend/values-staging.yaml`
```yaml
# Add at top
replicaCount: 2
imagePullSecrets:
  - name: ghcr-secret

# For LoadBalancer (DigitalOcean provides free LB)
services:
  lmsAuth:
    type: LoadBalancer
  lmsGateway:
    type: LoadBalancer

# Storage
persistence:
  enabled: true
  storageClassName: do-block-storage  # DO's default storage

# Resource requests (adjust for 3x $6/month nodes = 12GB RAM total)
resources:
  limits:
    memory: "1Gi"
    cpu: "500m"
  requests:
    memory: "512Mi"
    cpu: "250m"
```

**File:** `infra/helm/lms-backend/values-production.yaml`
```yaml
replicaCount: 3  # Higher for production
imagePullSecrets:
  - name: ghcr-secret

services:
  lmsAuth:
    type: LoadBalancer
  lmsGateway:
    type: LoadBalancer

persistence:
  enabled: true
  storageClassName: do-block-storage

# Stricter resource limits for production
resources:
  limits:
    memory: "2Gi"
    cpu: "1000m"
  requests:
    memory: "1Gi"
    cpu: "500m"
```

---

## **Phase 7: Update ArgoCD Applications**

**File:** `infra/argocd/app-staging.yaml`
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: lms-backend-staging
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/Mukeshmehta2041/enterprise-learning-management-system.git
    targetRevision: main
    path: infra/helm/lms-backend
    helm:
      valueFiles:
        - values-staging.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: lms-staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
```

**File:** `infra/argocd/app-production.yaml`
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: lms-backend-production
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/Mukeshmehta2041/enterprise-learning-management-system.git
    targetRevision: main
    path: infra/helm/lms-backend
    helm:
      valueFiles:
        - values-production.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: lms-production
  syncPolicy:
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    # Manual sync for production (safer)
```

---

## **Phase 8: Deploy ArgoCD Applications**

```bash
# Deploy staging
kubectl apply -f infra/argocd/app-staging.yaml

# Deploy production
kubectl apply -f infra/argocd/app-production.yaml

# Verify applications
kubectl get applications -n argocd
```

---

## **Phase 9: Monitor Deployment**

```bash
# Watch ArgoCD status
kubectl get applications -n argocd -w

# Check pod status
kubectl get pods -n lms-staging
kubectl get pods -n lms-production

# View pod logs
kubectl logs -n lms-staging deployment/lms-auth-service

# Port-forward to test services
kubectl port-forward -n lms-staging svc/lms-gateway 8080:80
```

---

## **Costs on DigitalOcean**

| Component | Cost/Month |
|---|---|
| 3x Basic nodes ($6 each) | $18 |
| LoadBalancer (1x) | $10 |
| Block Storage (50GB) | $5 |
| **Total** | **~$33/month** |

---

## **Troubleshooting**

### Pods Won't Start
```bash
# Check pod status
kubectl describe pod <pod-name> -n lms-staging

# Check logs
kubectl logs <pod-name> -n lms-staging

# Common issues:
# - ImagePullBackOff → Fix GHCR secret
# - OOMKilled → Increase memory in values.yaml
# - ImageNotFound → Check image tag in values.yaml
```

### ArgoCD Won't Sync
```bash
# Check ArgoCD server
kubectl get svc -n argocd

# Check ArgoCD logs
kubectl logs -n argocd deployment/argocd-application-controller
```

### Can't Pull from GHCR
```bash
# Recreate docker secret
kubectl delete secret ghcr-secret -n lms-staging
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<USERNAME> \
  --docker-password=<TOKEN> \
  -n lms-staging
```

---

## **Next Steps**

1. ✅ Create DOKS cluster
2. ✅ Install ArgoCD
3. ✅ Configure secrets
4. ✅ Deploy applications
5. 📊 Set up monitoring (Prometheus/Grafana)
6. 🔐 Configure SSL/TLS
7. 🚀 Set up pipeline notifications

---

**Quick Start Command (One-liner)**
```bash
# After cluster is ready:
kubectl create namespace argocd && \
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml && \
echo "✅ ArgoCD installed. Port-forward: kubectl port-forward svc/argocd-server -n argocd 8080:443"
```
