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

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const expectedJiejie = [
  { id: 'jiejie-mathematics-1', topic: '質因數分解和短除法', type: 'basic', title: '質因數分解和短除法', instruction: '請選出正確的質因數分解。', question: '84 的質因數分解是哪一個？', options: ['2 × 2 × 3 × 7', '2 × 3 × 14', '4 × 21', '6 × 14'], answer: 0, hint: '先把 84 依序除以最小的質因數，直到每個因數都是質數。', explanation: '84 ÷ 2 = 42，42 ÷ 2 = 21，21 ÷ 3 = 7。最後得到的質因數是 2、2、3、7，所以 84 = 2 × 2 × 3 × 7。', encouragement: '答對了！你完成了質因數分解。' },
  { id: 'jiejie-mathematics-2', topic: '分數的除法', type: 'application', title: '分數的除法', instruction: '請計算分數除法。', question: '計算：3/4 ÷ 1/2 = ？', options: ['3/8', '2/3', '3/2', '1/4'], answer: 2, hint: '除以一個分數，可以改成乘以它的倒數。', explanation: '3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2，也可以寫成 1 又 1/2。', encouragement: '答對了！你會計算分數的除法。' },
  { id: 'jiejie-mathematics-3', topic: '小數的除法', type: 'basic', title: '小數的除法', instruction: '請計算小數除法。', question: '計算：8.4 ÷ 0.7 = ？', options: ['1.2', '12', '120', '0.12'], answer: 1, hint: '把除數 0.7 變成整數時，被除數也要同時乘以 10。', explanation: '8.4 ÷ 0.7 的除數有一位小數，所以被除數和除數同時乘以 10，變成 84 ÷ 7。84 ÷ 7 = 12，因此 8.4 ÷ 0.7 = 12。', encouragement: '答對了！你能正確計算小數除法。' },
  { id: 'jiejie-mathematics-4', topic: '圓周長和圓面積', type: 'application', title: '圓面積', instruction: '請計算圓的面積。', question: '一個圓的半徑是 5 公分。若 π = 3.14，這個圓的面積是多少平方公分？', options: ['31.4 平方公分', '62.8 平方公分', '78.5 平方公分', '157 平方公分'], answer: 2, hint: '圓面積公式是 π × 半徑 × 半徑；題目已給半徑和 π。', explanation: '圓面積 = π × 半徑 × 半徑 = 3.14 × 5 × 5 = 3.14 × 25 = 78.5，所以面積是 78.5 平方公分。', encouragement: '答對了！你會使用圓面積公式。' },
  { id: 'jiejie-mathematics-5', topic: '比和比值', type: 'application', title: '比和比值', instruction: '請根據數量比解題。', question: '紅球和藍球的數量比是 2：3。若紅球有 8 顆，藍球有幾顆？', options: ['10 顆', '12 顆', '16 顆', '24 顆'], answer: 1, hint: '紅球的 2 份變成 8 顆，先找出 1 份是多少，再找 3 份。', explanation: '2 份紅球是 8 顆，所以 1 份是 8 ÷ 2 = 4 顆。藍球是 3 份，所以 4 × 3 = 12 顆。', encouragement: '答對了！你能用比來解決數量問題。' },
  { id: 'jiejie-mathematics-6', topic: '扇形的弧長和面積', type: 'application', title: '扇形弧長', instruction: '請計算扇形的弧長。', question: '一個圓心角 90° 的扇形，半徑為 6 公分。若 π = 3.14，這個扇形的弧長是多少公分？', options: ['6.28 公分', '9.42 公分', '18.84 公分', '37.68 公分'], answer: 1, hint: '圓心角 90° 的扇形弧長是整個圓周長的四分之一。', explanation: '整個圓周長 = 2 × 3.14 × 6 = 37.68 公分。圓心角 90° 的扇形弧長是整個圓周長的四分之一，所以 37.68 ÷ 4 = 9.42 公分。', encouragement: '答對了！你會計算扇形的弧長。' },
];

