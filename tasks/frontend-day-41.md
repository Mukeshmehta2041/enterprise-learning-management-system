# Frontend Day 41 – Admin dashboards and feature flags

**Focus:** Provide admin-focused dashboards and introduce feature flags to control rollout of frontend features.

**References:** [docs/11-phase-plan.md](../docs/11-phase-plan.md), any internal admin/ops docs.

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Admin dashboards and feature flags being added. |
| ✅ Done | Admins have a clear overview and controlled feature rollout. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 41 is done_

---

## Checklist

### 1. Admin dashboards

- [ ] Create or refine an admin area with high-level stats (users, courses, active enrollments, errors).
- [ ] Link to deeper analytics and logs where appropriate (backend dashboards, APM tools).

### 2. Feature flag infrastructure

- [ ] Choose or confirm the feature flag mechanism (config file, API-driven, or external service).
- [ ] Implement a simple feature flag hook/api (e.g. `useFeatureFlag('newDashboard')`) in the frontend.

### 3. Gated features

- [ ] Gate at least one non-critical feature behind a flag for controlled rollout.
- [ ] Ensure flags can be toggled per environment (dev, staging, prod).

### 4. Documentation

- [ ] Document how to add new feature flags and which flags currently exist.
- [ ] Ensure admin or ops folks know where to manage flags (if not code-only).

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 41 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 41 is complete. Next: [Frontend Day 42](frontend-day-42.md) (Experimentation and A/B testing scaffolding).

