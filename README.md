# Learning Management System (LMS) - Production-Grade Microservices Platform

> **AI Context Note**: This is a comprehensive, production-ready Learning Management System built with microservices architecture. This README provides complete context for understanding the codebase structure, architecture decisions, and implementation details.

## 🎯 Project Overview

A scalable, event-driven Learning Management System supporting course management, enrollment, content delivery, assignments, payments, and analytics. Built with Java 17, Spring Boot 3, React 19, and React Native (Expo).

**Architecture**: Microservices with API Gateway, event-driven communication (Kafka), distributed caching (Redis), and comprehensive observability.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Clients (Web + Mobile)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Edge Layer (CDN + WAF)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│         API Gateway (Spring Cloud Gateway)                   │
│    • JWT Validation  • Rate Limiting  • Routing             │
└─────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬─────┘
      │      │      │      │      │      │      │      │
┌─────▼──────▼──────▼──────▼──────▼──────▼──────▼──────▼─────┐
│              Core Microservices (10 Services)                │
│  User │ Auth │ Course │ Enrollment │ Content │ Assignment   │
│  Search │ Notification │ Payment │ Analytics                │
└─────┬──────────────────────────────────────────────┬────────┘
      │                                               │
┌─────▼───────────────────────────────────────────────▼────────┐
│  Data Layer: PostgreSQL (per-service) │ Redis │ Kafka       │
│  Storage: MinIO (S3-compatible)                              │
└──────────────────────────────────────────────────────────────┘
```

## 🏗️ Repository Structure

```
learning-management-system/
├── docs/                          # Comprehensive documentation (31 docs)
│   ├── 01-architecture.md         # System architecture & design principles
│   ├── 02-microservices.md        # Service breakdown & responsibilities
│   ├── 03-api-gateway.md          # Gateway design, JWT, rate limiting
│   ├── 04-database.md             # Per-service schemas & data models
│   ├── 05-events-kafka.md         # Event-driven architecture
│   ├── 06-redis.md                # Caching & distributed locks
│   ├── 07-security.md             # OAuth2, JWT, RBAC
│   ├── 08-observability.md        # Logging, metrics, tracing
│   ├── 09-devops.md               # Docker, K8s, CI/CD
│   ├── 10-best-practices.md       # Coding standards & testing
│   ├── 11-phase-plan.md           # 5-phase implementation roadmap
│   ├── 31-aws-ecs-fargate-deployment.md  # AWS deployment guide
│   ├── api-specs/                 # OpenAPI-style service specs
│   ├── frontend/                  # Frontend architecture docs
│   ├── mobile/                    # Mobile app docs & checklists
│   └── runbooks/                  # Operational runbooks
│
├── services/                      # Backend microservices (Java 17 + Spring Boot 3)
│   ├── lms-user-service/          # User management, profiles, roles
│   ├── lms-auth-service/          # Authentication & token management
│   ├── lms-course-service/        # Course catalog & curriculum
│   ├── lms-enrollment-service/    # Enrollments & progress tracking
│   ├── lms-content-service/       # Content delivery & storage
│   ├── lms-assignment-service/    # Assignments & grading
│   ├── lms-search-service/        # Full-text search (Elasticsearch)
│   ├── lms-notification-service/  # Email & in-app notifications
│   ├── lms-payment-service/       # Payment processing
│   └── lms-analytics-service/     # Reporting & dashboards
│
├── lms-gateway/                   # API Gateway (Spring Cloud Gateway)
├── lms-common/                    # Shared libraries & utilities
│
├── frontend/                      # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── app/                   # App layout, routing, protected routes
│   │   ├── features/              # Feature modules (auth, courses, etc.)
│   │   ├── shared/                # Shared components, hooks, utils
│   │   └── test/                  # Test utilities & mocks
│   └── package.json               # React Query, Zustand, TailwindCSS
│
├── mobile/                        # React Native + Expo
│   ├── app/                       # Expo Router (file-based routing)
│   ├── src/
│   │   ├── features/              # Feature modules
│   │   ├── shared/                # Shared components & hooks
│   │   └── services/              # API clients
│   └── package.json               # Expo, NativeWind, Socket.io
│
├── infra/                         # Infrastructure as code
│   ├── docker/                    # Docker Compose for local dev
│   │   └── docker-compose-dev.yml # 15+ services orchestration
│   ├── k8s/                       # Kubernetes manifests
│   └── terraform/                 # AWS infrastructure (optional)
│
├── scripts/                       # Automation scripts
│   ├── setup-ecr-repos.sh         # AWS ECR repository setup
│   └── build-all.sh               # Build all services
│
└── pom.xml                        # Maven parent POM (multi-module)
```

## 🔧 Technology Stack

### Backend (Microservices)

- **Language**: Java 17
- **Framework**: Spring Boot 3.4.5, Spring Cloud 2024.0.0
- **API Gateway**: Spring Cloud Gateway 4.2.3
- **Database**: PostgreSQL 16 (per-service isolation)
- **Caching**: Redis 8 (sessions, rate limiting, distributed locks)
- **Messaging**: Apache Kafka (KRaft mode, event-driven)
- **Search**: Elasticsearch 8.15
- **Storage**: MinIO (S3-compatible object storage)
- **Security**: JWT (JJWT 0.12.3), OAuth2, bcrypt
- **Testing**: JUnit 5, Mockito, Testcontainers, Gatling

### Frontend (Web)

- **Framework**: React 19.2.0 + TypeScript 5.9
- **Build Tool**: Vite 7.2.4
- **Styling**: TailwindCSS 4.1.18
- **State Management**:
  - React Query (TanStack) 5.90.20 - Server state
  - Zustand 5.0.11 - Client state
- **Routing**: React Router 7.13.0
- **Forms**: React Hook Form 7.71.1 + Zod 4.3.6
- **UI Components**: Lucide React, Framer Motion, Recharts
- **Testing**: Vitest 4.0.18, Testing Library
- **Dev Tools**: Storybook 10.2.10, PWA support

### Mobile (iOS/Android)

- **Framework**: React Native 0.81.5 + Expo 54
- **Navigation**: Expo Router 6.0.23 (file-based)
- **Styling**: NativeWind 4.0.36 (Tailwind for RN)
- **State**: React Query + Zustand + AsyncStorage
- **Real-time**: Socket.io-client 4.8.3
- **Storage**: Expo SecureStore, AsyncStorage
- **Testing**: Jest, Detox 20.47.0
- **Build**: EAS (Expo Application Services)

### Observability

- **Tracing**: OpenTelemetry + Jaeger 1.60
- **Metrics**: Prometheus + Grafana
- **Logging**: Logstash Logback Encoder + ELK Stack
- **APM**: Micrometer Tracing 1.4.3

### Infrastructure

- **Containers**: Docker + Docker Compose
- **Orchestration**: Kubernetes (manifests provided)
- **Cloud**: AWS ECS Fargate (deployment guide included)
- **CI/CD**: GitHub Actions (pipeline configured)

## 🎯 Microservices Breakdown

| Service                  | Port | Responsibility                          | Database           | Events                                                  |
| ------------------------ | ---- | --------------------------------------- | ------------------ | ------------------------------------------------------- |
| **API Gateway**          | 8080 | Routing, JWT validation, rate limiting  | Redis              | -                                                       |
| **User Service**         | 8081 | User management, profiles, roles, RBAC  | `lms_user`         | Publishes `user.events`                                 |
| **Auth Service**         | 8082 | Login, token lifecycle, refresh, logout | Redis only         | -                                                       |
| **Course Service**       | 8083 | Course catalog, modules, lessons        | `lms_course`       | Publishes `course.events`                               |
| **Enrollment Service**   | 8084 | Enrollments, progress tracking          | `lms_enrollment`   | Publishes `enrollment.events`, Consumes `course.events` |
| **Content Service**      | 8085 | Video/PDF/quiz content, presigned URLs  | `lms_content`      | Publishes `content.events`                              |
| **Assignment Service**   | 8087 | Assignments, submissions, grading       | `lms_assignment`   | Publishes `assignment.events`                           |
| **Search Service**       | 8086 | Full-text search, filters, facets       | Elasticsearch      | Consumes `course.events`, `content.events`              |
| **Notification Service** | 8088 | Email & in-app notifications            | `lms_notification` | Consumes all `*.events`                                 |
| **Payment Service**      | 8089 | Plans, invoices, payment gateway        | `lms_payment`      | Publishes `payment.events`                              |
| **Analytics Service**    | 8090 | Reports, dashboards, aggregates         | `lms_analytics`    | Consumes all `*.events`                                 |

## 🔐 Security Architecture

### Authentication Flow

1. **Login**: `POST /api/v1/auth/token` → Returns JWT access token (15min) + refresh token (7d)
2. **API Calls**: `Authorization: Bearer <access_token>` → Gateway validates JWT
3. **Refresh**: `POST /api/v1/auth/token` with `grant_type=refresh_token`
4. **Logout**: Adds JWT `jti` to Redis blacklist

### Authorization (RBAC)

- **STUDENT**: Enroll, view content, submit assignments
- **INSTRUCTOR**: Create/manage courses, grade assignments
- **ADMIN**: Full access to all resources
- **SUPER_ADMIN**: Cross-tenant management (multi-tenancy)

### Security Features

- JWT with RSA-256 signing
- Bcrypt password hashing
- Redis-based token blacklist
- Rate limiting (per IP & per user)
- CORS configuration
- Security headers (CSP, HSTS, X-Content-Type-Options)
- Input validation (Bean Validation)
- SQL injection prevention (JPA parameterized queries)

## 📡 Event-Driven Architecture

### Kafka Topics

| Topic                   | Partitions | Key          | Retention | Purpose                    |
| ----------------------- | ---------- | ------------ | --------- | -------------------------- |
| `user.events`           | 12         | userId       | 7d        | User lifecycle events      |
| `course.events`         | 24         | courseId     | 7d        | Course updates, publishing |
| `enrollment.events`     | 24         | enrollmentId | 7d        | Enrollment & progress      |
| `content.events`        | 24         | contentId    | 7d        | Content publishing         |
| `assignment.events`     | 24         | assignmentId | 7d        | Submissions & grading      |
| `payment.events`        | 12         | paymentId    | 14d       | Payment processing         |
| `notification.requests` | 12         | userId       | 1d        | Notification triggers      |
| `dlq.<source_topic>`    | 6          | original key | 14d       | Dead letter queue          |

### Event Envelope (Canonical Format)

```json
{
  "eventId": "uuid",
  "eventType": "EnrollmentCreated",
  "aggregateId": "enrollment-uuid",
  "version": 1,
  "timestamp": "2025-02-03T10:00:00Z",
  "payload": {
    /* domain-specific data */
  },
  "metadata": {
    "source": "enrollment-service",
    "traceId": "abc123",
    "userId": "user-uuid"
  }
}
```

### Idempotency

- Redis key: `idem:{consumerName}:{eventId}` (TTL: 24h)
- Prevents duplicate event processing

## 🗄️ Database Architecture

### Per-Service Databases

- **User DB** (`lms_user`): users, profiles, roles, user_roles, organizations
- **Course DB** (`lms_course`): courses, modules, lessons, course_instructors
- **Enrollment DB** (`lms_enrollment`): enrollments, lesson_progress
- **Content DB** (`lms_content`): content_items, content_versions, quiz_questions
- **Assignment DB** (`lms_assignment`): assignments, submissions, grades
- **Payment DB** (`lms_payment`): plans, invoices, payments
- **Analytics DB** (`lms_analytics`): event_snapshots, aggregates
- **Notification DB**: notification_requests, notification_history

### Data Patterns

- **Isolation**: Each service owns its schema (no shared tables)
- **Transactions**: Single-service only (no distributed transactions)
- **Consistency**: Eventual consistency via Kafka events
- **Pagination**: Cursor-based for large lists
- **Indexes**: B-tree on FKs, composite indexes for queries

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+ (for frontend)
- Docker & Docker Compose
- Maven 3.8+
- PostgreSQL 16 (or use Docker)
- Redis 8 (or use Docker)

### Local Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd learning-management-system
```

