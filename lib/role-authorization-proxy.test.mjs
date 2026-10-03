import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';

const proxyPath = new URL('../proxy.ts', import.meta.url);
const accessDeniedPath = new URL('../app/access-denied/page.tsx', import.meta.url);

test('proxy keeps authentication before role authorization and uses session metadata', () => {
  const proxy = readFileSync(proxyPath, 'utf8');
  assert.match(proxy, /clerkMiddleware/);
  assert.match(proxy, /redirectToSignIn\(\{ returnBackUrl: request\.url \}\)/);
  assert.match(proxy, /sessionClaims/);
  assert.match(proxy, /metadata\?\.role/);
  assert.match(proxy, /parseAppRole/);
  assert.match(proxy, /getRoleRouteDecision/);
  assert.match(proxy, /NextResponse\.redirect/);
  assert.doesNotMatch(proxy, /username/);
  assert.doesNotMatch(proxy, /userId/);
});

test('authorization redirects use the current request origin without hard-coded hosts', () => {
  const proxy = readFileSync(proxyPath, 'utf8');
  assert.match(proxy, /request\.nextUrl\.origin/);
  assert.doesNotMatch(proxy, /localhost|127\.0\.0\.1|192\.168\.|vercel\.app/);
});

test('access-denied is an intentionally minimal authenticated landing page', () => {
  assert.equal(existsSync(accessDeniedPath), true);
  const page = readFileSync(accessDeniedPath, 'utf8');
  assert.match(page, /access|權限|role/i);
  assert.doesNotMatch(page, /姐姐|妹妹|爸爸|\/jiejie|\/meimei|\/parent/);
});
