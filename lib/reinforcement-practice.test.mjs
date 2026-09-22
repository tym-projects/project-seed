import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./reinforcement-practice.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  const dependencies = {};
  for (const name of ['spaced-review', 'today-review']) {
    const dependencySource = readFileSync(new URL(`./${name}.ts`, import.meta.url), 'utf8');
    const dependencyCompiled = ts.transpileModule(dependencySource, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
    }).outputText;
    const dependencyModule = { exports: {} };
    vm.runInNewContext(dependencyCompiled, {
      exports: dependencyModule.exports,
      module: dependencyModule,
      Intl,
      Math,
      require: (specifier) => dependencies[specifier],
    });
    dependencies[`@/lib/${name}`] = dependencyModule.exports;
  }
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    Intl,
    Math,
    require: (specifier) => dependencies[specifier],
  });
  return testModule.exports;
}

function loadParentSummary() {
  const source = readFileSync(new URL('./parent-learning-summary.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const spacedSource = readFileSync(new URL('./spaced-review.ts', import.meta.url), 'utf8');
  const spacedCompiled = ts.transpileModule(spacedSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const spacedModule = { exports: {} };
  vm.runInNewContext(spacedCompiled, { exports: spacedModule.exports, module: spacedModule, Intl, Math });
  const confirmationSource = readFileSync(new URL('./understanding-confirmation.ts', import.meta.url), 'utf8');
  const confirmationCompiled = ts.transpileModule(confirmationSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const confirmationModule = { exports: {} };
  vm.runInNewContext(confirmationCompiled, {
    exports: confirmationModule.exports,
    module: confirmationModule,
    Intl,
    require: (specifier) => ({ '@/lib/spaced-review': spacedModule.exports })[specifier],
  });
  const summaryModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: summaryModule.exports,
    module: summaryModule,
    Intl,
    require: (specifier) => ({ '@/lib/spaced-review': spacedModule.exports, '@/lib/understanding-confirmation': confirmationModule.exports })[specifier],
  });
  return summaryModule.exports;
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

function localRecord(questionId, localDate, overrides = {}) {
  return record(questionId, { createdAt: `${localDate}T04:00:00.000Z`, ...overrides });
}

function settledAfterRetry(questionId, retryDate, overrides = {}) {
  const retry = localRecord(questionId, retryDate, { attempts: 2, firstAnswer: 1, ...overrides });
  const retryDay = Number(retryDate.slice(-2));
  const month = retryDate.slice(0, 8);
  return [
    retry,
    localRecord(questionId, `${month}${String(retryDay + 1).padStart(2, '0')}`),
    localRecord(questionId, `${month}${String(retryDay + 2).padStart(2, '0')}`),
    localRecord(questionId, `${month}${String(retryDay + 5).padStart(2, '0')}`),
  ];
}

const now = new Date('2026-08-20T04:00:00.000Z');
const options = { student: 'jiejie', subject: 'chinese', now, timeZone: 'Asia/Taipei' };

test('returns no reinforcement candidates when there is no recent retry', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  assert.deepEqual(Array.from(selectReinforcementPracticeItems({ questions: [question('one')], records: [record('one')], ...options })), []);
});

test('includes the local date exactly seven days before today but excludes the eighth day', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [question('boundary'), question('outside')];
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      ...settledAfterRetry('boundary', '2026-08-13'),
      record('outside', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-12T04:00:00.000Z' }),
    ],
    ...options,
  });
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['boundary']);
});

test('uses the configured local day around midnight instead of UTC date slicing', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [question('before'), question('after')];
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      ...settledAfterRetry('before', '2026-08-13', { createdAt: '2026-08-13T15:59:59.000Z' }),
      ...settledAfterRetry('after', '2026-08-14', { createdAt: '2026-08-13T16:00:01.000Z' }),
    ],
    now: new Date('2026-08-21T04:00:00.000Z'),
    timeZone: 'Asia/Taipei',
    student: 'jiejie',
    subject: 'chinese',
  });
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['after']);
});

