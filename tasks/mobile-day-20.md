# Mobile Day 20 – Mobile production readiness and release checklist

**Focus:** Prepare the mobile app for beta and production releases, with proper configuration, monitoring, and rollout plans.

**References:** [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Configured environment-based builds and monitoring infrastructure. |
| ✅ Done | Documented the App Store release and rollout strategy. |

**Started:** Day 20  
**Completed:** Day 20

---

## Checklist

### 1. Build configurations

- [x] Confirm separate configurations for dev, staging, and production (API base URLs, feature flags, analytics IDs).
- [x] Set up configuration utility in `src/config.ts` using `expo-constants`.

### 2. Store readiness

- [x] Prepare release checklist documentation in `docs/mobile/release-checklist.md`.
- [x] Define metadata and asset requirements for store submissions.

### 3. Monitoring and crash reporting

- [x] Integrate monitoring placeholder utility (`src/utils/monitoring.ts`).
- [x] Initialize monitoring in `_layout.tsx` to handle production crash tracking.

### 4. Rollout strategy

- [x] Documented phased rollout process (TestFlight -> Beta -> Phased Prod).
- [x] Defined criteria for verifying success post-release.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 20 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 20 is complete. Next: [Mobile Day 21](mobile-day-21.md) (Privacy, consent, and user data settings in the app).

