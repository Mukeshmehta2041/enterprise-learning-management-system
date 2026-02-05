# Frontend Day 1 – Project skeleton and tooling

**Focus:** Initialize the LMS frontend app with Vite + React + TypeScript, Tailwind, and basic tooling so you can build features quickly.

**References:** [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md), [docs/frontend/07-devops-frontend.md](../docs/frontend/07-devops-frontend.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | Day 1 implemented (frontend app scaffolded and tooling configured) |

**Started:** 2026-02-05
**Completed:** 2026-02-05

---

## Checklist

### 1. Project bootstrap

- [x] Create frontend project using Vite (React + TypeScript) in a `frontend` folder (or appropriate path in the monorepo).
- [x] Configure Vite aliases (e.g. `@/` for `src/`).
- [x] Add basic scripts: `dev`, `build`, `preview`, `test`, `lint`, `format` (as needed).

### 2. Tailwind and global styles

- [x] Install and configure Tailwind CSS and PostCSS according to Tailwind docs.
- [x] Wire Tailwind into the app entry (e.g. `index.css`) and confirm utility classes work.
- [x] Set up base styles (font family, body background, default text color) to match LMS branding.

### 3. Tooling and quality

- [x] Add ESLint with React/TypeScript rules; configure basic ruleset (no unused vars, no implicit any, etc.).
- [x] Add Prettier and ensure it is integrated with ESLint (or run as a separate step).
- [x] Add Vitest and React Testing Library; create one sample test to ensure the setup works.

### 4. App skeleton and routing placeholder

- [x] Create `src/app` (or similar) with root `App` component and router placeholder.
- [x] Add a simple layout shell placeholder (header with project name, empty main content).
- [x] Add placeholder routes for: `/`, `/login`, `/dashboard` (static content for now).

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Day 1 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 1 is complete. Next: [Frontend Day 2](frontend-day-2.md) (Design system, layout shell, base components).

