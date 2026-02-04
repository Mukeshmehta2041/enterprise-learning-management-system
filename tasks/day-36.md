# Day 36 – Real-time updates (WebSocket or SSE)

**Focus:** Real-time channel for notifications and live updates (e.g. new grade, announcement); auth and scaling considerations.

**References:** [docs/08-observability.md](../docs/08-observability.md), [docs/07-security.md](../docs/07-security.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | |

**Started:** _fill when you begin_  
**Completed:** _fill when Day 36 is done_

---

## Checklist

### 1. Channel choice

- [ ] Choose WebSocket or Server-Sent Events (SSE): SSE is simpler (one-way, HTTP); WebSocket for bidirectional. Use for: in-app notifications, live progress updates, or instructor announcements.
- [ ] Document endpoint (e.g. `/api/v1/notifications/stream`) and message format (JSON: type, payload, timestamp).

### 2. Authentication and authorization

- [ ] Authenticate connection with JWT (query param or first message); reject unauthenticated. Scope messages to user (only their notifications) or to course (instructor + enrolled students). Do not broadcast to other tenants.
- [ ] Optional: heartbeat/ping to detect dead connections; close and clean up on token expiry.

### 3. Backend integration

- [ ] When a relevant event occurs (e.g. grade posted, notification created), push to connected clients via in-memory broadcaster or Redis Pub/Sub so multiple gateway/service instances can push. Document scaling (sticky session or Redis adapter).
- [ ] Limit connection count per user and per instance; return 503 when at capacity.

### 4. Verify

- [ ] Connect as user; trigger event (e.g. create notification); confirm message received. Test reconnection and auth failure. Update Progress when done.

---

## Done?

When all checkboxes above are done, Day 36 is complete. Next: [Day 37](day-37.md) (Mobile API optimization).
