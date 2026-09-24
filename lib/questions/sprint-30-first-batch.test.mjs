import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadQuestions(fileName) {
  const modulePath = new URL(`./${fileName}.ts`, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

const expected = [
  {
    bank: 'jiejie-natural-science',
    id: 'jiejie-natural-science-5',
    topic: '探索天氣的變化',
    type: 'basic',
    title: '凝結現象',
    instruction: '請判斷水的變化。',
    question: '從冰箱拿出一瓶冰水，過了一會兒，瓶子外面出現許多小水滴。這些小水滴主要是怎麼形成的？',
    options: ['瓶內的水穿過瓶子流出來', '空氣中的水蒸氣遇冷凝結成小水滴', '瓶子外面的空氣直接變成冰塊', '瓶內的水受熱蒸發到瓶子外面'],
    answer: 1,
    hint: '想想空氣中的水蒸氣接觸冰冷表面後，會發生什麼變化。',
    explanation: '空氣中的水蒸氣接觸較冷的瓶子表面，可能凝結成液態小水滴。小水滴並非瓶內的水穿過瓶壁流出。',
    encouragement: '答對了！你觀察到水蒸氣的凝結。',
  },
  {
    bank: 'jiejie-natural-science',
    id: 'jiejie-natural-science-6',
    topic: '探索天氣的變化',
    type: 'application',
    title: '天氣資料判讀',
    instruction: '請根據資料判斷。',
    question: '觀察衛星雲圖時，發現某地上空有大片雲系。依據這項資料，下列哪一個判斷最適當？',
    options: ['該地一定正在下大雨', '該地未來一個月都不會下雨', '該地有較多雲層，是否降雨仍需配合其他資料判斷', '該地的地面氣溫一定是攝氏零度'],
    answer: 2,
    hint: '雲圖可以顯示雲的分布，但是否能只靠雲圖確定地面正在下雨？',
    explanation: '衛星雲圖可用來觀察雲系分布與變化，但大片雲系不等於當地一定正在降雨。判斷實際天氣仍需搭配其他觀測資料。',
    encouragement: '答對了！你能正確判讀天氣資料。',
  },
  {
    bank: 'jiejie-social-studies',
    id: 'jiejie-social-studies-5',
    topic: '個人發展如何受到社會變遷的影響？',
    type: 'application',
    title: '教育機會與個人發展',
    instruction: '請判斷社會變遷的影響。',
    question: '隨著教育機會增加，更多人可以依照自己的興趣和能力繼續學習。這項社會變遷可能帶來什麼影響？',
    options: ['每個人都必須選擇相同的工作', '個人有更多學習與發展能力的機會', '所有人都不需要再學習新知識', '個人的興趣與未來選擇完全沒有關係'],
    answer: 1,
    hint: '想想有更多機會接受教育，對個人未來的選擇可能有什麼影響。',
    explanation: '教育機會增加，可能讓更多人取得知識、培養能力，並依興趣與條件探索不同的發展方向。',
    encouragement: '答對了！你理解教育機會與個人發展的關係。',
  },
  {
    bank: 'jiejie-social-studies',
    id: 'jiejie-social-studies-6',
    topic: '族群交流如何影響臺灣社會？',
    type: 'application',
    title: '族群文化交流',
    instruction: '請判斷文化交流的影響。',
    question: '臺灣不同族群在生活中互相交流，有些料理會結合不同族群使用的食材與烹調方式。這種現象最能說明什麼？',
    options: ['不同族群交流後，所有飲食習慣都會完全相同', '不同族群的文化只能分開存在', '料理的改變一定代表原有文化完全消失', '族群交流可能讓不同文化互相影響，產生新的生活樣貌'],
    answer: 3,
    hint: '想想不同族群分享食材與料理方式後，生活文化可能發生什麼變化。',
    explanation: '不同族群透過生活往來分享飲食文化，可能互相影響並發展出新的料理方式。文化交流不代表原有文化必須消失。',
    encouragement: '答對了！你能理解文化交流帶來的影響。',
  },
  {
    bank: 'meimei-social-studies',
    id: 'meimei-social-studies-5',
    topic: '我和我的家人',
    type: 'basic',
    title: '親屬稱謂',
    instruction: '請選出適當的親屬稱謂。',
    question: '媽媽的弟弟來家裡作客。你通常應該怎麼稱呼他？',
    options: ['伯伯', '舅舅', '叔叔', '姑丈'],
    answer: 1,
    hint: '想想媽媽的兄弟應該使用哪一種親屬稱謂。',
    explanation: '媽媽的兄弟通常稱為舅舅。這題中的人物是媽媽的弟弟，因此選舅舅。',
    encouragement: '答對了！你能依家庭關係判斷稱謂。',
  },
  {
    bank: 'meimei-social-studies',
    id: 'meimei-social-studies-6',
    topic: '學習的方法',
    type: 'application',
    title: '安排學習步驟',
    instruction: '請選出有助於完成學習任務的做法。',
    question: '小安明天要交一份報告，但還沒有整理資料，也還沒開始寫。下列哪一種做法比較有助於完成報告？',
    options: ['先列出需要完成的工作，再安排時間依序進行', '一直等到明天早上，完全不做準備', '只挑自己喜歡的部分做，其他全部不處理', '因為事情很多，所以直接放棄'],
    answer: 0,
    hint: '想想把工作分成幾個步驟，是否有助於安排時間與完成任務。',
    explanation: '先整理需要完成的工作，再安排資料蒐集、撰寫與檢查的時間，有助於依序完成報告。',
    encouragement: '答對了！你會安排學習步驟。',
  },
];

const expectedByBank = new Map();
for (const item of expected) {
  const items = expectedByBank.get(item.bank) ?? [];
  items.push(item);
  expectedByBank.set(item.bank, items);
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Sprint 30 first batch contains the six approved questions exactly', () => {
  for (const [bank, items] of expectedByBank) {
    const actual = loadQuestions(bank).filter((question) => items.some((item) => item.id === question.id));
    assert.deepEqual(plain(actual), items.map((item) => {
      const copy = { ...item };
      delete copy.bank;
      return copy;
    }));
  }
});

test('Sprint 30 additions are unique singleton learning units with valid answers', () => {
  const additions = expected.flatMap((item) => loadQuestions(item.bank).filter((question) => question.id === item.id));
  assert.equal(additions.length, expected.length);
  assert.equal(new Set(additions.map((question) => question.id)).size, expected.length);
  for (const question of additions) {
    assert.equal(Object.hasOwn(question, 'reviewGroupId'), false);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, true);
    assert.ok(question.hint.length > 0);
    assert.ok(question.explanation.length > 0);
  }
});

test('Sprint 30 additions remain isolated to their approved student and subject banks', () => {
  assert.deepEqual(Array.from(loadQuestions('jiejie-natural-science').filter(({ id }) => ['jiejie-natural-science-5', 'jiejie-natural-science-6'].includes(id)), ({ id }) => id), [
    'jiejie-natural-science-5',
    'jiejie-natural-science-6',
  ]);
  assert.deepEqual(Array.from(loadQuestions('jiejie-social-studies').slice(-2), ({ id }) => id), [
    'jiejie-social-studies-5',
    'jiejie-social-studies-6',
  ]);
  assert.deepEqual(Array.from(loadQuestions('meimei-social-studies').slice(-2), ({ id }) => id), [
    'meimei-social-studies-5',
    'meimei-social-studies-6',
  ]);
});
