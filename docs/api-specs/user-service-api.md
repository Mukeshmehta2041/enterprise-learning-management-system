# User Service API (Phase 1)

Base path: `/api/v1/users`. All endpoints require authentication (JWT) unless noted. Gateway forwards `X-User-Id` and `X-Roles`.

## Create user (register)

- **Method:** `POST /api/v1/users`
- **Auth:** Optional (public registration) or admin-only.
- **Request body:** `email` (string), `password` (string), `displayName` (string, optional), `role` (string, optional, default STUDENT).
- **Response:** `201 Created`; body: `id`, `email`, `displayName`, `role`, `status`, `createdAt`.
- **Errors:** `400` validation; `409` email already exists.

## Get current user (profile)

- **Method:** `GET /api/v1/users/me`
- **Auth:** Required.
- **Response:** `200 OK`; body: `id`, `email`, `displayName`, `roles`, `status`, `createdAt`, `updatedAt`.
- **Errors:** `401` unauthorized.

## Get user by ID

- **Method:** `GET /api/v1/users/{userId}`
- **Auth:** Required; user can read own; admin can read any.
- **Response:** `200 OK`; body: same shape as profile (no sensitive fields).
- **Errors:** `401` unauthorized; `403` forbidden; `404` not found.

## Update user (profile)

- **Method:** `PATCH /api/v1/users/{userId}` or `PUT /api/v1/users/me`
- **Auth:** Required; user can update own profile only (e.g. displayName, avatar); admin can update more.
- **Request body:** `displayName` (optional), `avatarUrl` (optional). Do not allow email/role change via normal profile update.
- **Response:** `200 OK`; body: updated user shape.
- **Errors:** `400` validation; `403` forbidden; `404` not found.

## List users (admin)

- **Method:** `GET /api/v1/users?page=&size=&status=&role=`
- **Auth:** Admin only.
- **Query:** `page`, `size` (optional, default 20); `status` (optional filter); `role` (optional filter).
- **Response:** `200 OK`; body: `content` (array of user), `totalElements`, `totalPages`, `size`, `number`.
- **Errors:** `403` forbidden.

## Assign role

- **Method:** `POST /api/v1/users/{userId}/roles` or `PUT /api/v1/users/{userId}/roles`
- **Auth:** Admin only.
- **Request body:** `role` (string, e.g. INSTRUCTOR, ADMIN).
- **Response:** `200 OK` or `204 No Content`; body optional.
- **Errors:** `403` forbidden; `404` user not found.

## Deactivate user

- **Method:** `DELETE /api/v1/users/{userId}` or `PATCH /api/v1/users/{userId}` with `status: DEACTIVATED`
- **Auth:** Admin only (or user deactivating own account with confirmation).
- **Response:** `204 No Content` or `200 OK` with updated user.
- **Errors:** `403` forbidden; `404` not found.

---

**Status codes:** Use `400` for validation/bad request, `401` for missing/invalid token, `403` for insufficient permission, `404` for resource not found, `409` for conflict (e.g. duplicate email).
