import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('all first-practice pages load without hydration or runtime errors', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ''}`));

  for (const route of [
    '/jiejie/chinese', '/jiejie/mathematics', '/jiejie/natural-science', '/jiejie/social-studies',
    '/meimei/chinese', '/meimei/mathematics', '/meimei/natural-science', '/meimei/social-studies',
  ]) {
    await page.goto(route);
    await expect(page.getByText('第 1 題')).toBeVisible();
  }

  expect(errors).toEqual([]);
  await closeIsolatedContext(context);
});
