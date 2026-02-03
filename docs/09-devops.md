# 9. DevOps

## Docker

### Image per service

- One image per microservice (user-service, auth-service, course-service, etc.).
- **Multi-stage build:** Stage 1: build with Maven (Java 17); Stage 2: copy JAR and run with JRE 17. Use a minimal base (e.g. eclipse-temurin or distroless).
- **Non-root:** Run process as a non-root user inside the container.
- **Health check:** Use HTTP GET to `/actuator/health` (or equivalent); configure interval and timeout. Mark unhealthy after N failures.

### Docker Compose (local)

- **Services to run:** PostgreSQL (single instance with multiple schemas for dev, or one per service), Kafka (+ Zookeeper or KRaft), Redis, API Gateway, User Service, Auth Service, Course Service, Enrollment Service (and later Content, Assignment, etc.).
- **Env files:** Use `.env` or `env_file` per profile (e.g. `docker-compose.dev.yml`). Do not commit secrets; use placeholders or local override.
- **Networks:** Single bridge network so containers resolve by service name (e.g. `http://user-service:8080`).
- **Ports:** Expose gateway (e.g. 8080), and optionally DB/Kafka/Redis for local debugging.

## Environment and configuration

- **Profiles:** Use Spring profiles (e.g. `dev`, `staging`, `prod`) for environment-specific config.
- **Config server:** Use Spring Cloud Config (Git or Vault) to centralize properties; override with environment variables for URLs and secrets (e.g. `SPRING_DATASOURCE_URL`).
- **Secrets:** Never commit secrets. Use Vault, cloud secret manager, or Kubernetes Secrets; inject at runtime as env vars or mounted files.

## CI/CD (e.g. GitHub Actions)

### Pipeline stages

1. **On PR:** Build, run unit tests, optionally run integration tests (e.g. with Testcontainers). Fail if tests fail.
2. **On merge to main:** Build, run full test suite, build Docker images, push to registry. Optionally deploy to staging (e.g. Kubernetes or Compose).
3. **Release / deploy to prod:** Manual approval or automated with canary/blue-green. Deploy new image to prod namespace; run smoke tests.

### Gates

- All tests must pass before merge.
- No deployment to prod if staging health checks or smoke tests fail.
- Optional: dependency scan (e.g. OWASP) and security scan on images in pipeline.

### Config and feature flags

- Feature flags and toggles can live in config server or a DB table; use to enable new behavior gradually (e.g. new search backend).

## Kubernetes (design only)

- **Namespaces:** Separate namespaces per environment (e.g. `lms-dev`, `lms-staging`, `lms-prod`).
- **Deployments:** One Deployment per microservice; image from registry; resource requests/limits (CPU, memory); liveness/readiness via `/actuator/health`.
- **Services:** ClusterIP Service per deployment for internal routing; Gateway exposed via Ingress or LoadBalancer.
- **Ingress:** Single Ingress for gateway; TLS termination; route by host/path if needed.
- **HPA:** Horizontal Pod Autoscaler on CPU and/or memory (and custom metrics if needed) for each service.
- **PDB:** PodDisruptionBudget for critical services (e.g. min 1 available) to avoid eviction storms.
- **Kafka and Redis:** Prefer managed services (e.g. cloud Kafka, ElastiCache) or run via Helm charts; do not run critical data stores only on ephemeral pods without persistence.
