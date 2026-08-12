import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./today-review.ts', import.meta.url);

function loadTodayReviewModule() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, Intl });
  return testModule.exports;
}

function question(id, overrides = {}) {
  return { id, topic: '詞義', type: 'basic', ...overrides };
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
    createdAt: '2026-08-01T00:00:00.000Z',
    ...overrides,
  };
}

function select(questions, records = [], overrides = {}) {
  const { selectTodayReviewQuestions } = loadTodayReviewModule();
  return selectTodayReviewQuestions({
    questions,
    records,
    student: 'jiejie',
    subject: 'chinese',
    now: new Date('2026-08-12T04:00:00.000Z'),
    timeZone: 'Asia/Taipei',
    ...overrides,
  });
}

function ids(questions) {
  return Array.from(questions, (item) => item.id);
}

test('selects all available questions when there are no learning records', () => {
  assert.deepEqual(ids(select([question('one'), question('two')])), ['one', 'two']);
});

test('selects no more than five questions', () => {
  const questions = Array.from({ length: 6 }, (_, index) => question(`question-${index}`, { topic: `topic-${index}` }));
  assert.equal(select(questions).length, 5);
});

test('excludes every question completed today, including first-try completions', () => {
  const today = '2026-08-12T01:00:00.000Z';
  const result = select([question('first-try'), question('retry'), question('available')], [
    record('first-try', { createdAt: today }),
    record('retry', { createdAt: today, firstAnswer: 1, attempts: 2 }),
  ]);

  assert.deepEqual(ids(result), ['available']);
});

test('allows a retried question back into review on the following local day', () => {
  const result = select(
    [question('retry'), question('other')],
    [record('retry', { createdAt: '2026-08-12T01:00:00.000Z', firstAnswer: 1, attempts: 2 })],
    { now: new Date('2026-08-13T04:00:00.000Z') },
  );

  assert.deepEqual(ids(result), ['retry', 'other']);
});

test('never uses another student records for selection', () => {
  const result = select([question('same'), question('other')], [
    record('same', { student: 'meimei', createdAt: '2026-08-12T01:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result).sort(), ['other', 'same']);
});

test('prioritizes a question whose most recent completion required retries', () => {
  const result = select([question('old'), question('retry')], [
    record('old', { createdAt: '2026-08-01T00:00:00.000Z' }),
    record('retry', { createdAt: '2026-08-11T00:00:00.000Z', firstAnswer: 1, attempts: 2 }),
  ]);

  assert.deepEqual(ids(result), ['retry', 'old']);
});

test('prioritizes an unstable question with wrong-correct-wrong history', () => {
  const result = select([question('old'), question('unstable')], [
    record('unstable', { id: 'w1', createdAt: '2026-08-01T00:00:00.000Z', firstAnswer: 1, attempts: 2 }),
    record('unstable', { id: 'c1', createdAt: '2026-08-02T00:00:00.000Z' }),
    record('unstable', { id: 'w2', createdAt: '2026-08-03T00:00:00.000Z', firstAnswer: 1, attempts: 2 }),
    record('unstable', { id: 'c2', createdAt: '2026-08-04T00:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result), ['unstable', 'old']);
});

test('uses unreviewed questions before recently reviewed general questions', () => {
  const result = select([question('recent'), question('never')], [record('recent', { createdAt: '2026-08-11T00:00:00.000Z' })]);
  assert.deepEqual(ids(result), ['never', 'recent']);
});

test('spreads selected questions across topics before selecting another question from the same topic', () => {
  const result = select([
    question('same-high-attempts', { topic: '詞義' }),
    question('same-low-attempts', { topic: '詞義' }),
    question('different-topic', { topic: '句型' }),
  ], [
    record('same-high-attempts', { firstAnswer: 1, attempts: 3, createdAt: '2026-08-10T00:00:00.000Z' }),
    record('same-low-attempts', { firstAnswer: 1, attempts: 2, createdAt: '2026-08-09T00:00:00.000Z' }),
    record('different-topic', { firstAnswer: 1, attempts: 2, createdAt: '2026-08-08T00:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result), ['same-high-attempts', 'different-topic', 'same-low-attempts']);
});

test('uses higher attempts to order questions within the same topic', () => {
  const result = select([question('two', { topic: '詞義' }), question('three', { topic: '詞義' })], [
    record('two', { firstAnswer: 1, attempts: 2, createdAt: '2026-08-10T00:00:00.000Z' }),
    record('three', { firstAnswer: 1, attempts: 3, createdAt: '2026-08-09T00:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result), ['three', 'two']);
});

test('uses application questions before basic questions when same-topic evidence is otherwise tied', () => {
  const result = select([
    question('basic', { topic: '詞義', type: 'basic' }),
    question('application', { topic: '詞義', type: 'application' }),
  ], [
    record('basic', { firstAnswer: 1, attempts: 2, createdAt: '2026-08-10T00:00:00.000Z' }),
    record('application', { firstAnswer: 1, attempts: 2, createdAt: '2026-08-10T00:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result), ['application', 'basic']);
});

test('ignores records for unknown question ids', () => {
  assert.deepEqual(ids(select([question('known')], [record('removed-question', { firstAnswer: 1, attempts: 2 })])), ['known']);
});

test('does not select duplicate question ids more than once', () => {
  assert.deepEqual(ids(select([question('same'), question('same'), question('other')])).sort(), ['other', 'same']);
});

test('uses the configured local time zone when determining today', () => {
  const result = select(
    [question('before-midnight'), question('after-midnight')],
    [
      record('before-midnight', { createdAt: '2026-08-12T15:59:59.000Z' }),
      record('after-midnight', { createdAt: '2026-08-12T16:00:01.000Z' }),
    ],
    { now: new Date('2026-08-12T16:30:00.000Z') },
  );

  assert.deepEqual(ids(result), ['before-midnight']);
});
