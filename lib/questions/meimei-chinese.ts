import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export const questions: QuestionCardQuestion[] = [
  {
    id: 'meimei-chinese-1',
    reviewGroupId: 'meimei-chinese-gaoxing-meaning',
    topic: '詞語意思',
    type: 'basic',
    title: '詞語意思',
    instruction: '請選出和題目意思最接近的詞語。',
    question: '「高興」和下面哪一個詞語意思最接近？',
    options: ['快樂', '難過', '安靜'],
    answer: 0,
    hint: '想想哪個詞也可以表示心情愉快。',
    explanation: '「高興」和「快樂」都表示心情愉快，所以意思最接近；「難過」表示心情不好，「安靜」則是描述聲音或行為的狀態。',
    encouragement: '答對了！你知道詞語的意思。',
  },
  {
    id: 'meimei-chinese-2',
    reviewGroupId: 'meimei-chinese-action-word-identification',
    topic: '動作詞辨識',
    type: 'application',
    title: '認識動作詞',
    instruction: '請找出句子中表示動作的詞語。',
    question: '「小明把書放在書包裡。」哪一個詞語表示動作？',
    options: ['小明', '放', '書包'],
    answer: 1,
    hint: '找出小明正在做的事情，不是做事的人或放東西的地方。',
    explanation: '「放」表示把書放到書包裡的動作；「小明」是做動作的人，「書包」是放書的地方。',
    encouragement: '答對了！你找到動作詞了。',
  },
  {
    id: 'meimei-chinese-3',
    topic: '量詞運用',
    type: 'application',
    title: '量詞練習',
    instruction: '請選出最適合的量詞。',
    question: '一（　）鉛筆',
    options: ['本', '枝', '條'],
    answer: 1,
    explanation: '細長的鉛筆常用「枝」來計算。',
    encouragement: '答對了！量詞用得很正確。',
  },
  {
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
  },
  {
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
  },
  {
    id: 'meimei-chinese-6', topic: '詞語意思', type: 'basic', title: '詞語小偵探', instruction: '根據句子的意思，選出最接近「專心」的意思。', question: '上課時，小美「專心」聽老師說明，不和旁邊的同學聊天。「專心」是什麼意思？', options: ['心情很開心', '把心思集中在一件事情上', '動作非常快速', '一直想和別人說話'], answer: 1, hint: '想想小美為什麼沒有和旁邊的同學聊天。', explanation: '「專心」就是把注意力和心思集中在正在做的事情上。', encouragement: '答對了！你能從句子找到詞語的意思。',
  },
  {
    id: 'meimei-chinese-7', topic: '詞語意思', type: 'application', title: '從句子猜詞義', instruction: '閱讀情境，選出畫線詞語最適合的意思。', question: '弟弟第一次站上舞臺表演，看到臺下有這麼多人，他顯得十分「緊張」，兩隻手一直握得緊緊的。這裡的「緊張」最接近哪個意思？', options: ['因為擔心或害怕而心裡不安', '因為生氣而不想說話', '因為疲累而想睡覺', '因為高興而一直大笑'], answer: 0, hint: '注意「第一次上臺」、「很多人」和「手握得緊緊的」這些線索。', explanation: '從弟弟第一次上臺、看到很多觀眾，以及手握得緊緊的，可以知道這裡的「緊張」是因為擔心或害怕而感到不安。', encouragement: '很好！你會利用前後文來推測詞語的意思。',
  },
  {
    id: 'meimei-chinese-8', topic: '動作詞辨識', type: 'application', title: '選出正確的動作', instruction: '根據情境，選出最適合的動作詞。', question: '下課後，老師請小安把黑板上的字弄乾淨。小安拿起板擦，把黑板＿＿＿＿乾淨。', options: ['擦', '折', '踢', '捏'], answer: 0, hint: '想想板擦通常要怎麼使用。', explanation: '使用板擦把黑板上的字去除，最適合的動作詞是「擦」。', encouragement: '答對了！動作詞要和使用的物品搭配。',
  },
  {
    id: 'meimei-chinese-9', topic: '動作詞辨識', type: 'application', title: '哪個動作最適合', instruction: '根據句子的情境，選出最適合的動作詞。', question: '美術課時，老師請大家把黏土做成一顆圓圓的小球。小文把黏土放在手掌中輕輕地＿＿＿＿。', options: ['揉', '踩', '敲', '掃'], answer: 0, hint: '要讓柔軟的黏土慢慢變成圓球，需要用手反覆動作。', explanation: '「揉」是用手反覆搓動、按壓，很適合形容用手把黏土做成圓球的動作。', encouragement: '很棒！你能依照情境選出更精確的動作詞。',
  },
  {
    id: 'meimei-chinese-10', topic: '量詞運用', type: 'basic', title: '量詞配對', instruction: '選出最適合放入句子中的量詞。', question: '放學回家的路上，我看見一＿＿＿＿彩虹掛在天空中。', options: ['道', '顆', '本', '雙'], answer: 0, hint: '彩虹、光線等常使用同一個量詞。', explanation: '彩虹通常使用量詞「道」，所以應說「一道彩虹」。', encouragement: '答對了！你知道不同事物要搭配適合的量詞。',
  },
  {
    id: 'meimei-chinese-11', topic: '量詞運用', type: 'application', title: '量詞挑戰', instruction: '閱讀句子，選出量詞全部使用正確的選項。', question: '哪一句的量詞使用完全正確？', options: ['爸爸買了一「條」西瓜和兩「本」香蕉。', '桌上放著一「盞」檯燈和兩「本」故事書。', '池塘裡游著三「張」魚，旁邊開著一「頭」荷花。', '姐姐穿了一「把」外套，手上拿著一「雙」雨傘。'], answer: 1, hint: '一個一個檢查「檯燈」和「故事書」前面的量詞。', explanation: '「一盞檯燈」和「兩本故事書」的量詞都正確。其他選項中，西瓜、香蕉、魚、荷花、外套和雨傘的量詞都有不適合的地方。', encouragement: '太棒了！你能一次檢查兩個量詞是否使用正確。',
  },
  {
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
  },
  {
    id: 'meimei-chinese-13', topic: '第參單元句序理解', type: 'application', title: '排列事情順序', instruction: '請依照合理的時間順序排列事情。',
    question: '請依照合理的時間順序排列下面四件事：甲、前一天晚上，先看課表，把隔天要用的課本放進書包。乙、早上起床後，刷牙洗臉並換好衣服。丙、吃完早餐，再檢查書包和水壺。丁、比平常早五分鐘出門，準時到校。', options: ['乙 → 丙 → 甲 → 丁', '丁 → 甲 → 乙 → 丙', '甲 → 乙 → 丙 → 丁', '丙 → 乙 → 甲 → 丁'], answer: 2,
    hint: '先找出發生在「前一天晚上」的事情，再依早上的先後排列。', explanation: '甲發生在前一天晚上；乙是早上起床後；丙是在吃完早餐後；丁是最後出門到校，因此順序是甲、乙、丙、丁。', encouragement: '答對了！你能排出事情發生的順序。',
  },
  {
    id: 'meimei-chinese-14', topic: '第肆單元因果理解', type: 'application', title: '讀懂事情原因', instruction: '閱讀短文後回答問題。',
    question: '媽媽把水壺放在爐子上加熱。過了一會兒，小安看到壺口冒出白白的熱氣，媽媽立刻把火關小，並提醒他不要靠近壺口。小安聽完後退到一旁，等媽媽把水壺移開。媽媽為什麼提醒小安不要靠近壺口？', options: ['因為水壺裡沒有水了。', '因為小安要把水壺搬走。', '因為水已經變成冰塊。', '因為壺口附近很熱，靠近可能被燙傷。'], answer: 3,
    hint: '找找看媽媽看到什麼之後，做了什麼提醒。', explanation: '短文寫到水壺加熱後壺口冒出熱氣，媽媽隨即提醒他不要靠近；由這些因果線索可以知道壺口附近很熱，靠近可能被燙傷。', encouragement: '很好！你能從短文找出事情的原因。',
  },
  {
    id: 'meimei-chinese-15', topic: '第伍單元短文關鍵訊息', type: 'application', title: '找出短文重點', instruction: '閱讀短文後回答問題。',
    question: '小芸發現鉛筆盒裡沒有紅色鉛筆，便先看看美術課的課表，再向同學借用一枝。下課前，她把鉛筆還回去，並把需要的用品寫在紙條上。從短文可以知道小芸怎麼做？',
    options: ['她先確認需要，再想辦法準備並記下提醒。', '她把同學的鉛筆留下來自己使用。', '她不在意上課需要什麼用品。', '她只在下課後才知道今天有美術課。'], answer: 0,
    hint: '注意她先查看什麼、接著怎麼處理，最後又做了什麼。', explanation: '小芸先看課表確認需求，暫時借用用品並歸還，最後寫下提醒，因此可以知道她會先確認需要，再準備並記錄。', encouragement: '答對了！你能找出短文中的重要做法。',
  },
  {
    id: 'meimei-chinese-16', topic: '第陸單元因果推論', type: 'application', title: '推論事情原因', instruction: '閱讀短文後回答問題。',
    question: '放學時，天空突然下起大雨，小安看到地上積水，便把雨傘撐好，沿著騎樓慢慢走回家。從短文可以知道他為什麼這樣做？',
    options: ['他想把雨傘留在學校。', '他想減少被雨淋濕，也注意積水避免滑倒。', '他認為放學後一定不能回家。', '他想讓積水變成乾燥的地面。'], answer: 1,
    hint: '把「下大雨」「撐傘」和「慢慢走」三個線索連起來。', explanation: '下大雨時撐傘能減少被雨淋濕，看到積水後慢慢走也能降低滑倒的機會；這兩個行動都有短文線索支持。', encouragement: '很好！你能根據多個線索推想行動原因。',
  },
];

