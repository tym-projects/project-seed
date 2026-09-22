import type { Browser, BrowserContext } from '@playwright/test';
import type { SyntheticStorageState } from '../fixtures/storage';

export async function newIsolatedContext(browser: Browser, storageState: SyntheticStorageState): Promise<BrowserContext> {
  const context = await browser.newContext({ timezoneId: 'Asia/Taipei' });
  await context.addInitScript((entries: SyntheticStorageState) => {
    for (const [key, value] of Object.entries(entries)) {
      if (window.localStorage.getItem(key) === null) {
        window.localStorage.setItem(key, value);
      }
    }
  }, storageState);
  return context;
}

export async function closeIsolatedContext(context: BrowserContext) {
  await context.close();
}
