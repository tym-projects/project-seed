import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

test('application auth protects the home and role route families', () => {
  assert.equal(existsSync(new URL('../proxy.ts', import.meta.url)), true);
  const proxy = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8');
  const home = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assert.match(proxy, /clerkMiddleware/);
  assert.match(proxy, /redirectToSignIn/);
  assert.match(proxy, /sessionClaims/);
  assert.match(home, /auth\(\)/);
  assert.match(home, /redirectToSignIn/);
});
