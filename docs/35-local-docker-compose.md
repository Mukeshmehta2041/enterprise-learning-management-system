# Local Docker Compose Guide

This guide starts the LMS backend plus frontend with Docker Compose for local development.

## Prerequisites

- Docker Engine with Compose v2
- At least 8 GB RAM available to Docker (Elasticsearch and Kafka need memory)

## Configuration

1. Create a local environment file from the template:

```bash
cp .env.compose.example .env.compose
```

2. Update secrets in .env.compose, especially:

- JWT_SECRET
- MAILTRAP_USERNAME and MAILTRAP_PASSWORD

## Start The Stack

```bash
docker compose --env-file .env.compose up --build -d
```

## Check Status

```bash
docker compose ps
docker compose logs -f lms-gateway
```

Primary local endpoints:

- Frontend: http://localhost:3001
- API Gateway: http://localhost:8080
- Jaeger UI: http://localhost:16686
- MinIO API: http://localhost:9000
- MinIO Console: http://localhost:9001
- Elasticsearch: http://localhost:9200

## Stop The Stack

```bash
docker compose down
```

To also remove local data volumes:

```bash
docker compose down -v
```

## Current Limitation

The gateway and auth service still reference lms-user-service routes, but that module is not present in this repository. User-related endpoints will return upstream routing errors until that service is added or routes are changed.
