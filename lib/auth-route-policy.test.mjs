import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

function loadModule(url) {
  let source;
  try {
    source = readFileSync(url, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const testModule = { exports: {} };
  new Function('require', 'module', 'exports', compiled)(require, testModule, testModule.exports);
  return testModule.exports;
}

const policy = loadModule(new URL('./auth-route-policy.ts', import.meta.url));

test('sign-in, Clerk internal paths, Next.js internals, and static assets are public', () => {
  for (const path of ['/sign-in', '/sign-in/foo', '/__clerk/client']) {
    assert.equal(policy.isPublicAuthPath(path), true, path);
  }
  for (const path of ['/', '/parent', '/jiejie/chinese', '/meimei/exam/math']) {
    assert.equal(policy.isPublicAuthPath(path), false, path);
  }
});

test('protected route policy covers all application pages', () => {
  for (const path of ['/', '/parent', '/jiejie', '/jiejie/review', '/meimei', '/meimei/exam/chinese']) {
    assert.equal(policy.isProtectedAuthPath(path), true, path);
  }
});

test('auth route decision redirects signed-out protected pages and allows authenticated pages', () => {
  assert.deepEqual(policy.getAuthRouteDecision('/sign-in', false), { type: 'public' });
  assert.deepEqual(policy.getAuthRouteDecision('/__clerk/client', false), { type: 'public' });
  assert.deepEqual(policy.getAuthRouteDecision('/_next/static/chunk.js', false), { type: 'public' });
  assert.deepEqual(policy.getAuthRouteDecision('/favicon.ico', false), { type: 'public' });
  assert.deepEqual(policy.getAuthRouteDecision('/', false), { type: 'redirect' });
  assert.deepEqual(policy.getAuthRouteDecision('/parent', false), { type: 'redirect' });
  assert.deepEqual(policy.getAuthRouteDecision('/jiejie/chinese', false), { type: 'redirect' });
  assert.deepEqual(policy.getAuthRouteDecision('/meimei/exam/math', false), { type: 'redirect' });
  assert.deepEqual(policy.getAuthRouteDecision('/', true), { type: 'allow' });
  assert.deepEqual(policy.getAuthRouteDecision('/parent', true), { type: 'allow' });
});

test('production auth wiring explicitly protects routes and disables public sign-up UI', () => {
  const proxy = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
  const signIn = readFileSync(new URL('../app/sign-in/[[...sign-in]]/page.tsx', import.meta.url), 'utf8');
  assert.match(proxy, /clerkMiddleware/);
  assert.match(proxy, /redirectToSignIn/);
  assert.doesNotMatch(proxy, /createRouteMatcher/);
  assert.match(layout, /ClerkProvider/);
  assert.match(layout, /<body[\s\S]*<ClerkProvider>/);
  assert.match(signIn, /withSignUp=\{false\}/);
});
