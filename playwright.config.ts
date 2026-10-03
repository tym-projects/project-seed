import { defineConfig, devices } from '@playwright/test';

const testPort = process.env.AUTH_TEST_PORT ?? '3102';
const testBaseURL = `http://127.0.0.1:${testPort}`;

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  outputDir: 'test-results/artifacts',
  reporter: [['list'], ['html', { outputFolder: 'test-results/report', open: 'never' }]],
  use: {
    baseURL: testBaseURL,
    ...devices['Desktop Chrome'],
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: process.env.REUSE_AUTH_SERVER === '1'
    ? undefined
    : {
        command: `npm run start -- --hostname 0.0.0.0 --port ${testPort}`,
        url: testBaseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
