# Mobile Release & Rollout Strategy

This document outlines the steps for preparing a production release of the LMS mobile app.

## 1. Environment Configuration

The app uses `expo-constants` for configuration. Before building, ensure the `extra` field in `app.json` or your `app.config.js` is correct:

- **Staging**: `apiUrl`: `https://staging-api.lmsapp.com`, `environment`: `staging`
- **Production**: `apiUrl`: `https://api.lmsapp.com`, `environment`: `production`, `sentryDsn`: `<PROD_DSN>`

## 2. Store Assets Checklist

| Asset | Specs | Status |
|-------|-------|--------|
| App Icon | 1024x1024 png | [ ] |
| Splash Screen | 2732x2732 (centered content) | [ ] |
| Store Screenshots | iPhone 6.5"/5.5", Android 7"/10" | [ ] |
| Metadata | Name, Description, Keywords | [ ] |

## 3. Pre-Release Testing Loop

1. **Static Analysis**: Run `npm run lint` and `npm run type-check`.
2. **Automated Tests**: Run `npm run test` (ensure 80%+ coverage on business logic).
3. **E2E Tests**: Manual walkthrough of:
    - Login/Signup flow.
    - Course enrollment & Video playback.
    - Profile setup wizard.
    - Instructor dashboard & Toggle status.
4. **Deep Links**: Verify `lms-mobile://course/ID` opens correctly.

## 4. Rollout Strategy

We utilize a phased rollout approach via EAS (Expo Application Services):

### Phase 1: Internal Testing (Days 1-2)
- Deploy build to **TestFlight** (Internal) and **Google Play Console** (Internal Testing).
- Distribute to developers and stakeholders.

### Phase 2: Closed Beta (Days 3-7)
- Promote to External Beta (TestFlight) and Open Testing (Android).
- Target: 50-100 trusted users.

### Phase 3: Phased Production Rollout (Day 8+)
- **Android**: Start with 5% rollout, increasing to 20%, 50%, then 100% over 4 days.
- **iOS**: Phased release over 7 days (default App Store flow).

## 5. Post-Release Monitoring

- Monitor **Sentry** for spikes in crash rates compared to previous versions.
- Check **App Store / Play Store reviews** for critical UX feedback.
- Monitor backend logs for unexpected spikes in 4xx/5xx errors from mobile agents.
