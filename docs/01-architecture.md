# 1. High-Level Architecture

## System Context

Requests flow from clients through an edge layer and a single API Gateway into microservices. Services use REST for user-facing operations and Kafka for cross-cutting concerns (notifications, search indexing, analytics). Each service owns its data store; Redis is used for sessions, cache, and distributed coordination.

```mermaid
flowchart LR
    subgraph clients [Clients]
        Web[Web App]
        Mobile[Mobile App]
    end
    subgraph edge [Edge]
        CDN[CDN]
        WAF[WAF / Rate Limiter]
    end
    subgraph gateway [API Gateway]
        GW[Spring Cloud Gateway]
    end
    subgraph core [Core Services]
        UserSvc[User]
        AuthSvc[Auth]
        CourseSvc[Course]
        EnrollSvc[Enrollment]
        Other[Content, Assignment, etc.]
    end
    subgraph data [Data and Messaging]
        Kafka[Kafka]
        Redis[(Redis)]
        PG[(PostgreSQL)]
    end
    clients --> edge --> gateway --> UserSvc
    gateway --> AuthSvc
    gateway --> CourseSvc
    gateway --> EnrollSvc
    gateway --> Other
    UserSvc --> PG
    CourseSvc --> PG
    EnrollSvc --> PG
    Other --> PG
    UserSvc --> Kafka
    CourseSvc --> Kafka
    EnrollSvc --> Kafka
    Other --> Kafka
    UserSvc --> Redis
    AuthSvc --> Redis
    CourseSvc --> Redis
    EnrollSvc --> Redis
```

## Component Diagram

```mermaid
flowchart TB
    subgraph clients [Clients]
        Web[Web App]
        Mobile[Mobile App]
    end

    subgraph edge [Edge Layer]
        CDN[CDN]
        WAF[WAF / Rate Limiter]
    end

    subgraph gateway [API Gateway]
        GW[Spring Cloud Gateway]
        AuthFilter[Auth / JWT Validation]
    end

    subgraph core [Core Microservices]
        UserSvc[User Service]
        AuthSvc[Auth Service]
        CourseSvc[Course Service]
        EnrollSvc[Enrollment Service]
        ContentSvc[Content Service]
        AssignSvc[Assignment Service]
        NotifSvc[Notification Service]
        PaymentSvc[Payment Service]
        SearchSvc[Search Service]
        AnalyticsSvc[Analytics Service]
    end

    subgraph data [Data and Messaging]
        Kafka[Apache Kafka]
        Redis[(Redis)]
        PG1[(User DB)]
        PG2[(Course DB)]
        PG3[(Content DB)]
    end

    clients --> edge --> gateway
    gateway --> UserSvc
    gateway --> AuthSvc
    gateway --> CourseSvc
    gateway --> EnrollSvc
    gateway --> ContentSvc
    gateway --> AssignSvc
    gateway --> NotifSvc
    gateway --> PaymentSvc
    gateway --> SearchSvc
    gateway --> AnalyticsSvc

    UserSvc --> PG1
    CourseSvc --> PG2
    EnrollSvc --> PG2
    ContentSvc --> PG3
    AssignSvc --> PG3
    NotifSvc --> Kafka
    PaymentSvc --> Kafka
    SearchSvc --> Kafka
    AnalyticsSvc --> Kafka

    UserSvc --> Kafka
    CourseSvc --> Kafka
    EnrollSvc --> Kafka
    ContentSvc --> Kafka
    AssignSvc --> Kafka
    Kafka --> NotifSvc
    Kafka --> SearchSvc
    Kafka --> AnalyticsSvc

    UserSvc --> Redis
    AuthSvc --> Redis
    CourseSvc --> Redis
    EnrollSvc --> Redis
```

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Single entry** | All client traffic enters via the API Gateway. No direct access to backend services from the internet. |
| **Sync for user actions** | Login, enroll, submit assignment, get course, get progress: use REST for immediate response and clear success/failure. |
| **Async for cross-cutting** | Search indexing, notifications, analytics: use Kafka so producers stay decoupled and multiple consumers can subscribe. |
| **Database per service** | Each service owns its schema (or database). No shared DB access across services; integrate via APIs and events. |
| **Redis for shared state** | Sessions, JWT blacklist, refresh tokens, rate limits, cache, and distributed locks use Redis (optionally Redis Cluster for HA). |

## Data Flow Summary

- **Request path:** Client → Edge (CDN/WAF) → Gateway (auth, rate limit, route) → Target service → DB / Redis / Kafka as needed.
- **Response path:** Service → Gateway → Client.
- **Event path:** Service publishes to Kafka → Consumers (Notification, Search, Analytics) process asynchronously.

See [02-microservices.md](02-microservices.md) for service responsibilities and [03-api-gateway.md](03-api-gateway.md) for routing and security at the gateway.
