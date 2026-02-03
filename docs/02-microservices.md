# 2. Microservices Breakdown

## Service Overview

| Service | Responsibility | DB | Sync APIs | Publishes | Consumes |
|---------|----------------|-----|-----------|-----------|----------|
| **User Service** | Users, profiles, roles, org units | PostgreSQL `lms_user` | CRUD users, roles, profile | `user.events` | — |
| **Auth Service** | Login, tokens, refresh, logout | None (stateless + Redis) | Login, refresh, logout | — | — |
| **Course Service** | Courses, modules, curriculum | PostgreSQL `lms_course` | CRUD courses, modules | `course.events` | — |
| **Enrollment Service** | Enrollments, progress, completion | PostgreSQL `lms_enrollment` | Enroll, progress, list | `enrollment.events` | `course.events` |
| **Content Service** | Videos, PDFs, quizzes, metadata | PostgreSQL `lms_content` | CRUD content, presigned URLs | `content.events` | — |
| **Assignment Service** | Assignments, submissions, grades | PostgreSQL `lms_assignment` | CRUD assignments, submit, grade | `assignment.events` | — |
| **Notification Service** | Email, in-app, templates | None (event-driven) | In-app list, mark read | — | `*.events` |
| **Payment Service** | Plans, invoices, mock gateway | PostgreSQL `lms_payment` | Checkout, webhooks (mock) | `payment.events` | — |
| **Search Service** | Full-text, filters, facets | Elasticsearch/OpenSearch | Search, suggest, filters | — | `course.events`, `content.events` |
| **Analytics Service** | Reports, dashboards, aggregates | PostgreSQL `lms_analytics` | Reports, exports | — | All `*.events` |

## Sync vs Async Decision Guide

| Use case | Use | Reason |
|----------|-----|--------|
| Login, refresh, logout | **Sync (REST)** | Immediate success/failure; user waits for token. |
| Enroll in course, submit assignment | **Sync (REST)** | User expects confirmation and consistency. |
| Get course, get progress, list enrollments | **Sync (REST)** | Read-your-writes; low latency expected. |
| Index course/content for search | **Async (Kafka)** | Decouple indexing from write path; scale independently. |
| Send email/in-app notification | **Async (Kafka)** | No need to block request; multiple consumers. |
| Record analytics / aggregates | **Async (Kafka)** | Eventually consistent; batch-friendly. |
| Invalidate cache on update | **Async or sync** | Can publish event (async) or invalidate in same request (sync). |

## Where Each Topic Is Covered

| Topic | Document |
|-------|----------|
| API routes and gateway | [03-api-gateway.md](03-api-gateway.md) |
| Database schema per service | [04-database.md](04-database.md) |
| Kafka topics and events | [05-events-kafka.md](05-events-kafka.md) |
| Redis usage | [06-redis.md](06-redis.md) |
| Auth and RBAC | [07-security.md](07-security.md) |
| Phase 1 API contracts | [api-specs/](api-specs/) |
