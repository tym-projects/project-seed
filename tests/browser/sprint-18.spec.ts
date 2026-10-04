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

const completedTodayOtherGroups = [
  'jiejie-chinese-2', 'jiejie-chinese-5', 'jiejie-chinese-6', 'jiejie-chinese-7', 'jiejie-chinese-8', 'jiejie-chinese-9',
  'jiejie-chinese-10', 'jiejie-chinese-11', 'jiejie-chinese-12', 'jiejie-chinese-13',
  'jiejie-chinese-14', 'jiejie-chinese-15', 'jiejie-chinese-16', 'jiejie-chinese-17',
  'jiejie-chinese-18', 'jiejie-chinese-19', 'jiejie-chinese-20', 'jiejie-chinese-21',
].map((questionId) => ({
  id: `smoke-s18-today-${questionId}`, student: 'jiejie', subject: 'chinese', questionId,
  firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
  createdAt: isoAtLocalDay(0, 4),
}));

test('does not actively review an excluded or uncertain姐姐 Chinese history record', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [historyRecord, ...completedTodayOtherGroups] }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await expect(page.getByText('今天沒有新的複習題目。')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toContain('jiejie-chinese-1');
  await closeIsolatedContext(context);
});

test('safely ignores a stale review session for an excluded姐姐 Chinese question', async ({ browser }) => {
  const startedAt = isoAtLocalDay(0, 1);
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [historyRecord, ...completedTodayOtherGroups],
    reviewSessions: [{ student: 'jiejie', subject: 'chinese', localReviewDate: localDateAt(0), startedAt }],
  }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await expect(page.getByText('今天沒有新的複習題目。')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('project-seed:review-sessions:v1'))).toContain(startedAt);
  await closeIsolatedContext(context);
});

test('safely ignores a pending confirmation whose questions are now inactive', async ({ browser }) => {
  const primaryToday = { ...historyRecord, id: 'smoke-s18-primary-today', questionId: 'jiejie-chinese-3', createdAt: isoAtLocalDay(0, 11) };
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [historyRecord, primaryToday, ...completedTodayOtherGroups], reviewSessions: [{ student: 'jiejie', subject: 'chinese', localReviewDate: localDateAt(0), startedAt: isoAtLocalDay(0, 1) }] }));
  const page = await context.newPage();
  await page.goto('/jiejie/review');
  await expect(page.getByText('今天沒有新的複習題目。')).toBeVisible();
  await closeIsolatedContext(context);
});

test('renders the approved MeiMei action variation in the existing review flow', async ({ browser }) => {
  const fixedReviewDate = new Date('2026-09-22T12:00:00+08:00');
  const todayOtherGroups = [
    'meimei-chinese-1', 'meimei-chinese-3', 'meimei-chinese-6', 'meimei-chinese-7',
    'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10', 'meimei-chinese-11',
  ].map((questionId) => ({
    id: `smoke-s21-today-${questionId}`,
    student: 'meimei', subject: 'chinese', questionId,
    firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true,
    createdAt: '2026-09-22T04:00:00+08:00',
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
  await page.clock.install({ time: fixedReviewDate });
  await page.goto('/meimei/review');
  await page.getByRole('button', { name: '開始複習' }).click();
  await expect(page.locator('main p.text-xl')).toContainText('小安拿起鉛筆');
  await page.getByRole('button', { name: '寫' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('答對了！你找到了句子中的動作詞。')).toBeVisible();
  await closeIsolatedContext(context);
});
