# Day 36 – Real-time updates (WebSocket or SSE)

**Focus:** Real-time channel for notifications and live updates (e.g. new grade, announcement); auth and scaling considerations.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Implemented SSE for real-time notifications with Redis Pub/Sub scaling and JWT auth support. |

**Started:** 2026-02-09  
**Completed:** 2026-02-09  

---

## Checklist

### 1. Channel choice

- [x] Choose WebSocket or Server-Sent Events (SSE): SSE is simpler (one-way, HTTP); WebSocket for bidirectional. Use for: in-app notifications, live progress updates, or instructor announcements.
- [x] Document endpoint (e.g. `/api/v1/notifications/stream`) and message format (JSON: type, payload, timestamp).

### 2. Authentication and authorization

- [x] Authenticate connection with JWT (query param or first message); reject unauthenticated. Scope messages to user (only their notifications) or to course (instructor + enrolled students). Do not broadcast to other tenants.
- [x] Optional: heartbeat/ping to detect dead connections; close and clean up on token expiry.

### 3. Backend integration

- [x] When a relevant event occurs (e.g. grade posted, notification created), push to connected clients via in-memory broadcaster or Redis Pub/Sub so multiple gateway/service instances can push. Document scaling (sticky session or Redis adapter).
- [x] Limit connection count per user and per instance; return 503 when at capacity.

### 4. Verify

- [x] Connect as user; trigger event (e.g. create notification); confirm message received. Test reconnection and auth failure. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 36 is complete. Next: [Day 37](day-37.md) (Mobile API optimization).
