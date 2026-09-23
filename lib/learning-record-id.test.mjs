import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule(cryptoApi) {
  const source = readFileSync(new URL('./learning-record-id.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: testModule.exports,
    module: testModule,
    crypto: cryptoApi,
    Uint8Array,
  });
  return testModule.exports;
}

test('uses native randomUUID when available', () => {
  const { createLearningRecordId } = loadModule({ randomUUID: () => 'native-id' });
  assert.equal(createLearningRecordId(), 'native-id');
});

test('uses a cryptographic UUID v4 fallback when randomUUID is unavailable', () => {
  const bytes = new Uint8Array(16);
  bytes.fill(0xab);
  const { createLearningRecordId } = loadModule({ getRandomValues: (target) => target.set(bytes) });
  const id = createLearningRecordId();
  assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});

test('produces different UUID v4 values for different random bytes', () => {
  let seed = 0;
  const { createLearningRecordId } = loadModule({
    getRandomValues: (target) => target.fill(seed++),
  });
  assert.notEqual(createLearningRecordId(), createLearningRecordId());
});

test('fails clearly when no secure random API is available', () => {
  const { createLearningRecordId } = loadModule({});
  assert.throws(() => createLearningRecordId(), /無法建立學習紀錄識別碼/);
});
