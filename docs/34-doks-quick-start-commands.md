# DigitalOcean DOKS Quick Start - Step by Step

Follow these exact steps in order to deploy your LMS to DigitalOcean Kubernetes.

---

## **STEP 1: Create DigitalOcean DOKS Cluster**

```bash
# 1a. Sign up for DigitalOcean (if you haven't)
# → https://digitalocean.com

# 1b. Install doctl CLI
brew install doctl

# 1c. Authenticate doctl
doctl auth init
# Follow prompts to paste your API token from DigitalOcean dashboard

# 1d. Create Kubernetes cluster (takes ~10 mins)
doctl kubernetes cluster create lms-prod-cluster \
  --region nyc3 \
  --version latest \
  --node-pool "name=pool-1;size=s-2vcpu-4gb;count=3;auto-scale=true;min-nodes=3;max-nodes=6"

# Wait for cluster to be ready...
doctl kubernetes cluster get lms-prod-cluster

# 1e. Get kubeconfig
doctl kubernetes cluster kubeconfig save lms-prod-cluster
```

✅ **Verification:**
```bash
kubectl cluster-info
kubectl get nodes
# Should show 3 nodes ready
```

---

## **STEP 2: Install Required Tools**

```bash
# Install kubectl
brew install kubectl

# Install helm
brew install helm

# Verify
kubectl version --client
helm version
```

---

## **STEP 3: Install ArgoCD**

```bash
# 3a. Create namespace
kubectl create namespace argocd

# 3b. Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 3c. Wait for ArgoCD to be ready (2-3 mins)
kubectl wait --for=condition=available --timeout=300s \
  deployment/argocd-server -n argocd

# 3d. Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
# ⬆️ Save this password!

# 3e. Port-forward to access UI (keep terminal open)
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

✅ **Access ArgoCD:**
- URL: `http://localhost:8080`
- Username: `admin`
- Password: (from 3d above)

---

## **STEP 4: Generate ArgoCD API Token**

```bash
# 4a. Install argocd CLI
brew install argocd

# 4b. Login
argocd login localhost:8080 --username admin --password <PASSWORD_FROM_STEP_3D>

# 4c. Generate token for GitHub Actions
argocd account generate-token --account ci

# ⬆️ Copy this token - you'll need it in GitHub secrets!
```

---

## **STEP 5: Create Docker Registry Secret**

Get GitHub token first:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate token with `read:packages` scope
3. Copy token

Then create secrets in your cluster:

```bash
# Set variables
GITHUB_USERNAME="Mukeshmehta2041"
GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"  # From step above
GITHUB_EMAIL="your-email@example.com"

# Create in staging namespace
kubectl create namespace lms-staging
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=$GITHUB_USERNAME \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=$GITHUB_EMAIL \
  -n lms-staging

# Create in production namespace
kubectl create namespace lms-production
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=$GITHUB_USERNAME \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=$GITHUB_EMAIL \
  -n lms-production

# Verify
kubectl get secrets -n lms-staging
kubectl get secrets -n lms-production
```

---

## **STEP 6: Add GitHub Secrets**

1. Go to GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these 5 secrets:

```
ARGOCD_SERVER = http://argocd-server.argocd.svc.cluster.local:80
ARGOCD_AUTH_TOKEN = (token from STEP 4c)
ARGOCD_APP_STAGING = lms-backend-staging
ARGOCD_APP_PRODUCTION = lms-backend-production
ARGOCD_NAMESPACE = argocd
```

✅ **Verification:** All 5 secrets should appear in the GitHub UI

---

## **STEP 7: Deploy ArgoCD Applications**

From your terminal (in repo root):

```bash
# 7a. Deploy to staging
kubectl apply -f infra/argocd/app-staging.yaml

# 7b. Deploy to production  
kubectl apply -f infra/argocd/app-production.yaml

# 7c. Verify applications created
kubectl get applications -n argocd

# 7d. Watch deployment progress
kubectl get applications -n argocd -w
```

---

## **STEP 8: Test the Deployment**

```bash
# Check pods in staging
kubectl get pods -n lms-staging
kubectl get pods -n lms-production

# View service endpoints
kubectl get svc -n lms-staging
kubectl get svc -n lms-production

# Check logs of a pod
kubectl logs -n lms-staging deployment/lms-gateway

# Port-forward to test locally
kubectl port-forward -n lms-staging svc/lms-gateway 8080:80
# Visit http://localhost:8080
```

---

## **STEP 9: Trigger Your First Deployment**

```bash
# Your CI/CD pipeline is already set up!
# Just push a tag to trigger:

git tag v1.0.4
git push origin v1.0.4

# Then watch:
# 1. GitHub Actions → backend-release.yml workflow runs
# 2. Builds & pushes images to GHCR ✅
# 3. Triggers deploy-k8s.yml workflow
# 4. ArgoCD syncs the new images
# 5. Pods restart with new version ✅
```

---

## **TROUBLESHOOTING**

### Pods stuck in ImagePullBackOff
```bash
# Check secret
kubectl get secret -n lms-staging
kubectl describe secret ghcr-secret -n lms-staging

# Recreate if needed
kubectl delete secret ghcr-secret -n lms-staging
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=$GITHUB_USERNAME \
  --docker-password=$GITHUB_TOKEN \
  --docker-email=$GITHUB_EMAIL \
  -n lms-staging
```

### ArgoCD won't sync
```bash
# Check ArgoCD server logs
kubectl logs -n argocd deployment/argocd-server

# Check application status
kubectl get application lms-backend-staging -n argocd -o yaml
```

### Can't connect to cluster
```bash
# Verify kubeconfig
kubectl config current-context
kubectl config use-context do-nyc3-lms-prod-cluster

# Test connection
kubectl cluster-info
```

---

## **COST ESTIMATE**

For 3x Basic nodes (s-2vcpu-4gb @ $12/month each):

| Item | Cost |
|---|---|
| 3 Kubernetes nodes | $36/month |
| LoadBalancer (1) | $10/month |
| Block Storage (50GB) | $5/month |
| **Total** | **~$51/month** |

(Prices as of March 2026, may vary)

---

## **NEXT: Set Up Monitoring** (Optional but Recommended)

```bash
# After everything is working, consider:
# - Prometheus for metrics
# - Grafana for dashboards
# - ELK Stack for logs
# - PagerDuty for alerts
```

---

**🎉 You're done! Your LMS is now live on DigitalOcean Kubernetes!**
