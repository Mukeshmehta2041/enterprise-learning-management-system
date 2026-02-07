# Frontend Day 26 – PWA basics, install prompts, and caching strategy

**Focus:** Add Progressive Web App features so learners can “install” the LMS and enjoy better offline behavior.

**References:** [docs/frontend/01-frontend-architecture.md](../docs/frontend/01-frontend-architecture.md).

---

## Progress

| Status | Description |
|--------|-------------|
| ⬜ Not started | |
| 🔄 In progress | |
| ✅ Done | LMS frontend behaves like a solid PWA where appropriate. |

**Started:** 2024-05-26  
**Completed:** 2024-05-26

---

## Checklist

### 1. PWA manifest and basic setup

- [ ] Add or refine the web app manifest (name, icons, theme colors, start URL).
- [ ] Ensure the app passes basic PWA checks in browser devtools (installable, HTTPS, manifest valid).

### 2. Service worker and caching

- [ ] Implement a service worker (custom or via tooling) to cache static assets and shell.
- [ ] Decide on a caching strategy for HTML, JS, CSS, and images (e.g. stale-while-revalidate for assets).
- [ ] Avoid caching sensitive authenticated API responses indiscriminately.

### 3. Install prompts and UX

- [ ] Provide subtle guidance for users to install the app where it makes sense.
- [ ] Ensure the installed app shell looks good (splash screen, icons, app bar).

### 4. Testing and safety

- [ ] Test PWA behavior on at least one mobile and one desktop browser.
- [ ] Provide a way to disable or clear service worker/caches in development for debugging.

### 5. Progress update

- [ ] Update the **Progress** table at the top of this file when Frontend Day 26 is complete.

---

## Done?

When all checkboxes above are done, Frontend Day 26 is complete. Next: [Frontend Day 27](frontend-day-27.md) (Real-time features – websockets or SSE).

