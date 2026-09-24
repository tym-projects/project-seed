import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const modulePath = new URL('./first-practice-order.ts', import.meta.url);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const questions = [
  { id: 'a', answer: 0, hint: 'a', explanation: 'a', reviewGroupId: 'group-a' },
  { id: 'b', answer: 1, hint: 'b', explanation: 'b' },
  { id: 'c', answer: 2, hint: 'c', explanation: 'c', reviewGroupId: 'group-c' },
  { id: 'd', answer: 3, hint: 'd', explanation: 'd' },
];

test('shuffles a copied question list with an injectable RNG', () => {
  const { shuffleQuestions } = loadModule();
  const original = structuredClone(questions);
  const shuffled = shuffleQuestions(questions, () => 0);

  assert.deepEqual(plain(shuffled.map(({ id }) => id)), ['b', 'c', 'd', 'a']);
  assert.deepEqual(questions, original);
  assert.notEqual(shuffled, questions);
  assert.deepEqual(plain(shuffled.find(({ id }) => id === 'a')), questions[0]);
});

test('supports empty and single-question lists without duplication', () => {
  const { shuffleQuestions } = loadModule();
  assert.deepEqual(plain(shuffleQuestions([], () => 0)), []);
  assert.deepEqual(plain(shuffleQuestions([questions[0]], () => 0)), [questions[0]]);
});

test('preserves every question exactly once, including variation metadata', () => {
  const { shuffleQuestions } = loadModule();
  const shuffled = shuffleQuestions(questions, () => 0.75);
  assert.deepEqual(new Set(plain(shuffled.map(({ id }) => id))), new Set(questions.map(({ id }) => id)));
  assert.equal(shuffled.length, questions.length);
  assert.equal(shuffled.find(({ id }) => id === 'a').reviewGroupId, 'group-a');
  assert.equal(shuffled.find(({ id }) => id === 'c').reviewGroupId, 'group-c');
});
