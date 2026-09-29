import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./learning-record-diagnostics.ts', import.meta.url);

function loadDiagnosticsModule() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

const validRecord = {
  id: 'diagnostic-record',
  student: 'jiejie',
  subject: 'chinese',
  questionId: 'jiejie-chinese-1',
  firstAnswer: 0,
  finalAnswer: 0,
  attempts: 1,
  correct: true,
  completed: true,
  createdAt: '2026-09-29T00:00:00.000Z',
};

test('diagnoses a missing key without exposing records', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage(null);
  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    keyExists: false,
    rawIsNull: true,
    parseStatus: 'failed',
    parsedContainerType: 'none',
    totalRecordCount: 0,
    validRecordCount: 0,
    invalidRecordCount: 0,
    validationStatus: 'no-key',
  });
});

test('diagnoses an empty array', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage('[]');
  assert.equal(result.validationStatus, 'empty-array');
  assert.equal(result.parseStatus, 'success');
  assert.equal(result.parsedContainerType, 'array');
  assert.equal(result.totalRecordCount, 0);
});

test('diagnoses malformed JSON', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage('{bad');
  assert.equal(result.validationStatus, 'parse-failed');
  assert.equal(result.parseStatus, 'failed');
  assert.equal(result.keyExists, true);
});

test('diagnoses a non-array parsed container', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage(JSON.stringify({ records: [] }));
  assert.equal(result.validationStatus, 'schema-invalid');
  assert.equal(result.parsedContainerType, 'object');
  assert.equal(result.totalRecordCount, 0);
});

test('counts partially valid records without returning their contents', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage(JSON.stringify([validRecord, { id: 'invalid' }]));
  assert.deepEqual(JSON.parse(JSON.stringify(result)), {
    keyExists: true,
    rawIsNull: false,
    parseStatus: 'success',
    parsedContainerType: 'array',
    totalRecordCount: 2,
    validRecordCount: 1,
    invalidRecordCount: 1,
    validationStatus: 'partially-valid',
  });
  assert.equal('questionId' in result, false);
});

test('diagnoses a fully valid record array', () => {
  const result = loadDiagnosticsModule().diagnoseLearningRecordStorage(JSON.stringify([validRecord]));
  assert.equal(result.validationStatus, 'valid');
  assert.equal(result.validRecordCount, 1);
  assert.equal(result.invalidRecordCount, 0);
});