test('groups variations into one candidate and supports legacy single questions', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [
    question('variation-a', { reviewGroupId: 'shared' }),
    question('variation-b', { reviewGroupId: 'shared' }),
    question('legacy'),
  ];
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      ...settledAfterRetry('variation-a', '2026-08-14'),
      ...settledAfterRetry('legacy', '2026-08-13'),
    ],
    ...options,
  });
  assert.equal(items.length, 2);
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['shared', 'legacy']);
  assert.notEqual(items[0].primary.id, 'variation-a');
});

test('groups the approved third action variation with its existing practice unit', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [
    question('meimei-chinese-2', { reviewGroupId: 'meimei-chinese-action-word-identification' }),
    question('meimei-chinese-5', { reviewGroupId: 'meimei-chinese-action-word-identification' }),
    question('meimei-chinese-action-word-identification-3', { reviewGroupId: 'meimei-chinese-action-word-identification' }),
  ];
  const records = settledAfterRetry('meimei-chinese-action-word-identification-3', '2026-08-14')
    .map((item) => ({ ...item, student: 'meimei' }));
  const items = selectReinforcementPracticeItems({
    questions,
    records,
    student: 'meimei',
    subject: 'chinese',
    now,
    timeZone: 'Asia/Taipei',
  });

  assert.equal(items.length, 1);
  assert.equal(items[0].groupId, 'meimei-chinese-action-word-identification');
  assert.notEqual(items[0].primary.id, 'meimei-chinese-action-word-identification-3');
});

test('ranks by recent retry, retry count, latest completion, then group id and caps at three', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = Array.from({ length: 4 }, (_, index) => question(`group-${index}`));
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      ...settledAfterRetry('group-0', '2026-08-13'),
      ...settledAfterRetry('group-1', '2026-08-14'),
      record('group-1-again', { questionId: 'group-1', attempts: 2, firstAnswer: 1, createdAt: '2026-08-14T05:00:00.000Z' }),
      ...settledAfterRetry('group-2', '2026-08-14'),
      ...settledAfterRetry('group-3', '2026-08-13'),
      record('group-3-again', { questionId: 'group-3', attempts: 2, firstAnswer: 1, createdAt: '2026-08-13T05:00:00.000Z' }),
    ],
    ...options,
  });
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['group-1', 'group-2', 'group-3']);
});

test('excludes today records and currently due groups before ranking practice candidates', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [question('today'), question('due'), question('available')];
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      record('today', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-20T01:00:00.000Z' }),
      record('due', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-19T01:00:00.000Z' }),
      ...settledAfterRetry('available', '2026-08-13'),
    ],
    ...options,
  });
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['available']);
});

test('keeps a recently improved group bounded by the seven-day window', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [question('improved'), question('expired')];
  const items = selectReinforcementPracticeItems({
    questions,
    records: [
      ...settledAfterRetry('improved', '2026-08-13'),
      record('expired', { attempts: 2, firstAnswer: 1, createdAt: '2026-08-11T04:00:00.000Z' }),
    ],
    ...options,
  });
  assert.deepEqual(Array.from(items, (item) => item.groupId), ['improved']);
});

test('returns the same deterministic variation on repeated selection without random', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [
    question('a', { reviewGroupId: 'shared' }),
    question('b', { reviewGroupId: 'shared' }),
    question('c', { reviewGroupId: 'shared' }),
  ];
  const records = settledAfterRetry('a', '2026-08-14');
  const first = selectReinforcementPracticeItems({ questions, records, ...options });
  const second = selectReinforcementPracticeItems({ questions, records, ...options });
  assert.deepEqual(Array.from(second, (item) => item.primary.id), Array.from(first, (item) => item.primary.id));
  assert.notEqual(first[0].primary.id, 'a');
});

