# 11. Phase-Wise Implementation Plan

Use this as a checklist and implementation order. Each phase builds on the previous; implement in sequence unless you intentionally scope down.

---

## Phase 1 – MVP (Core Features)

**Goal:** Users can register, login, browse courses, enroll, and track progress.

### Checklist

1. **Monorepo / structure**
   - [ ] Create root build (Maven BOM or parent POM) and modules: gateway, user-service, auth-service, course-service, enrollment-service, and optionally a shared lib (DTOs, event envelope).
2. **User Service**
   - [ ] Implement User CRUD and roles (see [04-database.md](04-database.md) User schema, [api-specs/user-service-api.md](api-specs/user-service-api.md)).
   - [ ] Expose REST API; add validation and global exception handling.
3. **Auth Service**
   - [ ] Implement login (password grant), refresh token, logout (see [07-security.md](07-security.md), [api-specs/auth-service-api.md](api-specs/auth-service-api.md)).
   - [ ] Issue JWT access token and store refresh token in Redis; blacklist JWT on logout.
4. **Course Service**
   - [ ] Implement Course and Module CRUD (see [04-database.md](04-database.md) Course schema, [api-specs/course-service-api.md](api-specs/course-service-api.md)).
   - [ ] Expose REST API; consider publishing to Kafka later (Phase 2).
5. **Enrollment Service**
   - [ ] Implement enroll, list enrollments, update progress (see [04-database.md](04-database.md) Enrollment schema, [api-specs/enrollment-service-api.md](api-specs/enrollment-service-api.md)).
   - [ ] Validate course exists (call Course Service or event); enforce unique (user_id, course_id).
6. **API Gateway**
   - [ ] Configure routes per [03-api-gateway.md](03-api-gateway.md); forward to each service.
   - [ ] Add JWT validation filter; set `X-User-Id` and `X-Roles`; exclude auth routes from validation.
7. **Data and runtime**
   - [ ] Single PostgreSQL instance with schemas `lms_user`, `lms_course`, `lms_enrollment` (or one DB per service if preferred).
   - [ ] Optional for Phase 1: single Kafka topic `lms.events` for learning; or skip Kafka until Phase 2.
   - [ ] Docker Compose: PostgreSQL, Redis, Kafka (optional), gateway, user, auth, course, enrollment services (see [09-devops.md](09-devops.md)).

**Deliverable:** End-to-end flow: register → login → list courses → enroll → update progress.

---

## Phase 2 – Scalability and Performance

**Goal:** Full learning path with content and assignments; search; better throughput and latency.

### Checklist

1. **Content Service**
   - [ ] Implement content items (video, PDF, quiz), versions, presigned URLs (see [04-database.md](04-database.md) Content schema).
   - [ ] Publish `content.events`; add Kafka producer.
2. **Assignment Service**
   - [ ] Implement assignments, submissions, grades (see [04-database.md](04-database.md) Assignment schema).
   - [ ] Publish `assignment.events`.
3. **Database per service**
   - [ ] Move to separate DBs or schemas with clear ownership; no cross-DB access.
4. **Redis**
   - [ ] Add Redis to Course and Enrollment services: cache course by ID (see [06-redis.md](06-redis.md)); distributed lock for enrollment.
   - [ ] Rate limiting at gateway using Redis (see [03-api-gateway.md](03-api-gateway.md)).
5. **Kafka**
   - [ ] Introduce per-domain topics (course, enrollment, content, assignment); producers and consumers as in [05-events-kafka.md](05-events-kafka.md).
6. **Search Service**
   - [ ] Consume `course.events` and `content.events`; index in Elasticsearch/OpenSearch; expose search and filters API.
7. **Pagination and queries**
   - [ ] Cursor-based pagination for list enrollments, list courses (see [04-database.md](04-database.md)); add indexes as specified.

**Deliverable:** Content and assignments usable; search working; caching and locks in place.

---

## Phase 3 – Enterprise Features

**Goal:** Notifications, payment flow, basic analytics, stricter access control.

### Checklist

1. **Notification Service**
   - [ ] Consume domain events; send email and in-app notifications; expose in-app list and mark-read API.
2. **Payment Service**
   - [ ] Plans, invoices, mock gateway; idempotency on payment creation (see [04-database.md](04-database.md)); publish `payment.events`.
3. **Analytics Service**
   - [ ] Consume all domain events; store snapshots and aggregates (see [04-database.md](04-database.md)); expose reports/dashboards API.
4. **RBAC and versioning**
   - [ ] Enforce RBAC per [07-security.md](07-security.md); resource-level checks (e.g. instructor of course).
   - [ ] API versioning and deprecation headers (see [03-api-gateway.md](03-api-gateway.md)).

**Deliverable:** Notifications, mock payments, analytics, and RBAC in place.

---

## Phase 4 – Observability and Resilience

**Goal:** Full visibility and fault tolerance.

### Checklist

1. **Tracing**
   - [ ] Add OpenTelemetry to gateway and all services; W3C propagation; export to Jaeger/Tempo (see [08-observability.md](08-observability.md)).
2. **Metrics and dashboards**
   - [ ] Prometheus metrics (actuator + custom); Grafana dashboards for service health, Kafka lag, business metrics (see [08-observability.md](08-observability.md)).
3. **Logging**
   - [ ] Structured JSON logging with traceId, spanId; ship to ELK/OpenSearch (see [08-observability.md](08-observability.md)).
4. **Alerts**
   - [ ] Configure alerts for latency, errors, Kafka lag, DLQ, DB pool (see [08-observability.md](08-observability.md)).
5. **Resilience**
   - [ ] Retries and circuit breakers (e.g. Resilience4j) for outbound calls; timeouts; Kafka consumer retry and DLQ (see [05-events-kafka.md](05-events-kafka.md)).

**Deliverable:** Tracing, metrics, dashboards, alerts, and resilient consumers.

---

## Phase 5 – Security Hardening and Optimization

**Goal:** Production-hardened, scalable system.

### Checklist

1. **Security**
   - [ ] Dependency and container scans; OWASP checks; token lifecycle and blacklist verified; rate limiting per user and per endpoint (see [07-security.md](07-security.md)).
2. **Secrets and edge**
   - [ ] Secrets in Vault or cloud manager; WAF and rate limiting at edge (see [09-devops.md](09-devops.md)).
3. **Performance**
   - [ ] Connection pooling and cache tuning; DB query review; Kubernetes HPA and PDB (see [09-devops.md](09-devops.md)).
4. **CI/CD**
   - [ ] Pipeline with tests, contract tests, security gates; canary or blue-green deployment (see [09-devops.md](09-devops.md)).

**Deliverable:** Ready for high load and production operations.

---

## Dependencies Between Phases

- Phase 2 depends on Phase 1 (gateway, user, auth, course, enrollment running).
- Phase 3 depends on Phase 2 (Kafka and events flowing; search and content/assignment exist).
- Phase 4 can start after Phase 1 (observability can be added incrementally).
- Phase 5 applies to the full system and is last.

You can implement Phase 4 (observability) in parallel with Phase 2 or 3 if desired; the plan order keeps “features first, then visibility, then hardening.”
