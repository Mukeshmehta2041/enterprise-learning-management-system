# Frontend Day 32 – Code splitting, lazy loading, and bundle analysis

**Focus:** Reduce initial load times by splitting bundles and lazily loading heavy routes and components.

**References:** Vite/webpack docs, [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Code splitting and lazy loading being implemented. |
| ✅ Done | Bundle sizes are reduced and large features load on demand. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 32 is done_

---

## Checklist

### 1. Bundle analysis

- [ ] Run a bundle analyzer for production builds to identify large dependencies and entry points.
- [ ] Document the biggest contributors to bundle size.

### 2. Route-based code splitting

- [ ] Implement lazy loading for major routes (e.g. analytics, admin, instructor tools) using `React.lazy` or framework helpers.
- [ ] Provide fallback loading components for lazily-loaded routes.

### 3. Component-level splitting

- [ ] Lazily load particularly heavy components (e.g. rich text editors, chart libraries) used in less-frequent views.
- [ ] Ensure tree shaking works for modular libraries.

### 4. Verification

- [ ] Compare initial bundle sizes and load times before and after changes.
- [ ] Manually test lazy-loaded routes to verify smooth behavior and error handling.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 32 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 32 is complete. Next: [Frontend Day 33](frontend-day-33.md) (List virtualization and heavy screen optimization).

