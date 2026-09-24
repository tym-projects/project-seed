import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./jiejie-natural-science.ts', import.meta.url);

function loadQuestions() {
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

const expected = [
  {
    id: 'jiejie-natural-science-7',
    topic: '探索天氣的變化',
    type: 'basic',
    title: '水循環中的變化順序',
    instruction: '請判斷水循環中的變化順序。',
    question: '下列哪一個順序最能表示自然界中水循環的一段常見變化？',
    options: ['水蒸發 → 水蒸氣凝結 → 降水', '水蒸發 → 降水 → 水蒸氣凝結', '水蒸氣凝結 → 水蒸發 → 降水', '降水 → 水蒸氣凝結 → 水蒸發'],
    answer: 0,
    hint: '先想水如何進入空氣，再想雲和雨是如何形成的。',
    explanation: '地表的水蒸發成水蒸氣，水蒸氣在適當條件下凝結成小水滴或小冰晶，雲中的水滴或冰晶增長後可能形成降水。本題考查蒸發、凝結與降水的關係。',
    encouragement: '答對了！你能理解水循環中的變化順序。',
  },
  {
    id: 'jiejie-natural-science-8',
    topic: '水溶液',
    type: 'basic',
    title: '水溶液的均勻性',
    instruction: '請判斷水溶液的特性。',
    question: '將少量砂糖加入水中並充分攪拌，確認砂糖已完全溶解。下列哪一項描述最正確？',
    options: ['砂糖完全消失，因此糖水中已經沒有砂糖', '砂糖只分布在杯底，上層仍然是純水', '砂糖均勻分散在水中，糖水各部分都含有砂糖', '砂糖會變成細小顆粒，只集中在水面附近'],
    answer: 2,
    hint: '看不見砂糖顆粒，是否代表砂糖已經不存在？',
    explanation: '砂糖完全溶解後，仍存在於糖水中，並均勻分散；看不見原本的顆粒，不代表砂糖消失。',
    encouragement: '答對了！你知道溶解後的物質仍存在於水溶液中。',
  },
];

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Sprint 31 contains the two approved natural questions exactly', () => {
  const questions = loadQuestions();
  const actual = questions.filter(({ id }) => expected.some((item) => item.id === id));
  assert.deepEqual(plain(actual), expected);
});

test('Sprint 31 additions are unique singleton units with one valid answer', () => {
  const questions = loadQuestions();
  const additions = questions.filter(({ id }) => expected.some((item) => item.id === id));

  assert.equal(additions.length, 2);
  assert.equal(new Set(additions.map(({ id }) => id)).size, 2);
  for (const question of additions) {
    assert.equal(Object.hasOwn(question, 'reviewGroupId'), false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.ok(question.hint.trim());
    assert.ok(question.explanation.trim());
  }
});

test('Sprint 31 preserves the six existing natural questions', () => {
  assert.deepEqual(plain(loadQuestions().slice(0, 6).map(({ id }) => id)), [
    'jiejie-natural-science-1',
    'jiejie-natural-science-2',
    'jiejie-natural-science-3',
    'jiejie-natural-science-4',
    'jiejie-natural-science-5',
    'jiejie-natural-science-6',
  ]);
});