2. **Start infrastructure services**

```bash
cd infra/docker
docker-compose -f docker-compose-dev.yml up -d postgres redis kafka elasticsearch minio
```

3. **Build all services**

```bash
./mvnw clean install
```

4. **Run services individually** (or use Docker Compose)

```bash
# Terminal 1: Gateway
cd lms-gateway && ./mvnw spring-boot:run

# Terminal 2: User Service
cd services/lms-user-service && ./mvnw spring-boot:run

# Terminal 3: Auth Service
cd services/lms-auth-service && ./mvnw spring-boot:run

# ... repeat for other services
```

5. **Start frontend**

```bash
cd frontend
npm install
npm run dev
# Access at http://localhost:5173
```

6. **Start mobile app**

```bash
cd mobile
npm install
npm start
# Scan QR code with Expo Go app
```

### Using Docker Compose (Recommended)

```bash
cd infra/docker
docker-compose -f docker-compose-dev.yml up
```

This starts all 15+ services:

- PostgreSQL, Redis, Kafka, Elasticsearch, Kibana
- Jaeger, Prometheus, Grafana, MinIO
- All 10 microservices + API Gateway

**Access Points**:

- API Gateway: http://localhost:8080
- Kafka UI: http://localhost:9002
- Kibana: http://localhost:5601
- Grafana: http://localhost:3001
- Jaeger: http://localhost:16686
- MinIO Console: http://localhost:9001

