# Developer Portal & API Keys

## Overview
To support third-party integrations and server-to-server communication, the LMS provides **API Key Authentication**. This allows partners and external systems to interact with our APIs without requiring a user-interactive OAuth2 flow.

## 1. API Key Format
- **Prefix:** `lms_`
- **Body:** 32 chars of random alphanumeric data.
- **Example:** `lms_abc123...xyz`

## 2. Authentication Flow
1. Client sends a request with the header `X-API-Key: lms_...`.
2. The **API Gateway** intercepts the request.
3. The gateway hashes the key and looks it up in the **API Key Store** (Redis/Database).
4. If valid, the gateway:
   - Validates the **Scopes** (e.g., `read:courses`).
   - Injects `X-API-Key-ID` and `X-User-Id` (the owner) into the downstream headers.
   - Applies specific **Rate Limits** for the key.

## 3. Scopes
API keys are restricted by scopes to implement the principle of least privilege:
- `courses:read`: View course catalog.
- `enrollments:write`: Create new enrollments (e.g., for bulk partner onboarding).
- `analytics:read`: Export reporting data.

## 4. Security Practices
- **Hashing:** Only a hash of the API key is stored (SHA-256). The plain key is only shown once at creation.
- **Rotation:** Keys should be rotated annually. We support a 48-hour grace period where two keys are valid simultaneously.
- **Service Accounts:** API keys are typically associated with a "Service Account" user instead of a real person.

## 5. Developer Portal
The developer portal provides:
1. **Key Management:** Create, Revoke, and Rotate keys.
2. **API Documentation:** Interactive Swagger UI.
3. **Webhooks:** Configure endpoints for real-time event delivery.
