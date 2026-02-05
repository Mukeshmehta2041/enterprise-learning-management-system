# LMS Frontend Documentation

This folder contains the design and specification documentation for the **Learning Management System (LMS) frontend web app**. **Use these docs as the single source of truth to implement the frontend yourself**—no frontend application code is defined here.

## Tech Stack (Reference)

- Vite + React + TypeScript
- Tailwind CSS (utility-first design system)
- React Router
- React Query (TanStack Query) for data fetching and caching
- Framer Motion for animations and micro-interactions
- Vitest + React Testing Library for tests

## Table of Contents

| Doc | Description |
|-----|-------------|
| [01-frontend-architecture.md](01-frontend-architecture.md) | High-level frontend architecture, module boundaries, diagrams |
| [02-design-system.md](02-design-system.md) | Design tokens, UI components, UX guidelines, motion, a11y |
| [03-routing-and-layout.md](03-routing-and-layout.md) | Route map, layout shell, navigation and loading/error UX |
| [04-data-fetching-and-api-client.md](04-data-fetching-and-api-client.md) | API client, React Query patterns, pagination |
| [05-auth-and-security.md](05-auth-and-security.md) | Auth flows, token handling, RBAC in UI, security concerns |
| [06-testing-and-observability.md](06-testing-and-observability.md) | Frontend testing strategy, error tracking, performance |
| [07-devops-frontend.md](07-devops-frontend.md) | Builds, environments, deployment, local dev setup |
| [08-phase-plan-frontend.md](08-phase-plan-frontend.md) | Day 1–10 frontend phase plan mapped to backend |

## How to Use

1. Read **01-frontend-architecture.md** and **02-design-system.md** for the big-picture structure and UI/UX principles.
2. Follow **08-phase-plan-frontend.md** for implementation order (Days 1–10).
3. Use **03-routing-and-layout.md** and **04-data-fetching-and-api-client.md** while building screens and data flows.
4. Use **05-auth-and-security.md** together with backend `docs/07-security.md` to implement secure auth and role-based UI.
5. Use **06-testing-and-observability.md** and **07-devops-frontend.md** when adding tests, monitoring, and deployment.