test('keeps variation selection deterministic when records share a timestamp', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [
    question('a', { reviewGroupId: 'shared' }),
    question('b', { reviewGroupId: 'shared' }),
  ];
  const records = settledAfterRetry('a', '2026-08-14');
  const sameTimestamp = record('b', { createdAt: '2026-08-19T04:00:00.000Z' });
  const first = selectReinforcementPracticeItems({ questions, records: [...records, sameTimestamp], ...options });
  const reordered = selectReinforcementPracticeItems({ questions, records: [sameTimestamp, ...records], ...options });
  assert.deepEqual(Array.from(reordered, (item) => item.primary.id), Array.from(first, (item) => item.primary.id));
});

test('does not use another student or subject as a retry signal', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [question('shared')];
  assert.deepEqual(Array.from(selectReinforcementPracticeItems({
    questions,
    records: [record('shared', { student: 'meimei', attempts: 2, firstAnswer: 1, createdAt: '2026-08-15T04:00:00.000Z' })],
    ...options,
  })), []);
  assert.deepEqual(Array.from(selectReinforcementPracticeItems({
    questions,
    records: [record('shared', { subject: 'math', attempts: 2, firstAnswer: 1, createdAt: '2026-08-15T04:00:00.000Z' })],
    ...options,
  })), []);
});

test('excludes a Sprint 18 pending-confirmation group from reinforcement practice', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const questions = [
    question('primary', { reviewGroupId: 'confirmation-group' }),
    question('confirmation', { reviewGroupId: 'confirmation-group' }),
  ];
  const history = settledAfterRetry('primary', '2026-08-13');
  const primaryToday = record('primary', { createdAt: '2026-08-20T01:00:00.000Z' });
  assert.deepEqual(Array.from(selectReinforcementPracticeItems({
    questions,
    records: [...history, primaryToday],
    ...options,
  })), []);
});

test('does not mutate records or create a practice-side scheduling result', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const { createParentLearningSummary } = loadParentSummary();
  const records = settledAfterRetry('stable', '2026-08-14');
  const before = JSON.stringify(records);
  const summaryBefore = createParentLearningSummary({
    records,
    student: 'jiejie',
    subject: 'chinese',
    questions: [question('stable', { question: '穩定題' })],
    now,
    timeZone: 'Asia/Taipei',
  });
  selectReinforcementPracticeItems({ questions: [question('stable')], records, ...options });
  assert.equal(JSON.stringify(records), before);
  assert.deepEqual(createParentLearningSummary({
    records,
    student: 'jiejie',
    subject: 'chinese',
    questions: [question('stable', { question: '穩定題' })],
    now,
    timeZone: 'Asia/Taipei',
  }), summaryBefore);
});

test('keeps Natural Science and Social Studies practice candidates isolated and read-only', () => {
  const { selectReinforcementPracticeItems } = loadModule();
  const naturalQuestions = [question('natural-one')];
  const socialQuestions = [question('social-one')];
  const naturalRecords = settledAfterRetry('natural-one', '2026-08-14').map((item) => ({ ...item, subject: 'natural_science' }));
  const socialRecords = settledAfterRetry('social-one', '2026-08-14').map((item) => ({ ...item, subject: 'social_studies' }));
  const records = [...naturalRecords, ...socialRecords];
  const before = JSON.stringify(records);

  assert.deepEqual(Array.from(selectReinforcementPracticeItems({ questions: naturalQuestions, records, student: 'jiejie', subject: 'natural_science', now, timeZone: 'Asia/Taipei' }), (item) => item.groupId), ['natural-one']);
  assert.deepEqual(Array.from(selectReinforcementPracticeItems({ questions: socialQuestions, records, student: 'jiejie', subject: 'social_studies', now, timeZone: 'Asia/Taipei' }), (item) => item.groupId), ['social-one']);
  assert.equal(JSON.stringify(records), before);
});
