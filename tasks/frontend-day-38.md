# Frontend Day 38 – Error observability, logging, and frontend alerts

**Focus:** Improve visibility into frontend errors and connect them to backend observability where possible.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/frontend/06-testing-and-observability.md](../docs/frontend/06-testing-and-observability.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Frontend error observability being enhanced. |
| ✅ Done | Frontend errors are captured, triaged, and surfaced appropriately. |

**Started:** _fill when you begin_  
**Completed:** _fill when Frontend Day 38 is done_

---

## Checklist

### 1. Error tracking integration

- [ ] Integrate or refine error tracking tooling (e.g. Sentry, custom backend) in the frontend.
- [ ] Attach useful context to error reports (route, user role, app version) without PII.

### 2. Logging and correlation

- [ ] Ensure frontend logs include correlation IDs or trace IDs where available from backend responses.
- [ ] Provide a way to surface these IDs in UI to help support/debugging (e.g. in error dialogs).

### 3. User-facing alerts

- [ ] Make sure serious recurring errors present clear messages to users and suggest remedial actions (refresh, contact support).
- [ ] Avoid flooding users with repeated alerts in unstable network conditions.

### 4. Verification

- [ ] Trigger synthetic errors in staging to confirm visibility in dashboards and alerting.
- [ ] Document how engineers should use these tools when debugging incidents.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 38 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 38 is complete. Next: [Frontend Day 39](frontend-day-39.md) (E2E testing – Cypress/Playwright – for key journeys).

