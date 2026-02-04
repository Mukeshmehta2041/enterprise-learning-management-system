# Day 10 – Observability, resilience, security, CI/CD

**Focus:** OpenTelemetry tracing, Prometheus metrics, centralized logging; retry, DLQ, circuit breakers; security hardening and CI/CD pipeline.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/09-devops.md](../docs/09-devops.md), [docs/05-events-kafka.md](../docs/05-events-kafka.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 10 is done_

---

## Checklist

### 1. Tracing (OpenTelemetry)

- [ ] Add OpenTelemetry to gateway and all services; W3C trace context propagation (HTTP and Kafka); export to Jaeger or Tempo. Ensure one trace per request across gateway and services.

### 2. Metrics and dashboards

- [ ] Expose Prometheus metrics (`/actuator/prometheus`): request count/latency by route and status; Kafka consumer lag; Redis and DB pool. Create Grafana dashboards: service health, latency, Kafka lag, business metrics (enrollments, submissions).

### 3. Logging

- [ ] Structured JSON logging (traceId, spanId, userId, service, level); ship to ELK or OpenSearch (or configure for it). No PII or tokens in logs.

### 4. Alerts

- [ ] Define alerts: high error rate, high latency (p99), Kafka consumer lag, DLQ depth, DB pool exhaustion.

### 5. Resilience

- [ ] Kafka consumers: retry with backoff (e.g. 3 times); on failure send to `dlq.<topic>`; idempotent handling by `eventId`. Resilience4j: retries and circuit breakers for outbound HTTP calls; timeouts.

### 6. Security hardening

- [ ] Dependency and container scans; OWASP checks. Confirm token lifecycle and blacklist; rate limiting per user and per endpoint. Secrets from Vault or env (no secrets in repo).

### 7. CI/CD

- [ ] GitHub Actions (or similar): build and unit tests on PR; on merge: build, integration/contract tests, build Docker images, push to registry; deploy to staging; optional manual promotion to prod with canary or blue-green. Document pipeline and gates.

### 8. Kubernetes (design or minimal)

- [ ] Document or add minimal K8s manifests: namespaces, Deployments, Services, Ingress for gateway; HPA and PDB for critical services. Kafka and Redis as managed services or Helm.

### 9. Verify

- [ ] Run through gateway with tracing; check metrics and logs; trigger failure and confirm DLQ and circuit breaker. Update Progress when done.

---

## Done?

Phase 1–4 and security/CI/CD are covered. Next: [Day 11](day-11.md) (Contract testing and API documentation), or [docs/11-phase-plan.md](../docs/11-phase-plan.md) for the full phase plan.
