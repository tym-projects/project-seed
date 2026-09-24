import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('student home exposes monthly practice and monthly routes never fall back to general questions', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  for (const student of ['jiejie', 'meimei']) {
    await page.goto(`/${student}`);
    await expect(page.getByRole('link', { name: '第一次月考' }).first()).toBeVisible();
    await expect(page.locator(`a[href="/${student}/exam/mathematics"]`)).toBeVisible();
    await expect(page.locator(`a[href="/${student}/exam/natural-science"]`)).toBeVisible();
    await expect(page.locator(`a[href="/${student}/exam/social-studies"]`)).toBeVisible();
  }

  for (const path of [
    '/jiejie/exam/mathematics',
    '/jiejie/exam/natural-science',
    '/jiejie/exam/social-studies',
    '/meimei/exam/chinese',
    '/meimei/exam/mathematics',
    '/meimei/exam/social-studies',
  ]) {
    await page.goto(path);
    await expect(page.getByText('第 1 題')).toBeVisible();
    await expect(page.getByText('第一次月考題庫準備中')).toHaveCount(0);
  }

  for (const path of ['/jiejie/exam/chinese', '/meimei/exam/natural-science']) {
    await page.goto(path);
    await expect(page.getByText('第一次月考題庫準備中')).toBeVisible();
    await expect(page.getByText('高興')).toHaveCount(0);
    await expect(page.getByText('天空')).toHaveCount(0);
  }

  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('monthly practice remains usable in portrait and landscape tablet viewports', async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
    const context = await browser.newContext({ viewport, timezoneId: 'Asia/Taipei' });
    const page = await context.newPage();
    await page.goto('/jiejie/exam/natural-science');
    await expect(page.getByText('第一次月考練習')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow-x', 'visible');
    await context.close();
  }
});
