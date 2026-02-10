# Real-time Updates (SSE)

## Overview
To provide immediate feedback and notifications to users (students and instructors), the LMS uses **Server-Sent Events (SSE)**. SSE is a lightweight, unidirectional (Server-to-Client) communication protocol over HTTP that supports automatic reconnections.

## Implementation Details

### Protocol: Server-Sent Events (SSE)
- **Endpoint:** `/api/v1/notifications/stream`
- **MIME Type:** `text/event-stream`
- **Auth:** JWT provided via query parameter `token` (since standard SSE browser APIs don't support custom headers easily).

### Flow
1. Client connects to `/api/v1/notifications/stream?token=<JWT>`.
2. `lms-notification-service` validates the JWT and extracts the `userId`.
3. The service maintains an in-memory map of `SseEmitter` objects keyed by `userId`.
4. When a new notification is generated (via Kafka event), the service pushes the JSON payload to the corresponding emitter.

### Scaling & Distributed Setup
- Each service instance maintains its own set of emitters.
- To handle multiple service instances, we use **Redis Pub/Sub**:
  - When an instance receives a notification to send, it publishes to a Redis channel `notifications`.
  - All instances subscribe to this channel.
  - Upon receiving the Redis message, each instance checks if the target `userId` is connected to *it*. If yes, it sends the SSE message.

### Reliability
- **Heartbeats:** Every 30 seconds, a comment `:heartbeat` is sent to keep the connection alive.
- **Cleanup:** Emitters are removed on completion, timeout, or error.
- **Client Handling:** Vite/React frontend uses `EventSource` and reconnects on failure.

## Security
- **JWT Validation:** Every connection request is validated.
- **Tenant Isolation:** Messages are only sent to the user who owns them. The `userId` is derived from the JWT, ensuring users can't subscribe to others' streams.
