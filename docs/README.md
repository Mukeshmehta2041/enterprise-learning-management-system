# LMS Backend Documentation

This folder contains the design and specification documentation for the Learning Management System (LMS) production backend. **Use these docs as the single source of truth to implement the system yourself**—no application code, config, or infrastructure files are provided here.

## Tech Stack (Reference)

- Java 17+, Spring Boot 3+, Spring Cloud
- Microservices, Kafka, Redis, PostgreSQL
- Docker, Docker Compose, Kubernetes (design-level)
- OAuth2 / JWT, ELK/OpenSearch, Prometheus/Grafana, OpenTelemetry

## Table of Contents

| Doc | Description |
|-----|-------------|
| [01-architecture.md](01-architecture.md) | High-level system architecture, diagrams, design principles |
| [02-microservices.md](02-microservices.md) | Service breakdown, responsibilities, sync vs async |
| [03-api-gateway.md](03-api-gateway.md) | Gateway design, routes, JWT, rate limiting, versioning |
| [04-database.md](04-database.md) | Per-service schema, indexes, transactions, pagination |
| [05-events-kafka.md](05-events-kafka.md) | Topics, event payload, idempotency, retry, DLQ |
| [06-redis.md](06-redis.md) | Redis patterns, keys, TTLs |
| [07-security.md](07-security.md) | Auth flow, RBAC, token lifecycle, secure API |
| [08-observability.md](08-observability.md) | Logging, metrics, tracing, alerts, dashboards |
| [09-devops.md](09-devops.md) | Docker, Compose, env, CI/CD, K8s, secrets |
| [10-best-practices.md](10-best-practices.md) | Code structure, validation, testing, OpenAPI |
| [11-phase-plan.md](11-phase-plan.md) | Phase 1–5 checklist and implementation order |
| [12-disaster-recovery.md](12-disaster-recovery.md) | Multi-region DR strategy and failover runbook |
| [13-caching-and-cdn.md](13-caching-and-cdn.md) | HTTP caching, CDN design, and invalidation flow |
| [14-reporting-and-exports.md](14-reporting-and-exports.md) | Async bulk exports, CSV/PDF generation, and security |
| [15-multi-tenancy.md](15-multi-tenancy.md) | Multi-tenant architecture, tenant isolation, and roles |
| [31-aws-ecs-fargate-deployment.md](31-aws-ecs-fargate-deployment.md) | Comprehensive guide for deploying to AWS ECS Fargate |
| [onboarding.md](onboarding.md) | Developer and Ops onboarding guide, prerequisites |
| [api-v2-migration.md](api-v2-migration.md) | Guide for migrating from V1 to V2 API |
| [security-audit-report.md](security-audit-report.md) | Security audit findings and remediation |
| [runbooks/](runbooks/) | Operational runbooks for DR, Go-Live, and Incident Response |

## API Specs (Phase 1 Services)

| Spec | Description |
|------|-------------|
| [api-specs/user-service-api.md](api-specs/user-service-api.md) | User Service HTTP API |
| [api-specs/auth-service-api.md](api-specs/auth-service-api.md) | Auth Service (login, refresh, logout) |
| [api-specs/course-service-api.md](api-specs/course-service-api.md) | Course Service HTTP API |
| [api-specs/enrollment-service-api.md](api-specs/enrollment-service-api.md) | Enrollment Service HTTP API |

## How to Use

1. Read **01-architecture.md** and **02-microservices.md** for the big picture.
2. Follow **11-phase-plan.md** for implementation order (Phase 1 MVP first).
3. Use **04-database.md**, **05-events-kafka.md**, **06-redis.md** for data and messaging.
4. Use **03-api-gateway.md** and **api-specs/** for API contracts.
5. Use **07-security.md** for auth and RBAC; **08-observability.md** and **09-devops.md** when adding observability and deployment.
6. Use **31-aws-ecs-fargate-deployment.md** for production deployment on AWS.
