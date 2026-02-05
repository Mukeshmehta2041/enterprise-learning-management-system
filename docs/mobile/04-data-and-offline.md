# 4. Data Fetching and Offline Behavior (Mobile)

The mobile app reuses the backend HTTP APIs and leverages **React Query** for caching and data management.

## API Client

Implement an API client (e.g. `src/api/client.ts`) that:

- Uses `fetch` or a lightweight HTTP library.
- Reads a base URL from configuration (pointing to the API Gateway).
- Attaches `Authorization: Bearer <access_token>` when a session is active.
- Normalizes network and server errors into a consistent structure (status code, message, optional error code).

All domain-specific API modules should depend on this client.

## React Query on Mobile

- Initialize a `QueryClient` at the app root and wrap navigation in `QueryClientProvider`.
- Use query keys similar to the web app for easier cross-platform reasoning:
  - `['courses', 'list', params]`
  - `['course', courseId]`
  - `['enrollments', 'me']`
  - `['assignments', 'list']`
  - `['notifications', 'list']`
  - `['payments', 'plans']`
  - `['analytics', 'enrollments', params]`
- Configure default `staleTime` and `cacheTime` appropriate for mobile (longer for relatively static data like course metadata).

## Offline and Error Behavior (Day 1–10 Scope)

For the initial phase:

- Focus on **online-first** usage with graceful degradation:
  - Show cached/stale data when available while refetching in the background.
  - Display clear error messages and retry actions when requests fail.
- Offline behavior:
  - If the device is offline, detect network state and show an offline banner/message.
  - Allow reading previously loaded data (if React Query still has it in memory or via optional persistence) but do not attempt complex mutation queuing yet.

More advanced offline features (full persistence, queued mutations, background sync) can be planned as a later phase once the core flows are stable.

