# Auth Service API (Phase 1)

Base path: `/api/v1/auth` (or `/api/v1/oauth`). Endpoints are unauthenticated (no JWT required); gateway must not apply JWT filter to these paths.

## Login (token)

- **Method:** `POST /api/v1/auth/token` (or `POST /api/v1/oauth/token`)
- **Auth:** None.
- **Request body (form or JSON):**  
  - `grant_type`: `password`  
  - `username`: email (or username)  
  - `password`: string
- **Response:** `200 OK`; body:  
  - `access_token` (string, JWT)  
  - `refresh_token` (string, opaque)  
  - `token_type`: `Bearer`  
  - `expires_in` (integer, seconds)
- **Errors:** `400` missing/invalid params; `401` invalid credentials.

## Refresh token

- **Method:** `POST /api/v1/auth/token`
- **Auth:** None.
- **Request body:**  
  - `grant_type`: `refresh_token`  
  - `refresh_token`: string (opaque token from login)
- **Response:** Same as login (new access_token and optionally new refresh_token if rotating).
- **Errors:** `400` missing/invalid params; `401` invalid/expired refresh token.

## Logout (revoke)

- **Method:** `POST /api/v1/auth/logout`
- **Auth:** Bearer token (optional but recommended so gateway can extract JTI for blacklist).
- **Request body:** Optional `refresh_token` to revoke that refresh token.
- **Response:** `204 No Content` or `200 OK`.
- **Side effect:** Blacklist current JWT (by jti) in Redis; delete refresh token from Redis if provided.

## Introspect (optional)

- **Method:** `POST /api/v1/auth/introspect` or `GET /api/v1/auth/me` with Bearer
- **Auth:** Bearer token.
- **Response:** `200 OK`; body: `active` (boolean), `sub` (userId), `roles`, `exp`, etc. Used to validate token or get current user without calling User Service.

---

**Security:** Do not log request bodies (passwords, tokens). Use HTTPS only in production. Apply strict rate limiting on `/auth/token` and `/auth/logout` to prevent abuse.
