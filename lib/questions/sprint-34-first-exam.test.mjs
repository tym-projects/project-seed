import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const jiejieChinesePath = new URL('./jiejie-chinese.ts', import.meta.url);
const meimeiNaturalPath = new URL('./meimei-natural-science.ts', import.meta.url);
const firstExamPath = new URL('../first-exam-practice.ts', import.meta.url);

function loadModule(path, require = () => ({})) {
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require });
  return testModule.exports;
}

const expectedJiejieIds = [
  'jiejie-chinese-10', 'jiejie-chinese-11', 'jiejie-chinese-12', 'jiejie-chinese-13',
  'jiejie-chinese-14', 'jiejie-chinese-15', 'jiejie-chinese-16', 'jiejie-chinese-17',
];
const expectedMeimeiIds = [
  'meimei-natural-science-5', 'meimei-natural-science-6', 'meimei-natural-science-7', 'meimei-natural-science-8',
  'meimei-natural-science-9', 'meimei-natural-science-10', 'meimei-natural-science-11', 'meimei-natural-science-12',
];

test('Sprint 34 adds eight original Jiejie Chinese questions with complete feedback', () => {
  const bank = loadModule(jiejieChinesePath);
  const added = expectedJiejieIds.map((id) => bank.questions.find((question) => question.id === id));

  assert.ok(added.every(Boolean));
  assert.deepEqual(added.map(({ id }) => id), expectedJiejieIds);
  assert.ok(added.every(({ options, answer, explanation, hint, reviewGroupId }) =>
    options.length === 4 && new Set(options).size === 4 && Number.isInteger(answer) &&
    answer >= 0 && answer < 4 && hint && explanation && reviewGroupId === undefined));
  assert.deepEqual(added.map(({ topic }) => topic), [
    '第壹單元詞語理解', '第壹單元語詞運用', '第壹單元錯別字辨識', '第壹單元閱讀理解',
    '第貳單元詞語辨識', '第貳單元語句理解', '第貳單元錯別字辨識', '第貳單元閱讀理解',
  ]);
  assert.deepEqual(Array.from(bank.practiceQuestions.filter(({ id }) => expectedJiejieIds.includes(id)).map(({ id }) => id)), expectedJiejieIds);
});

test('Sprint 34 adds eight original Meimei Natural Science questions with complete feedback', () => {
  const bank = loadModule(meimeiNaturalPath);
  const added = expectedMeimeiIds.map((id) => bank.questions.find((question) => question.id === id));

  assert.ok(added.every(Boolean));
  assert.deepEqual(added.map(({ id }) => id), expectedMeimeiIds);
  assert.ok(added.every(({ options, answer, explanation, hint, reviewGroupId }) =>
    options.length === 4 && new Set(options).size === 4 && Number.isInteger(answer) &&
    answer >= 0 && answer < 4 && hint && explanation && reviewGroupId === undefined));
});

test('Sprint 34 monthly allowlists expose both newly available exam banks', () => {
  const firstExam = loadModule(firstExamPath, (specifier) => {
    if (specifier === '@/lib/learning-records') return {};
    if (specifier === '@/components/question/QuestionCard') return {};
    return {};
  });

  assert.deepEqual(Array.from(firstExam.getFirstExamQuestionIds('jiejie', 'chinese')), expectedJiejieIds);
  assert.deepEqual(Array.from(firstExam.getFirstExamQuestionIds('meimei', 'natural_science')), [
    'meimei-natural-science-1', 'meimei-natural-science-2', 'meimei-natural-science-3', 'meimei-natural-science-4',
    ...expectedMeimeiIds,
  ]);
});

test('Sprint 34 keeps retired Jiejie Chinese radical questions out of monthly and formal practice views', () => {
  const bank = loadModule(jiejieChinesePath);
  const firstExam = loadModule(firstExamPath, () => ({}));
  const monthlyIds = new Set(firstExam.getFirstExamQuestionIds('jiejie', 'chinese'));

  assert.equal(monthlyIds.has('jiejie-chinese-2'), false);
  assert.equal(monthlyIds.has('jiejie-chinese-4'), false);
  assert.equal(bank.practiceQuestions.some(({ id }) => id === 'jiejie-chinese-2' || id === 'jiejie-chinese-4'), false);
});