## 📝 API Documentation

### Base URL

```
http://localhost:8080/api/v1
```

### Key Endpoints

#### Authentication

```
POST   /api/v1/auth/token          # Login (get access + refresh tokens)
POST   /api/v1/auth/token          # Refresh (grant_type=refresh_token)
POST   /api/v1/auth/logout         # Logout (blacklist token)
```

#### Users

```
GET    /api/v1/users               # List users (admin)
POST   /api/v1/users               # Create user
GET    /api/v1/users/{id}          # Get user
PUT    /api/v1/users/{id}          # Update user
GET    /api/v1/users/me            # Get current user profile
```

#### Courses

```
GET    /api/v1/courses             # List courses (catalog)
POST   /api/v1/courses             # Create course (instructor)
GET    /api/v1/courses/{id}        # Get course details
PUT    /api/v1/courses/{id}        # Update course
GET    /api/v1/courses/{id}/modules # List modules
```

#### Enrollments

```
POST   /api/v1/enrollments         # Enroll in course
GET    /api/v1/enrollments         # List my enrollments
GET    /api/v1/enrollments/{id}    # Get enrollment details
PUT    /api/v1/enrollments/{id}/progress # Update progress
```

See `docs/api-specs/` for complete API specifications.

## 🧪 Testing

### Backend Testing

