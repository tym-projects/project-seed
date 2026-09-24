import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('first practice uses a new randomized order while keeping each flow order stable', async ({ browser }) => {
  const firstContext = await newIsolatedContext(browser, createSyntheticStorageState());
  const firstPage = await firstContext.newPage();
  await firstPage.goto('/jiejie/mathematics');
  await expect(firstPage.locator('p.text-xl.font-bold')).toHaveCount(1);
  await closeIsolatedContext(firstContext);

  const secondContext = await newIsolatedContext(browser, createSyntheticStorageState());
  const secondPage = await secondContext.newPage();
  await secondPage.goto('/jiejie/mathematics');
  const firstQuestion = secondPage.locator('p.text-xl.font-bold');
  const firstQuestionText = await firstQuestion.textContent();
  expect(firstQuestionText).toBeTruthy();
  await secondPage.locator('div.mt-6.space-y-3 button').first().click();
  await expect(firstQuestion).toHaveText(firstQuestionText!);
  await closeIsolatedContext(secondContext);
});

test('all student and subject first-practice routes still start with one isolated question', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const routes = [
    '/jiejie/chinese', '/jiejie/mathematics', '/jiejie/natural-science', '/jiejie/social-studies',
    '/meimei/chinese', '/meimei/mathematics', '/meimei/natural-science', '/meimei/social-studies',
  ];

  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByText('第 1 題')).toBeVisible();
    await expect(page.locator('p.text-xl.font-bold')).toHaveCount(1);
  }

  await closeIsolatedContext(context);
});
