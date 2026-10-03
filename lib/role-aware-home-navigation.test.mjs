import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const rootPage = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const homeLink = readFileSync(new URL('../components/navigation/SiteHomeLink.tsx', import.meta.url), 'utf8');
const jieJiePage = readFileSync(new URL('../app/jiejie/page.tsx', import.meta.url), 'utf8');
const meiMeiPage = readFileSync(new URL('../app/meimei/page.tsx', import.meta.url), 'utf8');

test('root page uses authenticated session role and defense-in-depth redirects', () => {
  assert.match(rootPage, /auth\(\)/);
  assert.match(rootPage, /sessionClaims/);
  assert.match(rootPage, /metadata\?\.role/);
  assert.match(rootPage, /parseAppRole/);
  assert.match(rootPage, /getRoleHome/);
  assert.match(rootPage, /redirect\(/);
  assert.doesNotMatch(rootPage, /useEffect|useRouter|username|userId/);
});

test('root page preserves all parent family entry points', () => {
  assert.match(rootPage, /href="\/jiejie"/);
  assert.match(rootPage, /href="\/meimei"/);
  assert.match(rootPage, /href="\/parent"/);
});

test('root page fails closed for missing or invalid roles', () => {
  assert.match(rootPage, /access-denied/);
  assert.doesNotMatch(rootPage, /role\s*\?\?\s*['"]parent['"]/);
});

test('SiteHomeLink derives its destination from the shared role home helper', () => {
  assert.match(homeLink, /auth\(\)/);
  assert.match(homeLink, /sessionClaims/);
  assert.match(homeLink, /metadata\?\.role/);
  assert.match(homeLink, /parseAppRole/);
  assert.match(homeLink, /getRoleHome/);
  assert.match(homeLink, /access-denied/);
  assert.doesNotMatch(homeLink, /username|userId/);
  assert.doesNotMatch(homeLink, /role\s*===\s*['"](parent|jiejie|meimei)['"]/);
});

test('child homepages have no cross-role or parent-mode entry points', () => {
  assert.doesNotMatch(jieJiePage, /妹妹|爸爸模式|\/meimei|\/parent/);
  assert.doesNotMatch(meiMeiPage, /姐姐|爸爸模式|\/jiejie|\/parent/);
});
