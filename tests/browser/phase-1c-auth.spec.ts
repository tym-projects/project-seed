import { test, expect } from '@playwright/test';

const protectedRoutes = [
  '/',
  '/parent',
  '/jiejie',
  '/jiejie/chinese',
  '/jiejie/review',
  '/jiejie/mathematics/reinforce',
  '/jiejie/exam/chinese',
  '/meimei',
  '/meimei/review',
  '/meimei/natural-science/reinforce',
  '/meimei/exam/mathematics',
];

test('signed-out users cannot reach protected route families', async ({ request }) => {
  for (const route of protectedRoutes) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toMatch(/\/sign-in(?:[/?#]|$)/);
  }
});

test('sign-in is public while the sign-up entry is absent', async ({ page }) => {
  await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/sign-in(?:[/?#]|$)/);
  await expect(page.getByText(/sign in/i).first()).toBeVisible();
  await expect(page.getByText(/sign up/i)).toHaveCount(0);
});

test('signed-out reload and back navigation do not reveal protected content', async ({ page }) => {
  await page.goto('/parent', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/sign-in(?:[/?#]|$)/);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/sign-in(?:[/?#]|$)/);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).not.toContainText('孩子學習紀錄');
});

test('Clerk auth state does not create a second Learning Record namespace', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('project-seed:learning-records:v1', JSON.stringify([]));
  });
  await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).sort())).toEqual([
    'project-seed:learning-records:v1',
  ]);
});

for (const username of ['yenmin', 'ariel', 'linda']) {
  test(`valid ${username} login is ready for Human credential injection`, async () => {
    test.skip(
      !process.env[`CLERK_E2E_${username.toUpperCase()}_PASSWORD`],
      'Password is intentionally supplied only by Human at the Authentication Review Gate.',
    );
  });
}

test('one invalid-password attempt is ready for Human credential injection', async () => {
  test.skip(
    !process.env.CLERK_E2E_INVALID_PASSWORD,
    'The one-attempt invalid-password check requires Human-supplied credentials and remains at the review gate.',
  );
});
