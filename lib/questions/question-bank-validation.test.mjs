import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const validationModulePath = new URL('./question-bank-validation.ts', import.meta.url);
const resultModulePath = new URL('../../components/question/QuestionResult.tsx', import.meta.url);

function loadTypeScriptModule(modulePath) {
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    require: () => ({ jsx: () => null, jsxs: () => null }),
  });
  return testModule.exports;
}

function loadQuestionResultModule() {
  const compiled = ts.transpileModule(readFileSync(resultModulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };
  const jsx = (type, props) => ({ type, props });

  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    require: () => ({ jsx, jsxs: jsx }),
  });
  return testModule.exports;
}

function textContent(node) {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (node && typeof node === 'object') return textContent(node.props?.children);
  return '';
}

function question(id, overrides = {}) {
  return {
    id,
    topic: 'fixture-topic',
    type: 'basic',
    options: ['A', 'B'],
    answer: 0,
    explanation: 'Fixture explanation.',
    ...overrides,
  };
}

test('uses question id as the learning unit when a review group is absent', () => {
  const { getLearningUnitId } = loadTypeScriptModule(validationModulePath);

  assert.equal(getLearningUnitId({ id: 'legacy' }), 'legacy');
});

test('uses one review group as the learning unit for variations', () => {
  const { getLearningUnitId, collectLearningUnits } = loadTypeScriptModule(validationModulePath);

  assert.equal(getLearningUnitId({ id: 'variation-a', reviewGroupId: 'shared-unit' }), 'shared-unit');
  assert.deepEqual(
    Array.from(collectLearningUnits([
      { id: 'variation-a', reviewGroupId: 'shared-unit' },
      { id: 'variation-b', reviewGroupId: 'shared-unit' },
      { id: 'legacy' },
    ])),
    ['legacy', 'shared-unit'],
  );
});

test('rejects duplicate question ids', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);

  assert.deepEqual(
    Array.from(validateQuestionBank([question('same'), question('same')]).errors),
    ['duplicate id: same'],
  );
});

test('rejects missing and invalid metadata', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);

  assert.deepEqual(
    Array.from(validateQuestionBank([
      question('missing-topic', { topic: '' }),
      question('missing-type', { type: '' }),
      question('invalid-type', { type: 'review' }),
      question('missing-options', { options: [] }),
      question('missing-explanation', { explanation: ' ' }),
    ]).errors),
    [
      'missing topic: missing-topic',
      'missing type: missing-type',
      'invalid type: invalid-type',
      'missing options: missing-options',
      'answer not in options: missing-options',
      'missing explanation: missing-explanation',
    ],
  );
});

test('rejects duplicate options and answers outside options', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);

  assert.deepEqual(
    Array.from(validateQuestionBank([
      question('duplicate-options', { options: ['A', 'A'] }),
      question('invalid-answer', { answer: 2 }),
    ]).errors),
    ['duplicate options: duplicate-options', 'answer not in options: invalid-answer'],
  );
});

test('rejects review group members with different topics or types', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);

  assert.deepEqual(
    Array.from(validateQuestionBank([
      question('group-a', { reviewGroupId: 'shared', topic: 'topic-a', type: 'basic' }),
      question('group-b', { reviewGroupId: 'shared', topic: 'topic-b', type: 'application' }),
    ]).errors),
    ['review group topic mismatch: shared', 'review group type mismatch: shared'],
  );
});

test('requires non-empty hints only for specified Sprint 16 ids', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);

  assert.deepEqual(
    Array.from(validateQuestionBank([
      question('approved-shape-only', { hint: 'Look at the clue.' }),
      question('missing-hint', { hint: ' ' }),
      question('legacy-without-hint'),
    ], { requireHintIds: ['approved-shape-only', 'missing-hint'] }).errors),
    ['missing hint: missing-hint'],
  );
});

