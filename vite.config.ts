///<reference types="vitest" />;
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 4200,
    strictPort: true,
  },
  test: {
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
