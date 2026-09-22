import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const localDateAt = (offsetDays: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isoAtLocalDay = (offsetDays: number, hour: number) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString();
};

const historyRecord = {
  id: 'smoke-s18-history', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-1',
  firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
  createdAt: isoAtLocalDay(-3, 4),
};

const completedTodayOtherGroups = ['jiejie-chinese-2', 'jiejie-chinese-5', 'jiejie-chinese-6', 'jiejie-chinese-7', 'jiejie-chinese-8', 'jiejie-chinese-9'].map((questionId) => ({
  id: `smoke-s18-today-${questionId}`, student: 'jiejie', subject: 'chinese', questionId,
  firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
  createdAt: isoAtLocalDay(0, 4),
}));

test('runs primary to deterministic confirmation and persists actual question ids once', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [historyRecord, ...completedTodayOtherGroups] }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await page.getByRole('button', { name: '開始複習' }).click();

  const firstQuestion = await page.locator('main p.text-xl').textContent();
  await page.getByRole('button', { name: /^①/ }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByRole('button', { name: '下一題' })).toBeVisible();
  await page.getByRole('button', { name: '下一題' }).click();
  await expect(page.getByText('換一種問法試試看，看看你是不是真的懂了。')).toBeVisible();
  const confirmationQuestion = await page.locator('main p.text-xl').textContent();
  expect(confirmationQuestion).not.toBe(firstQuestion);
  await page.getByRole('button', { name: /^①/ }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('今日複習完成！')).toBeVisible();

  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(completedTodayOtherGroups.length + 3);
  const newQuestionIds = records.slice(-2).map((record: { questionId: string }) => record.questionId);
  expect(new Set(newQuestionIds).size).toBe(2);
  expect(newQuestionIds).not.toContain('smoke-s18-history');
  await closeIsolatedContext(context);
});

test('refreshes pending confirmation without resetting the active review startedAt', async ({ browser }) => {
  const startedAt = isoAtLocalDay(0, 1);
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [historyRecord],
    reviewSessions: [{ student: 'jiejie', subject: 'chinese', localReviewDate: localDateAt(0), startedAt }],
  }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await page.getByRole('button', { name: '開始複習' }).click();
  const primaryQuestion = await page.locator('main p.text-xl').textContent();
  await page.getByRole('button', { name: /^①/ }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  const beforeRefresh = await page.evaluate(() => ({
    records: localStorage.getItem('project-seed:learning-records:v1'),
    session: localStorage.getItem('project-seed:review-sessions:v1'),
  }));
  await page.goto('/jiejie/review', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: '開始複習' }).click();
  const reopenedQuestion = await page.locator('main p.text-xl').textContent();
  expect(reopenedQuestion).not.toBe(primaryQuestion);
  const afterRefresh = await page.evaluate(() => ({
    records: localStorage.getItem('project-seed:learning-records:v1'),
    session: localStorage.getItem('project-seed:review-sessions:v1'),
  }));
  expect(afterRefresh.records).toBe(beforeRefresh.records);
  expect(afterRefresh.session).toBe(beforeRefresh.session);
  expect(afterRefresh.session).toContain(startedAt);
  await closeIsolatedContext(context);
});

test('reopens a seeded primary-only record as the alternate question', async ({ browser }) => {
  const primaryToday = { ...historyRecord, id: 'smoke-s18-primary-today', questionId: 'jiejie-chinese-3', createdAt: isoAtLocalDay(0, 11) };
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [historyRecord, primaryToday], reviewSessions: [{ student: 'jiejie', subject: 'chinese', localReviewDate: localDateAt(0), startedAt: isoAtLocalDay(0, 1) }] }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await page.getByRole('button', { name: '開始複習' }).click();
  await expect(page.locator('main p.text-xl')).toContainText('香蕉 的「蕉」讀音是？');
  await closeIsolatedContext(context);
});

test('renders the approved MeiMei action variation in the existing review flow', async ({ browser }) => {
  const todayOtherGroups = [
    'meimei-chinese-1', 'meimei-chinese-3', 'meimei-chinese-6', 'meimei-chinese-7',
    'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10', 'meimei-chinese-11',
  ].map((questionId) => ({
    id: `smoke-s21-today-${questionId}`,
    student: 'meimei', subject: 'chinese', questionId,
    firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
    createdAt: isoAtLocalDay(0, 4),
  }));
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [
    {
      id: 'smoke-s21-action-history', student: 'meimei', subject: 'chinese', questionId: 'meimei-chinese-2',
      firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
      createdAt: '2026-09-19T04:00:00.000Z',
    },
    ...todayOtherGroups,
  ] }));
  const page = await context.newPage();
  await page.goto('/meimei/review');
  await page.getByRole('button', { name: '開始複習' }).click();
  await expect(page.locator('main p.text-xl')).toContainText('小安拿起鉛筆');
  await page.getByRole('button', { name: '寫' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('答對了！你找到了句子中的動作詞。')).toBeVisible();
  await closeIsolatedContext(context);
});
