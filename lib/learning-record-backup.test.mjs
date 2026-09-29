import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./learning-record-backup.ts', import.meta.url);
const record = { id: 'r-1', student: 'jiejie', subject: 'chinese', questionId: 'jiejie-chinese-1', firstAnswer: 0, finalAnswer: 0, attempts: 1, correct: true, completed: true, createdAt: '2026-09-01T00:00:00.000Z' };
const otherRecord = { ...record, id: 'r-2', questionId: 'jiejie-chinese-2' };
const toPlain = (value) => JSON.parse(JSON.stringify(value));

function loadModule() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    require: (specifier) => {
      if (specifier === '@/lib/learning-records') {
        return { isLearningRecord: (value) => typeof value?.id === 'string' && value.id.length > 0 && (value.student === 'jiejie' || value.student === 'meimei') && ['chinese', 'mathematics', 'natural_science', 'social_studies'].includes(value.subject) && typeof value.questionId === 'string' && value.questionId.length > 0 && Number.isInteger(value.firstAnswer) && value.firstAnswer >= 0 && Number.isInteger(value.finalAnswer) && value.finalAnswer >= 0 && Number.isInteger(value.attempts) && value.attempts >= 1 && typeof value.correct === 'boolean' && typeof value.completed === 'boolean' && typeof value.createdAt === 'string' && Number.isFinite(Date.parse(value.createdAt)), LEARNING_RECORDS_STORAGE_KEY: 'project-seed:learning-records:v1' };
      }
      throw new Error(`Unexpected module: ${specifier}`);
    },
  });
  return testModule.exports;
}

function envelope(records = [record], overrides = {}) {
  return JSON.stringify({ format: 'project-seed-learning-records-backup', version: 1, exportedAt: '2026-09-29T00:00:00.000Z', recordCount: records.length, records, ...overrides });
}

test('exports an envelope without changing source records', () => {
  const { createLearningRecordBackup } = loadModule();
  const source = [record];
  const backup = createLearningRecordBackup(source, '2026-09-29T00:00:00.000Z');
  assert.deepEqual(toPlain(backup), { format: 'project-seed-learning-records-backup', version: 1, exportedAt: '2026-09-29T00:00:00.000Z', recordCount: 1, records: source });
  assert.deepEqual(source, [record]);
});

test('validates valid, empty, malformed, wrong format/version/count/container and invalid records', () => {
  const { parseLearningRecordBackup } = loadModule();
  assert.equal(parseLearningRecordBackup(envelope()).ok, true);
  assert.equal(parseLearningRecordBackup(envelope([])).ok, true);
  for (const raw of ['{', envelope([record], { format: 'wrong' }), envelope([record], { version: 2 }), envelope([record], { recordCount: 2 }), envelope(record), envelope([{ ...record, attempts: 0 }])]) {
    assert.equal(parseLearningRecordBackup(raw).ok, false);
  }
});

test('merges by record id and preserves existing records first', () => {
  const { mergeLearningRecords } = loadModule();
  const result = mergeLearningRecords([record], [record, otherRecord]);
  assert.deepEqual(toPlain(result.records), [record, otherRecord]);
  assert.deepEqual(toPlain(result.counts), { existing: 1, imported: 2, added: 1, duplicates: 1, final: 2 });
});

test('rejects conflicting duplicate ids instead of overwriting', () => {
  const { mergeLearningRecords } = loadModule();
  assert.throws(() => mergeLearningRecords([record], [{ ...record, questionId: 'different' }]), /conflict/i);
});

test('re-importing the same backup is idempotent', () => {
  const { mergeLearningRecords } = loadModule();
  const first = mergeLearningRecords([], [record, otherRecord]);
  const second = mergeLearningRecords(first.records, [record, otherRecord]);
  assert.deepEqual(toPlain(second.records), toPlain(first.records));
  assert.equal(second.counts.added, 0);
  assert.equal(second.counts.duplicates, 2);
});

test('invalid import leaves storage unchanged and valid import writes once', () => {
  const { importLearningRecordBackup } = loadModule();
  const values = new Map([['project-seed:learning-records:v1', JSON.stringify([record])]]);
  let writes = 0;
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { writes += 1; values.set(key, value); } };
  assert.equal(importLearningRecordBackup(storage, '{').ok, false);
  assert.equal(writes, 0);
  const result = importLearningRecordBackup(storage, envelope([otherRecord]));
  assert.equal(result.ok, true);
  assert.equal(writes, 1);
  assert.equal(JSON.parse(values.get('project-seed:learning-records:v1')).length, 2);
});

test('storage write failure does not report success or create a partial result', () => {
  const { importLearningRecordBackup } = loadModule();
  const storage = { getItem: () => JSON.stringify([record]), setItem: () => { throw new Error('quota'); } };
  const result = importLearningRecordBackup(storage, envelope([otherRecord]));
  assert.equal(result.ok, false);
  assert.match(result.error, /write|storage/i);
});
