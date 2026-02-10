# Mobile Day 42 – Experimentation and feature flags in the mobile app

**Focus:** Introduce feature flags and experimentation scaffolding tailored for mobile releases.

**References:** Feature flag/experimentation service docs if used, [docs/11-phase-plan.md](../docs/11-phase-plan.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | |
| ✅ Done | Mobile feature flags and experimentation scaffolding being added. |
| ✅ Done | Mobile app can roll out features and experiments safely. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 42 is done_

---

## Checklist

### 1. Feature flag integration

- [ ] Decide on feature flag configuration (remote service, config file, or API).
- [ ] Implement a simple mobile hook/API (e.g. `useFeatureFlag('newMobileDashboard')`) for conditional rendering.

### 2. Sample flagged feature

- [ ] Gate at least one non-critical UI or flow behind a mobile feature flag.
- [ ] Ensure flags can differ by environment (dev, staging, prod) and possibly user segments.

### 3. Experimentation basics

- [ ] Define a simple experiment (e.g. alternate layout for course list) and wire variants in code.
- [ ] Capture variant assignment in analytics events for downstream analysis.

### 4. Safety and cleanup

- [ ] Provide a clear pattern for deprecating/removing old flags and experiments.
- [ ] Document how to add new flags/experiments to the mobile app.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 42 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 42 is complete. Next: [Mobile Day 43](mobile-day-43.md) (Advanced navigation patterns and nested flows).

