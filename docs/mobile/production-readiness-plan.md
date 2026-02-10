# Mobile Production Readiness Plan

Date: 2026-02-09
Owner: Mobile team

## Goals
- Prepare the Expo/React Native app for store submission (iOS/Android).
- Enable production configuration, monitoring, and release workflows.
- Reduce release risk with test coverage and a clear rollout plan.

## Phase 1: Configuration and Environments
1. Define environment targets: development, staging, production.
2. Add environment-specific config (API URL, socket URL, Sentry DSN).
3. Replace placeholder bundle IDs and app identifiers.
4. Verify deep linking scheme works in production builds.

## Phase 2: Observability and Stability
1. Wire crash reporting (Sentry) for production and staging.
2. Add a release health dashboard (crash-free users, ANR, JS errors).
3. Add logging for critical flows (auth, enrollment, video, payments).

## Phase 3: Testing and Quality Gates
1. Ensure lint and typecheck are clean.
2. Increase unit test coverage for business logic (target 80%+).
3. Expand E2E automation for core flows (login, course, video, assignment).
4. Run device matrix smoke tests (iOS, Android, tablet).

## Phase 4: Store Readiness
1. Prepare store assets: icons, splash, screenshots, metadata.
2. Validate permissions and privacy labels (App Store/Play Console).
3. Verify app size, performance, and startup time targets.

## Phase 5: Release and Rollout
1. Build staging and production releases via EAS.
2. Internal testing (TestFlight, Play Internal Track).
3. External beta (TestFlight, Play Open Testing).
4. Phased rollout with monitoring gates.

## Deliverables
- Environment config updated for staging/production.
- Real bundle IDs and store metadata ready.
- Sentry enabled with DSN and release tagging.
- Expanded test coverage and E2E suite.
- Store assets and privacy checklists complete.
- Rollout plan executed and monitored.

## Implementation Order
1. Environment config and bundle IDs.
2. Sentry integration and logging.
3. Test coverage and E2E expansion.
4. Store assets and metadata.
5. Release builds and phased rollout.
