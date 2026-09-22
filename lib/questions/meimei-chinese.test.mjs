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

test('MeiMei Chinese question bank keeps twelve fixed and unique question IDs', () => {
  const questions = loadQuestionBank();

  assert.deepEqual(
    toPlainValue(questions.map((question) => question.id)),
    [
      'meimei-chinese-1', 'meimei-chinese-2', 'meimei-chinese-3', 'meimei-chinese-4', 'meimei-chinese-5',
      'meimei-chinese-6', 'meimei-chinese-7', 'meimei-chinese-8', 'meimei-chinese-9', 'meimei-chinese-10', 'meimei-chinese-11',
      'meimei-chinese-action-word-identification-3',
    ],
  );
  assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
});

test('MeiMei variation questions preserve their approved groups and answers', () => {
  const questions = loadQuestionBank();
  const byId = new Map(questions.map((question) => [question.id, question]));

  assert.equal(byId.get('meimei-chinese-1').reviewGroupId, 'meimei-chinese-gaoxing-meaning');
  assert.equal(byId.get('meimei-chinese-1').hint, '想想哪個詞也可以表示心情愉快。');
  assert.equal(byId.get('meimei-chinese-1').explanation, '「高興」和「快樂」都表示心情愉快，所以意思最接近；「難過」表示心情不好，「安靜」則是描述聲音或行為的狀態。');
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
    hint: '先找出句子描述的心情，再比較哪個選項和這種心情相同。',
    explanation: '句子用「很開心」描述妹妹收到禮物時的心情；「高興」也表示心情愉快，所以最適合。「難過」和「生氣」表示不同的情緒。',
    encouragement: '答對了！你真的理解「高興」的意思了！',
  });
  assert.equal(byId.get('meimei-chinese-2').reviewGroupId, 'meimei-chinese-action-word-identification');
  assert.equal(byId.get('meimei-chinese-2').hint, '找出小明正在做的事情，不是做事的人或放東西的地方。');
  assert.equal(byId.get('meimei-chinese-2').explanation, '「放」表示把書放到書包裡的動作；「小明」是做動作的人，「書包」是放書的地方。');
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
    hint: '找出小狗正在做的事情，不是小狗或牠活動的地方。',
    explanation: '「跑」表示小狗正在做的動作；「小狗」是做動作的動物，「草地」是活動的地方。',
    encouragement: '答對了！你找到動作詞了。',
  });
  assert.deepEqual(toPlainValue(byId.get('meimei-chinese-action-word-identification-3')), {
    id: 'meimei-chinese-action-word-identification-3',
    reviewGroupId: 'meimei-chinese-action-word-identification',
    topic: '動作詞辨識',
    type: 'application',
    title: '選出動作詞',
    instruction: '根據句子的意思，找出表示動作的詞語。',
    question: '小安拿起鉛筆，在紙上＿＿＿＿自己的名字。哪一個詞語表示小安做的動作？',
    options: ['小安', '鉛筆', '寫', '名字'],
    answer: 2,
    hint: '找出表示小安正在做什麼的詞，不是人物、工具或寫下的內容。',
    explanation: '「寫」表示小安用鉛筆在紙上記下名字的動作；「小安」是人物，「鉛筆」是工具，「名字」是寫下的內容。',
    encouragement: '答對了！你找到了句子中的動作詞。',
  });
});

test('MeiMei Chinese questions have valid answer options', () => {
  const questions = loadQuestionBank();

  for (const question of questions) {
    assert.ok(question.options.length >= 2);
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
  }
});
