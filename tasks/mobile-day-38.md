# Mobile Day 38 – Error observability and crash reporting on mobile

**Focus:** Improve visibility into mobile errors and crashes, connecting them to backend observability when possible.

**References:** [docs/08-observability.md](../docs/08-observability.md), mobile crash/analytics SDK docs, [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile error observability and crash reporting being enhanced. |
| ✅ Done | Crashes and key errors from the mobile app are visible and actionable. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 38 is done_

---

## Checklist

### 1. Crash reporting

- [ ] Integrate or refine crash reporting SDK (e.g. Crashlytics, Sentry) for release builds.
- [ ] Attach useful context (app version, platform, user role) without collecting sensitive data.

### 2. Error logging

- [ ] Ensure important handled errors from the app (e.g. repeated network failures) are logged to your observability stack.
- [ ] Correlate mobile errors with backend traces/IDs where possible (e.g. using correlation IDs from APIs).

### 3. User-facing alerts

- [ ] Provide clear error messaging in-app and avoid generic “Something went wrong” where you can be more specific.
- [ ] Offer next steps (retry, contact support) for severe errors.

### 4. Verification

- [ ] Trigger synthetic crashes and errors in a test build to verify dashboards and alerting.
- [ ] Document how engineers should triage mobile crash reports and link to runbooks.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 38 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 38 is complete. Next: [Mobile Day 39](mobile-day-39.md) (E2E flows on devices/emulators – Detox/Appium or similar).

