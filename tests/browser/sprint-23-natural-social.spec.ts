import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('runs all four natural and social first-practice entries with isolated records', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const cases = [
    { path: '/jiejie/natural-science', heading: '🌸 姐姐的自然練習', question: '陽光照射下，地面上的水逐漸變少', answer: '水變成水蒸氣，進入空氣中', student: 'jiejie', subject: 'natural_science', id: 'jiejie-natural-science-1' },
    { path: '/jiejie/social-studies', heading: '🌸 姐姐的社會練習', question: '下列哪一項是臺灣民主政治發展中的可查證歷史事實', answer: '1996 年臺灣舉行第一次總統直接民選', student: 'jiejie', subject: 'social_studies', id: 'jiejie-social-studies-1' },
    { path: '/meimei/natural-science', heading: '🌿 妹妹的自然練習', question: '觀察一株完整的植物', answer: '固定植物，並幫助植物吸收水分', student: 'meimei', subject: 'natural_science', id: 'meimei-natural-science-1' },
    { path: '/meimei/social-studies', heading: '🌿 妹妹的社會練習', question: '下列哪一個說法最符合家庭生活中的分工合作', answer: '家庭成員可以依能力和需要一起分擔生活中的工作', student: 'meimei', subject: 'social_studies', id: 'meimei-social-studies-1' },
  ] as const;

  const page = await context.newPage();
  for (const item of cases) {
    await page.goto(item.path);
    await expect(page.getByRole('heading', { name: item.heading })).toBeVisible();
    await expect(page.getByText(item.question)).toBeVisible();
    await page.getByRole('button', { name: item.answer, exact: true }).click();
    await page.getByRole('button', { name: '送出答案' }).click();
    await expect(page.getByText(/答對了！|答錯了。/)).toBeVisible();
    await expect(page.getByRole('button', { name: '下一題' })).toBeVisible();
  }

  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(4);
  expect(records.map((record: { student: string; subject: string; questionId: string }) => `${record.student}:${record.subject}:${record.questionId}`)).toEqual([
    'jiejie:natural_science:jiejie-natural-science-1',
    'jiejie:social_studies:jiejie-social-studies-1',
    'meimei:natural_science:meimei-natural-science-1',
    'meimei:social_studies:meimei-social-studies-1',
  ]);
  await closeIsolatedContext(context);
});

test('selects a natural science due item without mixing social studies', async ({ browser }) => {
  const due = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [
      { id: 'natural-due', student: 'jiejie', subject: 'natural_science', questionId: 'jiejie-natural-science-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: due },
      { id: 'social-due', student: 'jiejie', subject: 'social_studies', questionId: 'jiejie-social-studies-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: due },
    ],
  }));
  const page = await context.newPage();
  await page.goto('/jiejie/natural-science/review');
  await expect(page.getByText('今天準備了 4 題。')).toBeVisible();
  await page.getByRole('button', { name: '開始複習' }).click();
  await expect(page.getByText('陽光照射下，地面上的水逐漸變少')).toBeVisible();
  await expect(page.getByText('下列哪一項是臺灣民主政治發展中的可查證歷史事實')).toHaveCount(0);
  await closeIsolatedContext(context);
});

test('runs social studies reinforcement without writing a new learning record', async ({ browser }) => {
  const history = [
    { id: 'social-retry', student: 'meimei', subject: 'social_studies', questionId: 'meimei-social-studies-1', firstAnswer: 1, finalAnswer: 0, attempts: 2, correct: true, completed: true, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'social-recovery-1', student: 'meimei', subject: 'social_studies', questionId: 'meimei-social-studies-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'social-recovery-2', student: 'meimei', subject: 'social_studies', questionId: 'meimei-social-studies-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'social-recovery-3', student: 'meimei', subject: 'social_studies', questionId: 'meimei-social-studies-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ];
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: history }));
  const page = await context.newPage();
  await page.goto('/meimei/social-studies/reinforce');
  await expect(page.getByText('今天準備了 1 個需要再練的觀念。')).toBeVisible();
  await page.getByRole('button', { name: '開始再練一次' }).click();
  const before = await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'));
  await page.getByRole('button', { name: '只有賺錢的人才算對家庭有貢獻' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText(/提示：/)).toBeVisible();
  await page.getByRole('button', { name: '家庭成員可以依能力和需要一起分擔生活中的工作' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('再練習完成！')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toBe(before);
  await closeIsolatedContext(context);
});

test('shows separated natural and social parent summaries and preserves existing subjects', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    learningRecords: [
      { id: 'jiejie-natural', student: 'jiejie', subject: 'natural_science', questionId: 'jiejie-natural-science-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date().toISOString() },
      { id: 'meimei-social', student: 'meimei', subject: 'social_studies', questionId: 'meimei-social-studies-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: new Date().toISOString() },
    ],
    reviewSettings: [{ student: 'jiejie', subject: 'natural_science', targetMinutes: 15 }, { student: 'meimei', subject: 'social_studies', targetMinutes: 20 }],
  }));
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/parent');
  await page.getByRole('button', { name: '自然' }).click();
  await expect(page.getByText('陽光照射下，地面上的水逐漸變少')).toBeVisible();
  await expect(page.getByText('姐姐的自然學習摘要')).toHaveCount(1);
  await page.getByRole('button', { name: '妹妹' }).click();
  await page.getByRole('button', { name: '社會' }).click();
  await expect(page.getByText('下列哪一個說法最符合家庭生活中的分工合作')).toBeVisible();
  await expect(page.getByText('妹妹的社會學習摘要')).toHaveCount(1);
  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('keeps existing Chinese and Mathematics entries working without console errors', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/jiejie/chinese');
  await expect(page.getByRole('heading', { name: '🌸 姐姐的國語複習' })).toBeVisible();
  await page.goto('/meimei/mathematics');
  await expect(page.getByRole('heading', { name: '🌱 妹妹的數學練習' })).toBeVisible();
  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});
