import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./jiejie-chinese.ts', import.meta.url);

function loadQuestionBank() {
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };

  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

function toPlainValue(value) {
  return JSON.parse(JSON.stringify(value));
}

test('JieJie variation questions preserve their approved groups and answers', () => {
  const byId = new Map(loadQuestionBank().map((question) => [question.id, question]));

  assert.equal(byId.get('jiejie-chinese-1').reviewGroupId, 'jiejie-chinese-jiao-pronunciation');
  assert.deepEqual(toPlainValue(byId.get('jiejie-chinese-3')), {
    id: 'jiejie-chinese-3',
    reviewGroupId: 'jiejie-chinese-jiao-pronunciation',
    topic: '注音辨識',
    type: 'basic',
    title: '注音練習',
    instruction: '請選出正確的注音。',
    question: '校園裡有一棵芭蕉樹，「芭蕉」的「蕉」讀音是？',
    options: ['① ㄐㄧㄠ', '② ㄑㄧㄠ', '③ ㄒㄧㄠ'],
    answer: 0,
    explanation: '「蕉」不管出現在「香蕉」或「芭蕉」，都讀作「ㄐㄧㄠ」。',
    encouragement: '🎉 答對了！你會讀「蕉」了！',
  });
  assert.equal(byId.get('jiejie-chinese-2').reviewGroupId, 'jiejie-chinese-tian-radical');
  assert.deepEqual(toPlainValue(byId.get('jiejie-chinese-4')), {
    id: 'jiejie-chinese-4',
    reviewGroupId: 'jiejie-chinese-tian-radical',
    topic: '部首辨識',
    type: 'basic',
    title: '部首練習',
    instruction: '想查字典時，請選出要查的部首。',
    question: '想查「天」字時，應該查哪一個部首？',
    options: ['① 大部', '② 一部', '③ 人部'],
    answer: 0,
    explanation: '「天」的部首是「大」，所以查字典時要查「大部」。',
    encouragement: '🎉 答對了！你知道怎麼查「天」字了！',
  });
});
