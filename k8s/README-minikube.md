## LMS on Minikube (local Kubernetes)

This guide explains how to run the LMS microservices on a local Minikube cluster using the manifests in this `k8s/` directory.

It assumes:

- **Minikube** and **kubectl** are installed.
- You are ok building Docker images locally (no external registry).

All commands below are meant to be run from the project root:

```bash
cd /Users/mukeshkumar/Developer/projects/spring-boot/learning-managment-system
```

---

## 1. Start Minikube with enough resources

The stack includes many services (Postgres, Redis, Kafka, Elasticsearch, and multiple Spring Boot apps), so give Minikube sufficient CPU/RAM:

```bash
minikube start \
  --driver=docker \
  --cpus=6 \
  --memory=12288
```

You can adjust these numbers down if your machine has fewer resources, but if pods start crashing with `OOMKilled` or `Insufficient cpu/memory`, increase them.

Enable the addons needed for Ingress and HPA:

```bash
minikube addons enable ingress
minikube addons enable metrics-server
```

---

## 2. Use Minikube’s Docker daemon

The Kubernetes manifests reference local images like `lms-gateway:latest` and `lms-user-service:latest`.
To make those visible to Minikube, build them into Minikube’s Docker daemon:

```bash
eval $(minikube docker-env)
```

Then build the images for each service using the existing Dockerfiles (the same ones used by `docker-compose-dev.yml`):

```bash
# Gateway
docker build -t lms-gateway:latest ./lms-gateway

# Core services
docker build -t lms-user-service:latest ./services/lms-user-service
docker build -t lms-auth-service:latest ./services/lms-auth-service
docker build -t lms-course-service:latest ./services/lms-course-service
docker build -t lms-enrollment-service:latest ./services/lms-enrollment-service
docker build -t lms-content-service:latest ./services/lms-content-service
docker build -t lms-assignment-service:latest ./services/lms-assignment-service
docker build -t lms-search-service:latest ./services/lms-search-service
docker build -t lms-notification-service:latest ./services/lms-notification-service
docker build -t lms-payment-service:latest ./services/lms-payment-service
docker build -t lms-analytics-service:latest ./services/lms-analytics-service
```

> **Tip:** you can re-run `eval $(minikube docker-env)` in any new shell before building images, otherwise Minikube will not see them.

---

## 3. Configure secrets for local use

The base manifest `k8s/00-base.yaml` creates:

- Namespace `lms`
- ConfigMap `lms-shared-config`
- Secret `lms-secrets` (currently placeholder values like `__REPLACE__`)

For local development you can either:

- **Option A (simple):** Edit the secret values in `k8s/00-base.yaml` directly before applying (do NOT commit real secrets), or
- **Option B (recommended):** Apply the base ConfigMap and namespace, then create the secret via `kubectl`.

### Option A – edit file locally

Edit the `stringData` section in `k8s/00-base.yaml`:

- `POSTGRES_USER` / `POSTGRES_PASSWORD` – credentials your Postgres instance will accept.
- `JWT_SECRET` – any strong random string for local JWT signing.
- `MAIL_USERNAME` / `MAIL_PASSWORD` – dummy values if you are not sending real email.

Then apply:

```bash
kubectl apply -f k8s/00-base.yaml
```

### Option B – create secret via kubectl

First apply only the namespace and ConfigMap from `00-base.yaml` (leaving out the Secret block), or apply as-is, then override the secret with:

```bash
kubectl create secret generic lms-secrets \
  -n lms \
  --from-literal=POSTGRES_USER=lms \
  --from-literal=POSTGRES_PASSWORD=lms \
  --from-literal=JWT_SECRET=change-me-local \
  --from-literal=MAIL_USERNAME=mock \
  --from-literal=MAIL_PASSWORD=mock \
  --dry-run=client -o yaml | kubectl apply -f -
```

Adjust values as needed.

---

