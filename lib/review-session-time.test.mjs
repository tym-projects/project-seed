import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadTimeModule() {
  const source = readFileSync(new URL('./review-session-time.ts', import.meta.url), 'utf8');
  const testModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('has no notice before ten minutes', () => {
  const { getElapsedReviewMinutes, getReviewTimeNotice } = loadTimeModule();
  assert.equal(getElapsedReviewMinutes('2026-08-13T00:00:00.000Z', new Date('2026-08-13T00:09:59.999Z')), 9);
  assert.equal(getReviewTimeNotice(9, null), null);
});

test('keeps Sprint 14 thresholds when target is unset', () => {
  const { getReviewTimeNotice } = loadTimeModule();
  assert.deepEqual(toPlainValue(getReviewTimeNotice(10, null)), { kind: 'gentle-ten-minute' });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(14, null)), { kind: 'gentle-ten-minute' });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(15, null)), { kind: 'target-complete', targetMinutes: 15 });
});

test('keeps ten-minute completion after the old fifteen-minute boundary', () => {
  const { getReviewTimeNotice } = loadTimeModule();
  assert.deepEqual(toPlainValue(getReviewTimeNotice(10, 10)), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(14, 10)), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(15, 10)), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(31, 10)), { kind: 'target-complete', targetMinutes: 10 });
});

test('uses gentle ten then complete fifteen for an explicit fifteen-minute target', () => {
  const { getReviewTimeNotice } = loadTimeModule();
  assert.deepEqual(toPlainValue(getReviewTimeNotice(10, 15)), { kind: 'gentle-ten-minute' });
  assert.deepEqual(toPlainValue(getReviewTimeNotice(15, 15)), { kind: 'target-complete', targetMinutes: 15 });
});

test('does not produce negative elapsed time for invalid or future timestamps', () => {
  const { getElapsedReviewMinutes, getReviewTimeNotice } = loadTimeModule();
  assert.equal(getElapsedReviewMinutes('bad', new Date('2026-08-13T00:00:00.000Z')), 0);
  assert.equal(getElapsedReviewMinutes('2026-08-13T01:00:00.000Z', new Date('2026-08-13T00:00:00.000Z')), 0);
  assert.equal(getReviewTimeNotice(0, null), null);
});
