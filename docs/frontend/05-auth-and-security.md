# 5. Frontend Auth and Security

The frontend must work with the backend Auth and User services to provide secure login, registration, and role-based UI.

## Auth Flows

- **Login**
  - Form with email and password.
  - On submit, call `/api/v1/auth/token` with password grant.
  - On success, store access token (and optionally refresh token) and fetch current user (`/api/v1/auth/me` or `/api/v1/users/me`).
  - Redirect to the intended route or `/dashboard`.
- **Register**
  - Form with required user details.
  - On success, either auto-login or redirect to login.
- **Logout**
  - Call `/api/v1/auth/logout` with current access and refresh token.
  - Clear local auth state, then navigate to `/login`.

## Token Storage

Follow these guidelines:

- Prefer keeping the **access token** in memory (React state or context) and/or in a short-lived, secure storage mechanism.
- If using `localStorage` or `sessionStorage`, never interpolate tokens directly into the DOM and ensure they are only read/written in controlled code paths.
- Refresh tokens should not be exposed to the browser if the backend supports secure HTTP-only cookies; if they must be in the SPA, handle them carefully and never log them.

## Role-Based UI

- Decode roles from JWT payload or read from `/auth/me`.
- Maintain a `UserContext` or similar store containing `userId`, `roles`, and basic profile details.
- Use role checks to:
  - Show/hide navigation links (e.g. instructor menu).
  - Guard access to routes (instructor/admin sections).
  - Toggle specific actions (e.g. grade assignment vs. view assignment).

## Security Considerations

- **CSRF**: Prefer token-based auth (Bearer token) and CORS configuration at gateway; if using cookies for auth, follow backend CSRF recommendations.
- **XSS**: Never blindly inject HTML; prefer React’s default escaping, and only use `dangerouslySetInnerHTML` when absolutely required with sanitized content.
- **Sensitive data**: Do not log passwords, tokens, or PII in the browser console or error logs.
- **Redirect safety**: Validate redirect targets (avoid open redirects to arbitrary external domains).

Refer to backend `docs/07-security.md` for server-side concerns that affect frontend behavior (token lifetimes, blacklist, rate limiting).