const expectedMeimei = [
  { id: 'meimei-mathematics-1', topic: '數到 10000', type: 'basic', title: '位值分解', instruction: '請選出正確的位值分解。', question: '3407 的位值分解是哪一個？', options: ['3000 + 400 + 7', '3000 + 40 + 7', '300 + 400 + 7', '3000 + 400 + 70'], answer: 0, hint: '看千位、百位、十位和個位；3407 的十位有幾個？', explanation: '3407 有 3 個千、4 個百、0 個十和 7 個一，所以 3407 = 3000 + 400 + 7。', encouragement: '答對了！你會看數字的位值。' },
  { id: 'meimei-mathematics-2', topic: '四位數的加減', type: 'basic', title: '四位數的加法', instruction: '請計算四位數的加法。', question: '計算：3482 + 2157 = ？', options: ['5539', '5639', '5739', '5839'], answer: 1, hint: '可以從個位開始直式相加，滿十要進位。', explanation: '個位 2＋7＝9；十位 8＋5＝13，寫 3、向百位進 1；百位 4＋1＋1＝6；千位 3＋2＝5；所以答案為 5639。', encouragement: '答對了！你會正確完成四位數加法。' },
  { id: 'meimei-mathematics-3', topic: '乘法', type: 'basic', title: '乘法計算', instruction: '請計算乘法。', question: '計算：24 × 3 = ？', options: ['62', '72', '82', '92'], answer: 1, hint: '可以把 24 看成 20 和 4，再分別乘以 3。', explanation: '24 × 3 = (20 × 3) + (4 × 3) = 60 + 12 = 72。', encouragement: '答對了！你會用乘法計算。' },
  { id: 'meimei-mathematics-4', topic: '幾毫米', type: 'basic', title: '公分和毫米', instruction: '請進行公分和毫米的換算。', question: '3 公分 7 毫米等於幾毫米？', options: ['10 毫米', '30 毫米', '37 毫米', '307 毫米'], answer: 2, hint: '1 公分等於 10 毫米；先把 3 公分換成毫米，再加上 7 毫米。', explanation: '3 公分 = 3 × 10 = 30 毫米。再加上原本的 7 毫米，30 + 7 = 37 毫米。', encouragement: '答對了！你會進行長度單位換算。' },
  { id: 'meimei-mathematics-5', topic: '角、正方形和長方形', type: 'basic', title: '圖形的特徵', instruction: '請選出正確的圖形特徵。', question: '哪一個敘述正確？', options: ['正方形只有兩個直角。', '長方形的四條邊都一樣長。', '正方形的四條邊一樣長，而且四個角都是直角。', '長方形沒有直角。'], answer: 2, hint: '想一想正方形的邊和角各有什麼特徵。', explanation: '正方形有四條一樣長的邊，也有四個直角，所以第 3 個敘述正確。長方形也有四個直角，但不一定四邊都一樣長。', encouragement: '答對了！你能說出正方形的特徵。' },
  { id: 'meimei-mathematics-6', topic: '除法', type: 'application', title: '有餘數的除法', instruction: '請根據情境解決除法問題。', question: '26 顆糖果平分給 4 個人，每人分得幾顆？剩下幾顆？', options: ['6 顆，剩 2 顆', '6 顆，剩 4 顆', '7 顆，剩 2 顆', '7 顆，剩 0 顆'], answer: 0, hint: '找出 4 的乘法中最接近 26 且不超過 26 的數。', explanation: '4 × 6 = 24，26 - 24 = 2，所以每人分得 6 顆，還剩 2 顆。4 × 7 = 28，超過 26，不能分成每人 7 顆。', encouragement: '答對了！你會用除法處理分配問題。' },
];

test('Sprint 22 Mathematics banks contain exactly six approved units per student', () => {
  const jiejie = loadQuestions('jiejie-mathematics');
  const meimei = loadQuestions('meimei-mathematics');

  assert.deepEqual(plain(jiejie), expectedJiejie);
  assert.deepEqual(plain(meimei), expectedMeimei);
  assert.equal(new Set([...jiejie, ...meimei].map((question) => question.id)).size, 12);
  assert.equal(jiejie.every((question) => !Object.hasOwn(question, 'reviewGroupId')), true);
  assert.equal(meimei.every((question) => !Object.hasOwn(question, 'reviewGroupId')), true);
});

test('Sprint 22 Mathematics questions have unique valid answers and complete feedback', () => {
  for (const question of [...loadQuestions('jiejie-mathematics'), ...loadQuestions('meimei-mathematics')]) {
    assert.ok(question.options.length >= 2);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.ok(Number.isInteger(question.answer));
    assert.ok(question.answer >= 0 && question.answer < question.options.length);
    assert.ok(question.hint.length > 0);
    assert.ok(question.explanation.length > 0);
  }
});

test('Sprint 22 approved copy preserves the explicit math wording', () => {
  const jiejie = new Map(loadQuestions('jiejie-mathematics').map((question) => [question.id, question]));
  const meimei = new Map(loadQuestions('meimei-mathematics').map((question) => [question.id, question]));

  assert.match(jiejie.get('jiejie-mathematics-4').question, /π = 3\.14/);
  assert.match(jiejie.get('jiejie-mathematics-6').question, /圓心角 90°/);
  assert.match(meimei.get('meimei-mathematics-1').explanation, /0 個十/);
  assert.match(meimei.get('meimei-mathematics-2').explanation, /向百位進 1/);
  assert.equal(meimei.get('meimei-mathematics-6').question, '26 顆糖果平分給 4 個人，每人分得幾顆？剩下幾顆？');
});
