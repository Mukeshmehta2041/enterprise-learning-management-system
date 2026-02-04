# LMS Docker Compose (Dev)

Run the full LMS stack locally with PostgreSQL, Redis, Kafka, API Gateway, and all services.

## Prerequisites

- Docker and Docker Compose
- Build from **project root** first: `mvn clean package -DskipTests`

## How to run

From this directory (`infra/docker/`):

```bash
docker compose -f docker-compose-dev.yml up --build
```

Or from project root:

```bash
cd infra/docker && docker compose -f docker-compose-dev.yml up --build
```

## Environment variables (optional)

| Variable     | Description                          | Default |
|-------------|--------------------------------------|---------|
| `JWT_SECRET` | Shared secret for JWT (gateway + auth) | 64-char hex (see compose file) |

Set for production: `export JWT_SECRET=your-256-bit-secret-hex`

## Image versions (pinned stable)

| Image                 | Tag        | Notes                                                    |
|-----------------------|------------|----------------------------------------------------------|
| `postgres`            | `16`       | Official; PostgreSQL 16.x (keeps existing volume compatible) |
| `redis`               | `8-alpine` | Official; Redis 8.x, Alpine    |
| `apache/kafka-native` | `latest`   | Official Apache Kafka, KRaft mode (native image) |

LMS apps (gateway, user, auth, course, enrollment) are built from source.

**Upgrading PostgreSQL:** The compose uses `postgres:16` so existing `postgres_data` volumes keep working. To move to 17+, either remove the volume first (`docker compose down -v`, then `up`; **data is lost**) or run [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html) with a new volume.

## Services and ports

| Service              | Port (host) | Notes                    |
|----------------------|-------------|---------------------------|
| API Gateway          | 8080        | Entry point for all APIs  |
| PostgreSQL           | 5432        | DB `lms`, schemas per svc |
| Redis                | 6379        | Sessions, JWT blacklist   |
| Kafka                | 9092        | Event bus                 |
| User / Auth / Course / Enrollment | (internal) | Reach via gateway only    |

## Quick test

1. Register: `POST http://localhost:8080/api/v1/users` (body: `{"email":"u@example.com","password":"pass","displayName":"User"}`).
2. Login: `POST http://localhost:8080/api/v1/auth/token` with `grant_type=password`, `username=u@example.com`, `password=pass`.
3. Use returned `access_token` as `Authorization: Bearer <token>` for `/api/v1/courses`, `/api/v1/enrollments`, etc.
