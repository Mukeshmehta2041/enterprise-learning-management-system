# Day 39 – A/B testing infrastructure

**Focus:** Experiment framework: assign users to variants, feature flags per variant, and optional metrics collection for experiments.

**References:** [docs/10-best-practices.md](../docs/10-best-practices.md), [docs/08-observability.md](../docs/08-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented ExperimentManager with deterministic bucket allocation and documented A/B testing strategy. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Experiment model

- [x] Define experiments: id, name, variants (e.g. control, treatment_a), allocation % per variant, start/end date, and targeting (optional: by segment or tenant). Store in DB or config; assign user to variant deterministically (e.g. hash(userId, experimentId) % 100).
- [x] API for clients: `GET /api/v1/experiments` or include in auth/me response so client knows which variant to show. Backend can use variant to toggle behaviour (e.g. new enrollment flow).

### 2. Feature flags and variants

- [x] Integrate with feature-flag system: experiment variant drives flag value (e.g. experiment “new_ui” variant “on” → flag `new_ui` true). Ensure same user gets same variant for duration of experiment (sticky).
- [x] Document how to add new experiment and how to analyze (export events or metrics by variant).

### 3. Metrics and ethics

- [x] Emit event or metric with experiment id and variant for key actions (enrollment, completion, click); use for analysis. Do not run experiments on sensitive actions (e.g. payment) without explicit consent if required.
- [x] Document experiment lifecycle: create → run → conclude → remove or make winning variant default.

### 4. Verify

- [x] Create experiment; assign users; confirm variant stable per user; verify events include variant. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 39 is complete. Next: [Day 40](day-40.md) (Developer portal and API keys).
