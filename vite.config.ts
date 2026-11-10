import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import svgr from 'vite-plugin-svgr'
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// Two HTML entries: "/" is the scroll-craft landing, "/personal" is the React app.
// Vite's dev/preview servers fall back to the root index.html for unknown paths,
// so route every /personal URL (with or without a trailing slash, deep links too)
// to the React entry. On Vercel the same rule lives in vercel.json.
const personalRoute = (): Plugin => {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void) => {
    const path = (req.url ?? "").split("?")[0];
    if ((path === "/personal" || path.startsWith("/personal/")) && !/\.[a-z0-9]+$/i.test(path)) {
      req.url = "/personal/index.html";
    }
    next();
  };
  return {
    name: "personal-route",
    configureServer(server) { server.middlewares.use(rewrite); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
};

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
    personalRoute(),
    mode === "development" && componentTagger(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "LL2C - Lucas Lima",
        short_name: "LL2C",
        description: "Lucas Lima Cunha: front-end developer building AI-powered automation.",
        lang: "en",
        theme_color: "#031B2F",
        background_color: "#031B2F",
        display: "standalone",
        start_url: "/",
        scope: "/",
        id: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // The landing (/) and the React app (/personal) are separate HTML entries:
        // never answer a /personal navigation with the landing's index.html.
        navigateFallbackDenylist: [/^\/personal/],
        globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        personal: path.resolve(__dirname, "personal/index.html"),
      },
    },
  },
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
