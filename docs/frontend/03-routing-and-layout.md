# 3. Routing, Navigation, and Layout

The LMS frontend is a **single-page app** using React Router. Routes map directly to backend capabilities and are grouped into **public**, **authenticated learner**, and **instructor/admin** areas.

## Route Map

High-level route structure:

- **Public**
  - `/` – marketing/landing or redirect to `/courses`
  - `/login` – login screen
  - `/register` – registration screen
  - `/forgot-password` – optional password reset flow
- **Authenticated learner**
  - `/dashboard` – learner overview (enrollments, progress)
  - `/courses` – course catalog
  - `/courses/:courseId` – course details, modules, lessons
  - `/courses/:courseId/lesson/:lessonId` – content player
  - `/enrollments` – list of a learner’s enrollments
  - `/assignments` – list of assignments
  - `/assignments/:assignmentId` – assignment detail and submission
  - `/notifications` – in-app notifications
  - `/account` – user profile and settings
- **Instructor/Admin**
  - `/instructor/courses` – manage owned courses
  - `/instructor/courses/:courseId` – edit course/content
  - `/instructor/assignments` – assignment management
  - `/analytics` – analytics dashboards
  - `/admin/users` – optional admin-only management

## Layout Shell

The app uses a **layout shell** that wraps all authenticated routes:

- **Header**: logo, global search, notifications, user menu.
- **Sidebar** (on `md+`): navigation for main sections (Dashboard, Courses, Assignments, Analytics).
- **Content area**: scrollable area for route content.

Public routes (`/login`, `/register`, etc.) use a simplified layout (centered card, no sidebar).

## Route Guards

Implement simple guard logic:

- **Public routes**: redirect to `/dashboard` if already authenticated.
- **Private routes**: require authentication; if not authenticated, redirect to `/login` and optionally remember the intended URL.
- **Role-restricted routes**:
  - Instructor/instructor+admin only for `/instructor/**` and some `/analytics` views.
  - Admin-only for `/admin/**`.

Role information comes from the decoded JWT or from the `/api/v1/auth/me` endpoint.

## Loading and Error States

Each route should define:

- **Loading state**: skeletons or spinners placed where content will appear.
- **Error state**: friendly message, optional retry button, and minimal technical detail.
- **Empty state**: helpful copy when lists are empty (e.g. “No courses yet – browse catalog to get started”).

Use shared components (`LoadingSpinner`, `SkeletonList`, `ErrorState`, `EmptyState`) to keep behavior consistent.

## Navigation Behavior

- Highlight active route in the sidebar and header navigation.
- Preserve scroll position where it improves UX (e.g. course list); reset scroll to top on page transitions that show new content.
- Use **Framer Motion** to provide subtle transitions between major sections (e.g. fade/slide-in of page content).

