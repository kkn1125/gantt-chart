import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    include: ["src/__tests__/**", "src/**/*.spec.ts"],
    // ... Specify options here.
    reporters: ["default", "html"],
    coverage: {
      provider: "v8",
      enabled: true,
    },
    benchmark: {
      reporters: "verbose",
      outputFile: "html",
    },
    environment: "jsdom",
  },
  resolve: {
    alias: [
      { find: "@common/", replacement: "src/common/" },
      { find: "@utils/", replacement: "src/utils/" },
      { find: "@config/", replacement: "src/config/" },
      { find: "@database/", replacement: "src/database/" },
      { find: "@libs/", replacement: "src/libs/" },
      { find: "@src/", replacement: "src/" },
    ],
  },
  plugins: [tsconfigPaths()],
});
