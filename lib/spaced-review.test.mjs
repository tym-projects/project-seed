import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./spaced-review.ts', import.meta.url);

function loadSpacedReviewModule() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, Intl });
  return testModule.exports;
}

function record(questionId, overrides = {}) {
  return {
    id: `record-${questionId}-${overrides.createdAt ?? 'default'}`,
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

function reviewState(records, overrides = {}) {
  const { deriveReviewState } = loadSpacedReviewModule();

  return JSON.parse(JSON.stringify(deriveReviewState({
    records,
    student: 'jiejie',
    subject: 'chinese',
    questionId: 'question-1',
    now: new Date('2026-08-02T04:00:00.000Z'),
    timeZone: 'Asia/Taipei',
    ...overrides,
  })));
}

test('schedules the first clean completion for the next local calendar day', () => {
  assert.deepEqual(
    reviewState([record('question-1')]),
    {
      lastCompletedLocalDate: '2026-08-01',
      lastSessionHadWrong: false,
      stableSuccessStreak: 1,
      nextReviewLocalDate: '2026-08-02',
      isDue: true,
    },
  );
});

test('marks a question due on and after its scheduled local date', () => {
  const records = [record('question-1')];

  assert.equal(reviewState(records, { now: new Date('2026-08-02T04:00:00.000Z') }).isDue, true);
  assert.equal(reviewState(records, { now: new Date('2026-08-04T04:00:00.000Z') }).isDue, true);
});

test('moves due clean completions through the 1, 3, then 7 day intervals', () => {
  const result = reviewState([
    record('question-1', { id: 'first', createdAt: '2026-08-01T04:00:00.000Z' }),
    record('question-1', { id: 'second', createdAt: '2026-08-02T04:00:00.000Z' }),
    record('question-1', { id: 'third', createdAt: '2026-08-05T04:00:00.000Z' }),
    record('question-1', { id: 'fourth', createdAt: '2026-08-12T04:00:00.000Z' }),
  ], { now: new Date('2026-08-12T05:00:00.000Z') });

  assert.deepEqual(result, {
    lastCompletedLocalDate: '2026-08-12',
    lastSessionHadWrong: false,
    stableSuccessStreak: 4,
    nextReviewLocalDate: '2026-08-19',
    isDue: false,
  });
});

test('does not advance a clean completion made before its review date', () => {
  assert.deepEqual(
    reviewState([
      record('question-1', { id: 'first', createdAt: '2026-08-01T04:00:00.000Z' }),
      record('question-1', { id: 'early', createdAt: '2026-08-01T12:00:00.000Z' }),
    ]),
    {
      lastCompletedLocalDate: '2026-08-01',
      lastSessionHadWrong: false,
      stableSuccessStreak: 1,
      nextReviewLocalDate: '2026-08-02',
      isDue: true,
    },
  );
});

test('resets the streak and schedules the next local day when any same-day record required retries', () => {
  assert.deepEqual(
    reviewState([
      record('question-1', { id: 'first', createdAt: '2026-08-01T04:00:00.000Z' }),
      record('question-1', { id: 'retry', attempts: 2, createdAt: '2026-08-02T04:00:00.000Z' }),
      record('question-1', { id: 'clean', createdAt: '2026-08-02T05:00:00.000Z' }),
    ]),
    {
      lastCompletedLocalDate: '2026-08-02',
      lastSessionHadWrong: true,
      stableSuccessStreak: 0,
      nextReviewLocalDate: '2026-08-03',
      isDue: false,
    },
  );
});

test('starts again at the one-day stage after a retry reset', () => {
  assert.deepEqual(
    reviewState([
      record('question-1', { id: 'retry', attempts: 2, createdAt: '2026-08-01T04:00:00.000Z' }),
      record('question-1', { id: 'recovery', createdAt: '2026-08-02T04:00:00.000Z' }),
    ], { now: new Date('2026-08-02T05:00:00.000Z') }),
    {
      lastCompletedLocalDate: '2026-08-02',
      lastSessionHadWrong: false,
      stableSuccessStreak: 1,
      nextReviewLocalDate: '2026-08-03',
      isDue: false,
    },
  );
});

test('uses the configured local calendar through midnight, month end, year end, and leap day', () => {
  const { addLocalDays, getLocalDateKey } = loadSpacedReviewModule();

  assert.equal(getLocalDateKey(new Date('2026-01-01T15:30:00.000Z'), 'Asia/Taipei'), '2026-01-01');
  assert.equal(getLocalDateKey(new Date('2026-01-01T16:30:00.000Z'), 'Asia/Taipei'), '2026-01-02');
  assert.equal(addLocalDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addLocalDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addLocalDays('2028-02-28', 1), '2028-02-29');
});

test('isolates students and subjects and ignores malformed, invalid, incomplete, and incorrect records', () => {
  assert.deepEqual(
    reviewState([
      record('question-1', { student: 'meimei' }),
      record('question-1', { subject: 'math' }),
      record('other-question'),
      record('question-1', { id: 'bad-date', createdAt: 'bad-date' }),
      record('question-1', { id: 'bad-attempts', attempts: 0 }),
      record('question-1', { id: 'incomplete', completed: false }),
      record('question-1', { id: 'incorrect', correct: false }),
      null,
      record('question-1', { id: 'valid', createdAt: '2026-08-01T04:00:00.000Z' }),
    ]),
    {
      lastCompletedLocalDate: '2026-08-01',
      lastSessionHadWrong: false,
      stableSuccessStreak: 1,
      nextReviewLocalDate: '2026-08-02',
      isDue: true,
    },
  );
});
