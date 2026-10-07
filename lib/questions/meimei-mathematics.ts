import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export const questions: QuestionCardQuestion[] = [
  {
    id: 'meimei-mathematics-1',
    topic: '數到 10000',
    type: 'basic',
    title: '位值分解',
    instruction: '請選出正確的位值分解。',
    question: '3407 的位值分解是哪一個？',
    options: ['3000 + 400 + 7', '3000 + 40 + 7', '300 + 400 + 7', '3000 + 400 + 70'],
    answer: 0,
    hint: '看千位、百位、十位和個位；3407 的十位有幾個？',
    explanation: '3407 有 3 個千、4 個百、0 個十和 7 個一，所以 3407 = 3000 + 400 + 7。',
    encouragement: '答對了！你會看數字的位值。',
  },
  {
    id: 'meimei-mathematics-2',
    topic: '四位數的加減',
    type: 'basic',
    title: '四位數的加法',
    instruction: '請計算四位數的加法。',
    question: '計算：3482 + 2157 = ？',
    options: ['5539', '5639', '5739', '5839'],
    answer: 1,
    hint: '可以從個位開始直式相加，滿十要進位。',
    explanation: '個位 2＋7＝9；十位 8＋5＝13，寫 3、向百位進 1；百位 4＋1＋1＝6；千位 3＋2＝5；所以答案為 5639。',
    encouragement: '答對了！你會正確完成四位數加法。',
  },
  {
    id: 'meimei-mathematics-3',
    topic: '乘法',
    type: 'basic',
    title: '乘法計算',
    instruction: '請計算乘法。',
    question: '計算：24 × 3 = ？',
    options: ['62', '72', '82', '92'],
    answer: 1,
    hint: '可以把 24 看成 20 和 4，再分別乘以 3。',
    explanation: '24 × 3 = (20 × 3) + (4 × 3) = 60 + 12 = 72。',
    encouragement: '答對了！你會用乘法計算。',
  },
  {
    id: 'meimei-mathematics-4',
    topic: '幾毫米',
    type: 'basic',
    title: '公分和毫米',
    instruction: '請進行公分和毫米的換算。',
    question: '3 公分 7 毫米等於幾毫米？',
    options: ['10 毫米', '30 毫米', '37 毫米', '307 毫米'],
    answer: 2,
    hint: '1 公分等於 10 毫米；先把 3 公分換成毫米，再加上 7 毫米。',
    explanation: '3 公分 = 3 × 10 = 30 毫米。再加上原本的 7 毫米，30 + 7 = 37 毫米。',
    encouragement: '答對了！你會進行長度單位換算。',
  },
  {
    id: 'meimei-mathematics-5',
    topic: '角、正方形和長方形',
    type: 'basic',
    title: '圖形的特徵',
    instruction: '請選出正確的圖形特徵。',
    question: '哪一個敘述正確？',
    options: ['正方形只有兩個直角。', '長方形的四條邊都一樣長。', '正方形的四條邊一樣長，而且四個角都是直角。', '長方形沒有直角。'],
    answer: 2,
    hint: '想一想正方形的邊和角各有什麼特徵。',
    explanation: '正方形有四條一樣長的邊，也有四個直角，所以第 3 個敘述正確。長方形也有四個直角，但不一定四邊都一樣長。',
    encouragement: '答對了！你能說出正方形的特徵。',
  },
  {
    id: 'meimei-mathematics-6',
    topic: '除法',
    type: 'application',
    title: '有餘數的除法',
    instruction: '請根據情境解決除法問題。',
    question: '26 顆糖果平分給 4 個人，每人分得幾顆？剩下幾顆？',
    options: ['6 顆，剩 2 顆', '6 顆，剩 4 顆', '7 顆，剩 2 顆', '7 顆，剩 0 顆'],
    answer: 0,
    hint: '找出 4 的乘法中最接近 26 且不超過 26 的數。',
    explanation: '4 × 6 = 24，26 - 24 = 2，所以每人分得 6 顆，還剩 2 顆。4 × 7 = 28，超過 26，不能分成每人 7 顆。',
    encouragement: '答對了！你會用除法處理分配問題。',
  },
  {
    id: 'meimei-mathematics-7',
    topic: '數到 10000',
    type: 'basic',
    title: '四位數大小比較',
    instruction: '請比較四位數的大小。',
    question: '下面哪一個數最大？',
    options: ['4070', '4700', '4077', '4007'],
    answer: 1,
    hint: '先比較千位，再比較百位。',
    explanation: '四個數的千位都為 4，接著比較百位；4700 的百位是 7，其他數的百位較小，所以 4700 最大。',
    encouragement: '答對了！你會比較四位數的大小。',
  },
  {
    id: 'meimei-mathematics-8',
    topic: '四位數的加減',
    type: 'basic',
    title: '四位數的減法',
    instruction: '請計算四位數的減法。',
    question: '計算：5000 − 2768 = ？',
    options: ['2132', '2232', '2332', '2432'],
    answer: 1,
    hint: '用直式從個位開始，遇到不夠減時要向前一位借 1。',
    explanation: '5000 − 2768：個位 10−8=2；十位借位後 9−6=3；百位借位後 9−7=2；千位 4−2=2，所以答案是 2232。',
    encouragement: '答對了！你會完成四位數退位減法。',
  },
  {
    id: 'meimei-mathematics-9',
    topic: '乘法',
    type: 'basic',
    title: '三位數乘一位數',
    instruction: '請計算乘法。',
    question: '計算：306 × 4 = ？',
    options: ['1024', '1124', '1224', '1324'],
    answer: 2,
    hint: '可以分成 300 × 4、0 × 4 和 6 × 4 再相加。',
    explanation: '306 × 4 = 300 × 4 + 0 × 4 + 6 × 4 = 1200 + 0 + 24 = 1224。',
    encouragement: '答對了！你會用位值分解完成乘法。',
  },
  {
    id: 'meimei-mathematics-10',
    topic: '幾毫米',
    type: 'application',
    title: '公分和毫米相加',
    instruction: '請計算長度的總和。',
    question: '一條彩帶長 6 公分 4 毫米，另一條長 2 公分 9 毫米，合起來長幾公分幾毫米？',
    options: ['8 公分 3 毫米', '8 公分 7 毫米', '9 公分 3 毫米', '9 公分 7 毫米'],
    answer: 2,
    hint: '先分別把公分和毫米相加；10 毫米可以換成 1 公分。',
    explanation: '公分：6+2=8；毫米：4+9=13 毫米，也就是 1 公分 3 毫米，所以總長是 9 公分 3 毫米。',
    encouragement: '答對了！你會計算公分和毫米的長度。',
  },
  {
    id: 'meimei-mathematics-11', topic: '數到 10000', type: 'basic', title: '錢幣與數值', instruction: '請計算錢幣代表的總數。',
    question: '有 3 張 100 元、2 個 10 元和 5 個 1 元，合起來是多少元？', options: ['325 元', '352 元', '3052 元', '235 元'], answer: 0,
    hint: '分別算百元、十元和一元，再相加。', explanation: '300+20+5=325 元。', encouragement: '答對了！你會用位值概念計算錢幣總數。',
  },
  {
    id: 'meimei-mathematics-12', topic: '四位數的加減', type: 'basic', title: '四位數加法估算', instruction: '請選出合理的估算結果。',
    question: '398＋205 大約是多少？', options: ['約 500', '約 600', '約 700', '約 800'], answer: 1,
    hint: '把數字估成容易計算的整百數。', explanation: '398 約 400、205 約 200，400+200 約 600。', encouragement: '答對了！你能用估算快速判斷答案範圍。',
  },
  {
    id: 'meimei-mathematics-13', topic: '數到 10000', type: 'basic', title: '位值與數的比較', instruction: '請選出符合條件的數。',
    question: '下列哪個數最接近 5000，且比 5000 小？', options: ['5010', '4990', '5900', '490'], answer: 1,
    hint: '先找比 5000 小的數，再比較差多少。', explanation: '4990 比 5000 少 10，是選項中最接近且小於 5000 的數。', encouragement: '答對了！你會比較數字和 5000 的差距。',
  },
  {
    id: 'meimei-mathematics-14', topic: '乘法', type: 'application', title: '乘法意義與情境', instruction: '請用乘法解決問題。',
    question: '每盒有 6 枝彩色筆，買 4 盒共有幾枝？', options: ['10', '18', '24', '46'], answer: 2,
    hint: '把 6 個重複 4 次，可以用哪個乘法？', explanation: '6 × 4 = 24，表示 4 盒、每盒 6 枝。', encouragement: '答對了！你能用乘法表示重複的數量。',
  },
  {
    id: 'meimei-mathematics-15', topic: '幾毫米', type: 'application', title: '公分與毫米換算', instruction: '請計算長度的總和。',
    question: '一條緞帶長 5 公分 6 毫米，又接上 2 公分 8 毫米，合起來是多少？', options: ['7 公分 14 毫米', '8 公分 4 毫米', '8 公分 14 毫米', '7 公分 4 毫米'], answer: 3,
    hint: '10 毫米等於 1 公分，先把毫米合起來再進位。', explanation: '6+8=14 毫米 = 1 公分 4 毫米，再加 5+2+1=8 公分，所以是 8 公分 4 毫米。', encouragement: '答對了！你會在長度相加時進行換算。',
  },
  {
    id: 'meimei-mathematics-16', topic: '四位數的加減', type: 'application', title: '四位數兩步驟應用', instruction: '請用加法和減法解決問題。',
    question: '書店上午收到 2356 本書，下午又收到 1789 本，當天送出 204 本。現在還剩下幾本？', options: ['3941 本', '3737 本', '4145 本', '1843 本'], answer: 0,
    hint: '先把兩次收到的書相加，再減去送出的數量。', explanation: '先算 2356 + 1789 = 4145，再算 4145 − 204 = 3941，所以還剩 3941 本。', encouragement: '答對了！你能用兩步驟完成四位數加減。',
  },
  {
    id: 'meimei-mathematics-17', topic: '乘法', type: 'application', title: '分組數量兩步驟', instruction: '請根據分組情境計算總數。',
    question: '第一種餅乾有 3 盒，每盒 24 片；第二種餅乾有 2 盒，每盒 15 片。兩種餅乾共有幾片？', options: ['72 片', '78 片', '120 片', '102 片'], answer: 3,
    hint: '先算兩種餅乾各有幾片，再把兩個結果相加。', explanation: '第一種有 3 × 24 = 72 片，第二種有 2 × 15 = 30 片；72 + 30 = 102 片。', encouragement: '答對了！你能用乘法和加法整理兩組數量。',
  },
];

