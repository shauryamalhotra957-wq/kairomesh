import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: [
        "src/lib/demo-economics.ts",
        "src/lib/demo-receipt.ts",
        "src/lib/ledger.ts",
        "src/lib/proof-chain.ts",
        "src/lib/rate-limit.ts",
        "src/lib/receipt-browser.ts",
        "src/lib/request-body.ts",
        "src/lib/scheduler.ts",
        "src/lib/schemas.ts",
        "src/lib/state-machine.ts",
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        statements: 85,
        branches: 75,
      },
    },
  },
});
