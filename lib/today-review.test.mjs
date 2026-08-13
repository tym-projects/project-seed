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

  const spacedReviewPath = new URL('./spaced-review.ts', import.meta.url);
  const spacedReviewSource = readFileSync(spacedReviewPath, 'utf8');
  const spacedReviewCompiled = ts.transpileModule(spacedReviewSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const spacedReviewModule = { exports: {} };
  const testMath = Object.create(Math);
  testMath.random = () => {
    throw new Error('review selection must not use random');
  };

  vm.runInNewContext(spacedReviewCompiled, { exports: spacedReviewModule.exports, module: spacedReviewModule, Intl, Math: testMath });
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    Intl,
    Math: testMath,
    require: (specifier) => ({ '@/lib/spaced-review': spacedReviewModule.exports })[specifier],
  });
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

test('never uses another subject records for selection', () => {
  const result = select([question('same'), question('other')], [
    record('same', { subject: 'math', createdAt: '2026-08-12T01:00:00.000Z' }),
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

test('prioritizes due questions before never-completed questions', () => {
  const result = select([question('recent'), question('never')], [record('recent', { createdAt: '2026-08-11T00:00:00.000Z' })]);
  assert.deepEqual(ids(result), ['recent', 'never']);
});

test('does not select a stable question before its review date even when fewer than five questions are available', () => {
  const result = select(
    [question('not-due')],
    [
      record('not-due', { id: 'first', createdAt: '2026-08-11T00:00:00.000Z' }),
      record('not-due', { id: 'second', createdAt: '2026-08-12T01:00:00.000Z' }),
    ],
    { now: new Date('2026-08-13T04:00:00.000Z') },
  );

  assert.deepEqual(ids(result), []);
});

test('prioritizes a due retry-reset question over another due stable question', () => {
  const result = select([question('stable'), question('retry')], [
    record('stable', { createdAt: '2026-08-01T00:00:00.000Z' }),
    record('retry', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-11T00:00:00.000Z' }),
  ]);

  assert.deepEqual(ids(result), ['retry', 'stable']);
});

test('keeps unknown and malformed records from affecting due candidates', () => {
  const result = select([question('due'), question('never')], [
    record('due', { createdAt: '2026-08-01T00:00:00.000Z' }),
    record('removed-question', { attempts: 2, createdAt: '2026-08-11T00:00:00.000Z' }),
    { student: 'jiejie', subject: 'chinese', questionId: 'due', attempts: 0 },
  ]);

  assert.deepEqual(ids(result), ['due', 'never']);
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

  assert.deepEqual(ids(result), ['different-topic', 'same-low-attempts', 'same-high-attempts']);
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

test('ignores malformed and invalid learning records during selection', () => {
  const records = [
    null,
    { student: 'jiejie', subject: 'chinese' },
    record('invalid-date', { createdAt: 'not-a-date', attempts: 2 }),
    record('non-finite-attempts', { attempts: Infinity }),
    record('zero-attempts', { attempts: 0 }),
    record('other-student', { student: 'meimei', createdAt: '2026-08-12T01:00:00.000Z' }),
  ];

  assert.deepEqual(
    ids(select([
      question('invalid-date'),
      question('non-finite-attempts'),
      question('zero-attempts'),
      question('other-student'),
      question('safe'),
    ], records)),
    ['invalid-date', 'non-finite-attempts', 'other-student', 'safe', 'zero-attempts'],
  );
});

test('returns every available candidate when fewer than five remain after today exclusions', () => {
  const result = select(
    [question('completed'), question('one'), question('two')],
    [record('completed', { createdAt: '2026-08-12T01:00:00.000Z' })],
  );

  assert.deepEqual(ids(result), ['one', 'two']);
});

test('shows one deterministic variation per group and avoids its most recently completed question', () => {
  const variations = [
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
  ];
  const initial = select(variations);
  const reopened = select(variations);
  const firstQuestionId = ids(initial)[0];

  assert.deepEqual(ids(reopened), [firstQuestionId]);
  assert.equal(initial.length, 1);
  assert.deepEqual(
    ids(select(variations, [record(firstQuestionId, { createdAt: '2026-08-01T00:00:00.000Z' })])),
    [firstQuestionId === 'variation-a' ? 'variation-b' : 'variation-a'],
  );
});

test('excludes a whole group after any variation is completed today', () => {
  const result = select([
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
    question('other'),
  ], [record('variation-a', { createdAt: '2026-08-12T01:00:00.000Z' })]);

  assert.deepEqual(ids(result), ['other']);
});

test('uses previous variation records when a new variation joins its group', () => {
  const result = select([
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
    question('variation-c', { reviewGroupId: 'shared-concept' }),
  ], [
    record('variation-a', { createdAt: '2026-08-11T00:00:00.000Z' }),
    record('variation-b', { createdAt: '2026-08-12T01:00:00.000Z' }),
  ], { now: new Date('2026-08-13T04:00:00.000Z') });

  assert.deepEqual(ids(result), []);
});

test('does not surface a group before its review date', () => {
  const result = select([
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
  ], [
    record('variation-a', { createdAt: '2026-08-11T00:00:00.000Z' }),
    record('variation-b', { createdAt: '2026-08-12T01:00:00.000Z' }),
  ], { now: new Date('2026-08-13T04:00:00.000Z') });

  assert.deepEqual(ids(result), []);
});

test('selects variation groups without calling random', () => {
  assert.deepEqual(ids(select([
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
  ])), ['variation-a']);
});

test('keeps variation groups isolated by student and subject', () => {
  const variations = [
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
  ];

  assert.equal(select(variations, [record('variation-a', { student: 'meimei', createdAt: '2026-08-12T01:00:00.000Z' })]).length, 1);
  assert.equal(select(variations, [record('variation-a', { subject: 'math', createdAt: '2026-08-12T01:00:00.000Z' })]).length, 1);
});

test('ignores malformed and unknown records for a variation group', () => {
  const result = select([
    question('variation-a', { reviewGroupId: 'shared-concept' }),
    question('variation-b', { reviewGroupId: 'shared-concept' }),
  ], [
    record('removed-variation', { createdAt: '2026-08-12T01:00:00.000Z' }),
    { student: 'jiejie', subject: 'chinese', questionId: 'variation-a', attempts: 0 },
  ]);

  assert.equal(result.length, 1);
});

test('limits selection to five review groups and spreads distinct group topics first', () => {
  const questions = [
    question('a-1', { reviewGroupId: 'a', topic: 'shared' }), question('a-2', { reviewGroupId: 'a', topic: 'shared' }),
    question('b-1', { reviewGroupId: 'b', topic: 'shared' }), question('b-2', { reviewGroupId: 'b', topic: 'shared' }),
    question('c-1', { reviewGroupId: 'c', topic: 'different' }), question('c-2', { reviewGroupId: 'c', topic: 'different' }),
    question('d-1', { reviewGroupId: 'd', topic: 'fourth' }), question('e-1', { reviewGroupId: 'e', topic: 'fifth' }),
    question('f-1', { reviewGroupId: 'f', topic: 'sixth' }),
  ];
  const selected = select(questions);

  assert.equal(selected.length, 5);
  assert.ok(selected.some((item) => item.reviewGroupId === 'c'));
  assert.ok(selected.some((item) => item.reviewGroupId === 'd'));
  assert.ok(selected.some((item) => item.reviewGroupId === 'e'));
  assert.ok(selected.some((item) => item.reviewGroupId === 'f'));
});
