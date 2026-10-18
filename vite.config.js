import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"),
  },

  esbuild: {
    jsx: "automatic",
  },

  build: {
    outDir: "src/public/assets",
    emptyOutDir: false,
    lib: {
      entry: "src/public/main.jsx",
      formats: ["iife"],
      name: "umaworld",
      fileName: () => "umaworld.js",
    },
  },
});
