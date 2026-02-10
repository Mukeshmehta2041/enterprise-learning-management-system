# API Design Standards & Best Practices

## Overview
To ensure a consistent and high-quality developer experience, all LMS services must adhere to the following API design standards.

## 1. Response & Error Standard (RFC 7807)
We follow a variation of RFC 7807 for error responses to provide structured information about failures.

### Standard Error Format
```json
{
  "type": "https://lms.com/errors/invalid-resource",
  "title": "Invalid Request Content",
  "status": 400,
  "code": "VALIDATION_FAILED",
  "detail": "The 'price' field cannot be negative.",
  "instance": "/api/v1/courses/123",
  "traceId": "a1b2c3d4..."
}
```

### Standard Success Format
```json
{
  "data": { ... },
  "metadata": {
    "requestId": "...",
    "timestamp": "2026-02-09T10:00:00Z"
  }
}
```

## 2. Resource Naming
- **Plurals:** Use plural nouns for resource collections (e.g., `/courses`, `/enrollments`).
- **Nesting:** Avoid nesting resources deeper than 2 levels (e.g., `/courses/{id}/modules`). For deeper associations, use flat query parameters.
- **Kebab-case:** Use kebab-case for URL paths (e.g., `/user-profiles`).

## 3. HTTP Methods & Status Codes
- **GET:** 200 (OK), 404 (Not Found).
- **POST:** 201 (Created), 400 (Bad Request).
- **PUT/PATCH:** 200 (OK), 204 (No Content).
- **DELETE:** 204 (No Content).
- **Generic Errors:** 401 (Unauthorized), 403 (Forbidden), 429 (Too Many Requests).

## 4. Idempotency
- **GET, PUT, DELETE** must be idempotent.
- **POST** for critical actions (e.g., creating a payment) should support an `Idempotency-Key` header to prevent duplicate processing.

## 5. Security Headers (Gateway Level)
The API Gateway injects the following headers for all responses:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## 6. CORS Policy
- **Allowed Origins:** Explicit list of approved frontend and mobile domains (e.g., `https://app.lms.com`).
- **Allowed Methods:** `GET, POST, PUT, DELETE, OPTIONS, PATCH`.
- **Preflight:** Handles `OPTIONS` requests at the Gateway level to protect downstream services.
