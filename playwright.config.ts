import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    viewport: { width: 680, height: 560 },
    trace: "retain-on-failure"
  }
});
