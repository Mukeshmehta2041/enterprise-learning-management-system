# Resilience Drills & Chaos Engineering

This document outlines how to perform controlled failure injection to validate the resilience of the LMS microservices.

## Objectives
-   Confirm **Circuit Breakers** open as expected.
-   Verify **Fallbacks** provide a graceful degradation.
-   Ensure **Retries** work for transient failures.
-   Validate **Kafka DLQ** and idempotent processing.
-   Verify **Alerts** fire for high error rates and latency.

## Failure Scenarios

### 1. Service Unavailability (e.g. Course Service down)
-   **Target:** `lms-course-service`
-   **Method:** `kubectl scale deployment lms-course-service -n lms --replicas=0`
-   **Expected Result:** 
    -   Gateway calls to `/api/v1/courses` return fallback response (from cache or empty).
    -   Enrollment service (calling Course Service) opens circuit breaker and returns internal fallback.
    -   Alerts fire for `ServiceUnavailable`.

### 2. High Latency (Slow Database or Downstream)
-   **Target:** `lms-user-service`
-   **Method:** Use Chaos Mesh `NetworkAttack` or `ChaosController` (see below).
-   **Expected Result:**
    -   Timeouts trigger circuit breaker or retry.
    -   Thread pools stay stable (no exhaustion).
    -   Latency metrics (p99) reflect the injected delay.

### 3. Kafka Consumer Failure
-   **Target:** `lms-notification-service`
-   **Method:** Stop the service or inject a malformed message.
-   **Expected Result:**
    -   Message is retried N times (per config).
    -   Message moves to `dlq.user.events`.
    -   No duplicate notifications on replay (idempotency).

## Chaos Testing Tooling

### Manual Injection via `ChaosController`
A `ChaosController` is available in `lms-common` (when enabled via `lms.chaos.enabled=true`) to inject failures:

-   `POST /api/v1/chaos/latency?millis=2000`: Adds a sleep to all subsequent requests.
-   `POST /api/v1/chaos/error?code=500`: Forces all requests to return given error code.
-   `POST /api/v1/chaos/reset`: Clears any injected failure.

### Tools
-   **Gremlin / Chaos Mesh:** For infrastructure-level chaos (kill pods, network delay).
-   **Toxiproxy:** For network-level faults between services and DB/Redis/Kafka.

## Game Day Process
1.  **Hypothesis:** If we kill `auth-service`, cached tokens in Gateway should still work for N minutes.
2.  **Execution:** Kill `lms-auth-service`.
3.  **Observation:** Try to access protected endpoint with existing token.
4.  **Verification:** Confirm 200 OK for cached tokens, 503 for login/refresh.
5.  **Recovery:** Restart `lms-auth-service`.
6.  **Post-Mortem:** Did we have enough visibility? Was the fallback acceptable?