## 4. Infrastructure dependencies (Postgres, Redis, Kafka, Elasticsearch)

The current `k8s/` manifests focus on the LMS microservices. Infra components are referenced by DNS names in `k8s/00-base.yaml`:

- Postgres: `lms-postgres:5432`
- Redis: `lms-redis:6379`
- Kafka: `lms-kafka:9092`
- Elasticsearch: `lms-elasticsearch:9200`

You have two options:

- **Option 1 (simplest right now):** Continue running infra via Docker Compose and point Kubernetes services at that (not fully isolated).
- **Option 2 (future improvement):** Add dedicated Kubernetes manifests for Postgres, Redis, Kafka, and Elasticsearch (mirroring `infra/docker/docker-compose-dev.yml`).

At the moment, **Option 1** is easiest:

1. In a separate terminal, from `infra/docker`, run:

   ```bash
   docker compose -f docker-compose-dev.yml up postgres redis kafka elasticsearch
   ```

2. Update `k8s/00-base.yaml` `ConfigMap` to point to the Docker host instead of service names if needed (for Minikube with Docker driver, `host.docker.internal` or `host.minikube.internal` can be used depending on your setup).

If you’d like fully in-cluster Postgres/Redis/Kafka/Elasticsearch, we can add those manifests later.

---

## 5. Deploy LMS services to Minikube

Once:

- Minikube is running,
- Images are built inside Minikube’s Docker daemon,
- `lms` namespace, `lms-shared-config`, and `lms-secrets` exist,
- Infra (Postgres, Redis, Kafka, Elasticsearch) is reachable,

apply the LMS microservice manifests:

```bash
kubectl apply -f k8s/user-service.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/course-service.yaml
kubectl apply -f k8s/enrollment-service.yaml
kubectl apply -f k8s/content-service.yaml
kubectl apply -f k8s/assignment-service.yaml
kubectl apply -f k8s/search-service.yaml
kubectl apply -f k8s/notification-service.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/analytics-service.yaml
kubectl apply -f k8s/gateway.yaml
kubectl apply -f k8s/hpa-pdb.yaml
```

You can also apply everything in one go:

```bash
kubectl apply -f k8s/
```

> **Note:** The current `gateway.yaml` Ingress is configured for a production-like host (`api.lms-example.com`) with TLS. For local Minikube usage you may prefer to port-forward or adjust the Ingress (see next section).

---

## 6. Accessing the API from your machine

### Option A – simple port-forward (recommended to start)

Forward the gateway service to your localhost:

```bash
kubectl port-forward svc/lms-gateway -n lms 8080:80
```

Then access the API at:

```text
http://localhost:8080
```

This avoids any extra Ingress/host/TLS configuration for local development.

### Option B – Ingress via Minikube

If you want to test Ingress locally:

1. Edit `k8s/gateway.yaml`:
   - Change `host: api.lms-example.com` to something like `lms.local`.
   - For local HTTP-only testing, you can comment out the `tls` section entirely.

2. Re-apply:

   ```bash
   kubectl apply -f k8s/gateway.yaml
   ```

3. Get the Minikube IP:

   ```bash
   minikube ip
   ```

4. Add a line to `/etc/hosts` (on macOS):

   ```text
   <MINIKUBE_IP>  lms.local
   ```

Now you can hit:

```text
http://lms.local/
```

---

## 7. Verifying everything is running

Check that pods are up:

```bash
kubectl get pods -n lms
```

You should see all LMS services in `Running` or `Ready` state.

If something is not ready, describe the pod:

```bash
kubectl describe pod <pod-name> -n lms
kubectl logs <pod-name> -n lms
```

This will usually point to a missing secret, unreachable database, or image not found (images not built into Minikube).

---

## 8. Tear down

To remove LMS resources from Minikube:

```bash
kubectl delete namespace lms
```

To stop the Minikube cluster entirely:

```bash
minikube stop
```

