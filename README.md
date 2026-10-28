# algorithmicpoetry

Cross-platform app baseline inspired by [Schrecktech/my-app](https://github.com/Schrecktech/my-app) — same drawer/tabs structure, Zen Garden theming, and starter screens — **without Expo or EAS**.

| Target | How |
|--------|-----|
| **Web** | Vite + React Native Web → static `dist/` (GitHub Pages) |
| **iOS / Android** | Same `src/` UI primitives; add a React Native CLI (or Community CLI) shell later — no Expo required |

## Why not Expo?

Expo is great for speed, but this repo optimizes for **vendor neutrality**: standard React Navigation, AsyncStorage, and RN Web so you can host anywhere (Pages, S3, Netlify, your own nginx) and own native builds later.

## Develop (web)

```bash
npm install
npm run dev
```

## Build static site

```bash
npm run build
```

Output lands in `dist/`. Pushing to `main` deploys via `.github/workflows/pages.yml`.

## Restyle

Edit `src/constants/theme.ts` — colors, spacing, radii, fonts. Copy stays in `src/constants/locales/en.ts`.

## Screen map

- **Home / About** — bottom tabs + parallax hero
- **Drawer** — Profile, Activity, Settings (+ logout stub)
- **About → version** — platform / runtime modal (no Expo SDK)

## Native later (no Expo)

1. `npx @react-native-community/cli init NativeShell`
2. Point Metro at this `src/` (shared package or monorepo)
3. Keep `react-native` imports; swap only platform entry (`index.js`) and icons if needed
4. Build with Xcode / Android Studio or your own CI — not EAS
