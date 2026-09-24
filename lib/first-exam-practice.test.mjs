import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const modulePath = new URL('./first-exam-practice.ts', import.meta.url);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

const question = (id, extra = {}) => ({
  id,
  topic: 'topic',
  type: 'basic',
  title: 'title',
  instruction: 'instruction',
  question: id,
  options: ['A', 'B', 'C', 'D'],
  answer: 0,
  hint: 'hint',
  explanation: 'explanation',
  encouragement: 'encouragement',
  ...extra,
});

test('monthly eligibility is an explicit questionId allowlist for confirmed ranges', () => {
  const { getFirstExamQuestions } = loadModule();
  const bank = [question('jiejie-mathematics-5'), question('jiejie-mathematics-1'), question('jiejie-mathematics-11')];
  assert.deepEqual(getFirstExamQuestions('jiejie', 'mathematics', bank).map(({ id }) => id), ['jiejie-mathematics-1', 'jiejie-mathematics-11']);
});

test('monthly mode excludes unconfirmed, out-of-range, and retired questions without fallback', () => {
  const { getFirstExamQuestions } = loadModule();
  const bank = [
    question('jiejie-chinese-1'),
    question('jiejie-chinese-2'),
    question('meimei-natural-science-1'),
    question('jiejie-mathematics-5'),
  ];
  assert.deepEqual(getFirstExamQuestions('jiejie', 'chinese', bank), []);
  assert.deepEqual(getFirstExamQuestions('meimei', 'natural_science', bank), []);
  assert.deepEqual(getFirstExamQuestions('jiejie', 'mathematics', bank), []);
});

test('allowlist selection is independent of source array order and preserves question objects', () => {
  const { getFirstExamQuestions } = loadModule();
  const first = question('meimei-social-studies-1', { answer: 2, hint: 'specific hint' });
  const second = question('meimei-social-studies-8', { explanation: 'specific explanation' });
  const selected = getFirstExamQuestions('meimei', 'social_studies', [second, first]);
  assert.deepEqual(selected.map(({ id }) => id), ['meimei-social-studies-8', 'meimei-social-studies-1']);
  assert.equal(selected[0], second);
  assert.equal(selected[1].answer, 2);
  assert.equal(selected[1].hint, 'specific hint');
  assert.equal(selected[0].explanation, 'specific explanation');
  assert.equal(new Set(selected.map(({ id }) => id)).size, selected.length);
});

test('confirmed monthly banks expose the expected eligible counts', () => {
  const { getFirstExamQuestionIds } = loadModule();
  assert.equal(getFirstExamQuestionIds('jiejie', 'mathematics').length, 13);
  assert.equal(getFirstExamQuestionIds('jiejie', 'natural_science').length, 12);
  assert.equal(getFirstExamQuestionIds('jiejie', 'social_studies').length, 12);
  assert.equal(getFirstExamQuestionIds('meimei', 'chinese').length, 12);
  assert.equal(getFirstExamQuestionIds('meimei', 'mathematics').length, 10);
  assert.equal(getFirstExamQuestionIds('meimei', 'natural_science').length, 0);
  assert.equal(getFirstExamQuestionIds('meimei', 'social_studies').length, 10);
});
