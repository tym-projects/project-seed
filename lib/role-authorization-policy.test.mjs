import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadModule(url) {
  const source = readFileSync(url, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(require, testModule, testModule.exports);
  return testModule.exports;
}

const policy = loadModule(new URL('./role-authorization-policy.ts', import.meta.url));

test('parseAppRole accepts only the three supported roles', () => {
  assert.equal(policy.parseAppRole('parent'), 'parent');
  assert.equal(policy.parseAppRole('jiejie'), 'jiejie');
  assert.equal(policy.parseAppRole('meimei'), 'meimei');
  for (const value of [undefined, null, '', 'admin', {}, 1]) {
    assert.equal(policy.parseAppRole(value), null, JSON.stringify(value));
  }
});

test('getRoleHome maps every valid role to its home route', () => {
  assert.equal(policy.getRoleHome('parent'), '/');
  assert.equal(policy.getRoleHome('jiejie'), '/jiejie');
  assert.equal(policy.getRoleHome('meimei'), '/meimei');
});

test('parent can access the family home, parent mode, and both student route families', () => {
  for (const path of ['/', '/parent', '/parent/details', '/jiejie', '/jiejie/review', '/meimei', '/meimei/exam/chinese']) {
    assert.deepEqual(policy.getRoleRouteDecision(path, 'parent'), { type: 'allow' }, path);
  }
});

test('jiejie is redirected home from root, meimei, and parent routes', () => {
  assert.deepEqual(policy.getRoleRouteDecision('/', 'jiejie'), { type: 'redirect', location: '/jiejie' });
  assert.deepEqual(policy.getRoleRouteDecision('/jiejie/review', 'jiejie'), { type: 'allow' });
  assert.deepEqual(policy.getRoleRouteDecision('/meimei', 'jiejie'), { type: 'redirect', location: '/jiejie' });
  assert.deepEqual(policy.getRoleRouteDecision('/parent', 'jiejie'), { type: 'redirect', location: '/jiejie' });
});

test('meimei is redirected home from root, jiejie, and parent routes', () => {
  assert.deepEqual(policy.getRoleRouteDecision('/', 'meimei'), { type: 'redirect', location: '/meimei' });
  assert.deepEqual(policy.getRoleRouteDecision('/meimei/exam/mathematics', 'meimei'), { type: 'allow' });
  assert.deepEqual(policy.getRoleRouteDecision('/jiejie', 'meimei'), { type: 'redirect', location: '/meimei' });
  assert.deepEqual(policy.getRoleRouteDecision('/parent', 'meimei'), { type: 'redirect', location: '/meimei' });
});

test('missing and invalid roles fail closed without defaulting to parent', () => {
  for (const role of [null, 'admin']) {
    for (const path of ['/', '/parent', '/jiejie', '/meimei', '/jiejie/review', '/meimei/exam/chinese']) {
      assert.deepEqual(policy.getRoleRouteDecision(path, role), { type: 'redirect', location: '/access-denied' }, `${role}:${path}`);
    }
    assert.deepEqual(policy.getRoleRouteDecision('/access-denied', role), { type: 'allow' });
  }
});

test('public, Clerk internal, Next.js internal, and static paths bypass role denial', () => {
  for (const path of ['/sign-in', '/sign-in/foo', '/__clerk/client', '/_next/static/chunk.js', '/favicon.ico']) {
    assert.deepEqual(policy.getRoleRouteDecision(path, null), { type: 'allow' }, path);
  }
});
