import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const record = (id: string, student: 'jiejie' | 'meimei', questionId: string, createdAt: string, attempts = 1) => ({
  id, student, subject: 'chinese', questionId, firstAnswer: 0, finalAnswer: 0, attempts,
  correct: true, completed: true, createdAt,
});

test('renders isolated parent summary metrics and actionable states', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [
      record('smoke-s20-j-today-primary', 'jiejie', 'jiejie-chinese-1', '2026-09-21T01:00:00.000Z'),
      record('smoke-s20-j-yesterday-retry', 'jiejie', 'jiejie-chinese-1', '2026-09-20T02:00:00.000Z', 2),
      record('smoke-s20-j-two-days-ago-retry', 'jiejie', 'jiejie-chinese-1', '2026-09-19T02:00:00.000Z', 2),
      record('smoke-s20-m-today', 'meimei', 'meimei-chinese-1', '2026-09-21T01:00:00.000Z'),
    ],
  }));
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/parent');

  await expect(page.getByRole('heading', { name: '姐姐的學習摘要' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '妹妹的學習摘要' })).toBeVisible();
  await expect(page.getByText('完成作答紀錄', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('首次答對率（作答紀錄）', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('曾需再次嘗試的作答紀錄', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('可以陪同複習', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('到期但尚未完成', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('今日複習尚有理解確認待完成', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('目前沒有跨日期反覆需要再次嘗試的紀錄', { exact: true }).first()).toBeVisible();
  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('renders the neutral empty summary state for both students', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [] }));
  const page = await context.newPage();
  await page.goto('/parent');
  await expect(page.getByText('尚無有效作答紀錄', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('目前沒有跨日期反覆需要再次嘗試的紀錄', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('目前沒有尚未完成的到期複習', { exact: true }).first()).toBeVisible();
  await closeIsolatedContext(context);
});
