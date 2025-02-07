/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    // ...
    alias: [{ find: "@", replacement: path.join(path.resolve(), "src") }],
  },
});
