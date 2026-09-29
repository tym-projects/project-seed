import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

const record = {
  id: 'backup-record-1',
  student: 'jiejie',
  subject: 'mathematics',
  questionId: 'jiejie-mathematics-1',
  firstAnswer: 0,
  finalAnswer: 0,
  attempts: 1,
  correct: true,
  completed: true,
  createdAt: '2026-09-29T08:00:00.000Z',
};

function backup(records: unknown[]) {
  return {
    format: 'project-seed-learning-records-backup',
    version: 1,
    exportedAt: '2026-09-29T09:00:00.000Z',
    recordCount: records.length,
    records,
  };
}

test('parent center exports and imports a validated learning-record backup', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [record] }));
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  await page.goto('/parent');
  await expect(page.getByRole('heading', { name: '學習紀錄備份' })).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '匯出備份' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^project-seed-learning-records-.*\.json$/);
  const raw = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of raw ?? []) chunks.push(Buffer.from(chunk));
  const exported = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  expect(exported.recordCount).toBe(1);
  expect(exported.records[0].id).toBe(record.id);
  await expect(page.getByText(record.questionId)).toHaveCount(0);

  const imported = { ...record, id: 'backup-record-2', questionId: 'jiejie-mathematics-2' };
  await page.locator('input[type="file"]').setInputFiles({
    name: 'learning-records.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup([imported])), 'utf8'),
  });
  await expect(page.getByText('匯入完成')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]').length)).toBe(2);
  expect(errors).toEqual([]);
  await closeIsolatedContext(context);
});

test('invalid backup is rejected without changing existing records', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [record] }));
  const page = await context.newPage();
  await page.goto('/parent');
  await page.locator('input[type="file"]').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ ...backup([record]), recordCount: 2 }), 'utf8'),
  });
  await expect(page.getByText(/匯入拒絕/)).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]').length)).toBe(1);
  await closeIsolatedContext(context);
});

test('restore drill recovers a backup after synthetic storage reset and reload', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState({ learningRecords: [record] }));
  const page = await context.newPage();
  await page.goto('/parent');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '匯出備份' }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream ?? []) chunks.push(Buffer.from(chunk));
  const exported = Buffer.concat(chunks).toString('utf8');
  await page.evaluate(() => localStorage.setItem('project-seed:learning-records:v1', '[]'));
  await page.locator('input[type="file"]').setInputFiles({ name: 'restore.json', mimeType: 'application/json', buffer: Buffer.from(exported, 'utf8') });
  await expect(page.getByText('匯入完成')).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]').length)).toBe(1);
  await page.reload();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]').length)).toBe(1);
  await page.locator('input[type="file"]').setInputFiles({ name: 'restore-again.json', mimeType: 'application/json', buffer: Buffer.from(exported, 'utf8') });
  await expect(page.getByText(/重複略過 1 筆/)).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('project-seed:learning-records:v1') ?? '[]').length)).toBe(1);
  await closeIsolatedContext(context);
});

test('backup controls remain usable at tablet sizes', async ({ browser }) => {
  for (const viewport of [{ width: 768, height: 1024 }, { width: 1024, height: 768 }]) {
    const context = await browser.newContext({ viewport, timezoneId: 'Asia/Taipei' });
    await context.addInitScript((entries) => {
      for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value);
    }, createSyntheticStorageState({ learningRecords: [record] }));
    const page = await context.newPage();
    await page.goto('/parent');
    await expect(page.getByRole('button', { name: '匯出備份' })).toBeVisible();
    await expect(page.getByLabel('匯入備份')).toBeVisible();
    const layout = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth);
    await closeIsolatedContext(context);
  }
});
