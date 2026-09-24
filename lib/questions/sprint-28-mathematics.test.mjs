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

const expectedJiejie = [
  { id: 'jiejie-mathematics-7', topic: '質因數分解和短除法', type: 'basic', title: '最大公因數', instruction: '請找出兩個數的最大公因數。', question: '24 和 36 的最大公因數是多少？', options: ['4', '6', '8', '12'], answer: 3, hint: '找出同時能整除 24 和 36 的數，再選其中最大的。', explanation: '24 的因數包含 1、2、3、4、6、8、12、24；36 的因數包含 1、2、3、4、6、9、12、18、36。共同因數中最大的數是 12。', encouragement: '答對了！你找到了最大公因數。' },
  { id: 'jiejie-mathematics-8', topic: '分數的除法', type: 'application', title: '整數除以分數', instruction: '請根據情境解決分數除法問題。', question: '2 公升果汁，每 1/4 公升裝成一瓶，可以裝滿幾瓶？', options: ['2 瓶', '4 瓶', '6 瓶', '8 瓶'], answer: 3, hint: '把 2 ÷ 1/4 改寫成乘以 1/4 的倒數。', explanation: '2 ÷ 1/4 = 2 × 4 = 8，所以可以裝滿 8 瓶。', encouragement: '答對了！你會用分數除法解決生活問題。' },
  { id: 'jiejie-mathematics-9', topic: '圓周長和圓面積', type: 'basic', title: '圓周長', instruction: '請計算圓的圓周長。', question: '一個圓的半徑是 4 公分。若 π = 3.14，圓周長是多少公分？', options: ['12.56 公分', '25.12 公分', '50.24 公分', '100.48 公分'], answer: 1, hint: '圓周長公式是 2 × π × 半徑。', explanation: '圓周長 = 2 × 3.14 × 4 = 25.12，所以圓周長是 25.12 公分。', encouragement: '答對了！你會使用圓周長公式。' },
];

const expectedMeimei = [
  { id: 'meimei-mathematics-7', topic: '數到 10000', type: 'basic', title: '四位數大小比較', instruction: '請比較四位數的大小。', question: '下面哪一個數最大？', options: ['4070', '4700', '4077', '4007'], answer: 1, hint: '先比較千位，再比較百位。', explanation: '四個數的千位都為 4，接著比較百位；4700 的百位是 7，其他數的百位較小，所以 4700 最大。', encouragement: '答對了！你會比較四位數的大小。' },
  { id: 'meimei-mathematics-8', topic: '四位數的加減', type: 'basic', title: '四位數的減法', instruction: '請計算四位數的減法。', question: '計算：5000 − 2768 = ？', options: ['2132', '2232', '2332', '2432'], answer: 1, hint: '用直式從個位開始，遇到不夠減時要向前一位借 1。', explanation: '5000 − 2768：個位 10−8=2；十位借位後 9−6=3；百位借位後 9−7=2；千位 4−2=2，所以答案是 2232。', encouragement: '答對了！你會完成四位數退位減法。' },
  { id: 'meimei-mathematics-9', topic: '乘法', type: 'basic', title: '三位數乘一位數', instruction: '請計算乘法。', question: '計算：306 × 4 = ？', options: ['1024', '1124', '1224', '1324'], answer: 2, hint: '可以分成 300 × 4、0 × 4 和 6 × 4 再相加。', explanation: '306 × 4 = 300 × 4 + 0 × 4 + 6 × 4 = 1200 + 0 + 24 = 1224。', encouragement: '答對了！你會用位值分解完成乘法。' },
  { id: 'meimei-mathematics-10', topic: '幾毫米', type: 'application', title: '公分和毫米相加', instruction: '請計算長度的總和。', question: '一條彩帶長 6 公分 4 毫米，另一條長 2 公分 9 毫米，合起來長幾公分幾毫米？', options: ['8 公分 3 毫米', '8 公分 7 毫米', '9 公分 3 毫米', '9 公分 7 毫米'], answer: 2, hint: '先分別把公分和毫米相加；10 毫米可以換成 1 公分。', explanation: '公分：6+2=8；毫米：4+9=13 毫米，也就是 1 公分 3 毫米，所以總長是 9 公分 3 毫米。', encouragement: '答對了！你會計算公分和毫米的長度。' },
];

const expectedIds = new Set([...expectedJiejie, ...expectedMeimei].map((question) => question.id));

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Sprint 28 banks contain the seven approved mathematics questions exactly', () => {
  const jiejie = loadQuestions('jiejie-mathematics').filter((question) => expectedIds.has(question.id));
  const meimei = loadQuestions('meimei-mathematics').filter((question) => expectedIds.has(question.id));
  assert.deepEqual(plain(jiejie), expectedJiejie);
  assert.deepEqual(plain(meimei), expectedMeimei);
});

test('Sprint 28 additions have unique options, valid answers, and singleton metadata', () => {
  const additions = [...loadQuestions('jiejie-mathematics'), ...loadQuestions('meimei-mathematics')].filter((question) => expectedIds.has(question.id));
  assert.equal(new Set(additions.map((question) => question.id)).size, 7);
  assert.equal(additions.filter((question) => question.id.startsWith('jiejie-')).length, 3);
  assert.equal(additions.filter((question) => question.id.startsWith('meimei-')).length, 4);
  for (const question of additions) {
    assert.equal(Object.hasOwn(question, 'reviewGroupId'), false);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.answer] !== undefined, true);
    assert.ok(question.hint.length > 0);
    assert.ok(question.explanation.length > 0);
  }
});
