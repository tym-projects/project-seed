import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./practice-persistence.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

test('formal review mode persists learning records', () => {
  const { shouldPersistLearningRecord } = loadModule();
  assert.equal(shouldPersistLearningRecord('formal-review'), true);
});

test('reinforcement practice mode never persists learning records', () => {
  const { shouldPersistLearningRecord } = loadModule();
  assert.equal(shouldPersistLearningRecord('reinforcement-practice'), false);
});
