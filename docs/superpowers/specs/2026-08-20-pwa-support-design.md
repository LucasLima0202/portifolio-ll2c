# PWA Support Design

## Context

The site (Vite + React + TypeScript) currently has no PWA support: no manifest, no service worker, no `theme-color` meta tag. [`public/favicon.svg`](../../../public/favicon.svg) is a transparent-background white "LL" monogram, used as the browser-tab favicon and also inline as a logo `<img>` in [`Navbar.tsx`](../../../src/components/Navbar.tsx) and [`Footer.tsx`](../../../src/components/Footer.tsx).

## Goal

Make the site installable (add-to-home-screen, standalone window) with a proper app icon and basic offline support (cached shell, works after the first visit without network). The app icon is the existing logo composited onto a black → very-dark-near-black-purple → black gradient background.

## Approach

Use `vite-plugin-pwa` (the standard PWA tool for Vite projects) for the manifest + service worker, with `registerType: "autoUpdate"` and the default `generateSW` strategy — this precaches the built JS/CSS/HTML/fonts/images with no custom Workbox config needed for a site this size (no API GET endpoints worth special caching rules; the contact form's `POST` to Web3Forms is never precached regardless).

**Icon generation:** `@vite-pwa/assets-generator` (the tool's own companion package) was considered but rejected — its default presets (including `minimal2023Preset`) also regenerate `favicon.ico`/`favicon.svg`, which would overwrite the existing transparent logo used inline in the Navbar and Footer (not just the browser tab). Instead, a small one-off script using `sharp` (a standard, well-supported image library) rasterizes a purpose-built master SVG into exactly the 3 PNG files the PWA needs, under new filenames that don't collide with anything already in `public/`. This gives full, predictable control over output filenames with no risk to the existing favicon.

## Master Icon Artwork

A new source file, `src/assets/pwa/icon-source.svg` (512×512), composites:
- A full-bleed diagonal linear gradient background: `#000000` → `#150a24` (very dark, near-black purple) → `#000000`.
- The existing logo's two white paths (from `favicon.svg`), scaled ~3.1× and centered, occupying roughly the middle 45-50% of the square — comfortably inside the "safe zone" Android maskable icons require (content should sit within the inner ~80% diameter circle) and suitable for the non-cropped `apple-touch-icon` too.

This file is a **build input**, not something served directly — it lives under `src/assets/`, not `public/`.

## Generated Files

A script, `scripts/generate-pwa-icons.mjs`, rasterizes the master SVG via `sharp` into:
- `public/pwa-192x192.png` (192×192)
- `public/pwa-512x512.png` (512×512)
- `public/apple-touch-icon.png` (180×180)

Run once via `npm run generate:pwa-icons`; the generated PNGs are committed (static output, regenerated only if the source artwork changes — consistent with how every other image in `public/`/`src/assets/` is already handled in this repo, no build-time generation step).

## Manifest & Registration

`vite.config.ts` gains a `VitePWA({...})` plugin entry:
- `name`: "LL2C - Lucas Lima", `short_name`: "LL2C" (matches the existing `<title>`).
- `description`: reuses the existing `index.html` meta description text.
- `theme_color` / `background_color`: `#000000`.
- `display: "standalone"`, `start_url: "/"`, `scope: "/"`.
- `icons`: the 512×512 PNG listed twice (`purpose: "any"` and `purpose: "maskable"` — the artwork's full-bleed gradient background and safe-zone padding already satisfy both), plus the 192×192 PNG.
- `registerType: "autoUpdate"`, default `injectRegister: "auto"` — the plugin auto-injects the service-worker registration script into the built HTML; **no changes to `main.tsx` or any app code are needed**, so this has zero interaction with the Vitest test suite (which renders components in isolation, never the built `index.html`).

`index.html` gains:
- `<meta name="theme-color" content="#000000" />`
- `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` (iOS reads this link tag directly; it doesn't consult the web manifest for its home-screen icon).

## Out of Scope

- No custom splash screen component (the earlier design question confirmed the gradient applies only to the app icon).
- No custom Workbox runtime-caching rules — default precaching is sufficient for this site's size and content.
- `devOptions` (testing the service worker against the dev server) stays disabled (the default) — only the production build gets a service worker, which is the standard, lower-friction setup.
- The existing `favicon.svg`/browser-tab icon and the Navbar/Footer logo `<img>` are untouched.

## Testing / Verification

This is build tooling, not app logic — verification is `npm run build` succeeding and producing `dist/manifest.webmanifest`, a service-worker file (`dist/sw.js`), and the 3 icon PNGs, plus confirming the full Vitest suite still passes (no app-code changes should affect it, but the plan should re-run it as a regression check regardless).
