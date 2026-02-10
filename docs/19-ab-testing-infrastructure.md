# A/B Testing Infrastructure

## Overview
To iterate on features based on data, the LMS implements a lightweight **A/B Testing (Experimentation) Framework**. This allows us to assign users to different variants of a feature and measure the impact on key metrics.

## 1. Core Concepts
- **Experiment:** A test on a specific feature (e.g., "New Course Card Design").
- **Variant:** One of the possible versions (e.g., "Control", "Treatment A").
- **Allocation:** Deterministic assignment based on User ID hash.

## 2. Deterministic Assignment
Assignment is performed using the formula:
`hash(userId + experimentId) % 100`
- Users in `0-49` get Variant A.
- Users in `50-99` get Variant B.
This ensures a user always sees the same variant across sessions without needing to store the assignment in a database (Stateless Stickiness).

## 3. Implementation
We use the **Feature Flag** system to drive experiments.
1. The backend evaluates the experiment assignment.
2. The resulting variant is passed to the frontend or used in the backend to toggle logic.
3. Every analytics event includes the `experimentId` and `variant` in its metadata.

## 4. Usage in Code

### Backend (Spring Boot)
```java
String variant = experimentManager.getVariant(userId, "new-enrollment-flow");
if ("Treatment".equals(variant)) {
    // Show new flow
}
```

### Frontend (React)
The frontend receives active experiments in the `/api/v1/auth/me` or `/api/v1/features` response.

## 5. Metrics Collection
When a user completes an action (e.g., enrolls), an event is emitted:
```json
{
  "eventType": "EnrollmentCreated",
  "metadata": {
    "experiment": "new-ui",
    "variant": "B"
  }
}
```
This allows the Analytics Service to calculate conversion rates per variant.
