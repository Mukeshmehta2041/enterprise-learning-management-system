# Developer and Ops Onboarding Guide

Welcome to the LMS project! This guide will help you get started with development and operations.

## 1. Developer Onboarding

### Prerequisites
- **Java**: 17 or higher
- **Maven**: 3.8+
- **Docker & Docker Compose**: For local infrastructure
- **IDE**: IntelliJ IDEA (recommended) or VS Code

### Getting Started
1. **Clone the repo**: `git clone <repo-url>`
2. **Setup Infrastructure**:
   ```bash
   cd infra/docker
   docker-compose up -d
   ```
   This starts PostgreSQL, Kafka, Redis, and Jaeger.
3. **Build the project**:
   ```bash
   ./mvnw clean install
   ```
4. **Run a service locally**:
   Example:
   ```bash
   ./mvnw spring-boot:run -pl services/lms-user-service
   ```
5. **Run tests**:
   ```bash
   ./mvnw test
   ```

### API Docs
- Swagger UI (Local): `http://localhost:8080/swagger-ui.html` (via Gateway)
- OpenAPI Specs: `docs/api-specs/`

---

## 2. Operations Onboarding

### Infrastructure Access
- **Kubernetes**: Use `kubectl` with the provided context. Manifests in `k8s/`.
- **Logs**: Centralized in OpenSearch/Kibana (accessible via internal VPN).
- **Metrics**: Grafana dashboards for each microservice.

### Deployment & Rollback
- **Deploy**: Follow the Blue-Green strategy in `docs/runbooks/deployment.md`.
- **Rollback**: Switch the Gateway traffic back to the "Blue" version by updating the Kubernetes Service selector.

### Monitoring & Alerts
- **Prometheus**: Scrapes `/actuator/prometheus` on all services.
- **Critical Alerts**: Channel #lms-ops on Slack for high error rates or latency.

### Incident Response
- Refer to `docs/runbooks/` for standard procedures.
- **Escalation Path**: Dev Lead -> Ops Lead -> CTO.

---

## 3. Architecture Decisions (ADR)
- **Monorepo**: For easier contract management between microservices.
- **Kafka for Async**: Used for side effects (notifications, analytics) to keep core logic fast.
- **Redis for Token Storage**: To allow stateful revocation in a stateless JWT setup.
- **Blue-Green Deployments**: To ensure zero-downtime updates in production.

## 4. Known Tech Debt
- **Circular Dependencies**: Some services have logical circular dependencies that are currently broken by Kafka; need more rigorous service boundary review.
- **Test Coverage**: Current coverage is ~70%; aiming for 85%+ on service layer.
