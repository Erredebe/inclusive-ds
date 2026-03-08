import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './apps/storybook/tests',
  use: {
    baseURL: 'http://localhost:6006',
    headless: true,
  },
  webServer: {
    command: 'pnpm storybook',
    port: 6006,
    reuseExistingServer: true,
  },
});
