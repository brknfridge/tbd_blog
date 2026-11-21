/// <reference types="vitest" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname } from "node:path";

// In production the [tbd] design system is served by the main site at /_ds/.
// In dev, serve it straight from the sibling folder so the same <link> works.
function serveDesignSystem(): Plugin {
  const root = resolve(__dirname, "..");
  const types: Record<string, string> = {
    ".css": "text/css",
    ".woff2": "font/woff2",
  };
  return {
    name: "serve-tbd-ds",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith("/_ds/")) return next();
        const file = resolve(root, "." + decodeURIComponent(req.url.split("?")[0]!));
        if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader("content-type", types[extname(file)] ?? "application/octet-stream");
        createReadStream(file).pipe(res);
      });
    },
  };
}

const DS = "/_ds/tbd-design-system-3a5dc6ab-3b87-4bfb-a5fd-020b5cb2c164";

// Injected after Vite's HTML processing so the absolute /_ds/ URLs aren't
// rebased under /spendle/ or bundled — the browser reuses the main site's copy.
function linkDesignSystem(): Plugin {
  return {
    name: "link-tbd-ds",
    transformIndexHtml: {
      order: "post",
      handler: () => [
        ...["InstrumentSerif-Italic", "GeistMono-Variable", "Geist-Variable"].map((f) => ({
          tag: "link",
          attrs: { rel: "preload", href: `${DS}/assets/fonts/${f}.woff2`, as: "font", type: "font/woff2", crossorigin: "" },
          injectTo: "head-prepend" as const,
        })),
        { tag: "link", attrs: { rel: "stylesheet", href: `${DS}/styles.css` }, injectTo: "head-prepend" as const },
      ],
    },
  };
}

export default defineConfig({
  base: "/spendle/",
  plugins: [react(), serveDesignSystem(), linkDesignSystem()],
  build: { outDir: "dist", assetsDir: "assets", target: "es2019" },
  test: { environment: "jsdom", globals: true },
});
