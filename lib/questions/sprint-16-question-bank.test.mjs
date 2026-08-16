import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadQuestions(modulePath) {
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

const approvedJiejieQuestions = [
  { id: 'jiejie-chinese-5', topic: '成語運用', type: 'basic', title: '成語填空', instruction: '根據句子的意思，選出最適合的成語。', question: '得知自己代表學校參加比賽後，小晴每天認真練習，絲毫不敢＿＿＿＿，希望能有最好的表現。', options: ['自暴自棄', '掉以輕心', '得意忘形', '隨遇而安'], answer: 1, hint: '她很重視比賽，沒有因為任何原因而放鬆或輕忽。', explanation: '「掉以輕心」指對事情採取輕率、不重視的態度。句中「絲毫不敢」表示小晴非常認真，因此最適合填入「掉以輕心」。', encouragement: '答對了！你能根據上下文判斷成語的用法。' },
  { id: 'jiejie-chinese-6', topic: '成語運用', type: 'application', title: '情境成語填空', instruction: '閱讀情境，選出最適合形容人物表現的成語。', question: '上臺報告前，小安準備了很久，但是一看到臺下坐滿觀眾，原本背得很熟的內容突然一句也想不起來。這時最適合用哪個成語形容他？', options: ['胸有成竹', '滔滔不絕', '張口結舌', '對答如流'], answer: 2, hint: '他原本準備充分，但緊張得一時說不出話。', explanation: '「張口結舌」形容因緊張、害怕或理屈而說不出話。小安面對觀眾突然忘詞，最符合這個情境。', encouragement: '很好！成語不只要知道意思，也要能放進正確的情境。' },
  { id: 'jiejie-chinese-7', topic: '錯別字辨識', type: 'basic', title: '找出錯別字', instruction: '找出句子中使用錯誤的詞語。', question: '「經過全班熱烈討論，我們終於達成共視，決定一起參加校慶活動。」哪一個詞語寫錯了？', options: ['熱烈', '討論', '共視', '校慶'], answer: 2, hint: '大家取得一致的意見，稱為達成「ㄍㄨㄥˋ ㄕˋ」。', explanation: '「共視」應寫成「共識」。「共識」表示共同的認識或一致的意見。', encouragement: '答對了！讀懂詞義能幫助你判斷正確用字。' },
  { id: 'jiejie-chinese-8', topic: '錯別字辨識', type: 'basic', title: '辨認正確用字', instruction: '找出句子中使用錯誤的詞語。', question: '「我們必須先分晰失敗的原因，才能找到改進的方法。」哪一個詞語寫錯了？', options: ['必須', '分晰', '原因', '改進'], answer: 1, hint: '這個詞表示把事情拆開研究，其中一個字和「解析」相同。', explanation: '「分晰」應寫成「分析」。「析」有分開、解析的意思，因此正確寫法是「分析」。', encouragement: '很好！你能分辨讀音相近但意思不同的字。' },
  { id: 'jiejie-chinese-9', topic: '錯別字辨識', type: 'application', title: '挑戰錯別字', instruction: '閱讀短文，找出使用錯誤的詞語。', question: '班級準備成果發表時，小芸寫下工作紀錄：「大家先蒐集資料，再仔細分析內容。遇到不同意見時，我們也會互相溝通、協調。雖然準備過程十分繁鎖，但大家仍按部就班完成工作。」哪一個詞語的用字有誤？', options: ['蒐集', '協調', '繁鎖', '按部就班'], answer: 2, hint: '這個詞形容事情繁雜、瑣碎；想想「瑣碎」使用的是哪一個字。', explanation: '「繁鎖」應寫成「繁瑣」。「瑣」有細小、零碎的意思，「繁瑣」用來形容事情繁雜而細碎。「鎖」則是鎖住、鎖頭的意思。', encouragement: '很棒！你能在較長的文章中運用字義找出錯別字。' },
];

const approvedMeimeiQuestions = [
  { id: 'meimei-chinese-6', topic: '詞語意思', type: 'basic', title: '詞語小偵探', instruction: '根據句子的意思，選出最接近「專心」的意思。', question: '上課時，小美「專心」聽老師說明，不和旁邊的同學聊天。「專心」是什麼意思？', options: ['心情很開心', '把心思集中在一件事情上', '動作非常快速', '一直想和別人說話'], answer: 1, hint: '想想小美為什麼沒有和旁邊的同學聊天。', explanation: '「專心」就是把注意力和心思集中在正在做的事情上。', encouragement: '答對了！你能從句子找到詞語的意思。' },
  { id: 'meimei-chinese-7', topic: '詞語意思', type: 'application', title: '從句子猜詞義', instruction: '閱讀情境，選出畫線詞語最適合的意思。', question: '弟弟第一次站上舞臺表演，看到臺下有這麼多人，他顯得十分「緊張」，兩隻手一直握得緊緊的。這裡的「緊張」最接近哪個意思？', options: ['因為擔心或害怕而心裡不安', '因為生氣而不想說話', '因為疲累而想睡覺', '因為高興而一直大笑'], answer: 0, hint: '注意「第一次上臺」、「很多人」和「手握得緊緊的」這些線索。', explanation: '從弟弟第一次上臺、看到很多觀眾，以及手握得緊緊的，可以知道這裡的「緊張」是因為擔心或害怕而感到不安。', encouragement: '很好！你會利用前後文來推測詞語的意思。' },
  { id: 'meimei-chinese-8', topic: '動作詞辨識', type: 'application', title: '選出正確的動作', instruction: '根據情境，選出最適合的動作詞。', question: '下課後，老師請小安把黑板上的字弄乾淨。小安拿起板擦，把黑板＿＿＿＿乾淨。', options: ['擦', '折', '踢', '捏'], answer: 0, hint: '想想板擦通常要怎麼使用。', explanation: '使用板擦把黑板上的字去除，最適合的動作詞是「擦」。', encouragement: '答對了！動作詞要和使用的物品搭配。' },
  { id: 'meimei-chinese-9', topic: '動作詞辨識', type: 'application', title: '哪個動作最適合', instruction: '根據句子的情境，選出最適合的動作詞。', question: '美術課時，老師請大家把黏土做成一顆圓圓的小球。小文把黏土放在手掌中輕輕地＿＿＿＿。', options: ['揉', '踩', '敲', '掃'], answer: 0, hint: '要讓柔軟的黏土慢慢變成圓球，需要用手反覆動作。', explanation: '「揉」是用手反覆搓動、按壓，很適合形容用手把黏土做成圓球的動作。', encouragement: '很棒！你能依照情境選出更精確的動作詞。' },
  { id: 'meimei-chinese-10', topic: '量詞運用', type: 'basic', title: '量詞配對', instruction: '選出最適合放入句子中的量詞。', question: '放學回家的路上，我看見一＿＿＿＿彩虹掛在天空中。', options: ['道', '顆', '本', '雙'], answer: 0, hint: '彩虹、光線等常使用同一個量詞。', explanation: '彩虹通常使用量詞「道」，所以應說「一道彩虹」。', encouragement: '答對了！你知道不同事物要搭配適合的量詞。' },
  { id: 'meimei-chinese-11', topic: '量詞運用', type: 'application', title: '量詞挑戰', instruction: '閱讀句子，選出量詞全部使用正確的選項。', question: '哪一句的量詞使用完全正確？', options: ['爸爸買了一「條」西瓜和兩「本」香蕉。', '桌上放著一「盞」檯燈和兩「本」故事書。', '池塘裡游著三「張」魚，旁邊開著一「頭」荷花。', '姐姐穿了一「把」外套，手上拿著一「雙」雨傘。'], answer: 1, hint: '一個一個檢查「檯燈」和「故事書」前面的量詞。', explanation: '「一盞檯燈」和「兩本故事書」的量詞都正確。其他選項中，西瓜、香蕉、魚、荷花、外套和雨傘的量詞都有不適合的地方。', encouragement: '太棒了！你能一次檢查兩個量詞是否使用正確。' },
];

test('Sprint 16 production banks contain the eleven human-approved objects exactly', () => {
  const jiejie = loadQuestions(new URL('./jiejie-chinese.ts', import.meta.url));
  const meimei = loadQuestions(new URL('./meimei-chinese.ts', import.meta.url));
  const byId = new Map([...jiejie, ...meimei].map((question) => [question.id, plain(question)]));

  for (const question of [...approvedJiejieQuestions, ...approvedMeimeiQuestions]) {
    assert.deepEqual(byId.get(question.id), question);
    assert.equal(Object.hasOwn(byId.get(question.id), 'reviewGroupId'), false);
  }
});

test('Sprint 16 coverage uses five active topics while retaining JieJie legacy topics', () => {
  const jiejie = loadQuestions(new URL('./jiejie-chinese.ts', import.meta.url));
  const meimei = loadQuestions(new URL('./meimei-chinese.ts', import.meta.url));
  const unitsFor = (questions, topic) => new Set(questions.filter((question) => question.topic === topic).map((question) => question.reviewGroupId ?? question.id)).size;

  assert.equal(jiejie.length, 9);
  assert.equal(meimei.length, 11);
  assert.deepEqual(plain({
    成語運用: unitsFor(jiejie, '成語運用'),
    錯別字辨識: unitsFor(jiejie, '錯別字辨識'),
    詞語意思: unitsFor(meimei, '詞語意思'),
    動作詞辨識: unitsFor(meimei, '動作詞辨識'),
    量詞運用: unitsFor(meimei, '量詞運用'),
    注音辨識: unitsFor(jiejie, '注音辨識'),
    部首辨識: unitsFor(jiejie, '部首辨識'),
  }), { 成語運用: 2, 錯別字辨識: 3, 詞語意思: 3, 動作詞辨識: 3, 量詞運用: 3, 注音辨識: 1, 部首辨識: 1 });
  assert.equal(new Set([...jiejie, ...meimei].map((question) => question.reviewGroupId ?? question.id)).size, 16);
});
