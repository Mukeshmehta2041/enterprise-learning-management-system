# Frontend Day 42 – Experimentation and A/B testing scaffolding

**Focus:** Lay the groundwork for safe UI experiments and A/B tests in the LMS frontend.

**References:** Any experimentation platform docs you use, [docs/11-phase-plan.md](../docs/11-phase-plan.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Experimentation scaffolding being implemented. |
| ✅ Done | Frontend can run small UX experiments in a controlled way. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 42 is done_

---

## Checklist

### 1. Experiment framework

- [ ] Decide how experiments are configured (config file, remote flags, experimentation service).
- [ ] Implement a minimal API (e.g. `useExperiment('newLanding')`) to branch UI safely.

### 2. Sample experiment

- [ ] Implement one small experiment (e.g. variant of course listing or CTA button copy).
- [ ] Ensure experiment assignment is stable per user or session.

### 3. Metrics and analysis

- [ ] Decide which metrics will be tracked per experiment (click-through, enrollment, completion).
- [ ] Ensure variant information is captured in analytics events.

### 4. Safety and cleanup

- [ ] Make it easy to disable experiments and remove old experiment code.
- [ ] Document guidelines for adding new experiments and when to clean them up.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 42 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 42 is complete. Next: [Frontend Day 43](frontend-day-43.md) (Advanced navigation, breadcrumbs, and deep linking).

