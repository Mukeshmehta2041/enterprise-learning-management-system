# Copilot Instructions for LMS Monorepo

## Project Overview
- **Monorepo** for a Learning Management System (LMS) with backend (Java/Spring Boot microservices), frontend (React/TypeScript/Vite), and mobile (React Native) apps.
- **Docs** in `docs/` are the single source of truth for architecture, service boundaries, data flows, and implementation phases. Start with `docs/01-architecture.md` and `docs/02-microservices.md`.
- **Service APIs** are specified in `docs/api-specs/` (OpenAPI-style markdown). Follow these contracts for backend/frontend/mobile integration.

## Key Conventions & Patterns
- **Backend:**
  - Each microservice in `services/` (e.g., `lms-user-service/`, `lms-auth-service/`) is a Spring Boot app with its own `pom.xml`.
  - Common code in `lms-common/`.
  - API Gateway in `lms-gateway/` (see `k8s/gateway.yaml` and `docs/03-api-gateway.md`).
  - Event-driven communication via Kafka (see `docs/05-events-kafka.md`).
  - Redis, PostgreSQL, and other infra described in `docs/04-database.md`, `docs/06-redis.md`.
- **Frontend:**
  - Located in `frontend/`, built with Vite, React, and TypeScript.
  - Shared code in `frontend/src/shared/`.
  - Use API contracts from `docs/api-specs/`.
  - Linting/formatting via ESLint and Prettier (see `frontend/README.md`).
- **Mobile:**
  - Located in `mobile/`, React Native, TypeScript.
  - Follows similar API usage as frontend.

## Developer Workflows
- **Backend:**
  - Build: `./mvnw clean install` (from repo root or per-service)
  - Run: `./mvnw spring-boot:run -pl services/lms-<service>-service`
  - Test: `./mvnw test`
  - Docker Compose: see `infra/docker/` and `docs/09-devops.md`
- **Frontend:**
  - Install: `cd frontend && npm install`
  - Dev: `npm run dev`
  - Test: `npm run test` (uses Vitest)
- **Mobile:**
  - Install: `cd mobile && npm install`
  - Run: `npm start` (Metro), then use platform-specific commands

## Integration & Communication
- **APIs:** All inter-service and client-server APIs are contract-first. Do not invent endpoints—extend or update `docs/api-specs/` first.
- **Events:** Use Kafka topics as defined in `docs/05-events-kafka.md`.
- **Security:** OAuth2/JWT, RBAC—see `docs/07-security.md`.

## Project-Specific Notes
- **Implementation order:** Follow `docs/11-phase-plan.md` and `tasks/README.md` for phased, day-by-day progress.
- **Testing:** Contract and integration tests are prioritized (see `docs/10-best-practices.md`, `docs/11-phase-plan.md`).
- **Observability:** Logging, metrics, tracing—see `docs/08-observability.md`.

## Examples
- To add a new service: create under `services/`, update `docs/02-microservices.md`, and add API spec in `docs/api-specs/`.
- To update an API: edit the relevant spec in `docs/api-specs/`, then update both backend and frontend/mobile clients.

---
For any new pattern or workflow, check the `docs/` folder first. If unclear, update this file with new conventions as they emerge.
