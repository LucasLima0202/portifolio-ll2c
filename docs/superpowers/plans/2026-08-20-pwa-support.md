# PWA Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the site installable (add-to-home-screen, standalone window) with basic offline support, using an app icon that composites the existing logo onto a black → very-dark-near-black-purple → black gradient background.

**Architecture:** `vite-plugin-pwa` generates the web manifest and a precaching service worker at build time (`generateSW` strategy, `registerType: "autoUpdate"`, auto-injected registration — no app-code changes). The app icon PNGs are generated once, ahead of time, by a small `sharp`-based script from a purpose-built master SVG, and committed as static assets — this avoids `@vite-pwa/assets-generator`'s default presets, which would regenerate and overwrite the existing `favicon.svg`/`favicon.ico` (used inline in the Navbar and Footer, not just the browser tab).

**Tech Stack:** `vite-plugin-pwa` (new devDependency), `sharp` (new devDependency, for the one-off icon generation script), Vite (existing).

## Global Constraints

- The existing `public/favicon.svg` and `public/favicon.ico` must not be touched, regenerated, or overwritten — they stay exactly as they are, still used for the browser-tab icon and the inline Navbar/Footer logo `<img>`.
- No changes to `main.tsx` or any React component — service-worker registration is handled entirely by `vite-plugin-pwa`'s auto-injection into the built HTML.
- Gradient colors, exact hex: `#000000` → `#150a24` → `#000000`.
- `package.json` currently has one unrelated, pre-existing uncommitted change (adding `vite-plugin-svgr` to `devDependencies`, matching an already-in-use import in `vite.config.ts`). `npm install` will add new packages alongside that existing line without conflict — it is expected and fine for that line to ride along in this plan's dependency-install commits (it's a single, harmless, already-in-use dependency entry, not unrelated feature work). Do not attempt to strip it back out.
- `vite.config.ts` and `index.html` also have pre-existing, unrelated uncommitted edits already in the working tree (an `svgr()` plugin addition, formatting changes, and an OG-title/favicon-link tweak). Both tasks' reference code below is written against the CURRENT state of those files (verify by reading them fresh before editing — if they've drifted further since this plan was written, stop and report rather than guessing).

---

### Task 1: Generate the PWA app icon

**Files:**
- Create: `src/assets/pwa/icon-source.svg`
- Create: `scripts/generate-pwa-icons.mjs`
- Create (generated, then committed): `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png`
- Modify: `package.json` (add `sharp` devDependency, add `generate:pwa-icons` script)
- Modify: `package-lock.json` (via `npm install`)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: the 3 PNG files at fixed paths/sizes that Task 2's manifest config references by exact filename: `/pwa-192x192.png` (192×192), `/pwa-512x512.png` (512×512), `/apple-touch-icon.png` (180×180).

- [ ] **Step 1: Create the master icon artwork**

Create `src/assets/pwa/icon-source.svg`:

```svg
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#000000"/>
      <stop offset="0.5" stop-color="#150a24"/>
      <stop offset="1" stop-color="#000000"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <g transform="translate(139.93 126) scale(3.0952)">
    <path d="M64.5637 20.5898L64.3367 78.8648L53.4566 78.8242L53.6472 29.9358L28.1274 29.8407L28.164 20.4541L64.5637 20.5898Z" fill="white"/>
    <path d="M10.7593 64.4445V6.16895H21.6393V55.0578H47.1593V64.4445H10.7593Z" fill="white"/>
  </g>
</svg>
```

(The `<g>` transform scales and centers the existing `favicon.svg` logo paths — originally in a 75×84 viewBox — to roughly 232×260 within the 512×512 canvas, comfortably inside the safe zone Android maskable icons require.)

- [ ] **Step 2: Write the icon generation script**

Create `scripts/generate-pwa-icons.mjs`:

```js
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const sourceSvg = readFileSync(
  path.join(projectRoot, "src/assets/pwa/icon-source.svg")
);

const targets = [
  { file: "public/pwa-192x192.png", size: 192 },
  { file: "public/pwa-512x512.png", size: 512 },
  { file: "public/apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  const outPath = path.join(projectRoot, file);
  await sharp(sourceSvg).resize(size, size).png().toFile(outPath);
  console.log(`Wrote ${file} (${size}x${size})`);
}
```

