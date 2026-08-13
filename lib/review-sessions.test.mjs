import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./review-sessions.ts', import.meta.url);

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function createLocalStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

function loadReviewSessionsModule() {
  const spacedSource = readFileSync(new URL('./spaced-review.ts', import.meta.url), 'utf8');
  const spacedModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(spacedSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, { exports: spacedModule.exports, module: spacedModule, Intl });
  const source = readFileSync(modulePath, 'utf8');
  const testModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, {
    exports: testModule.exports, module: testModule, window: globalThis.window,
    require: (specifier) => ({ '@/lib/spaced-review': spacedModule.exports })[specifier],
  });
  return testModule.exports;
}

function todayOptions(overrides = {}) {
  return { student: 'jiejie', subject: 'chinese', now: new Date('2026-08-12T16:30:00.000Z'), timeZone: 'Asia/Taipei', ...overrides };
}

test('creates a new session with the local review date', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { getOrCreateReviewSession, REVIEW_SESSIONS_STORAGE_KEY } = loadReviewSessionsModule();
  const session = getOrCreateReviewSession(todayOptions());
  assert.deepEqual(toPlainValue(session), { student: 'jiejie', subject: 'chinese', localReviewDate: '2026-08-13', startedAt: '2026-08-12T16:30:00.000Z' });
  assert.deepEqual(JSON.parse(globalThis.window.localStorage.getItem(REVIEW_SESSIONS_STORAGE_KEY)), [toPlainValue(session)]);
});

test('restores a same-day session after refresh', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { getOrCreateReviewSession } = loadReviewSessionsModule();
  const first = getOrCreateReviewSession(todayOptions());
  const restored = getOrCreateReviewSession(todayOptions({ now: new Date('2026-08-12T17:30:00.000Z') }));
  assert.deepEqual(restored, first);
});

test('replaces a stale prior-date session', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { getOrCreateReviewSession, readReviewSessions, REVIEW_SESSIONS_STORAGE_KEY } = loadReviewSessionsModule();
  globalThis.window.localStorage.setItem(REVIEW_SESSIONS_STORAGE_KEY, JSON.stringify([{ student: 'jiejie', subject: 'chinese', localReviewDate: '2026-08-12', startedAt: '2026-08-12T10:00:00.000Z' }]));
  const session = getOrCreateReviewSession(todayOptions());
  assert.equal(session.startedAt, '2026-08-12T16:30:00.000Z');
  assert.deepEqual(toPlainValue(readReviewSessions()), [toPlainValue(session)]);
});

test('keeps sisters and subjects isolated and clears only the completed session', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { getOrCreateReviewSession, readReviewSessions, endReviewSession } = loadReviewSessionsModule();
  const jiejieChinese = getOrCreateReviewSession(todayOptions());
  const meimeiChinese = getOrCreateReviewSession(todayOptions({ student: 'meimei' }));
  const jiejieMath = getOrCreateReviewSession(todayOptions({ subject: 'math' }));
  endReviewSession('jiejie', 'chinese');
  assert.deepEqual(toPlainValue(readReviewSessions()), [toPlainValue(meimeiChinese), toPlainValue(jiejieMath)]);
  assert.notEqual(jiejieChinese.student, meimeiChinese.student);
});

test('falls back safely for malformed storage and unavailable browser storage', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { getOrCreateReviewSession, readReviewSessions, REVIEW_SESSIONS_STORAGE_KEY } = loadReviewSessionsModule();
  globalThis.window.localStorage.setItem(REVIEW_SESSIONS_STORAGE_KEY, '{bad json');
  assert.deepEqual(toPlainValue(readReviewSessions()), []);
  assert.doesNotThrow(() => getOrCreateReviewSession(todayOptions()));
  delete globalThis.window;
  assert.deepEqual(toPlainValue(loadReviewSessionsModule().readReviewSessions()), []);
});
