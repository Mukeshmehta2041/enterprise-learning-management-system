# Multi-Tenancy and Organization Scope

This document outlines the multi-tenant architecture for the LMS.

## 1. Multi-Tenancy Model

- **Strategy**: Pooled Database with Discriminator Column (`organization_id`).
- **Isolation**: Every tenant-scoped table includes an `organization_id` (UUID).
- **Entities Scoped**: `User`, `Course`, `Enrollment`, `AuditLog`.

## 2. Tenant Resolution

1. **Gateway Layer**:
    - Extract `org_id` from JWT claims (resolved during login).
    - Injects `X-Tenant-Id` header into all downstream requests.
2. **Service Layer**:
    - `TenantFilter` in `lms-common` intercept the header.
    - Stores the ID in `TenantContext` (ThreadLocal).
3. **Persistence Layer**:
    - Spring Data JPA repositories include `organizationId` in all queries.
    - Hibernate Filters or Spring Data `@Query` are used to enforce isolation.

## 3. Roles and Permissions

| Role | Scope | Description |
|------|-------|-------------|
| **ROLE_SUPER_ADMIN** | Global | Can manage all organizations, system-wide config, and stats. |
| **ROLE_ORG_ADMIN** | Tenant | Can manage users and courses within their organization only. |
| **ROLE_INSTRUCTOR** | Tenant | Can manage their assigned courses within their organization. |
| **ROLE_STUDENT** | Tenant | Can access courses within their organization. |

## 4. Cross-Tenant Isolation

- **Query Enforcement**: Every repository method must include `findBy...AndOrganizationId`.
- **Validation**: Incoming IDs (e.g., `courseId`) are validated against the current `TenantContext.getTenantId()`.
- **Event Bus**: Kafka events include the `organizationId` in the message envelope.
