# 7. Frontend Builds, Environments, and Deployment

## Vite Build and Environments

Use **Vite** with React and TypeScript:

- Configure base URL and aliases in `vite.config.ts`.
- Use environment variables prefixed with `VITE_`, for example:
  - `VITE_API_BASE_URL` – points to the API Gateway (dev, staging, prod).
  - `VITE_FEATURE_FLAGS_*` – optional feature flags.

Environment files:

- `.env.development` – local dev.
- `.env.staging` – staging.
- `.env.production` – production.

Never commit secrets to version control.

## Local Development

For local dev:

- Run the backend stack via Docker Compose (see `docs/09-devops.md` and `infra/docker`).
- Start Vite dev server (e.g. `npm run dev`) and point `VITE_API_BASE_URL` to the gateway (e.g. `http://localhost:8080`).
- Ensure CORS and CSRF are configured appropriately on the gateway for dev.

## Build and Deployment

- Build command: `npm run build` (or equivalent).
- Output: static assets (HTML, JS, CSS, assets) under `dist/`.

Deployment options:

- Serve static assets behind the same domain as the API Gateway via:
  - A static file server or reverse proxy (Nginx, Apache, etc.).
  - A CDN (for caching, compression, edge delivery).
- Ensure the gateway and frontend share the same origin or are configured with proper CORS settings.

## CI Integration

Extend the existing CI pipeline (`.github/workflows/ci.yml`) to:

- Install dependencies and run `npm test` (Vitest).
- Run `npm run lint` and `npm run build`.
- Optionally upload build artifacts or deploy to a static hosting service on successful builds.

