import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('runs jiejie mathematics first practice and saves a mathematics record', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  await context.addInitScript(() => { Math.random = () => 0.999999; });
  const page = await context.newPage();
  await page.goto('/jiejie/mathematics');
  await expect(page.getByRole('heading', { name: '🌸 姐姐的數學練習' })).toBeVisible();
  await expect(page.getByText('84 的質因數分解是哪一個？')).toBeVisible();
  await page.getByRole('button', { name: '2 × 2 × 3 × 7' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(1);
  expect(records[0]).toMatchObject({
    student: 'jiejie',
    subject: 'mathematics',
    questionId: 'jiejie-mathematics-1',
    attempts: 1,
    correct: true,
    completed: true,
  });
  await closeIsolatedContext(context);
});

test('runs meimei mathematics first practice with isolated student data', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [{
      id: 'jiejie-chinese-existing', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-1',
      firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: '2026-09-20T00:00:00.000Z',
    }],
  }));
  await context.addInitScript(() => { Math.random = () => 0.999999; });
  const page = await context.newPage();
  await page.goto('/meimei/mathematics');
  await expect(page.getByRole('heading', { name: '🌱 妹妹的數學練習' })).toBeVisible();
  await expect(page.getByText('3407 的位值分解是哪一個？')).toBeVisible();
  await page.getByRole('button', { name: '3000 + 400 + 7', exact: true }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(2);
  expect(records[1]).toMatchObject({ student: 'meimei', subject: 'mathematics', questionId: 'meimei-mathematics-1' });
  expect(records[0].student).toBe('jiejie');
  await closeIsolatedContext(context);
});

test('selects a due jiejie mathematics question in Today Review', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [
      {
        id: 'jiejie-math-due', student: 'jiejie', subject: 'mathematics', questionId: 'jiejie-mathematics-1',
        firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      ...[2, 3, 4, 5, 6, 7, 8, 9].map((unit) => ({
        id: `jiejie-math-completed-${unit}`, student: 'jiejie', subject: 'mathematics', questionId: `jiejie-mathematics-${unit}`,
        firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
        createdAt: new Date().toISOString(),
      })),
    ],
  }));
  const page = await context.newPage();
  await page.goto('/jiejie/mathematics/review');
  await expect(page.getByText('今天準備了 1 題。')).toBeVisible();
  await page.getByRole('button', { name: '開始複習' }).click();
  await expect(page.getByText('84 的質因數分解是哪一個？')).toBeVisible();
  await closeIsolatedContext(context);
});

test('runs meimei mathematics reinforcement without writing records', async ({ browser }) => {
  const history = [
    { id: 'meimei-math-retry-1', student: 'meimei', subject: 'mathematics', questionId: 'meimei-mathematics-1', firstAnswer: 1, finalAnswer: 0, attempts: 2, correct: true, completed: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'meimei-math-recovery-1', student: 'meimei', subject: 'mathematics', questionId: 'meimei-mathematics-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'meimei-math-recovery-2', student: 'meimei', subject: 'mathematics', questionId: 'meimei-mathematics-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'meimei-math-recovery-3', student: 'meimei', subject: 'mathematics', questionId: 'meimei-mathematics-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ];
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: history }));
  const page = await context.newPage();
  await page.goto('/meimei/mathematics/reinforce');
  await expect(page.getByText('今天準備了 1 個需要再練的觀念。')).toBeVisible();
  await page.getByRole('button', { name: '開始再練一次' }).click();
  const before = await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'));
  await page.getByRole('button', { name: '300 + 400 + 7', exact: true }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText(/提示：/)).toBeVisible();
  await page.getByRole('button', { name: '3000 + 400 + 7', exact: true }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('再練習完成！')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toBe(before);
  await closeIsolatedContext(context);
});

test('keeps Mathematics Parent Summary and review settings isolated from Chinese', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [{
      id: 'parent-math-record', student: 'jiejie', subject: 'mathematics', questionId: 'jiejie-mathematics-1',
      firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date().toISOString(),
    }],
    reviewSettings: [{ student: 'jiejie', subject: 'mathematics', targetMinutes: 15 }],
  }));
  const page = await context.newPage();
  await page.goto('/parent');
  await page.getByRole('button', { name: '數學' }).click();
  await expect(page.getByText('84 的質因數分解是哪一個？')).toBeVisible();
  await expect(page.getByText('姐姐的數學學習摘要')).toHaveCount(1);
  await expect(page.getByLabel('15 分鐘')).toBeChecked();
  await closeIsolatedContext(context);
});

test('keeps the existing Chinese entry working without console errors', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/jiejie/chinese');
  await expect(page.getByRole('heading', { name: '🌸 姐姐的國語複習' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});