```bash
# Unit tests
./mvnw test

# Integration tests (requires Docker)
./mvnw verify

# Specific service
./mvnw test -pl services/lms-user-service

# Load tests
cd load-tests && ./run-gatling.sh
```

### Frontend Testing

```bash
cd frontend
npm test              # Unit tests (Vitest)
npm run test:watch    # Watch mode
npm run storybook     # Component development
```

### Mobile Testing

```bash
cd mobile
npm test              # Jest unit tests
npm run test:e2e      # Detox E2E tests
```

## 📊 Observability

### Logging

- **Format**: Structured JSON (Logstash encoder)
- **Fields**: timestamp, level, message, service, traceId, spanId, userId
- **Destination**: ELK Stack (Elasticsearch + Kibana)
- **Access**: http://localhost:5601

### Metrics

- **Exporter**: Prometheus (actuator endpoint)
- **Dashboards**: Grafana
- **Key Metrics**:
  - `http_server_requests_seconds` (latency)
  - `kafka_consumer_lag`
  - `redis_connections_active`
  - `jvm_memory_used_bytes`
- **Access**: http://localhost:3001

### Tracing

- **Standard**: OpenTelemetry + W3C Trace Context
- **Backend**: Jaeger
- **Propagation**: HTTP headers + Kafka message metadata
- **Access**: http://localhost:16686

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

1. **On PR**: Build → Unit tests → Integration tests → Security scan
2. **On Merge**: Full test suite → Build Docker images → Push to ECR
3. **On Release**: Deploy to staging → Smoke tests → Manual approval → Deploy to prod

### Deployment Strategies

- **Blue-Green**: Zero-downtime deployments
- **Canary**: Gradual rollout with traffic splitting
- **Feature Flags**: Runtime feature toggles (Redis-based)

## 📚 Documentation Guide

### For New Developers

1. Start with `docs/01-architecture.md` - System overview
2. Read `docs/11-phase-plan.md` - Implementation roadmap
3. Review `docs/onboarding.md` - Developer setup guide
4. Check `docs/api-specs/` - API contracts

### For Operations

1. `docs/09-devops.md` - Deployment guide
2. `docs/runbooks/` - Operational procedures
3. `docs/12-disaster-recovery.md` - DR strategy
4. `docs/31-aws-ecs-fargate-deployment.md` - AWS deployment

### For Security

1. `docs/07-security.md` - Auth & RBAC
2. `docs/security-audit-report.md` - Security findings
3. `docs/24-compliance-and-security-controls.md` - Compliance

## 🎯 Implementation Phases

### Phase 1 - MVP (Core Features)

- ✅ User, Auth, Course, Enrollment services
- ✅ API Gateway with JWT validation
- ✅ PostgreSQL + Redis + Docker Compose
- **Deliverable**: Register → Login → Browse courses → Enroll → Track progress

### Phase 2 - Scalability

- ✅ Content & Assignment services
- ✅ Kafka event-driven architecture
- ✅ Search service (Elasticsearch)
- ✅ Redis caching & distributed locks
- **Deliverable**: Full learning path with content and assignments

