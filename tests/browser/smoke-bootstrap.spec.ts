import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('starts an isolated browser smoke context and loads the parent page', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto('/parent');
  await expect(page.getByRole('heading', { name: '孩子學習紀錄' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('injects only whitelisted synthetic storage and isolates a fresh context', async ({ browser }) => {
  const record = {
    id: 'smoke-jiejie-record',
    student: 'jiejie', subject: 'chinese', questionId: 'smoke-question',
    firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
    createdAt: '2026-09-21T01:00:00.000Z',
  };
  const seededContext = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [record] }));
  const seededPage = await seededContext.newPage();
  await seededPage.goto('/parent');
  await expect(seededPage.locator('body')).toContainText('smoke-question');
  const seededStorage = await seededPage.evaluate(() => Object.keys(localStorage).sort());
  expect(seededStorage).toEqual(['project-seed:learning-records:v1']);
  await closeIsolatedContext(seededContext);

  const freshContext = await newIsolatedContext(browser, createSyntheticStorageState());
  const freshPage = await freshContext.newPage();
  await freshPage.goto('/parent');
  await expect(freshPage.locator('body')).not.toContainText('smoke-question');
  await closeIsolatedContext(freshContext);
});