const sprint37Questions: QuestionCardQuestion[] = Array.from({ length: 44 }, (_, offset) => {
  const index = offset + 17;
  const type = offset < 14 ? 'basic' : 'application';
  const answer = offset % 4;
  const lessons = ['時間是什麼', '妙用便利貼', '提早五分鐘', '水滾了', '為梨花撐傘', '小鉛筆大學問'];
  const cases = [
    ['小安看到明天要交閱讀紀錄，今天先把書放進書包，再在紙上寫下完成時間。', '先確認任務並提早準備，能減少忘記或匆忙的情況。'],
    ['小美把長篇作業分成三小段，每完成一段就休息一下，最後檢查是否全部完成。', '把任務分段並檢查，有助於穩定完成較長的工作。'],
    ['小凱發現水壺旁有熱氣，便聽從家人提醒退到安全位置，等大人處理。', '看見可能造成危險的線索時，應依提醒保持安全距離。'],
    ['小芳借用同學的彩色筆後，先記下物品名稱，下課前主動歸還並道謝。', '借用物品後記錄、歸還並道謝，是負責任的做法。'],
    ['老師說明活動規則後，小宇先重述一次，再依序準備用品，遇到不懂的地方才提問。', '先確認規則和步驟，再準備並提問，能減少做錯的機會。'],
    ['小玲整理書桌時，把每天會用的文具放在固定位置，把暫時不用的物品收進盒子。', '分類和固定位置能讓用品較容易找到，也幫助維持整潔。'],
    ['小杰早上發現下雨，便查看路線和雨具，再決定提早出門。', '根據天氣和路線資訊調整準備與時間，是周全的安排。'],
    ['小琪寫完句子後，讀出聲音檢查是否通順，再依照意思換上更合適的詞。', '讀句子並依語意修正，能讓表達更清楚。'],
  ];
  const [passage, correct] = cases[offset % cases.length];
  const wrongs = ['只要最後有人提醒，前面完全不必準備。', '遇到不確定的事情就直接放棄，不用查看線索。', '短文表示所有事情都必須由同一個人完成。'];
  const options = [correct, ...wrongs]; const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `meimei-chinese-${index}`, topic: `第${lessons[offset % lessons.length]}｜語文理解`, type, title: '自編短文理解', instruction: '閱讀自編短文後回答問題。', question: `${passage}（自編情境第${Math.floor(offset / 8) + 1}組）從短文可以知道什麼？`, options, answer, hint: '把人物先做的事、後做的事和結果連起來。', explanation: `短文的行動和結果支持「${correct}」；其他選項與短文線索不符。`, encouragement: '答對了！你能找出短文中的重要做法。' };
});
questions.push(...sprint37Questions);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sprint38QuestionModule = typeof require === 'function' ? require('./sprint38-question-additions') : undefined;
const sprint38QuestionsByBank = (sprint38QuestionModule?.sprint38QuestionsByBank ?? {}) as Record<string, QuestionCardQuestion[]>;
questions.push(...(sprint38QuestionsByBank['meimei/chinese'] ?? []));