const sprint37Questions: QuestionCardQuestion[] = Array.from({ length: 43 }, (_, offset) => {
  const index = offset + 18;
  const type = offset < 14 ? 'basic' : 'application';
  const answer = offset % 4;
  const unit = offset % 4;
  let topic: string; let title: string; let question: string; let correct: string; let wrongs: string[]; let hint: string; let explanation: string;
  if (unit === 0) {
    const [a, b] = [[2345, 678], [4000, 1256], [3078, 942], [1560, 785], [2890, 1345], [5000, 2768], [4217, 899], [3605, 1777], [1980, 965], [2754, 1288], [6320, 2456]][Math.floor(offset / 4) % 11];
    const result = a + b; topic = '數到10000'; title = '四位數加法'; question = `文具店上午有 ${a} 枝鉛筆，下午又進貨 ${b} 枝，現在共有幾枝？`; correct = String(result); wrongs = [String(result - 100), String(result + b), String(a - b)]; hint = '把千位、百位、十位和個位分別相加，注意進位。'; explanation = `${a} + ${b} = ${result}，所以現在共有 ${result} 枝鉛筆。`;
  } else if (unit === 1) {
    const [a, b] = [[4000, 1256], [3078, 942], [1560, 785], [2890, 1345], [5000, 2768], [4217, 899], [3605, 1777], [1980, 965], [2754, 1288], [6320, 2456], [7100, 3688]][Math.floor(offset / 4) % 11];
    const result = a - b; topic = '四位數的加減'; title = '四位數減法'; question = `倉庫有 ${a} 個紙箱，送出 ${b} 個後還剩幾個？`; correct = String(result); wrongs = [String(result + 100), String(a + b), String(b - a)]; hint = '先確認原來有多少和用掉多少，再用減法計算。'; explanation = `${a} - ${b} = ${result}，所以還剩 ${result} 個紙箱。`;
  } else if (unit === 2) {
    const [a, b] = [[23, 4], [16, 5], [32, 3], [24, 6], [15, 7], [42, 2], [18, 5], [27, 3], [34, 2], [19, 4], [25, 6]][Math.floor(offset / 4) % 11];
    const result = a * b; topic = '乘法'; title = '乘法情境'; question = `每排有 ${a} 顆珠子，排成 ${b} 排，一共有幾顆？`; correct = String(result); wrongs = [String(result + a), String(result - b), String(a + b)]; hint = '每排一樣多，可以用乘法表示。'; explanation = `${a} × ${b} = ${result}，所以一共有 ${result} 顆珠子。`;
  } else {
    const [cm, mm] = [[3, 4], [5, 6], [7, 8], [9, 4], [12, 5], [15, 7], [2, 9], [6, 8], [11, 3], [14, 6]][Math.floor(offset / 4) % 10];
    const result = cm * 10 + mm; topic = '幾毫米'; title = '公分和毫米換算'; question = `${cm} 公分又 ${mm} 毫米合起來是幾毫米？`; correct = `${result} 毫米`; wrongs = [`${cm + mm} 毫米`, `${cm * 100 + mm} 毫米`, `${result + 10} 毫米`]; hint = '1 公分等於 10 毫米。'; explanation = `${cm} 公分是 ${cm * 10} 毫米，再加上 ${mm} 毫米，共 ${result} 毫米。`;
  }
  const options = [...new Set([correct, ...wrongs])];
  while (options.length < 4) options.push(`其他可能結果 ${options.length}`);
  const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `meimei-mathematics-${index}`, topic, type, title, instruction: '請選出正確的計算結果。', question, options, answer, hint, explanation, encouragement: '答對了！你能把計算方法用在生活情境中。' };
});
questions.push(...sprint37Questions);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sprint38QuestionModule = typeof require === 'function' ? require('./sprint38-question-additions') : undefined;
const sprint38QuestionsByBank = (sprint38QuestionModule?.sprint38QuestionsByBank ?? {}) as Record<string, QuestionCardQuestion[]>;
questions.push(...(sprint38QuestionsByBank['meimei/mathematics'] ?? []));
