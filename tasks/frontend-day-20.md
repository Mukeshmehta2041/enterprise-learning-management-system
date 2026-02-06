# Frontend Day 20 – Frontend production readiness and rollout checklist

**Focus:** Ensure the frontend is ready for staging and production rollouts, with proper configuration, monitoring, and rollback options.

**References:** [docs/frontend/07-devops-frontend.md](../docs/frontend/07-devops-frontend.md), [docs/09-devops.md](../docs/09-devops.md), [tasks/day-20.md](day-20.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Frontend production readiness checklist being executed. |
| ✅ Done | Frontend is production-ready with rollout and rollback procedures defined. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 20 is done_

---

## Checklist

### 1. Environment configuration and build

- [ ] Verify environment-specific configuration for frontend builds (dev, staging, prod): API base URLs, feature flags, analytics keys.
- [ ] Ensure secrets are provided via environment variables or secure config, not hard-coded in the bundle.
- [ ] Confirm that production builds are minified, tree-shaken, and use appropriate cache headers.

### 2. Observability and monitoring

- [ ] Integrate frontend error tracking (e.g. Sentry) and connect it to environment identifiers.
- [ ] Expose basic metrics (page views, key funnel steps) through your analytics tooling.
- [ ] Ensure error boundaries and logging include enough context (user role, route) without leaking PII.

### 3. Deployment and rollback

- [ ] Document the deployment process for the frontend (static hosting, CDN invalidation, container image, etc.).
- [ ] Provide a clear rollback strategy (prior build artifact, blue/green, or canary).
- [ ] Test a staging deployment end-to-end, including cache invalidation and asset serving.

### 4. Smoke tests and UAT

- [ ] Define a smoke test checklist for staging/prod (login, browse courses, enroll, view content, instructor analytics).
- [ ] Enable UAT testers to easily access staging builds with the correct configuration.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 20 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 20 is complete. Next: [Frontend Day 21](frontend-day-21.md) (Privacy, consent, and user data settings UI).

