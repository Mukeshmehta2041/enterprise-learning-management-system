# Database Read Scaling & Replicas

## Overview
To handle high read traffic (e.g., browsing the course catalog) and ensure high availability, the LMS uses **PostgreSQL Read Replicas**. This offloads read-intensive queries from the primary database, improving overall system throughput.

## 1. Architecture
- **Primary Database:** Handles all Write operations (INSERT, UPDATE, DELETE).
- **Read Replicas:** Handle Read operations (SELECT). We use streaming replication to keep replicas in sync with the primary.
- **Routing Layer:** The application layer automatically routes traffic based on the transaction type.

## 2. Implementation: Dynamic Routing DataSource
In Spring Boot, we use `AbstractRoutingDataSource` to switch between `PRIMARY` and `REPLICA` data sources at runtime.

### Logic:
1. When a method is called with `@Transactional(readOnly = true)`, the datasource switches to the **Replica**.
2. When a method is called with `@Transactional` (or `readOnly = false`), it uses the **Primary**.
3. If no transaction is present, it defaults to the **Primary**.

## 3. Configuration in Services
Read-heavy services (Course, Enrollment, Search) are configured with two connection strings:
- `SPRING_DATASOURCE_URL` (Primary)
- `SPRING_DATASOURCE_REPLICA_URL` (Replica)

## 4. Replication Lag handling
- **Lag Monitoring:** Replica lag is monitored via Prometheus. 
- **Consistency:** We accept **eventual consistency** for catalog listings. For critical paths (e.g., viewing an enrollment immediately after payment), we use `@Transactional(readOnly = false)` to force a read from the primary (Read-Your-Writes).

## 5. Benefits
- **Scalability:** Add more replicas horizontally as traffic grows.
- **Isolation:** Analytics or heavy report queries don't impact transactional performance on the primary.
- **HA:** Replicas can be promoted to Primary in case of a disaster.
