# 2. Navigation, Screens, and UX Flows

The mobile app uses **React Navigation** to organize screens into an auth flow and a main tabbed experience.

## Navigation Structure

- **Auth Stack**
  - `AuthStack` (stack navigator)
    - `LoginScreen`
    - `RegisterScreen`
    - Optional: `ForgotPasswordScreen`
- **Main App**
  - `MainTabs` (tab navigator), shown only when authenticated:
    - `HomeTab` – dashboard / \"My learning\"
    - `CoursesTab` – browse courses
    - `AssignmentsTab` – assignments list
    - `ProfileTab` – user profile and settings
  - Nested stacks for details:
    - `CoursesStack` for course list, course detail, and player
    - `AssignmentsStack` for assignment detail and submission
    - Instructor/analytics stack for instructor-only screens

## Key Flows

### Auth Flow

- Open app → if no valid session → show `AuthStack`.
- Login/Register → on success, store session, navigate to `MainTabs`.
- Logout → clear session, navigate back to `AuthStack`.

### Learner Flow

- Home tab: show enrollments and progress overview.
- Courses tab:
  - List of available courses with filters.
  - Tap a course → Course detail → Lessons list.
  - Tap a lesson → Content player screen.
- Assignments tab:
  - List assignments → Tap to open details → Submit work.
- Notifications:
  - Accessible via icon/button (from Home or Profile) → Notifications list → Mark as read.

### Instructor/Admin Flow (Optional in Day 1–10)

- Instructor-only routes (e.g. analytics, manage courses) can live in a separate stack or under Profile/Analytics screens, hidden unless the user has appropriate roles.

## Mobile UX Guidelines

- Use **bottom tabs** for primary navigation; reserve drawers or nested stacks for secondary flows.
- Respect **safe areas** on iOS and Android (status bar, notches).
- Prefer **scrollable pages** with clear sections and headings for content-heavy screens.
- Keep interactions **thumb-friendly**: large tap targets, minimal need for precise taps near screen edges.
- Make error and loading states clear but unobtrusive (loading indicators near content, concise error messages with retry actions). 

