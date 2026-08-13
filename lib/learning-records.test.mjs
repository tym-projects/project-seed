import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./learning-records.ts', import.meta.url);

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadLearningRecordsModule() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, window: globalThis.window });

  return testModule.exports;
}

function createLocalStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function createFailingLocalStorage() {
  return {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error('storage quota exceeded');
    },
  };
}

const record = {
  id: 'record-1',
  student: 'jiejie',
  subject: 'chinese',
  questionId: 'jiejie-chinese-1',
  firstAnswer: 1,
  finalAnswer: 0,
  attempts: 2,
  correct: true,
  completed: true,
  createdAt: '2026-08-12T00:00:00.000Z',
};

const meimeiRecord = {
  ...record,
  id: 'record-2',
  student: 'meimei',
  questionId: 'meimei-chinese-1',
};

test('readLearningRecords returns an empty list without a browser', () => {
  delete globalThis.window;
  const { readLearningRecords } = loadLearningRecordsModule();

  assert.deepEqual(toPlainValue(readLearningRecords()), []);
});

test('readLearningRecords returns an empty list for damaged JSON', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { LEARNING_RECORDS_STORAGE_KEY, readLearningRecords } = loadLearningRecordsModule();
  globalThis.window.localStorage.setItem(LEARNING_RECORDS_STORAGE_KEY, '{not-json');

  assert.deepEqual(toPlainValue(readLearningRecords()), []);
});

test('readLearningRecords ignores unexpected stored structures', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { LEARNING_RECORDS_STORAGE_KEY, readLearningRecords } = loadLearningRecordsModule();
  globalThis.window.localStorage.setItem(LEARNING_RECORDS_STORAGE_KEY, JSON.stringify({ records: [record] }));

  assert.deepEqual(toPlainValue(readLearningRecords()), []);
});

test('readLearningRecords keeps only safe records when legacy data is mixed with valid records', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { LEARNING_RECORDS_STORAGE_KEY, readLearningRecords } = loadLearningRecordsModule();
  const invalidDate = { ...record, id: 'invalid-date', createdAt: 'not-a-date' };
  const infiniteAttempts = { ...record, id: 'infinite-attempts', attempts: Infinity };
  const unreasonableAttempts = { ...record, id: 'zero-attempts', attempts: 0 };
  const missingQuestionId = { ...record, id: 'missing-question-id' };
  delete missingQuestionId.questionId;

  globalThis.window.localStorage.setItem(
    LEARNING_RECORDS_STORAGE_KEY,
    JSON.stringify([record, invalidDate, infiniteAttempts, unreasonableAttempts, missingQuestionId, null]),
  );

  assert.deepEqual(toPlainValue(readLearningRecords()), [record]);
});

test('saveLearningRecord does not throw when localStorage rejects writes', () => {
  globalThis.window = { localStorage: createFailingLocalStorage() };
  const { saveLearningRecord } = loadLearningRecordsModule();

  assert.doesNotThrow(() => saveLearningRecord(record));
});

test('saveLearningRecord appends a record that readLearningRecords returns', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { LEARNING_RECORDS_STORAGE_KEY, readLearningRecords, saveLearningRecord } = loadLearningRecordsModule();

  saveLearningRecord(record);

  assert.deepEqual(toPlainValue(readLearningRecords()), [record]);
  assert.deepEqual(JSON.parse(globalThis.window.localStorage.getItem(LEARNING_RECORDS_STORAGE_KEY)), [record]);
});

test('saveLearningRecord stores a MeiMei Chinese record', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  const { readLearningRecords, saveLearningRecord } = loadLearningRecordsModule();

  saveLearningRecord(meimeiRecord);

  assert.deepEqual(toPlainValue(readLearningRecords()), [meimeiRecord]);
});
