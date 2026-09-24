import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";

// Standalone client-only build used for the native (Capacitor) app.
// The web app keeps using vite.config.ts / TanStack Start SSR.
export default defineConfig({
  base: "./",
  root: path.resolve(process.cwd(), "mobile"),
  plugins: [react(), tailwindcss(), tsConfigPaths({ root: process.cwd() })],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  build: {
    outDir: path.resolve(process.cwd(), "dist-mobile"),
    emptyOutDir: true,
  },
});
