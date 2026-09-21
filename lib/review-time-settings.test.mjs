import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./review-time-settings.ts', import.meta.url);
const timeModulePath = new URL('./review-session-time.ts', import.meta.url);
const settingsKey = 'project-seed:review-settings:v1';
const sessionsKey = 'project-seed:review-sessions:v1';

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function createLocalStorage({ throwOnSet = false } = {}) {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      if (throwOnSet) throw new Error('storage unavailable');
      values.set(key, value);
    },
  };
}

function loadSettingsModule() {
  const source = readFileSync(modulePath, 'utf8');
  const testModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, {
    exports: testModule.exports,
    module: testModule,
    window: globalThis.window,
  });
  return testModule.exports;
}

function loadTimeModule() {
  const source = readFileSync(timeModulePath, 'utf8');
  const testModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, {
    exports: testModule.exports,
    module: testModule,
  });
  return testModule.exports;
}

test('returns null until a target is explicitly saved and restores it after refresh', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  let settings = loadSettingsModule();
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), null);
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  settings = loadSettingsModule();
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), 10);
});

test('upserts one pair without changing sister or subject settings', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const settings = loadSettingsModule();
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  settings.saveReviewTargetMinutes('meimei', 'chinese', 15);
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 15);
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), 15);
  assert.equal(settings.getReviewTargetMinutes('meimei', 'chinese'), 15);
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'math'), null);
});

test('keeps an unset sibling unset after another student saves a target', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const settings = loadSettingsModule();
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  assert.equal(settings.getReviewTargetMinutes('meimei', 'chinese'), null);
});

test('ignores malformed storage and keeps the last valid duplicate record', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const settings = loadSettingsModule();
  globalThis.window.localStorage.setItem(settingsKey, '{bad json');
  assert.deepEqual(toPlainValue(settings.readReviewTimeSettings()), []);
  globalThis.window.localStorage.setItem(settingsKey, JSON.stringify([
    { student: 'jiejie', subject: 'chinese', targetMinutes: 10 },
    { student: 'jiejie', subject: 'chinese', targetMinutes: 15 },
    { student: 'meimei', subject: 'math', targetMinutes: 10 },
    { student: 'unknown', subject: 'chinese', targetMinutes: 10 },
    { student: 'meimei', subject: 'chinese', targetMinutes: 20 },
  ]));
  assert.deepEqual(toPlainValue(settings.readReviewTimeSettings()), [{ student: 'jiejie', subject: 'chinese', targetMinutes: 15 }]);
});

test('normalizes only the saved pair and does not modify active review session data', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const originalSession = [{ student: 'meimei', subject: 'chinese', localReviewDate: '2026-08-20', startedAt: '2026-08-20T00:00:00.000Z' }];
  globalThis.window.localStorage.setItem(sessionsKey, JSON.stringify(originalSession));
  globalThis.window.localStorage.setItem(settingsKey, JSON.stringify([
    { student: 'jiejie', subject: 'chinese', targetMinutes: 10 },
    { student: 'jiejie', subject: 'chinese', targetMinutes: 15 },
    { student: 'meimei', subject: 'chinese', targetMinutes: 15 },
  ]));
  const settings = loadSettingsModule();
  const rawSessionBefore = globalThis.window.localStorage.getItem(sessionsKey);
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  assert.deepEqual(JSON.parse(globalThis.window.localStorage.getItem(settingsKey)), [
    { student: 'meimei', subject: 'chinese', targetMinutes: 15 },
    { student: 'jiejie', subject: 'chinese', targetMinutes: 10 },
  ]);
  assert.equal(globalThis.window.localStorage.getItem(sessionsKey), rawSessionBefore);
});

test('uses a changed target with the original active session clock', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const originalSession = [{ student: 'meimei', subject: 'chinese', localReviewDate: '2026-08-20', startedAt: '2026-08-20T00:00:00.000Z' }];
  globalThis.window.localStorage.setItem(sessionsKey, JSON.stringify(originalSession));
  const settings = loadSettingsModule();
  settings.saveReviewTargetMinutes('meimei', 'chinese', 15);
  settings.saveReviewTargetMinutes('meimei', 'chinese', 10);
  assert.equal(globalThis.window.localStorage.getItem(sessionsKey), JSON.stringify(originalSession));
  const { getReviewTimeNotice } = loadTimeModule();
  assert.deepEqual(toPlainValue(getReviewTimeNotice(10, settings.getReviewTargetMinutes('meimei', 'chinese'))), { kind: 'target-complete', targetMinutes: 10 });
});

test('falls back safely without browser storage or when writes throw', () => {
  delete globalThis.window;
  let settings = loadSettingsModule();
  assert.deepEqual(toPlainValue(settings.readReviewTimeSettings()), []);
  assert.doesNotThrow(() => settings.saveReviewTargetMinutes('jiejie', 'chinese', 10));
  globalThis.window = { localStorage: createLocalStorage({ throwOnSet: true }) };
  settings = loadSettingsModule();
  assert.doesNotThrow(() => settings.saveReviewTargetMinutes('jiejie', 'chinese', 10));
});
