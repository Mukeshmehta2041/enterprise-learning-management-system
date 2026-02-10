# Reporting and Bulk Exports Design

This document describes the design for high-volume data exports and analytical reporting in the LMS.

## 1. Reporting Architecture

### 1.1. Synchronous Reports
- Small, real-time data sets are served via standard REST endpoints in JSON.
- Used for dashboard widgets and quick lookups.

### 1.2. Asynchronous Bulk Exports (CSV/PDF)
- Large data sets (e.g., all student grades for a large course) are generated asynchronously.
- **Flow**:
    1. User requests report via `POST /api/v1/analytics/reports/...`.
    2. System returns `202 Accepted` with a `requestId`.
    3. A background worker (Spring `@Async` or Batch) queries the DB in chunks.
    4. The CSV/PDF is uploaded to S3 with a unique UUID.
    5. A `NotificationCreated` event is published to notify the user.
    6. User downloads the file via a temporary presigned URL.

## 2. Resource Management

- **Streaming**: Large result sets are streamed from PostgreSQL using `Stream<T>` or `Slice<T>` to avoid OOM.
- **Retention**: Exported files are kept in S3 for 7 days before auto-deletion via Lifecycle Policy.
- **Rate Limiting**: Users are limited to 5 concurrent report generations.

## 3. Security

- **RBAC**: Reports are restricted based on permissions:
    - `ROLE_ADMIN`: All reports.
    - `ROLE_INSTRUCTOR`: Reports for their assigned courses.
    - `ROLE_STUDENT`: Personal progress reports only.
- **PII Protection**: Filenames never contain user IDs or emails; they use request UUIDs.
