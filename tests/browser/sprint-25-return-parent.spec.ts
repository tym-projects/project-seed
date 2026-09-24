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
        const link = page.getByRole('link', { name: `返回${student.label}首頁` }).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', student.home);
        const rect = await link.boundingBox();
        expect(rect?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(360);
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

test('unfinished answer uses an in-page leave dialog and preserves state when cancelled', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [] }));
  await context.addInitScript(() => { Math.random = () => 0.999999; });
  const page = await context.newPage();
  await page.goto('/jiejie/mathematics');
  await page.getByRole('button', { name: '2 × 2 × 3 × 7' }).click();
  await page.getByRole('link', { name: '返回姐姐首頁' }).click();
  await expect(page).toHaveURL(/\/jiejie\/mathematics$/);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  await expect(page.getByRole('heading', { name: '確定要返回首頁嗎？' })).toBeVisible();
  await expect(page.getByText('目前這題尚未完成，離開後不會保留這題的作答進度。')).toBeVisible();
  await expect(page.getByRole('button', { name: '繼續作答' })).toBeFocused();
  await page.getByRole('button', { name: '繼續作答' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '2 × 2 × 3 × 7' })).toHaveClass(/bg-pink-100/);
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toBe('[]');

  await page.getByRole('link', { name: '返回姐姐首頁' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/\/jiejie\/mathematics$/);
  await page.getByRole('link', { name: '返回姐姐首頁' }).click();
  await page.getByRole('button', { name: '確認返回首頁' }).click();
  await expect(page).toHaveURL(/\/jiejie$/);
  expect(await page.evaluate(() => localStorage.getItem('project-seed:learning-records:v1'))).toBe('[]');

  await page.goto('/jiejie/mathematics');
  await page.getByRole('button', { name: '2 × 2 × 3 × 7' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  await expect(page.getByText('答對了！')).toBeVisible();
  await page.getByRole('link', { name: '返回姐姐首頁' }).click();
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
    await expect(page.getByRole('link', { name: '返回妹妹首頁' })).toBeVisible();
    await page.goto('/parent');
    await expect(page.getByRole('button', { name: '姐姐' })).toBeVisible();
    await expect(page.getByRole('button', { name: '社會' })).toBeVisible();
    const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    await closeIsolatedContext(context);
  }
});

test('saves a Learning Record when randomUUID is unavailable but getRandomValues remains available', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 }, timezoneId: 'Asia/Taipei' });
  await context.addInitScript(() => { Math.random = () => 0.999999; });
  await context.addInitScript(() => {
    window.localStorage.setItem('project-seed:learning-records:v1', '[]');
    Object.defineProperty(window.crypto, 'randomUUID', { configurable: true, value: undefined });
  });
  const page = await context.newPage();
  await page.goto('/jiejie/mathematics');
  await page.getByRole('button', { name: '2 × 2 × 3 × 7' }).click();
  await page.getByRole('button', { name: '送出答案' }).click();
  const records = await page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]'));
  expect(records).toHaveLength(1);
  expect(records[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  await closeIsolatedContext(context);
});
