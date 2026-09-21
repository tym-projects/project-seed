import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadModule() {
  const source = readFileSync(new URL('./understanding-confirmation-flow.ts', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

function completion(attempts = 1) {
  return { questionId: 'question', firstAnswer: 0, finalAnswer: 0, attempts, correct: true, completed: true };
}

function plan(confirmation = null) {
  return { groupId: 'group', primary: { id: 'primary' }, confirmation };
}

test('primary first-try completion enters its one confirmation phase', () => {
  const { advanceAfterCompletion, getInitialConfirmationFlowState } = loadModule();
  const state = advanceAfterCompletion({
    state: getInitialConfirmationFlowState(1),
    item: plan({ id: 'confirmation' }),
    completion: completion(1),
    itemCount: 1,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(state)), { itemIndex: 0, phase: 'confirmation', isComplete: false });
});

test('primary retry skips confirmation and advances to the next group', () => {
  const { advanceAfterCompletion } = loadModule();
  const state = advanceAfterCompletion({
    state: { itemIndex: 0, phase: 'primary', isComplete: false },
    item: plan({ id: 'confirmation' }),
    completion: completion(2),
    itemCount: 2,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(state)), { itemIndex: 1, phase: 'primary', isComplete: false });
});

test('confirmation completion advances once and never creates a third phase', () => {
  const { advanceAfterCompletion } = loadModule();
  const state = advanceAfterCompletion({
    state: { itemIndex: 0, phase: 'confirmation', isComplete: false },
    item: plan({ id: 'confirmation' }),
    completion: completion(2),
    itemCount: 1,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(state)), { itemIndex: 0, phase: 'confirmation', isComplete: true });
});

test('an item without confirmation keeps the existing one-question progression', () => {
  const { advanceAfterCompletion } = loadModule();
  const state = advanceAfterCompletion({
    state: { itemIndex: 0, phase: 'primary', isComplete: false },
    item: plan(),
    completion: completion(1),
    itemCount: 2,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(state)), { itemIndex: 1, phase: 'primary', isComplete: false });
});

test('complete state is stable and cannot loop into another question', () => {
  const { advanceAfterCompletion } = loadModule();
  const state = advanceAfterCompletion({
    state: { itemIndex: 0, phase: 'confirmation', isComplete: true },
    item: plan({ id: 'confirmation' }),
    completion: completion(1),
    itemCount: 5,
  });
  assert.deepEqual(JSON.parse(JSON.stringify(state)), { itemIndex: 0, phase: 'confirmation', isComplete: true });
});
