import { test, expect } from '@playwright/test';
import { createSyntheticStorageState } from './fixtures/storage';
import { closeIsolatedContext, newIsolatedContext } from './helpers/context';

test('retired JieJie Chinese radical questions are absent from current practice and review routes', async ({ browser }) => {
  const context = await newIsolatedContext(browser, createSyntheticStorageState());
  const page = await context.newPage();

  for (const path of ['/jiejie/chinese', '/jiejie/review', '/jiejie/reinforce']) {
    await page.goto(path);
    const content = await page.locator('main').innerText();
    expect(content).not.toContain('「天空」的「天」是什麼部首？');
    expect(content).not.toContain('想查「天」字時，應該查哪一個部首？');
  }

  await closeIsolatedContext(context);
});
