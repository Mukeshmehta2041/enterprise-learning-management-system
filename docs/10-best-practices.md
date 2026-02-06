# 10. Best Practices

## Coding standards

- **Language:** Java 17+; Spring Boot 3.x.
- **Formatting:** Consistent style (e.g. Google Java Style or Spotless); apply on commit or in CI.
- **Package structure:** Prefer package-by-feature within each service, e.g.:
  - `.<service>.domain` – entities, value objects, domain logic
  - `.<service>.api` – REST controllers, DTOs, validation
  - `.<service>.application` – use cases, application services
  - `.<service>.infra` – persistence, Kafka, Redis, external clients

## Exception handling

- **Global handler:** Use `@ControllerAdvice` (or `@RestControllerAdvice`) to map exceptions to HTTP responses. Return a stable error body (e.g. `code`, `message`); do not expose stack traces or internal details.
- **Domain exceptions:** Define domain-specific exceptions (e.g. `UserNotFound`, `CourseNotPublished`); map them in the advice to appropriate status codes (404, 409, 422, etc.).

## Validation

- **DTOs:** Use Bean Validation (`@NotNull`, `@Size`, `@Email`, etc.) on request DTOs; validate at controller or filter layer.
- **Business rules:** Check existence and ownership in application layer (e.g. “course exists”, “user is instructor of this course”) and throw domain exceptions when violated.

## Testing strategy

| Layer | What to test | Tools |
|-------|----------------|------|
| Unit | Domain logic, application service logic (mocked repos) | JUnit 5, Mockito |
| Integration | REST APIs with real DB (and optionally Kafka/Redis) | Spring Boot Test, Testcontainers (PostgreSQL, Kafka, Redis) |
| Contract | Gateway ↔ service API contract (request/response) | Pact or Spring Cloud Contract |
| Load | Critical paths (login, enroll, list courses) under load | Gatling or k6 |

Run unit and integration tests in CI; contract tests when gateway or service API changes; load tests on release or periodically.

### Running Tests

- **Unit tests:** `./mvnw test`
- **Integration tests:** `./mvnw verify` (requires Docker for Testcontainers)
- **Service-specific:** `./mvnw test -pl services/lms-user-service`
- **CI/CD:** Use a modern CI (GitHub Actions, GitLab CI, etc.) that supports Docker; Testcontainers will spin up sidecars on host or via Docker network.

## API documentation

...

## Feature Flags

- **Mechanism:** Use `FeatureFlagService` (from `lms-common`) which checks Redis overrides first, then falls back to static application properties.
- **Rollout Process:**
  1. **Add Flag:** Define a new flag in `application.yml` under `lms.features.flags.<name>`.
  2. **Implement:** Wrap new code or behavioral changes using `featureFlagService.isEnabled("<name>")`.
  3. **Deploy:** Deploy with the flag set to `false` (default).
  4. **Hot Toggle:** Enable for testing or gradual rollout by setting a Redis override: `POST /api/v1/internal/features/<name>/override?enabled=true`.
  5. **Finalize:** Once stable, update the static property to `true` and eventually remove the check and flag from code.
- **Safe Changes:** Use flags to hide incomplete features and support side-by-side versions during migrations.

