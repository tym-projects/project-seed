import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadQuestions(fileName) {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

const expected = [
  {
    bank: 'jiejie-mathematics.ts', id: 'jiejie-mathematics-14', topic: '質因數分解和短除法', type: 'basic', title: '最小公倍數', instruction: '請找出兩個數的最小公倍數。',
    question: '12 和 18 的最小公倍數是多少？', options: ['24', '30', '36', '48'], answer: 2,
    hint: '找出同時是 12 和 18 倍數的最小正整數。', explanation: '12 的倍數有 12、24、36；18 的倍數有 18、36，所以兩者共同的最小倍數是 36。', encouragement: '答對了！你能找出最小公倍數。',
  },
  {
    bank: 'jiejie-mathematics.ts', id: 'jiejie-mathematics-15', topic: '圓周長和圓面積', type: 'basic', title: '半徑和直徑', instruction: '請判斷圓的半徑和直徑關係。',
    question: '一個圓的直徑是 14 公分，它的半徑是多少公分？', options: ['7 公分', '14 公分', '21 公分', '28 公分'], answer: 0,
    hint: '直徑是通過圓心的完整線段，半徑是其中的一半。', explanation: '半徑是直徑的一半，14 ÷ 2 = 7，所以半徑是 7 公分。', encouragement: '答對了！你理解半徑和直徑的關係。',
  },
  {
    bank: 'jiejie-natural-science.ts', id: 'jiejie-natural-science-11', topic: '探索天氣的變化', type: 'application', title: '降水形成', instruction: '請判斷水循環中的現象。',
    question: '雲中的小水滴或小冰晶逐漸變大，最後落到地面，這種現象稱為什麼？', options: ['蒸發', '凝結', '降水', '溶解'], answer: 2,
    hint: '想想雨和雪是怎麼從雲中回到地面的。', explanation: '雲中的水滴或冰晶增長後落到地面，稱為降水；雨、雪等都屬於降水。', encouragement: '答對了！你能辨認水循環中的降水現象。',
  },
  {
    bank: 'jiejie-natural-science.ts', id: 'jiejie-natural-science-12', topic: '水溶液', type: 'application', title: '分離糖水', instruction: '請選出可行的觀察方法。',
    question: '想觀察糖水中的砂糖，將糖水加熱使水逐漸蒸發，最可能看到什麼結果？', options: ['砂糖完全變成空氣', '水蒸發後留下砂糖', '砂糖變成泥土', '水和砂糖都消失'], answer: 1,
    hint: '水蒸發時，已溶解的砂糖會不會跟著變成水蒸氣？', explanation: '加熱時水可以蒸發離開，砂糖不會跟著水蒸氣離開，水分減少後可留下砂糖。', encouragement: '答對了！你能用蒸發理解水溶液的分離。',
  },
  {
    bank: 'jiejie-social-studies.ts', id: 'jiejie-social-studies-11', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '科技與學習方式', instruction: '請判斷社會變遷對個人發展的影響。',
    question: '網路和數位工具普及後，學生可以用線上資料輔助學習。這個例子說明什麼？', options: ['科技改變可能增加人們學習與取得資訊的方式', '科技出現後每個人的興趣都會完全相同', '只要使用工具就一定不用思考', '社會變遷只會影響交通，不會影響學習'], answer: 0,
    hint: '比較以前和現在取得學習資料的方式有什麼不同。', explanation: '科技發展使取得資料和學習的方式增加，但仍需要判斷資料與主動思考；這是社會變遷影響個人發展的例子。', encouragement: '答對了！你能看見科技變化和學習方式的關係。',
  },
  {
    bank: 'jiejie-social-studies.ts', id: 'jiejie-social-studies-12', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '文化交流的態度', instruction: '請選出尊重文化交流的做法。',
    question: '小組要介紹不同族群的節慶，哪一種做法最適當？', options: ['只用自己的習慣猜測節慶意義', '把一個人的做法說成所有人都一樣', '查找可靠資料並說明不同家庭或地區可能有差異', '只挑自己覺得奇怪的地方取笑'], answer: 2,
    hint: '介紹文化時，資料來源和對差異的態度都很重要。', explanation: '查證資料並承認同一族群內也可能有不同做法，能較完整且尊重地介紹文化；不能靠猜測或刻板印象。', encouragement: '答對了！你能用尊重和查證的方式認識文化。',
  },
  {
    bank: 'meimei-social-studies.ts', id: 'meimei-social-studies-9', topic: '我和我的家人', type: 'application', title: '家人的關心與聯絡', instruction: '請選出合適的家庭互動方式。',
    question: '住在不同地方的家人想知道彼此近況，哪一種做法最合適？', options: ['完全不聯絡，也不關心對方', '用電話或訊息互相問候，並在需要時提供幫助', '只在發生爭吵時聯絡', '要求每個家人每天做完全相同的事'], answer: 1,
    hint: '家人即使不住在一起，也可以用什麼方式保持關心？', explanation: '家人可以透過電話、訊息或見面互相問候，在需要時提供支持；家庭互動不必要求每個人生活完全相同。', encouragement: '答對了！你知道家人可以用不同方式互相關心。',
  },
  {
    bank: 'meimei-social-studies.ts', id: 'meimei-social-studies-10', topic: '學習的方法', type: 'basic', title: '準備學習環境', instruction: '請選出有助於學習的準備方式。',
    question: '開始寫作業前，哪一種準備最有助於專心完成？', options: ['先準備需要的文具，整理桌面並安排安靜的時間', '把所有玩具放在桌上，邊玩邊寫', '不看題目，直接猜答案', '把作業放到最後一刻才想起來'], answer: 0,
    hint: '先準備好用品和時間，能不能減少學習中斷？', explanation: '準備需要的用品、整理桌面並安排時間，可以減少找東西和被打擾的情況，較有助於專心學習。', encouragement: '答對了！你會先準備適合的學習環境。',
  },
];

test('Sprint 33 approved-evidence batch is present with exact content', () => {
  const byBank = new Map();
  for (const item of expected) {
    if (!byBank.has(item.bank)) byBank.set(item.bank, loadQuestions(item.bank));
    const actual = byBank.get(item.bank).find(({ id }) => id === item.id);
    assert.ok(actual, `missing ${item.id}`);
    const expectedQuestion = Object.fromEntries(Object.entries(item).filter(([key]) => key !== 'bank'));
    assert.deepEqual(JSON.parse(JSON.stringify(actual)), expectedQuestion);
  }
});

test('Sprint 33 additions are unique singleton questions with one valid answer', () => {
  const ids = expected.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of expected) {
    const actual = loadQuestions(item.bank).find(({ id }) => id === item.id);
    assert.equal(Object.hasOwn(actual, 'reviewGroupId'), false);
    assert.equal(actual.options.length, 4);
    assert.equal(new Set(actual.options).size, 4);
    assert.equal(actual.answer >= 0 && actual.answer < 4, true);
    assert.ok(actual.hint.trim());
    assert.ok(actual.explanation.trim());
  }
});
