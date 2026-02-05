# 5. Mobile Auth and Security

The mobile app uses the same Auth and User services as the web app, but must handle token storage and session management in a mobile-appropriate way.

## Auth Flows

- **Login**
  - Email/password form.
  - Call `/api/v1/auth/token` and receive access (and possibly refresh) tokens.
  - Store tokens securely and fetch current user info for the session.
- **Register**
  - Registration form aligned with the User Service contract.
  - Optionally auto-login on success or redirect back to login.
- **Logout**
  - Call `/api/v1/auth/logout` with active tokens.
  - Clear stored tokens and session state.
  - Navigate back to the auth stack.

## Token Storage

Preferred approach:

- Use a **secure storage** mechanism for long-lived tokens where possible (Keychain on iOS, Keystore on Android) via a library; as a simpler starting point, you can use `AsyncStorage` with an understanding of its tradeoffs.
- Keep in-memory copies for fast access; sync them from storage on app start.
- Never log tokens or include them in crash reports.

## Session and Role-Based UI

- Maintain a central `AuthContext` or store holding:
  - `accessToken`
  - `user` object (id, email, roles, etc.)
  - session status (loading, authenticated, unauthenticated)
- Use roles to:
  - Show/hide tabs or screens (e.g. analytics/instructor-only areas).
  - Guard navigation (e.g. prevent direct navigation to instructor screens for learners).

## Security Considerations

- Ensure all API calls use HTTPS.
- Handle token expiration: when backend returns 401/403, clear session or trigger a refresh flow (if implemented) and navigate to login.
- Avoid including sensitive information in local logs or error toasts.

See backend `docs/07-security.md` for details on token lifecycle, JWT structure, and server-side protections.

