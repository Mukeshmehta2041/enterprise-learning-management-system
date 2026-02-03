# 8. Observability

## Logging

### Structured fields

Emit logs as JSON (e.g. Logstash Logback encoder) with at least:

| Field | Description |
|-------|-------------|
| `timestamp` | ISO-8601 |
| `level` | INFO, WARN, ERROR |
| `message` | Human-readable message |
| `service` | Service name (e.g. user-service) |
| `traceId` | W3C trace id (from OpenTelemetry or gateway) |
| `spanId` | Current span id |
| `userId` | Optional; when request is authenticated (do not log for auth failures) |
| `thread` | Optional |
| `logger` | Logger name |

Do not log request/response bodies that may contain PII or tokens; log method, path, status, and duration only.

### Centralization

- Ship logs to a central store (e.g. ELK or OpenSearch): filebeat/fluentd/OTLP from each service or from the platform (e.g. Kubernetes).
- Use log level and sampling configurable per environment (e.g. INFO in prod with sampling for high-volume paths).

## Metrics (Prometheus)

### Scrape

- Expose Prometheus metrics at `/actuator/prometheus` (Spring Boot Actuator). Scraper (e.g. in Kubernetes) pulls on an interval.

### Recommended metrics

| Metric | Type | Labels | Purpose |
|--------|------|--------|---------|
| `http_server_requests_seconds` | Histogram | method, uri, status | Latency and count by route. |
| `http_server_requests_total` | Counter | method, uri, status | Request rate. |
| `kafka_consumer_lag` | Gauge | topic, partition, group | Consumer lag. |
| `redis_connections_active` | Gauge | — | Redis pool usage. |
| `jvm_memory_used_bytes` | Gauge | area (heap, nonheap) | Memory. |
| `db_pool_active` | Gauge | pool | DB connection pool. |
| `lms_enrollments_total` | Counter | course_id, status | Business: enrollments. |
| `lms_submissions_total` | Counter | assignment_id, status | Business: submissions. |

Add custom meters for critical business actions (enrollment, payment, etc.) and tag by status where useful.

## Tracing (OpenTelemetry)

- Instrument gateway and all services with OpenTelemetry (auto-instrumentation or Spring integration).
- Propagate W3C Trace Context (`traceparent`, `tracestate`) in HTTP headers between gateway and services, and to Kafka (in event metadata).
- Export spans to a backend (e.g. Jaeger or Tempo). Critical path: Gateway → Auth/User → Course → Enrollment; ensure one trace per request across services.

## Alerts

Define alerts (e.g. in Prometheus/Alertmanager or Grafana) for:

| Alert | Condition | Severity |
|-------|-----------|----------|
| High error rate | Error rate per service > threshold (e.g. 5%) | High |
| High latency | p99 latency per service > threshold | High |
| Kafka consumer lag | Lag > N messages or > M minutes | Medium |
| DLQ depth | Messages in any DLQ > threshold | Medium |
| DB pool exhausted | Active connections near max | High |
| Certificate expiry | TLS cert expiring in < 14d | High |

## Dashboards (Grafana)

- **Service health:** Request rate, error rate, latency (p50, p95, p99) per service.
- **Dependencies:** Redis and DB connection usage; Kafka producer/consumer metrics.
- **Business:** Enrollment funnel (enrollments, completions); submissions over time; payment success/failure.
