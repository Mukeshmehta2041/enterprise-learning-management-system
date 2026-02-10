# Mobile API Optimization

## Overview
To improve performance for mobile and low-bandwidth clients, the LMS provides several API optimizations:
1. **Sparse Fieldsets:** Clients can request only the fields they need.
2. **Response Compression:** Reducing data transfer size using Gzip.
3. **Payload Tuning:** Stripping null values and using efficient pagination.

## 1. Sparse Fieldsets (Field Selection)
Clients can use the `fields` query parameter to specify a comma-separated list of properties to include in the response.

**Example Request:**
`GET /api/v1/courses?fields=id,title,instructorName`

**Implementation:**
- Logic resides in `lms-common` to filter the JSON response based on the `fields` parameter.
- This reduces both the compute time for serialization and the network payload size.

## 2. Compression (Gzip)
Gzip compression is enabled at the **API Gateway** level and at the individual **Microservice** level for responses larger than 1KB.

**Configuration:**
```yaml
server:
  compression:
    enabled: true
    mime-types: text/html,text/xml,text/plain,text/css,text/javascript,application/javascript,application/json,application/xml
    min-response-size: 1024
```

## 3. Pagination & Inclusion
- **Page Size Cap:** Max `page_size` is limited to 100 to prevent oversized responses.
- **Inclusion (Sideloading):** Supporting `include` for related entities to minimize round-trips (e.g., `include=tags,author`).

## 4. Best Practices for Mobile Clients
- Use `ETag` and `If-None-Match` for aggressive client-side caching.
- Prefer `fields` selection for list views (e.g., just `id`, `title`, `thumbnail`).
- Use the `Accept-Encoding: gzip` header.