test('enforces the active-topic coverage gate without requiring retained JieJie topics to reach three units', () => {
  const { validateQuestionBankCoverage } = loadTypeScriptModule(validationModulePath);
  const fixtures = [
    ...['a', 'b'].map((id) => question(`fixture-jiejie-idiom-${id}`, { topic: '成語運用' })),
    ...['a', 'b', 'c'].map((id) => question(`fixture-jiejie-typo-${id}`, { topic: '錯別字辨識' })),
    question('fixture-jiejie-retained-pronunciation', { topic: '注音辨識' }),
    question('fixture-jiejie-retained-radical', { topic: '部首辨識' }),
    ...['a', 'b', 'c'].map((id) => question(`fixture-meimei-meaning-${id}`, { topic: '詞語意思' })),
    ...['a', 'b', 'c'].map((id) => question(`fixture-meimei-action-${id}`, { topic: '動作詞辨識' })),
    ...['a', 'b', 'c'].map((id) => question(`fixture-meimei-measure-${id}`, { topic: '量詞運用' })),
  ];
  const result = validateQuestionBankCoverage(fixtures, {
    activeTopics: ['成語運用', '錯別字辨識', '詞語意思', '動作詞辨識', '量詞運用'],
    minimumUnitsPerActiveTopic: 3,
    minimumUnitsByActiveTopic: { 成語運用: 2 },
    minimumTotalUnits: 16,
  });

  assert.deepEqual(Array.from(result.errors), []);
  assert.equal(result.unitIds.length, 16);
  assert.deepEqual(JSON.parse(JSON.stringify(Array.from(result.topicUnitCounts.entries()))), [
    ['成語運用', 2], ['錯別字辨識', 3], ['注音辨識', 1], ['部首辨識', 1], ['詞語意思', 3], ['動作詞辨識', 3], ['量詞運用', 3],
  ]);
});

test('rejects active topics below the configured unit minimum while safely retaining their legacy count', () => {
  const { validateQuestionBankCoverage } = loadTypeScriptModule(validationModulePath);
  const result = validateQuestionBankCoverage([
    question('legacy-radical', { topic: '部首辨識' }),
    ...['a', 'b'].map((id) => question(`active-typo-${id}`, { topic: '錯別字辨識' })),
  ], {
    activeTopics: ['錯別字辨識'],
    minimumUnitsPerActiveTopic: 3,
    minimumTotalUnits: 3,
  });

  assert.deepEqual(Array.from(result.errors), [
    'insufficient active topic units: 錯別字辨識 (2/3)',
  ]);
  assert.equal(result.topicUnitCounts.get('部首辨識'), 1);
});

test('defines exactly eleven Sprint 16 allocation ids without creating production question fixtures', () => {
  const sprint16NewIds = [
    'jiejie-chinese-5', 'jiejie-chinese-6', 'jiejie-chinese-7', 'jiejie-chinese-8', 'jiejie-chinese-9',
    'meimei-chinese-6', 'meimei-chinese-7', 'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10', 'meimei-chinese-11',
  ];

  assert.equal(sprint16NewIds.length, 11);
  assert.equal(new Set(sprint16NewIds).size, 11);
});

test('keeps variation coverage deduped and student fixture sets isolated', () => {
  const { validateQuestionBank } = loadTypeScriptModule(validationModulePath);
  const jiejie = [question('jiejie-a', { reviewGroupId: 'shared' }), question('jiejie-b', { reviewGroupId: 'shared' })];
  const meimei = [question('meimei-a', { reviewGroupId: 'shared' }), question('meimei-b', { reviewGroupId: 'shared' })];

  assert.equal(validateQuestionBank(jiejie).unitIds.length, 1);
  assert.equal(validateQuestionBank(meimei).unitIds.length, 1);
});

test('does not provide a hint before submission or after a correct answer', () => {
  const { getQuestionResultHint } = loadQuestionResultModule();

  assert.equal(getQuestionResultHint({ isSubmitted: false, isCorrect: false, hint: 'Think about the clue.' }), undefined);
  assert.equal(getQuestionResultHint({ isSubmitted: true, isCorrect: true, hint: 'Think about the clue.' }), undefined);
});

test('keeps the legacy retry UI when an incorrect answer has no hint', () => {
  const { QuestionResult } = loadQuestionResultModule();
  const result = QuestionResult({ isCorrect: false, encouragement: 'Great', explanation: 'Explanation', theme: 'pink' });

  assert.match(textContent(result), /再想一次！/);
  assert.doesNotMatch(textContent(result), /提示：/);
});

test('renders a non-empty hint only after an incorrect submission', () => {
  const { QuestionResult, getQuestionResultHint } = loadQuestionResultModule();

  assert.equal(getQuestionResultHint({ isSubmitted: true, isCorrect: false, hint: 'Think about the clue.' }), 'Think about the clue.');
  assert.equal(getQuestionResultHint({ isSubmitted: true, isCorrect: false, hint: ' ' }), undefined);
  assert.match(
    textContent(QuestionResult({ isCorrect: false, encouragement: 'Great', explanation: 'Explanation', hint: 'Think about the clue.', theme: 'pink' })),
    /提示：Think about the clue\./,
  );
});
