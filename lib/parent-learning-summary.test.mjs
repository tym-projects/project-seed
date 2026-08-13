import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./parent-learning-summary.ts', import.meta.url);

function loadModule() {
  const spacedPath = new URL('./spaced-review.ts', import.meta.url);
  const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  const spaced = { exports: {} };
  vm.runInNewContext(compile(readFileSync(spacedPath, 'utf8')), { exports: spaced.exports, module: spaced, Intl });
  const summary = { exports: {} };
  vm.runInNewContext(compile(readFileSync(modulePath, 'utf8')), {
    exports: summary.exports, module: summary, Intl,
    require: (name) => ({ '@/lib/spaced-review': spaced.exports })[name],
  });
  return summary.exports;
}

const questions = [
  { id: 'a', question: '題目 A', reviewGroupId: 'group-a' },
  { id: 'b', question: '題目 B', reviewGroupId: 'group-a' },
  { id: 'legacy', question: '舊題目' },
];
const now = new Date('2026-08-13T04:00:00.000Z');
function record(id, questionId, overrides = {}) {
  return { id, student: 'jiejie', subject: 'chinese', questionId, firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: '2026-08-13T01:00:00.000Z', ...overrides };
}
function summary(records, overrides = {}) {
  return JSON.parse(JSON.stringify(loadModule().createParentLearningSummary({
    records, student: 'jiejie', subject: 'chinese', questions, now, timeZone: 'Asia/Taipei', ...overrides,
  })));
}

test('returns empty-safe periods for empty and invalid records', () => {
  const result = summary([null, { attempts: 0 }, record('bad', 'a', { createdAt: 'bad-date' }), record('wrong', 'a', { correct: false })]);
  assert.deepEqual(result.today, { completedRecordCount: 0, firstTryCorrectCount: 0, firstTryCorrectRate: null, retryRecordCount: 0 });
  assert.deepEqual(result.last7Days, result.today);
  assert.equal(result.latestLearningLocalDate, null);
  assert.deepEqual(result.attentionItems, []);
});

test('uses local calendar periods and isolates student and subject', () => {
  const result = summary([
    record('today', 'a', { createdAt: '2026-08-12T16:00:00.000Z' }),
    record('seven', 'legacy', { attempts: 2, createdAt: '2026-08-06T16:00:00.000Z' }),
    record('eight', 'legacy', { createdAt: '2026-08-05T16:00:00.000Z' }),
    record('other-student', 'a', { student: 'meimei' }),
    record('other-subject', 'a', { subject: 'math' }),
  ]);
  assert.equal(result.today.completedRecordCount, 1);
  assert.equal(result.last7Days.completedRecordCount, 2);
  assert.equal(result.last7Days.firstTryCorrectCount, 1);
  assert.equal(result.last7Days.firstTryCorrectRate, 0.5);
  assert.equal(result.last7Days.retryRecordCount, 1);
  assert.equal(result.latestLearningLocalDate, '2026-08-13');
});

test('dedupes groups and creates deterministic attention only after two retry records', () => {
  const result = summary([
    record('retry-a', 'a', { attempts: 2, createdAt: '2026-08-10T01:00:00.000Z' }),
    record('retry-b', 'b', { attempts: 5, createdAt: '2026-08-11T01:00:00.000Z' }),
    record('due', 'legacy', { createdAt: '2026-08-10T01:00:00.000Z' }),
  ]);
  assert.equal(result.dueLearningUnitCount, 2);
  assert.deepEqual(result.attentionItems, [
    { kind: 'repeated-retry', unitId: 'group-a', label: '題目 A', retryRecordCount: 2 },
    { kind: 'due-review', unitId: 'group-a', label: '題目 A' },
    { kind: 'due-review', unitId: 'legacy', label: '舊題目' },
  ]);
});

test('does not report a due unit already completed today', () => {
  const result = summary([record('first', 'legacy', { createdAt: '2026-08-11T01:00:00.000Z' }), record('today', 'legacy')]);
  assert.equal(result.attentionItems.some((item) => item.kind === 'due-review' && item.unitId === 'legacy'), false);
});
