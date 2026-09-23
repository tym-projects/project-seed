import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./flow-exit.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('builds an explicit student home target for every flow', () => {
  const { getFlowHomeTarget } = loadModule();
  assert.deepEqual(toPlainValue(getFlowHomeTarget('/jiejie', '回到姐姐首頁')), { href: '/jiejie', label: '回到姐姐首頁' });
  assert.deepEqual(toPlainValue(getFlowHomeTarget('/meimei', '回妹妹首頁')), { href: '/meimei', label: '回妹妹首頁' });
});

test('confirms only when an unfinished answer is in progress', () => {
  const { shouldConfirmFlowExit } = loadModule();
  assert.equal(shouldConfirmFlowExit({ selectedAnswer: null, isSubmitted: false, isCorrect: false }), false);
  assert.equal(shouldConfirmFlowExit({ selectedAnswer: 0, isSubmitted: false, isCorrect: false }), true);
  assert.equal(shouldConfirmFlowExit({ selectedAnswer: 0, isSubmitted: true, isCorrect: true }), false);
  assert.equal(shouldConfirmFlowExit({ selectedAnswer: 0, isSubmitted: true, isCorrect: false }), true);
});
