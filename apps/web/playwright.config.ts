import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // testes de auth precisam ser sequenciais
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup: cria usuárias de teste
    { name: "setup", testMatch: "**/setup.ts" },

    // Desktop Chrome
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },

    // Mobile — iOS Safari
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 15"] },
      dependencies: ["setup"],
    },

    // Mobile — Android Chrome
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      dependencies: ["setup"],
    },
  ],

  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true, // inicie o servidor manualmente antes de rodar os testes
    timeout: 120_000,
  },
});
