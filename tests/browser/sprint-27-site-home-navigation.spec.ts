import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const modePages = [
  { path: '/jiejie', label: '姐姐的學習' },
  { path: '/meimei', label: '妹妹的學習' },
  { path: '/parent', label: '孩子學習紀錄' },
] as const;

test('student and parent mode pages expose a clear return to the site home', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();

  for (const mode of modePages) {
    await page.goto(mode.path);
    await expect(page.getByRole('heading', { name: mode.label })).toBeVisible();
    const link = page.getByRole('link', { name: '返回網站首頁' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', '/');
    const rect = await link.boundingBox();
    expect(rect?.width ?? 0).toBeGreaterThanOrEqual(120);
    expect(rect?.height ?? 0).toBeGreaterThanOrEqual(44);
    await link.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: '🌱 Project Seed' })).toBeVisible();
  }

  await closeIsolatedContext(context);
});

test('site home still reaches both student modes and parent mode', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  await page.goto('/');

  for (const target of [
    { label: '👧 姐姐', path: '/jiejie', heading: '姐姐的學習' },
    { label: '👧 妹妹', path: '/meimei', heading: '妹妹的學習' },
    { label: '👨 爸爸模式', path: '/parent', heading: '孩子學習紀錄' },
  ]) {
    await page.goto('/');
    await page.getByRole('link', { name: target.label }).click();
    await expect(page).toHaveURL(new RegExp(`${target.path.replace('/', '\\/')}$`));
    await expect(page.getByRole('heading', { name: target.heading })).toBeVisible();
  }

  await closeIsolatedContext(context);
});

test('site-home navigation keeps tablet layouts usable', async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
    const context = await browser.newContext({ viewport, timezoneId: 'Asia/Taipei' });
    await context.addInitScript((entries) => {
      for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
    }, createSyntheticStorageState());
    const page = await context.newPage();

    for (const path of ['/jiejie', '/meimei', '/parent']) {
      await page.goto(path);
      const link = page.getByRole('link', { name: '返回網站首頁' });
      await expect(link).toBeVisible();
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    }

    await closeIsolatedContext(context);
  }
});
