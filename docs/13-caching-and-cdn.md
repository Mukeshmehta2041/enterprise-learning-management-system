# Caching Strategy and CDN Design

This document describes the multi-layer caching architecture for the LMS.

## 1. Caching Layers

### 1.1. Browser Cache (Edge/Client)
- **Static Assets**: Images, CSS, JS, and font files are served with `Cache-Control: public, max-age=31536000, immutable`.
- **Public API**: GET endpoints for course listings and public details use `Cache-Control: public, max-age=300` (5 minutes).
- **Private API**: Endpoints returning user-specific data (enrollments, grades) use `Cache-Control: no-store, must-revalidate`.

### 1.2. CDN (Content Delivery Network)
- **Providers**: Cloudflare or AWS CloudFront.
- **Static Content**: Assets stored in S3 are fronted by CDN. URLs are generated with short-lived presigned tokens for private content or long-lived public URLs for public assets.
- **Dynamic Content**: API Gateway responses for `/api/v1/courses/**` are cached at the edge for 5 minutes.

### 1.3. Application Cache (Redis)
- **Service Cache**: Course details, module lists, and lesson content are cached in Redis to reduce DB load.
- **Session/Token Cache**: Refresh tokens and JWT blacklists are stored in Redis with TTL matching token expiry.
- **Rate Limiting**: Redis counters are used for sliding-window rate limiting.

## 2. Cache Invalidation Flow

1. **Course Update**: 
   - Service evicts Redis key `course:{id}`.
   - Optional: CDN Purge API called for `/api/v1/courses/{id}`.
2. **Content Update**:
   - Lesson content cache is evicted.
   - Browser picks up new content after TTL or via ETag check.
3. **User Deletion**:
   - All user-referenced caches (notifications, enrollments) are purged.

## 3. Implementation Details

- **ETags**: Enabled in Spring Boot via `ShallowEtagHeaderFilter`.
- **CDN URLs**: `ContentApplicationService` generates URLs pointing to `https://cdn.lms.com/assets/...`.
