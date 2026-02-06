# Mobile Day 20 – Mobile production readiness and release checklist

**Focus:** Prepare the mobile app for beta and production releases, with proper configuration, monitoring, and rollout plans.

**References:** [docs/mobile/06-testing-and-release.md](../docs/mobile/06-testing-and-release.md), [docs/09-devops.md](../docs/09-devops.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | Mobile production readiness checklist being executed. |
| ✅ Done | Mobile app is ready for store releases with clear build and rollout processes. |

**Started:** _fill when you begin_  
**Completed:** _fill when Mobile Day 20 is done_

---

## Checklist

### 1. Build configurations

- [ ] Confirm separate configurations for dev, staging, and production (API base URLs, feature flags, analytics IDs).
- [ ] Set up signing configs/profiles for Android and iOS (keystore, provisioning profiles/certificates).

### 2. Store readiness

- [ ] Prepare app metadata (name, icon, screenshots, descriptions) for app stores.
- [ ] Validate that privacy policy, terms, and data usage disclosures meet store requirements.

### 3. Monitoring and crash reporting

- [ ] Integrate crash reporting (e.g. Sentry, Firebase Crashlytics) for release builds.
- [ ] Ensure errors include enough context (app version, platform) but exclude sensitive data.

### 4. Rollout strategy

- [ ] Decide on rollout process (internal testing → beta → phased rollout).
- [ ] Document steps for releasing new versions and verifying success post-release.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Mobile Day 20 is complete.

---

## Done?

When all checkboxes above are done, Mobile Day 20 is complete. Next: [Mobile Day 21](mobile-day-21.md) (Privacy, consent, and user data settings in the app).

