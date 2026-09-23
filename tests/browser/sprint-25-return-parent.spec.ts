import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const students = [
  { id: 'jiejie', home: '/jiejie', label: '姐姐' },
  { id: 'meimei', home: '/meimei', label: '妹妹' },
] as const;
const subjects = [
  { practice: 'chinese', review: 'review', reinforce: 'reinforce', label: '國語' },
  { practice: 'mathematics', review: 'mathematics/review', reinforce: 'mathematics/reinforce', label: '數學' },
  { practice: 'natural-science', review: 'natural-science/review', reinforce: 'natural-science/reinforce', label: '自然' },
  { practice: 'social-studies', review: 'social-studies/review', reinforce: 'social-studies/reinforce', label: '社會' },
] as const;

test('all four student flows expose an explicit home return target', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [] }));
  const page = await context.newPage();

  for (const student of students) {
    for (const subject of subjects) {
      for (const suffix of [subject.practice, subject.review, subject.reinforce]) {
        await page.goto(`/${student.id}/${suffix}`);
        const link = page.getByRole('link', { name: new RegExp(`${student.label}首頁`) }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', student.home);
      }
    }
  }

  await closeIsolatedContext(context);
});

test('parent center switches one student and one subject while preserving isolated settings', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({
    reviewSettings: [
      { student: 'jiejie', subject: 'mathematics', targetMinutes: 15 },
      { student: 'meimei', subject: 'social_studies', targetMinutes: 10 },
    ],
  }));
  const page = await context.newPage();
  await page.goto('/parent');

  await expect(page.getByRole('heading', { name: '姐姐的學習摘要' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '妹妹的學習摘要' })).toHaveCount(0);
  await page.getByRole('button', { name: '數學' }).click();
  await expect(page.getByRole('heading', { name: '姐姐的數學學習摘要' })).toBeVisible();
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(1);
  await expect(page.locator('input[type="radio"]:checked')).toBeChecked();
  await page.getByLabel('10 分鐘').check();
  await page.getByRole('button', { name: '妹妹' }).click();
  await page.getByRole('button', { name: '社會' }).click();
  await expect(page.getByRole('heading', { name: '妹妹的社會學習摘要' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '姐姐的數學學習摘要' })).toHaveCount(0);
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(1);
  await expect(page.locator('input[type="radio"]:checked')).toBeChecked();
  await page.getByRole('button', { name: '姐姐' }).click();
  await page.getByRole('button', { name: '數學' }).click();
  await expect(page.getByLabel('10 分鐘')).toBeChecked();

  await closeIsolatedContext(context);
});

test('unfinished answer asks before leaving, while completed record remains', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [] }));
  const page = await context.newPage();
  await page.goto('/jiejie/mathematics');
  await page.getByRole('button', { name: '2 × 2 × 3 × 7' }).click();
  let dialogSeen = false;
  page.once('dialog', async (dialog) => { dialogSeen = true; await dialog.dismiss(); });
  await page.getByRole('link', { name: '回到姐姐首頁' }).click();
  await expect(page).toHaveURL(/\/jiejie\/mathematics$/);
  expect(dialogSeen).toBe(true);
  await expect(page.getByRole('button', { name: '2 × 2 × 3 × 7' })).toHaveClass(/bg-pink-100/);
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toBe('[]');

  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('答對了！')).toBeVisible();
  await page.getByRole('link', { name: '回到姐姐首頁' }).click();
  await expect(page).toHaveURL(/\/jiejie$/);
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(1);
  await closeIsolatedContext(context);
});

test('tablet portrait and landscape keep return and parent controls usable', async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
    const context = await browser.newContext({ viewport, timezoneId: 'Asia/Taipei' });
    await context.addInitScript((entries) => {
      for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
    }, createSyntheticStorageState());
    const page = await context.newPage();
    await page.goto('/meimei/natural-science');
    await expect(page.getByRole('link', { name: /妹妹首頁/ })).toBeVisible();
    await page.goto('/parent');
    await expect(page.getByRole('button', { name: '姐姐' })).toBeVisible();
    await expect(page.getByRole('button', { name: '社會' })).toBeVisible();
    const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    await closeIsolatedContext(context);
  }
});
