import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const subjects = [
  { label: '國語', practice: 'chinese', review: 'review', reinforce: 'reinforce', heading: '國語' },
  { label: '數學', practice: 'mathematics', review: 'mathematics/review', reinforce: 'mathematics/reinforce', heading: '數學' },
  { label: '自然', practice: 'natural-science', review: 'natural-science/review', reinforce: 'natural-science/reinforce', heading: '自然' },
  { label: '社會', practice: 'social-studies', review: 'social-studies/review', reinforce: 'social-studies/reinforce', heading: '社會' },
] as const;

function expectedLinks(student: 'jiejie' | 'meimei') {
  return subjects.flatMap(({ practice, review, reinforce }) => [
    `/${student}/${practice}`,
    `/${student}/${review}`,
    `/${student}/${reinforce}`,
  ]);
}

async function assertHomeLinks(page: import('@playwright/test').Page, student: 'jiejie' | 'meimei') {
  await page.goto(`/${student}`);
  const links = page.locator(`a[href^="/${student}/"]`);
  await expect(links).toHaveCount(12);
  const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')));
  expect(hrefs).toEqual(expectedLinks(student));
  await expect(page.getByRole('heading', { name: '📚 選擇練習' })).toBeVisible();
  for (const href of expectedLinks(student)) {
    const link = page.locator(`a[href="${href}"]`);
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href.replaceAll('/', '\\/')}$`));
    await page.goto(`/${student}`);
  }
}

test('姐姐與妹妹首頁各提供四科三入口並保留正確 student route', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  await assertHomeLinks(page, 'jiejie');
  await assertHomeLinks(page, 'meimei');

  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('四科首次練習入口仍顯示對應科目，且沒有 console error', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });

  for (const student of ['jiejie', 'meimei'] as const) {
    for (const { practice, heading } of subjects) {
      await page.goto(`/${student}/${practice}`);
      await expect(page.getByRole('heading', { name: new RegExp(heading) })).toBeVisible();
    }
  }

  expect(consoleErrors).toEqual([]);
  await closeIsolatedContext(context);
});

test('手機 viewport 可看到並點擊所有首頁入口且沒有水平溢出', async ({ browser }) => {
  const storageState = createSyntheticStorageState();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Taipei' });
  await context.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      if (window.localStorage.getItem(key) === null) window.localStorage.setItem(key, value);
    }
  }, storageState);
  const page = await context.newPage();

  for (const student of ['jiejie', 'meimei'] as const) {
    await page.goto(`/${student}`);
    await expect(page.locator(`a[href^="/${student}/"]`)).toHaveCount(12);
    const layout = await page.evaluate((student) => ({
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      links: Array.from(document.querySelectorAll(`a[href^="/${student}/"]`)).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      }),
    }), student);
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    expect(layout.links.every(({ left, right, width, height }) => left >= 0 && right <= layout.viewportWidth && width > 0 && height > 0)).toBe(true);
  }

  await closeIsolatedContext(context);
});
