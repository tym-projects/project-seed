import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = new URL('../', import.meta.url);

function loadPolicy() {
  const url = new URL('./lib/role-authorization-policy.ts', root);
  const source = readFileSync(url, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(require, testModule, testModule.exports);
  return testModule.exports;
}

const policy = loadPolicy();

const layouts = [
  { name: 'parent', path: '/parent', allowed: ['parent'], redirects: { jiejie: '/jiejie', meimei: '/meimei' } },
  { name: 'jiejie', path: '/jiejie', allowed: ['parent', 'jiejie'], redirects: { meimei: '/meimei' } },
  { name: 'meimei', path: '/meimei', allowed: ['parent', 'meimei'], redirects: { jiejie: '/jiejie' } },
];

for (const layout of layouts) {
  test(`${layout.name} layout source uses server auth, session metadata, parser, policy, and redirect`, () => {
    const path = new URL(`./app/${layout.name}/layout.tsx`, root);
    assert.equal(existsSync(path), true);
    const source = readFileSync(path, 'utf8');
    assert.match(source, /auth\(\)/);
    assert.match(source, /sessionClaims/);
    assert.match(source, /metadata\?\.role/);
    assert.match(source, /parseAppRole/);
    assert.match(source, /getRoleRouteDecision/);
    assert.match(source, /redirect\(/);
    assert.doesNotMatch(source, /username|email|userId/);
  });

  test(`${layout.name} layout decisions allow and redirect through the shared policy`, () => {
    for (const role of layout.allowed) {
      assert.deepEqual(policy.getRoleRouteDecision(layout.path, role), { type: 'allow' });
    }
    for (const [role, location] of Object.entries(layout.redirects)) {
      assert.deepEqual(policy.getRoleRouteDecision(layout.path, role), { type: 'redirect', location });
    }
    assert.deepEqual(policy.getRoleRouteDecision(layout.path, undefined), {
      type: 'redirect',
      location: '/access-denied',
    });
    assert.deepEqual(policy.getRoleRouteDecision(layout.path, 'invalid'), {
      type: 'redirect',
      location: '/access-denied',
    });
  });
}

test('layout guards fail closed for signed-out requests without rendering children', () => {
  for (const layout of layouts) {
    const source = readFileSync(new URL(`./app/${layout.name}/layout.tsx`, root), 'utf8');
    assert.match(source, /isAuthenticated/);
    assert.match(source, /redirectToSignIn/);
    assert.doesNotMatch(source, /children\s*\}\s*\)/);
  }
});

test('layout sources delegate decisions to the shared policy instead of defining role matrices', () => {
  for (const layout of layouts) {
    const source = readFileSync(new URL(`./app/${layout.name}/layout.tsx`, root), 'utf8');
    assert.doesNotMatch(source, /role\s*===\s*['"](parent|jiejie|meimei)['"]/);
  }
});
