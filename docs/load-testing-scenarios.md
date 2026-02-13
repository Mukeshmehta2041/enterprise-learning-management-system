# Load Testing Scenarios: Media & Course Flows

## 1. Playback Token Issuance (High Volume)
**Goal:** Verify the system can handle concurrent requests for playback tokens during peak hours (e.g. course launch).

- **Service:** `lms-content-service`
- **Endpoint:** `GET /api/v1/content/{contentId}/playback-token`
- **Setup:**
  - Mock authentications (JWTs).
  - Pre-configure 1,000 students enrolled in a single course.
  - Constant load of 500 RPS.
- **Success Criteria:** 
  - Mean latency < 100ms.
  - Error rate < 0.1% (excluding 429 rate limiting).
  - Rate limiting (429) correctly triggers above 5 RPS per user (default config).

## 2. Concurrent Video Uploads
**Goal:** Verify the system handles multiple large file uploads without degradation.

- **Service:** `lms-content-service`
- **Endpoints:** 
    - `POST /api/v1/content/{contentId}/upload-url`
    - `POST /api/v1/content/{contentId}/complete-upload`
- **Setup:**
  - 50 concurrent instructors starting uploads.
  - Upload actual 500MB payloads to S3 (mocked if local).
- **Success Criteria:**
  - Presigned URL generation is reliable.
  - DB transaction for "complete-upload" succeeds under load.
  - Kafka events for processing are successfully published.

## 3. Bulk Course Moderation
**Goal:** Verify the impact of admin operations on course listing performance.

- **Service:** `lms-course-service`
- **Endpoint:** `PATCH /api/v1/courses/admin/bulk-status`
- **Setup:**
  - Run background load of students listing courses.
  - Execute a bulk status update for 100 courses simultaneously.
- **Success Criteria:**
  - Background student requests unaffected (no latency spikes).
  - Cache invalidation (Redis) correctly removes stale course snapshots.

## 4. Mobile UX under Latency
**Goal:** Simulate poor network conditions for mobile users.

- **Tool:** `network-link-conditioner` or `tc` (Traffic Control).
- **Setup:**
  - 250ms latency, 5% packet loss.
- **Verification:**
  - Player handled retry logic for tokens.
  - UI shows meaningful "Loading" or "Offline" states rather than crashing.
