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

test('has no notice before ten minutes', () => {
  const { getElapsedReviewMinutes, getReviewTimeNotice } = loadTimeModule();
  assert.equal(getElapsedReviewMinutes('2026-08-13T00:00:00.000Z', new Date('2026-08-13T00:09:59.999Z')), 9);
  assert.equal(getReviewTimeNotice(9), null);
});

test('shows the ten-minute notice from ten through fourteen minutes', () => {
  const { getReviewTimeNotice } = loadTimeModule();
  assert.equal(getReviewTimeNotice(10), 'ten-minutes');
  assert.equal(getReviewTimeNotice(14), 'ten-minutes');
});

test('shows the fifteen-minute notice at and after fifteen minutes', () => {
  const { getReviewTimeNotice } = loadTimeModule();
  assert.equal(getReviewTimeNotice(15), 'fifteen-minutes');
  assert.equal(getReviewTimeNotice(31), 'fifteen-minutes');
});

test('does not produce negative elapsed time for invalid or future timestamps', () => {
  const { getElapsedReviewMinutes, getReviewTimeNotice } = loadTimeModule();
  assert.equal(getElapsedReviewMinutes('bad', new Date('2026-08-13T00:00:00.000Z')), 0);
  assert.equal(getElapsedReviewMinutes('2026-08-13T01:00:00.000Z', new Date('2026-08-13T00:00:00.000Z')), 0);
  assert.equal(getReviewTimeNotice(0), null);
});
