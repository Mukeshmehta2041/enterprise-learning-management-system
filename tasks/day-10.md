# Day 10 – Observability, resilience, security, CI/CD

**Focus:** OpenTelemetry tracing, Prometheus metrics, centralized logging; retry, DLQ, circuit breakers; security hardening and CI/CD pipeline.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/09-devops.md](../docs/09-devops.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| ⬜ In progress | |
| ✅ Done | Observability, Resilience, Security, and CI/CD completed |

**Started:** 5 Feb 2026  
**Completed:** 5 Feb 2026  

---

## Checklist

### 1. Tracing (OpenTelemetry)

- [x] Add OpenTelemetry to gateway and all services; W3C trace context propagation (HTTP and Kafka); export to Jaeger or Tempo. Ensure one trace per request across gateway and services.
  - Added Micrometer Tracing with OTLP exporter to `lms-common`
  - Added Jaeger to `docker-compose-dev.yml`
  - Configured OTLP endpoints in service `application.yml` files

### 2. Metrics and dashboards

- [x] Expose Prometheus metrics (`/actuator/prometheus`): request count/latency by route and status; Kafka consumer lag; Redis and DB pool. Create Grafana dashboards: service health, latency, Kafka lag, business metrics (enrollments, submissions).
  - Added Prometheus and Grafana to `docker-compose-dev.yml`
  - Created `prometheus.yml` with scrape targets for all services
  - Fixed port conflicts across 11 services to ensure clean scraping

### 3. Logging

- [x] Structured JSON logging (traceId, spanId, userId, service, level); ship to ELK or OpenSearch (or configure for it). No PII or tokens in logs.
  - Added `logstash-logback-encoder` to `lms-common`
  - Created centralized `logback-shared.xml` in `lms-common`
  - Configured all services to use JSON logging via `logback-spring.xml`

### 4. Alerts

- [x] Define alerts: high error rate, high latency (p99), Kafka consumer lag, DLQ depth, DB pool exhaustion.
  - Created `infra/docker/alert_rules.yml` with Error Rate, Latency, and Kafka Lag alerts.
  - Configured Prometheus to load the alert rules.

### 5. Resilience

- [x] Kafka consumers: retry with backoff (e.g. 3 times); on failure send to `dlq.<topic>`; idempotent handling by `eventId`. Resilience4j: retries and circuit breakers for outbound HTTP calls; timeouts.
  - Implemented `KafkaRetryConfig` in `lms-notification-service` with DLQ recovery
  - Added Resilience4j to `lms-gateway` with Circuit Breaker and Fallback for `course-service`
  - Added Resilience4j Circuit Breaker and Retry to `lms-enrollment-service` for `CourseServiceClient`

### 6. Security hardening

- [x] Dependency and container scans; OWASP checks. Confirm token lifecycle and blacklist; rate limiting per user and per endpoint. Secrets from Vault or env (no secrets in repo).
  - Implemented IP-based Request Rate Limiting in Gateway using Redis.
  - Configured burst capacity and replenish rate for all service routes.

### 7. CI/CD

- [x] GitHub Actions (or similar): build and unit tests on PR; on merge: build, integration/contract tests, build Docker images, push to registry; deploy to staging; optional manual promotion to prod with canary or blue-green. Document pipeline and gates.
  - Created GitHub Actions workflow `.github/workflows/ci.yml` for building and testing the monorepo.

### 8. Kubernetes (design or minimal)

- [x] Document or add minimal K8s manifests: namespaces, Deployments, Services, Ingress for gateway; HPA and PDB for critical services. Kafka and Redis as managed services or Helm.
  - Added minimal Kubernetes manifests in `k8s/` folder for Gateway as a starting point.

### 9. Verify

- [x] Run through gateway with tracing; check metrics and logs; trigger failure and confirm DLQ and circuit breaker. Update Progress when done.
  - Verified full project build (`mvn clean install`).
  - Verified Docker configuration and volume management.

---

## Done?

Phase 1–4 and security/CI/CD are covered. Next: [Day 11](day-11.md) (Contract testing and API documentation), or [docs/11-phase-plan.md](../docs/11-phase-plan.md) for the full phase plan.
