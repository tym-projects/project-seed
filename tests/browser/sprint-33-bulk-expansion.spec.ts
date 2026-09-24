import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('Sprint 33 additions are reachable from the four expanded monthly banks', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  for (const path of [
    '/jiejie/exam/mathematics',
    '/jiejie/exam/natural-science',
    '/jiejie/exam/social-studies',
    '/meimei/exam/social-studies',
  ]) {
    await page.goto(path);
    await expect(page.getByText('第一次月考練習')).toBeVisible();
    await expect(page.getByText('第 1 題')).toBeVisible();
    await expect(page.getByText('第一次月考題庫準備中')).toHaveCount(0);
  }

  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('Sprint 33 monthly routes remain isolated from unconfirmed subjects', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();

  for (const path of ['/jiejie/exam/chinese', '/meimei/exam/natural-science']) {
    await page.goto(path);
    await expect(page.getByText('第一次月考題庫準備中')).toBeVisible();
  }

  await closeIsolatedContext(context);
});
