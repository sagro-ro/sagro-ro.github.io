import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      // Astro 7 auto-backgrounds in agent shells; --ignore-lock keeps this managed test server foreground.
      command: 'npm run dev -- --host 127.0.0.1 --port 4321 --ignore-lock',
      url: 'http://127.0.0.1:4321/favicon.svg',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      // An intercepted .test endpoint lets browser tests exercise transport without sending customer data.
      command: 'PUBLIC_FORM_ENDPOINT=https://forms.example.test/solicitari npm run dev -- --host 127.0.0.1 --port 4322 --ignore-lock',
      url: 'http://127.0.0.1:4322/favicon.svg',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4324 --ignore-lock',
      url: 'http://127.0.0.1:4324/favicon.svg',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
