# algorithmicpoetry

Cross-platform app baseline inspired by [Schrecktech/my-app](https://github.com/Schrecktech/my-app) — same drawer/tabs structure, Zen Garden theming, and starter screens — **without Expo or EAS**.

| Target | How |
|--------|-----|
| **Web (static)** | Vite + React Native Web → `dist/` (GitHub Pages) |
| **Web + edge** | Same build served by a **Cloudflare Worker** (`≤10ms` CPU design target) |
| **iOS / Android** | Same `src/` UI primitives; add a React Native CLI shell later — no Expo required |

## Why not Expo?

Expo is great for speed, but this repo optimizes for **vendor neutrality**: standard React Navigation, AsyncStorage, and RN Web so you can host anywhere (Pages, S3, Netlify, Cloudflare, your own nginx) and own native builds later.

## Develop (web)

```bash
npm install
npm run dev
```

### Edge API locally (optional)

In a second terminal (after a build, or once `dist/` exists):

```bash
npm run build
npm run worker:dev
```

Vite proxies `/api/*` → `http://127.0.0.1:8787`. Endpoints:

| Route | Purpose |
|-------|---------|
| `GET /api/health` | Liveness + CPU budget metadata |
| `GET /api/config` | Brand/theme snapshot + feature flags |
| `POST /api/run` | Allowlisted micro-ops (`ping`, `normalize-locale`, `slugify`, `theme-tint`) |

Handlers are intentionally tiny so they stay under the **Cloudflare free-tier ~10ms CPU** budget. Do not add heavy crypto, large parsers, or fetch waterfalls here.

## Build static site

```bash
npm run build
```

Output lands in `dist/`. Pushing to `main` deploys GitHub Pages via `.github/workflows/pages.yml`.

## Deploy Cloudflare Worker

```bash
npm run worker:deploy
```

Or enable CI: set secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`, and variable `CLOUDFLARE_DEPLOY=true`. Workflow: `.github/workflows/cloudflare-worker.yml`.

If the SPA stays on GitHub Pages and the Worker is on `*.workers.dev`, set:

```bash
# .env (see .env.example)
VITE_EDGE_URL=https://algorithmicpoetry.<account>.workers.dev
```

Same-origin needs no env when the Worker also serves `dist/` (default `wrangler.toml` assets binding).

## Restyle

Edit `src/constants/theme.ts` — colors, spacing, radii, fonts. Copy stays in `src/constants/locales/en.ts`.

## Screen map

- **Home / About** — bottom tabs + parallax hero
- **Drawer** — Profile, Activity, Settings (+ logout stub)
- **About → version** — platform / runtime / edge modal (no Expo SDK)

## Native later (no Expo)

1. `npx @react-native-community/cli init NativeShell`
2. Point Metro at this `src/` (shared package or monorepo)
3. Keep `react-native` imports; swap only platform entry (`index.js`) and icons if needed
4. Build with Xcode / Android Studio or your own CI — not EAS