- [ ] **Step 3: Install `sharp` and add the generation npm script**

Run: `npm install -D sharp`

In `package.json`, add a `generate:pwa-icons` entry to `"scripts"` (alongside the existing `dev`/`build`/`test` entries):

```json
"generate:pwa-icons": "node scripts/generate-pwa-icons.mjs",
```

- [ ] **Step 4: Run the generator and verify the output**

Run: `npm run generate:pwa-icons`
Expected: console output `Wrote public/pwa-192x192.png (192x192)`, `Wrote public/pwa-512x512.png (512x512)`, `Wrote public/apple-touch-icon.png (180x180)`.

Verify the files exist and are correctly sized:

```bash
node -e "
import('sharp').then(async ({ default: sharp }) => {
  for (const f of ['public/pwa-192x192.png', 'public/pwa-512x512.png', 'public/apple-touch-icon.png']) {
    const meta = await sharp(f).metadata();
    console.log(f, meta.width, meta.height, meta.format);
  }
});
"
```

Expected: `public/pwa-192x192.png 192 192 png`, `public/pwa-512x512.png 512 512 png`, `public/apple-touch-icon.png 180 180 png`.

- [ ] **Step 5: Commit**

```bash
git add src/assets/pwa/icon-source.svg scripts/generate-pwa-icons.mjs public/pwa-192x192.png public/pwa-512x512.png public/apple-touch-icon.png package.json package-lock.json
git commit -m "feat: generate PWA app icon from gradient background + existing logo"
```

---

### Task 2: Wire up the PWA manifest and service worker

**Files:**
- Modify: `vite.config.ts`
- Modify: `index.html`
- Modify: `package.json` (add `vite-plugin-pwa` devDependency)
- Modify: `package-lock.json` (via `npm install`)

**Interfaces:**
- Consumes: `public/pwa-192x192.png`, `public/pwa-512x512.png`, `public/apple-touch-icon.png` (Task 1).
- Produces: nothing consumed by other tasks — this is the final task.

- [ ] **Step 1: Install `vite-plugin-pwa`**

Run: `npm install -D vite-plugin-pwa`

- [ ] **Step 2: Read the current `vite.config.ts` and `index.html` fresh**

Both files have pre-existing uncommitted edits from separate work (see Global Constraints). Read them from disk now to confirm they still match the "before" state assumed below. If they've drifted further, reconcile carefully rather than pasting the block below verbatim over unrelated changes.

- [ ] **Step 3: Add the `VitePWA` plugin**

Replace the full contents of `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from 'vite-plugin-svgr'
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "LL2C - Lucas Lima",
        short_name: "LL2C",
        description: "Portfólio de Lucas Lima Cunha - Desenvolvedor Full Stack, automações com IA e sistemas sob medida.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
```

- [ ] **Step 4: Add `theme-color` and `apple-touch-icon` to `index.html`**

Replace the full contents of `index.html`:

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LL2C - Lucas Lima | Full-Stack Developer</title>
    <meta name="description" content="Portfólio de Lucas Lima Cunha - Desenvolvedor Full Stack, automações com IA e sistemas sob medida." />
    <meta name="author" content="Lucas Lima Cunha" />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" type="image/x-icon" href="favicon.svg">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <meta property="og:title" content="LL2C - Lucas Lima" />
    <meta property="og:description" content="Portfólio de Lucas Lima Cunha - Desenvolvedor Full Stack, automações com IA e sistemas sob medida." />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Build and verify the manifest/service-worker output**

Run: `npm run build`
Expected: build succeeds with no errors.

Run: `ls dist/`
Expected: includes `manifest.webmanifest`, a service-worker file (`sw.js`), and the 3 icon PNGs (`pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`) alongside the usual `index.html`/`assets/`.

Run: `cat dist/manifest.webmanifest`
Expected: valid JSON containing `"name":"LL2C - Lucas Lima"`, `"display":"standalone"`, `"theme_color":"#000000"`, and an `"icons"` array with 3 entries referencing the PNG files above.

- [ ] **Step 6: Run the full test suite and a type check as a regression check**

Run: `npx vitest run`
Expected: PASS — every existing test still green (no app code changed, so no test should be affected).

Run: `npx tsc -b --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts index.html package.json package-lock.json
git commit -m "feat: add PWA manifest, icons, and offline service worker"
```
