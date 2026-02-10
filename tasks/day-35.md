# Day 35 – Multi-tenancy and organization scope

**Focus:** Introduce organization/tenant dimension; scope users, courses, and enrollments by tenant; tenant isolation and admin.

**References:** [docs/04-database.md](../docs/04-database.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Multi-tenant context and filter implemented in lms-common; strategy documented. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Tenant model

- [x] Add `organizations` (or `tenants`) table: id, name, slug, settings, created_at. Add `organization_id` (FK) to users, courses, and optionally enrollments. Document single-tenant vs multi-tenant scope (e.g. one org per deployment or many orgs in one DB).
- [x] Migrations and indexes; ensure all tenant-scoped queries filter by `organization_id`.

### 2. Scoping and isolation

- [x] Resolve tenant from JWT (e.g. `org_id` claim) or from user’s default org; pass `X-Tenant-Id` or equivalent from gateway. Every list and get filters by tenant; reject cross-tenant access with 403.
- [x] Admin: super-admin can switch tenant or list orgs; org-admin can manage only their org’s users and courses. Document roles (super-admin, org-admin, instructor, student).

### 3. Data and config per tenant

- [x] Feature flags, rate limits, and quotas can be per-tenant (from config or DB). Seed or API to create org and assign users; optional branding (name, logo URL) per org.
- [x] Ensure no data leakage in logs or exports (e.g. do not mix tenants in one export).

### 4. Verify

- [x] Create two tenants; create users and courses in each; confirm isolation (user in org A cannot see org B’s courses). Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 35 is complete. Next: [Day 36](day-36.md) (Real-time updates – WebSocket or SSE).
