# Frontend Day 24 – Multi-tenant theming and branding

**Focus:** Enable different institutions or organizations to have customized branding and themes in the LMS frontend.

**References:** [docs/frontend/02-design-system.md](../docs/frontend/02-design-system.md), [docs/01-architecture.md](../docs/01-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Multi-tenant theming and branding being implemented. |
| ✅ Done | The frontend can adapt branding per tenant with minimal effort. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 24 is done_

---

## Checklist

### 1. Theming architecture

- [ ] Confirm how tenant identity is determined on the frontend (subdomain, path, JWT claim).
- [ ] Extend the design system to support theme tokens (colors, logos, typography) per tenant.
- [ ] Add a theme provider that switches based on current tenant.

### 2. Branding assets

- [ ] Wire in tenant-specific logos, favicons, and primary colors.
- [ ] Ensure login, dashboard, and key marketing-like surfaces respect tenant branding.

### 3. Configuration and safety

- [ ] Decide how tenant themes are configured (build-time config, runtime API, or static JSON).
- [ ] Handle missing or misconfigured tenant themes with safe defaults.

### 4. Tests and preview

- [ ] Add a way (e.g. storybook stories, test route, or dev flag) to preview multiple tenant themes.
- [ ] Write basic tests to ensure theme switching works and does not break layout.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 24 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 24 is complete. Next: [Frontend Day 25](frontend-day-25.md) (Offline-friendly patterns and optimistic UI).

