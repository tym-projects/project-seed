import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadQuestions(file) {
  const modulePath = new URL(`./${file}`, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports.questions;
}

const expected = [
  {
    bank: 'jiejie-mathematics.ts',
    id: 'jiejie-mathematics-10', topic: '質因數分解和短除法', type: 'basic', title: '短除法第一步', instruction: '請選出最適合的第一個除數。',
    question: '用短除法分解 60，第一個除數選哪一個最適合？', options: ['2', '4', '6', '9'], answer: 0,
    hint: '先找能整除 60 的最小質數。', explanation: '60 是偶數，可先除以質數 2；短除法每一步使用質數因數。60÷2=30；4、6 不是質數，9 不能整除 60。', encouragement: '答對了！你會找出短除法的第一個質數因數。',
  },
  {
    bank: 'jiejie-mathematics.ts',
    id: 'jiejie-mathematics-11', topic: '分數的除法', type: 'application', title: '分數平分緞帶', instruction: '請解決分數除法的生活問題。',
    question: '一條長 3/4 公尺的緞帶，平均分成 3 段，每段長幾公尺？', options: ['1/4', '1/2', '3/7', '9/4'], answer: 0,
    hint: '把 3/4 平分成 3 份，就是 3/4 ÷ 3。', explanation: '3/4 ÷ 3 = 3/4 × 1/3 = 1/4 公尺；1/4×3=3/4。', encouragement: '答對了！你能用分數除法解決平分問題。',
  },
  {
    bank: 'jiejie-mathematics.ts',
    id: 'jiejie-mathematics-12', topic: '小數的除法', type: 'application', title: '小數除法剪繩', instruction: '請解決小數除法的生活問題。',
    question: '一條 6.4 公尺的繩子，每 0.8 公尺剪成一段，可以剪成幾段？', options: ['0.8', '8', '80', '5.6'], answer: 1,
    hint: '計算 6.4 ÷ 0.8，先把除數變成整數。', explanation: '6.4 ÷ 0.8 = 64 ÷ 8 = 8 段；0.8×8=6.4。', encouragement: '答對了！你能用小數除法解決分段問題。',
  },
  {
    bank: 'jiejie-mathematics.ts',
    id: 'jiejie-mathematics-13', topic: '圓周長和圓面積', type: 'application', title: '由直徑求圓周長', instruction: '請計算圓的周長。',
    question: '一個圓的直徑是 10 公分，π 取 3.14，圓周長是多少？', options: ['15.7 公分', '31.4 公分', '62.8 公分', '100 公分'], answer: 1,
    hint: '圓周長可用直徑 × π。', explanation: '10×3.14=31.4 公分；15.7 是半徑 5 乘 π，62.8 是正解兩倍，100 不符合公式。', encouragement: '答對了！你會由直徑求出圓周長。',
  },
  {
    bank: 'jiejie-natural-science.ts',
    id: 'jiejie-natural-science-9', topic: '探索天氣的變化', type: 'basic', title: '水氣遇冷凝結', instruction: '請判斷水氣遇冷後的變化。',
    question: '下列哪一項最能說明空氣中的水氣遇冷後可能發生的變化？', options: ['凝結成小水滴', '變成砂糖', '消失成土壤', '變成聲音'], answer: 0,
    hint: '想想冷玻璃外的小水滴從哪裡來。', explanation: '水氣遇冷可能凝結成小水滴，形成霧或雲的一部分；其餘不是水氣遇冷的變化。', encouragement: '答對了！你能判斷水氣遇冷的變化。',
  },
  {
    bank: 'jiejie-natural-science.ts',
    id: 'jiejie-natural-science-10', topic: '水溶液', type: 'basic', title: '比較水溶液導電性', instruction: '請選出公平比較實驗的方法。',
    question: '若要比較兩種水溶液是否容易導電，哪一種做法最公平？', options: ['使用不同體積且不記錄濃度', '使用相同裝置與相同體積，再比較結果', '只看顏色猜測', '只測其中一杯一次且不記錄'], answer: 1,
    hint: '公平比較要固定哪些條件？', explanation: '相同裝置與體積等條件能減少其他因素影響，才較能比較水溶液差異。', encouragement: '答對了！你知道公平比較實驗要控制條件。',
  },
  {
    bank: 'jiejie-social-studies.ts',
    id: 'jiejie-social-studies-7', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '家庭角色變遷', instruction: '請選出符合現代家庭分工的說法。',
    question: '下列哪一項最符合現代家庭分工的觀念？', options: ['家事只能由女性負責', '家庭成員可依能力、時間與需要協調分工', '只有收入最高者能決定所有事', '小孩完全不能參與家庭工作'], answer: 1,
    hint: '分工應看需要，不應只用性別決定。', explanation: '家庭角色會隨社會變遷調整，成員可協調分工並共同承擔責任。', encouragement: '答對了！你了解家庭分工可以一起協調。',
  },
  {
    bank: 'jiejie-social-studies.ts',
    id: 'jiejie-social-studies-8', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '個人興趣與發展', instruction: '請判斷尊重個人發展的做法。',
    question: '同學對未來興趣不同，哪一種做法最符合個人發展的學習？', options: ['要求所有人選同一興趣', '依自己的興趣與能力探索，並尊重別人的選擇', '只以別人的成績決定方向', '因為不同就不合作'], answer: 1,
    hint: '個人發展可以有差異，也要尊重他人。', explanation: '個人可有多元發展選擇，探索自我不等於否定他人。', encouragement: '答對了！你能尊重自己和別人的發展選擇。',
  },
  {
    bank: 'jiejie-social-studies.ts',
    id: 'jiejie-social-studies-9', topic: '族群交流如何影響臺灣社會？', type: 'basic', title: '文化形成背景', instruction: '請選出有助於理解文化背景的資料。',
    question: '要了解一項族群文化活動，哪一項資料最有助於理解它的背景？', options: ['只看活動名稱', '了解生活環境、歷史交流與活動意義', '只用自己的習慣判斷', '以一句刻板印象概括所有人'], answer: 1,
    hint: '文化特色通常和哪些背景有關？', explanation: '理解環境、歷史與交流能避免只看表面或刻板化。', encouragement: '答對了！你能從背景理解文化特色。',
  },
  {
    bank: 'jiejie-social-studies.ts',
    id: 'jiejie-social-studies-10', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '文化交流與尊重', instruction: '請選出適合介紹文化的說法。',
    question: '介紹不同族群的飲食文化時，哪一種說法最合適？', options: ['每個族群的人都一定吃同樣的食物', '只比較誰的文化比較好', '說明文化交流形成的特色，也尊重同一族群內的差異', '不查資料只靠印象'], answer: 2,
    hint: '介紹文化要同時做到理解與尊重。', explanation: '文化交流可能形成新特色，但不能把單一例子說成所有人的共同特徵。', encouragement: '答對了！你能理解文化交流並尊重差異。',
  },
  {
    bank: 'meimei-mathematics.ts',
    id: 'meimei-mathematics-11', topic: '數到 10000', type: 'basic', title: '錢幣與數值', instruction: '請計算錢幣代表的總數。',
    question: '有 3 張 100 元、2 個 10 元和 5 個 1 元，合起來是多少元？', options: ['325 元', '352 元', '3052 元', '235 元'], answer: 0,
    hint: '分別算百元、十元和一元，再相加。', explanation: '300+20+5=325 元。', encouragement: '答對了！你會用位值概念計算錢幣總數。',
  },
  {
    bank: 'meimei-mathematics.ts',
    id: 'meimei-mathematics-12', topic: '四位數的加減', type: 'basic', title: '四位數加法估算', instruction: '請選出合理的估算結果。',
    question: '398＋205 大約是多少？', options: ['約 500', '約 600', '約 700', '約 800'], answer: 1,
    hint: '把數字估成容易計算的整百數。', explanation: '398 約 400、205 約 200，400+200 約 600。', encouragement: '答對了！你能用估算快速判斷答案範圍。',
  },
  {
    bank: 'meimei-social-studies.ts',
    id: 'meimei-social-studies-7', topic: '我和我的家人', type: 'basic', title: '家庭組成多樣性', instruction: '請選出對家庭的合適理解。',
    question: '下列哪一項最適合說明家庭的樣子？', options: ['每個家庭成員數量都一樣', '家庭組成可能不同，但都可以互相照顧與合作', '只有和自己同住的人才算家人', '家庭一定要有相同職業'], answer: 1,
    hint: '想想不同家庭可能有哪些成員。', explanation: '家庭組成與生活方式可能不同，成員仍可互相照顧與合作。', encouragement: '答對了！你知道不同家庭都能互相照顧。',
  },
  {
    bank: 'meimei-social-studies.ts',
    id: 'meimei-social-studies-8', topic: '我和我的家人', type: 'application', title: '自己的家庭責任', instruction: '請選出適合的家庭責任做法。',
    question: '小安要整理自己的書包，哪一種做法最符合家庭與自己的責任？', options: ['把所有物品交給家人整理', '先自己整理，再在需要時請家人協助', '故意把物品丟在地上', '說謊表示已經整理好'], answer: 1,
    hint: '自己的事情可以先怎麼做？', explanation: '先負責自己的物品，遇到需要時再尋求協助，是合作而非推卸責任。', encouragement: '答對了！你會先負責自己的事情，也知道何時求助。',
  },
];

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('Sprint 32 ready candidates are present with exact approved content', () => {
  const byBank = new Map();
  for (const item of expected) {
    if (!byBank.has(item.bank)) byBank.set(item.bank, loadQuestions(item.bank));
    const actual = byBank.get(item.bank).find(({ id }) => id === item.id);
    assert.ok(actual, `missing ${item.id}`);
    const expectedQuestion = Object.fromEntries(
      Object.entries(item).filter(([key]) => key !== 'bank'),
    );
    assert.deepEqual(plain(actual), expectedQuestion);
  }
});

test('Sprint 32 ready candidates are unique singleton questions', () => {
  const ids = expected.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length);
  const byBank = new Map();
  for (const item of expected) {
    if (!byBank.has(item.bank)) byBank.set(item.bank, loadQuestions(item.bank));
    const actual = byBank.get(item.bank).find(({ id }) => id === item.id);
    assert.equal(Object.hasOwn(actual, 'reviewGroupId'), false);
    assert.equal(actual.options.length, 4);
    assert.equal(new Set(actual.options).size, 4);
    assert.ok(actual.hint.trim());
    assert.ok(actual.explanation.trim());
    assert.ok(Number.isInteger(actual.answer) && actual.answer >= 0 && actual.answer < 4);
  }
});
