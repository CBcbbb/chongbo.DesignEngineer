import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@content$/, replacement: path.resolve(import.meta.dirname, "content/index.ts") },
      { find: /^@content\/(.*)$/, replacement: path.resolve(import.meta.dirname, "content/$1") },
      { find: /^@\/(.*)$/, replacement: path.resolve(import.meta.dirname, "src/$1") },
      { find: /^server-only$/, replacement: path.resolve(import.meta.dirname, "tests/unit/server-only-stub.ts") },
    ],
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
