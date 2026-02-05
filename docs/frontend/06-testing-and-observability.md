# 6. Testing and Observability (Frontend)

## Testing Strategy

Use **Vitest** and **React Testing Library** for unit and component tests:

- Test UI components in isolation (props, interaction, rendering states).
- Test hooks that wrap React Query (e.g. ensure correct query keys and behavior on success/error).
- Test key flows at the component level: login, course enrollment, assignment submission.

Recommended structure:

- `src/` mirrors app structure with `__tests__` directories or `*.test.tsx` colocated with components.
- Use test utilities for common setup (providers, router, query client).

## Integration and E2E (Optional)

For more complete coverage, consider:

- Integration tests that render full pages with mocked API responses.
- E2E tests (e.g. Playwright or Cypress) for critical paths:
  - Login, browse courses, enroll, view progress.
  - Instructor flows: manage courses, view analytics.

## Error Handling and Logging

- Provide a simple logging abstraction (e.g. `logger.ts`) instead of calling `console` directly everywhere.
- Use an error boundary for unexpected runtime errors with a user-friendly fallback UI.
- Optionally integrate with an error tracking service (e.g. Sentry) to capture client-side exceptions.

## Performance and User Experience

- Track key web vitals (LCP, CLS, FID/INP) via browser APIs and forward metrics to a monitoring backend if desired.
- Optimize:
  - Initial bundle size through code splitting.
  - Images (compression, responsive sizes).
  - React Query cache settings to avoid unnecessary refetching.

Coordinate with backend observability (`docs/08-observability.md`) so you can correlate frontend errors with backend traces and logs, using request IDs or trace IDs where available.