### Phase 3 - Enterprise Features

- ✅ Notification service (email + in-app)
- ✅ Payment service (mock gateway)
- ✅ Analytics service (reporting)
- ✅ RBAC enforcement
- **Deliverable**: Notifications, payments, analytics

### Phase 4 - Observability

- ✅ OpenTelemetry tracing
- ✅ Prometheus metrics + Grafana dashboards
- ✅ ELK logging stack
- ✅ Alerting rules
- **Deliverable**: Full visibility and monitoring

### Phase 5 - Production Hardening

- ✅ Security audit & penetration testing
- ✅ Load testing & performance optimization
- ✅ CI/CD pipeline with security gates
- ✅ Kubernetes deployment manifests
- ✅ AWS ECS Fargate deployment guide
- **Deliverable**: Production-ready system

## 🌐 Multi-Tenancy Support

### Architecture

- **Model**: Pooled database with `organization_id` discriminator
- **Isolation**: Row-level security per tenant
- **Resolution**: JWT contains `org_id` → Gateway injects `X-Tenant-Id` header
- **Roles**: SUPER_ADMIN (global), ORG_ADMIN (tenant), INSTRUCTOR, STUDENT

### Tenant Context

```java
// Automatic tenant filtering in repositories
TenantContext.setTenantId(organizationId);
courseRepository.findAll(); // Automatically filtered by org_id
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/lms
SPRING_DATASOURCE_USERNAME=lms
SPRING_DATASOURCE_PASSWORD=lms

# Redis
SPRING_DATA_REDIS_HOST=redis
SPRING_DATA_REDIS_PORT=6379

# Kafka
SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9093

# JWT
JWT_SECRET=your-secret-key-here

# Storage (MinIO)
LMS_STORAGE_ENDPOINT=http://minio:9000
LMS_STORAGE_ACCESS_KEY=minioadmin
LMS_STORAGE_SECRET_KEY=minioadmin

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=http://jaeger:4317
MANAGEMENT_METRICS_EXPORT_PROMETHEUS_ENABLED=true
```

## 🤝 Contributing

### Code Standards

- **Language**: Java 17+ with Spring Boot 3
- **Style**: Google Java Style (enforced by Spotless)
- **Package Structure**: Package-by-feature within each service
- **Testing**: Minimum 80% code coverage
- **Documentation**: JavaDoc for public APIs

### Git Workflow

1. Create feature branch: `feature/your-feature-name`
2. Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
3. Run tests: `./mvnw verify`
4. Create PR with description and tests
5. Wait for CI checks and code review

## 📞 Support & Resources

### Documentation

- **Architecture**: `docs/01-architecture.md`
- **API Specs**: `docs/api-specs/`
- **Runbooks**: `docs/runbooks/`
- **Frontend**: `docs/frontend/`
- **Mobile**: `docs/mobile/`

### Monitoring Dashboards

- **Grafana**: http://localhost:3001 (admin/admin)
- **Kibana**: http://localhost:5601
- **Jaeger**: http://localhost:16686
- **Kafka UI**: http://localhost:9002

### Health Checks

```bash
# Gateway
curl http://localhost:8080/actuator/health

# User Service
curl http://localhost:8081/actuator/health

# All services expose /actuator/health
```

## 📄 License

[Add your license information here]

## 🙏 Acknowledgments

Built with modern microservices patterns and best practices from:

- Spring Boot & Spring Cloud ecosystem
- Domain-Driven Design (DDD)
- Event-Driven Architecture (EDA)
- CQRS patterns
- Twelve-Factor App methodology

---

**For AI Assistants**: This README provides comprehensive context about the LMS platform. Key areas to understand:

1. **Architecture**: Microservices with API Gateway, event-driven (Kafka), per-service databases
2. **Tech Stack**: Java 17 + Spring Boot 3 (backend), React 19 (web), React Native + Expo (mobile)
3. **Security**: JWT-based auth, RBAC with 4 roles, Redis token blacklist
4. **Data Flow**: Sync APIs for user actions, async Kafka events for cross-cutting concerns
5. **Observability**: OpenTelemetry tracing, Prometheus metrics, ELK logging
6. **Deployment**: Docker Compose (local), Kubernetes (prod), AWS ECS Fargate (cloud)
7. **Documentation**: 31 comprehensive docs in `/docs/` covering all aspects
8. **Testing**: Unit (JUnit), Integration (Testcontainers), Contract (Spring Cloud Contract), Load (Gatling)

When working with this codebase, always refer to the relevant documentation in `/docs/` for detailed specifications and design decisions.
