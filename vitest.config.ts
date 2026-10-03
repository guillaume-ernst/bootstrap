import { defineConfig } from "vitest/config";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import path from "node:path";

const jqueryMajor = process.env.JQUERY === "4" ? "4" : "3";
const bundleMode = process.env.BUNDLE === "true";

export default defineConfig({
  test: {
    globals: false,
    environment: "jsdom",
    include: ["tests/unit/**/*.spec.js"],
    setupFiles: ["./tests/unit/setup.js"],
    env: {
      JQUERY: jqueryMajor,
      BUNDLE: bundleMode ? "true" : "false",
    },
  },
  resolve: {
    alias: {
      // Make imports like `import $ from 'jquery'` resolve to the installed version.
      // Vitest can load jQuery 3 or 4 depending on the installed devDependency.
    },
  },
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".js"],
    }),
  ],
});
