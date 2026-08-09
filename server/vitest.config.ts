import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "mini-crm-server",
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret",
    },
    fileParallelism: false,
    hookTimeout: 10000,
  },
  resolve: {
    alias: [
      {
        find: /^\.\.\/server\//,
        replacement: `${path.resolve(__dirname)}/`,
      },
    ],
  },
});