import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./meimei-chinese.ts', import.meta.url);

function loadQuestionBank() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });

  return testModule.exports.questions;
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('MeiMei Chinese question bank keeps three fixed and unique question IDs', () => {
  const questions = loadQuestionBank();

  assert.deepEqual(
    toPlainValue(questions.map((question) => question.id)),
    ['meimei-chinese-1', 'meimei-chinese-2', 'meimei-chinese-3'],
  );
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
});

test('MeiMei Chinese questions have valid answer options', () => {
  const questions = loadQuestionBank();

  for (const question of questions) {
    assert.ok(question.options.length >= 2);
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
  }
});
