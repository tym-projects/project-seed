import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./meimei-chinese.ts', import.meta.url);

function loadQuestionBank() {
  const source = readFileSync(modulePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });

  return testModule.exports.questions;
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('MeiMei Chinese question bank keeps five fixed and unique question IDs', () => {
  const questions = loadQuestionBank();

  assert.deepEqual(
    toPlainValue(questions.map((question) => question.id)),
    ['meimei-chinese-1', 'meimei-chinese-2', 'meimei-chinese-3', 'meimei-chinese-4', 'meimei-chinese-5'],
  );
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
});

test('MeiMei variation questions preserve their approved groups and answers', () => {
  const questions = loadQuestionBank();
  const byId = new Map(questions.map((question) => [question.id, question]));

  assert.equal(byId.get('meimei-chinese-1').reviewGroupId, 'meimei-chinese-gaoxing-meaning');
  assert.deepEqual(toPlainValue(byId.get('meimei-chinese-4')), {
    id: 'meimei-chinese-4',
    reviewGroupId: 'meimei-chinese-gaoxing-meaning',
    topic: '詞語意思',
    type: 'basic',
    title: '詞語意思',
    instruction: '請根據句子的意思選出最適合的詞語。',
    question: '妹妹收到生日禮物，心裡很開心。下面哪一個詞語最適合形容妹妹的心情？',
    options: ['高興', '難過', '生氣'],
    answer: 0,
    explanation: '收到喜歡的生日禮物時，心情很開心，也可以說「很高興」。',
    encouragement: '答對了！你真的理解「高興」的意思了！',
  });
  assert.equal(byId.get('meimei-chinese-2').reviewGroupId, 'meimei-chinese-action-word-identification');
  assert.deepEqual(toPlainValue(byId.get('meimei-chinese-5')), {
    id: 'meimei-chinese-5',
    reviewGroupId: 'meimei-chinese-action-word-identification',
    topic: '動作詞辨識',
    type: 'application',
    title: '認識動作詞',
    instruction: '請找出句子中表示動作的詞語。',
    question: '「小狗在草地上跑。」哪一個詞語表示動作？',
    options: ['小狗', '草地', '跑'],
    answer: 2,
    explanation: '「跑」表示小狗正在做的動作。',
    encouragement: '答對了！你找到動作詞了。',
  });
});

test('MeiMei Chinese questions have valid answer options', () => {
  const questions = loadQuestionBank();

  for (const question of questions) {
    assert.ok(question.options.length >= 2);
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
  }
});
