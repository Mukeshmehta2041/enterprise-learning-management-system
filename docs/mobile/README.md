# LMS Mobile App Documentation (React Native)

This folder contains the design and specification documentation for the **Learning Management System (LMS) mobile app** built with React Native. **Use these docs as the single source of truth to implement the mobile client yourself**—no mobile application code is defined here.

## Tech Stack (Reference)

- React Native (TypeScript)
- React Navigation
- React Query (TanStack Query)
- A small design system aligned with the web Tailwind design
- Jest + React Native Testing Library

## Table of Contents

| Doc | Description |
|-----|-------------|
| [01-architecture-mobile.md](01-architecture-mobile.md) | High-level mobile architecture and platform integration |
| [02-navigation-and-ux-flows.md](02-navigation-and-ux-flows.md) | Navigation structure, screens, and UX flows |
| [03-design-system-mobile.md](03-design-system-mobile.md) | Mobile design system, primitives, theming, accessibility |
| [04-data-and-offline.md](04-data-and-offline.md) | Data fetching, API client, caching, and offline behavior |
| [05-auth-and-security-mobile.md](05-auth-and-security-mobile.md) | Mobile auth flows, token storage, and secure session handling |
| [06-testing-and-release.md](06-testing-and-release.md) | Testing strategy, performance notes, and release basics |
| [07-phase-plan-mobile.md](07-phase-plan-mobile.md) | Mobile Day 1–10 phase plan |

## How to Use

1. Read **01-architecture-mobile.md** and **02-navigation-and-ux-flows.md** to understand the overall structure and navigation.
2. Use **03-design-system-mobile.md** when implementing shared UI primitives and theming.
3. Follow **04-data-and-offline.md** and **05-auth-and-security-mobile.md** while wiring API calls and authentication.
4. Use **06-testing-and-release.md** and **07-phase-plan-mobile.md** when adding tests and preparing builds/releases.

