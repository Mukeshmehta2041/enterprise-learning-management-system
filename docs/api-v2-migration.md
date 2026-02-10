# API v2 Migration Guide

This document outlines the differences between v1 and v2 APIs and provides a migration path for consumers.

## General Changes

- **Consistent Pagination**: All v2 list endpoints now use a shared `metadata` object for pagination details.
- **Resource Embedding**: v2 responses may include additional computed fields (e.g., `avgRating`) to reduce subsequent API calls.
- **Version Headers**: While v2 is available via `/api/v2/*` paths, it is recommended to use the `Accept` header or path-based versioning consistently.

## Course Service

### `GET /api/v2/courses`

| Change Type | Description |
|-------------|-------------|
| Response Shape | Changed from flat pagination fields to a nested `metadata` object. |
| New Fields | Added `avgRating` (Double) and `enrollmentCount` (Integer) to each course item. |
| Pagination | Use `v2.metadata` for next cursor and total counts. |

#### V1 Mapping to V2
- `totalElements` -> `metadata.total`
- `totalPages` -> `metadata.totalPages`
- `number` -> `metadata.page`
- `content` -> `data`

## Enrollment Service

### `GET /api/v2/enrollments/me`

| Change Type | Description |
|-------------|-------------|
| New Fields | Added `nextLessonId` and `nextLessonTitle` to help users resume learning quickly. |
| Response Shape | Consistent list response structure. |

## Deprecation Schedule

- **V1 Deprecation Date**: 2024-12-01
- **V1 Sunset Date**: 2025-12-31
- **Headers**: All V1 responses now include `Deprecation: true` and `Sunset` headers.

## Migration Steps

1. Update your API clients to point to `/api/v2/`.
2. Update DTO parsing logic to account for the `metadata` object in list responses.
3. Leverage new fields in V2 to enhance your UI (e.g., show progress or ratings without extra calls).
