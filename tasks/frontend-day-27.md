# Frontend Day 27 – Real-time features (websockets or SSE)

**Focus:** Add real-time capabilities to the frontend for time-sensitive updates like live sessions, notifications, or dashboards.

**References:** [docs/05-events-kafka.md](../docs/05-events-kafka.md), any backend docs on websockets/SSE if available.

---

## Progress

| Status | Description |
|--------|-------------|
| ✅ Done | Selected LMS features update in real time where appropriate. |

**Started:** 2024-05-27  
**Completed:** 2024-05-27

---

## Checklist

### 1. Real-time client setup

- [x] Choose and configure the real-time mechanism (websockets, SSE, or provider SDK) used by the backend.
- [x] Implement a small client wrapper or hook (e.g. `useRealtimeChannel`) with proper connection lifecycle handling.

### 2. Real-time use cases

- [x] Enable real-time updates for at least one feature (e.g. live notifications, classroom chat, or analytics widgets).
- [x] Ensure UI updates are efficient and do not cause unnecessary re-renders.

### 3. Resilience and fallbacks

- [x] Handle reconnect logic and backoff on connection failures.
- [x] Provide a graceful fallback (e.g. periodic polling) if real-time connection cannot be established.

### 4. Testing and monitoring

- [x] Add tests or storybook scenarios to exercise real-time updates.
- [x] Manually simulate dropped connections and verify the frontend recovers or falls back cleanly.

### 5. Progress update

- [x] Update the **Progress** table at the top of this file when Frontend Day 27 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 27 is complete. Next: [Frontend Day 28](frontend-day-28.md) (Advanced analytics UI and reporting exports).

