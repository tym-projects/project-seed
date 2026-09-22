import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./understanding-confirmation.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  const spacedSource = readFileSync(new URL('./spaced-review.ts', import.meta.url), 'utf8');
  const spacedCompiled = ts.transpileModule(spacedSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const spacedModule = { exports: {} };
  const testMath = Object.create(Math);
  testMath.random = () => { throw new Error('confirmation selection must not use random'); };
  vm.runInNewContext(spacedCompiled, { exports: spacedModule.exports, module: spacedModule, Intl, Math: testMath });
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    Intl,
    Math: testMath,
    require: (specifier) => ({ '@/lib/spaced-review': spacedModule.exports })[specifier],
  });
  return testModule.exports;
}

function loadMeimeiQuestions() {
  const source = readFileSync(new URL('./questions/meimei-chinese.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

function question(id, overrides = {}) {
  return { id, topic: '詞義', type: 'basic', ...overrides };
}

function record(questionId, overrides = {}) {
  return {
    id: `${questionId}-${overrides.createdAt ?? '2026-08-01T04:00:00.000Z'}`,
    student: 'jiejie',
    subject: 'chinese',
    questionId,
    firstAnswer: 0,
    finalAnswer: 0,
    attempts: 1,
    correct: true,
    completed: true,
    createdAt: '2026-08-01T04:00:00.000Z',
    ...overrides,
  };
}

const now = new Date('2026-08-02T04:00:00.000Z');

test('uses reviewGroupId or question id as the learning-group identity', () => {
  const { getReviewGroupId } = loadModule();
  assert.equal(getReviewGroupId(question('legacy')), 'legacy');
  assert.equal(getReviewGroupId(question('variation-a', { reviewGroupId: 'shared' })), 'shared');
});

test('requires one historical variation, due state, and no record today for eligibility', () => {
  const { isConfirmationEligible } = loadModule();
  const group = { id: 'shared', questions: [question('a', { reviewGroupId: 'shared' }), question('b', { reviewGroupId: 'shared' })] };
  assert.equal(isConfirmationEligible({ group, records: [record('a')], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), true);
  assert.equal(isConfirmationEligible({ group, records: [], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
  assert.equal(isConfirmationEligible({ group, records: [record('a', { createdAt: '2026-08-02T01:00:00.000Z' })], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
});

test('does not trigger after two historical variations, for a retry, or for another student or subject', () => {
  const { isConfirmationEligible } = loadModule();
  const group = { id: 'shared', questions: [question('a'), question('b')] };
  assert.equal(isConfirmationEligible({ group, records: [record('a'), record('b')], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
  assert.equal(isConfirmationEligible({ group, records: [record('a', { attempts: 2, firstAnswer: 1 })], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), true);
  assert.equal(isConfirmationEligible({ group, records: [record('a', { student: 'meimei' })], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
  assert.equal(isConfirmationEligible({ group, records: [record('a', { subject: 'math' })], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
});

test('does not trigger for a single variation or a legacy question', () => {
  const { isConfirmationEligible } = loadModule();
  assert.equal(isConfirmationEligible({ group: { id: 'single', questions: [question('single')] }, records: [record('single')], student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' }), false);
});

test('does not use a malformed record without valid answer fields as confirmation history', () => {
  const { isConfirmationEligible, findPendingConfirmation } = loadModule();
  const group = { id: 'shared', questions: [question('a'), question('b')] };
  const malformed = record('a', { createdAt: '2026-08-01T04:00:00.000Z' });
  delete malformed.firstAnswer;
  const args = { group, student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' };
  assert.equal(isConfirmationEligible({ ...args, records: [malformed] }), false);
  const malformedToday = record('a', { createdAt: '2026-08-02T01:00:00.000Z' });
  delete malformedToday.finalAnswer;
  assert.equal(findPendingConfirmation({ ...args, records: [record('a'), malformedToday] }), null);
});

test('selects the only non-primary variation for a two-variation group', () => {
  const { selectConfirmationVariation } = loadModule();
  const group = { id: 'shared', questions: [question('a'), question('b')] };
  assert.equal(selectConfirmationVariation({ group, primaryQuestionId: 'a', records: [record('a')], student: 'jiejie', subject: 'chinese', localReviewDate: '2026-08-02' }).id, 'b');
});

test('deterministically avoids primary and latest history when three variations have a candidate', () => {
  const { selectConfirmationVariation } = loadModule();
  const group = { id: 'shared', questions: [question('a'), question('b'), question('c')] };
  const args = { group, primaryQuestionId: 'a', records: [record('b', { createdAt: '2026-08-01T04:00:00.000Z' })], student: 'jiejie', subject: 'chinese', localReviewDate: '2026-08-02' };
  const first = selectConfirmationVariation(args);
  const second = selectConfirmationVariation(args);
  assert.equal(first.id, second.id);
  assert.notEqual(first.id, 'a');
  assert.notEqual(first.id, 'b');
});

test('uses the approved third action variation as a deterministic confirmation candidate', () => {
  const { selectConfirmationVariation } = loadModule();
  const questions = loadMeimeiQuestions().filter((item) => item.reviewGroupId === 'meimei-chinese-action-word-identification');
  const group = { id: 'meimei-chinese-action-word-identification', questions };
  const args = {
    group,
    primaryQuestionId: 'meimei-chinese-5',
    records: [record('meimei-chinese-2', { student: 'meimei', createdAt: '2026-08-01T04:00:00.000Z' })],
    student: 'meimei',
    subject: 'chinese',
    localReviewDate: '2026-08-02',
  };
  const first = selectConfirmationVariation(args);
  const second = selectConfirmationVariation(args);
  assert.equal(first.id, 'meimei-chinese-action-word-identification-3');
  assert.equal(second.id, first.id);
  assert.notEqual(first.id, args.primaryQuestionId);
});

test('finds pending confirmation only when today has the primary and not the confirmation', () => {
  const { findPendingConfirmation } = loadModule();
  const group = { id: 'shared', questions: [question('a'), question('b')] };
  const args = { group, student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' };
  const history = record('a', { createdAt: '2026-08-01T04:00:00.000Z' });
  assert.equal(findPendingConfirmation({ ...args, records: [history, record('a', { createdAt: '2026-08-02T01:00:00.000Z' })] }).confirmation.id, 'b');
  assert.equal(findPendingConfirmation({ ...args, records: [history, record('a', { createdAt: '2026-08-02T01:00:00.000Z' }), record('b', { createdAt: '2026-08-02T02:00:00.000Z' })] }), null);
  assert.equal(findPendingConfirmation({ ...args, records: [history, record('a', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-02T01:00:00.000Z' })] }), null);
});
