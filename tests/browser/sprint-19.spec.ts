import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const practiceHistory = [
  { id: 'smoke-s19-retry', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-5', firstAnswer: 0, finalAnswer: 1, attempts: 2, correct: true, completed: true, createdAt: '2026-09-18T04:00:00.000Z' },
  { id: 'smoke-s19-recovery-1', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-5', firstAnswer: 1, finalAnswer: 1, attempts: 1, correct: true, completed: true, createdAt: '2026-09-19T04:00:00.000Z' },
  { id: 'smoke-s19-recovery-2', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-5', firstAnswer: 1, finalAnswer: 1, attempts: 1, correct: true, completed: true, createdAt: '2026-09-20T04:00:00.000Z' },
];

test('does not reinforce an inactive姐姐 Chinese question', async ({ browser }) => {
  const reviewSessions = [{ student: 'jiejie', subject: 'chinese', localReviewDate: '2026-09-21', startedAt: '2026-09-21T01:00:00.000Z' }];
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: practiceHistory, reviewSessions }));
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-09-22T12:00:00+08:00') });
  await page.goto('/jiejie/reinforce');
  await expect(page.getByText('目前沒有需要再練的題目。')).toBeVisible();
  await closeIsolatedContext(context);
});

test('keeps meimei and non-chinese data out of jiejie practice', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [...practiceHistory, {
      id: 'smoke-s19-meimei-math', student: 'meimei', subject: 'math', questionId: 'jiejie-chinese-5', firstAnswer: 0, finalAnswer: 1, attempts: 2, correct: true, completed: true, createdAt: '2026-09-18T04:00:00.000Z',
    }],
  }));
  const page = await context.newPage();
  await page.goto('/meimei/reinforce');
  await expect(page.getByText('目前沒有需要再練的題目。')).toBeVisible();
  await closeIsolatedContext(context);
});
