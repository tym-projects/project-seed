import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const displayModulePath = new URL('./learning-record-display.ts', import.meta.url);
const jiejieQuestionModulePath = new URL('./questions/jiejie-chinese.ts', import.meta.url);
const meimeiQuestionModulePath = new URL('./questions/meimei-chinese.ts', import.meta.url);

function loadTypeScriptModule(modulePath, dependencies = {}) {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    require: (specifier) => dependencies[specifier],
    Intl,
  });

  return testModule.exports;
}

function loadDisplayModule() {
  const jiejieQuestions = loadTypeScriptModule(jiejieQuestionModulePath).questions;
  const meimeiQuestions = loadTypeScriptModule(meimeiQuestionModulePath).questions;

  return loadTypeScriptModule(displayModulePath, {
    '@/lib/questions/jiejie-chinese': { questions: jiejieQuestions },
    '@/lib/questions/meimei-chinese': { questions: meimeiQuestions },
  });
}

function record(overrides = {}) {
  return {
    id: 'record-1',
    student: 'jiejie',
    subject: 'chinese',
    questionId: 'jiejie-chinese-1',
    firstAnswer: 0,
    finalAnswer: 0,
    attempts: 1,
    correct: true,
    completed: true,
    createdAt: '2026-08-12T00:00:00.000Z',
    ...overrides,
  };
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('maps a Jiejie Chinese record to the Jiejie question bank', () => {
  const { toDisplayLearningRecord } = loadDisplayModule();
  const result = toDisplayLearningRecord(record());

  assert.notEqual(result.questionText, '這題已不在目前題庫');
  assert.equal(result.firstAnswerText, result.finalAnswerText);
});

test('maps a MeiMei Chinese record to the MeiMei question bank', () => {
  const { toDisplayLearningRecord } = loadDisplayModule();
  const result = toDisplayLearningRecord(record({ student: 'meimei', questionId: 'meimei-chinese-1' }));

  assert.notEqual(result.questionText, '這題已不在目前題庫');
  assert.equal(result.status, '一次答對');
});

test('sorts learning records with the newest completion first', () => {
  const { sortLearningRecords } = loadDisplayModule();
  const sorted = sortLearningRecords([
    record({ id: 'old', createdAt: '2026-08-11T00:00:00.000Z' }),
    record({ id: 'new', createdAt: '2026-08-12T00:00:00.000Z' }),
  ]);

  assert.deepEqual(toPlainValue(sorted.map((item) => item.id)), ['new', 'old']);
});

test('classifies first-try, retry, and multiple-attempt completions', () => {
  const { getAttemptStatus } = loadDisplayModule();

  assert.equal(getAttemptStatus(1), '一次答對');
  assert.equal(getAttemptStatus(2), '曾經答錯');
  assert.equal(getAttemptStatus(3), '多次嘗試後完成');
});

test('converts answer indexes to option text', () => {
  const { toDisplayLearningRecord } = loadDisplayModule();
  const result = toDisplayLearningRecord(record({ firstAnswer: 1, finalAnswer: 0, attempts: 2 }));

  assert.notEqual(result.firstAnswerText, result.finalAnswerText);
  assert.equal(result.firstAnswerText.length > 0, true);
});

test('uses a safe fallback when the question no longer exists', () => {
  const { toDisplayLearningRecord } = loadDisplayModule();
  const result = toDisplayLearningRecord(record({ questionId: 'removed-question' }));

  assert.equal(result.questionText, '這題已不在目前題庫');
  assert.equal(result.questionId, 'removed-question');
  assert.equal(result.firstAnswerText, null);
});

test('keeps an empty learning record list empty', () => {
  const { sortLearningRecords } = loadDisplayModule();

  assert.deepEqual(toPlainValue(sortLearningRecords([])), []);
});

test('does not look up a Jiejie question in MeiMei question bank', () => {
  const { toDisplayLearningRecord } = loadDisplayModule();
  const result = toDisplayLearningRecord(record({ student: 'meimei', questionId: 'jiejie-chinese-1' }));

  assert.equal(result.questionText, '這題已不在目前題庫');
});
