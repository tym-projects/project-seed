import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./reinforcement-practice-flow.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

test('maps practice items to primary-only flow items', () => {
  const { toPracticeFlowItems } = loadModule();
  const question = { id: 'q1', topic: '詞義', type: 'basic' };
  const result = toPracticeFlowItems([{ groupId: 'unit-1', primary: question }]);
  assert.deepEqual(Array.from(result, (item) => ({ groupId: item.groupId, primaryId: item.primary.id, confirmation: item.confirmation })), [
    { groupId: 'unit-1', primaryId: 'q1', confirmation: null },
  ]);
});

test('preserves item order and never creates a confirmation phase', () => {
  const { toPracticeFlowItems } = loadModule();
  const result = toPracticeFlowItems([
    { groupId: 'one', primary: { id: 'q1' } },
    { groupId: 'two', primary: { id: 'q2' } },
    { groupId: 'three', primary: { id: 'q3' } },
  ]);
  assert.deepEqual(Array.from(result, (item) => [item.groupId, item.primary.id, item.confirmation]), [
    ['one', 'q1', null],
    ['two', 'q2', null],
    ['three', 'q3', null],
  ]);
});
