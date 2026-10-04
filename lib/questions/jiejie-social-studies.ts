import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type Question = QuestionCardQuestion;

export const questions: Question[] = [
  {
    id: 'jiejie-social-studies-1', topic: '臺灣民主政治的發展', type: 'basic', title: '總統直接民選', instruction: '請選出可查證的歷史事實。',
    question: '下列哪一項是臺灣民主政治發展中的可查證歷史事實？',
    options: ['1996 年臺灣舉行第一次總統直接民選', '1996 年臺灣取消所有公共選舉', '1996 年臺灣由抽籤決定總統', '1996 年臺灣禁止人民參與投票'], answer: 0,
    hint: '想想「直接民選」代表人民以什麼方式選出總統。',
    explanation: '官方總統府資料記載，臺灣在 1996 年 3 月 23 日舉行第一次總統直接民選，這是民主政治發展的重要里程碑。其他選項與此歷史事實相反。', encouragement: '答對了！你找到了可查證的歷史事實。',
  },
  {
    id: 'jiejie-social-studies-2', topic: '臺灣民主政治的發展', type: 'application', title: '民主參與', instruction: '請判斷情境中的民主精神。',
    question: '班級要決定校外教學的集合方式。大家先提出理由，再依班級規則投票，投票結果公布後，多數同學仍願意遵守共同決定。這個情境最能表現哪一種民主精神？',
    options: ['只要聲音最大的人就一定可以決定', '透過討論與合乎規則的參與形成共同決定', '只有班長可以表達意見', '投票後可以完全不理會共同決定'], answer: 1,
    hint: '注意情境中的「提出理由、依規則投票、遵守共同決定」。',
    explanation: '民主參與包括表達意見、聆聽不同看法、依規則作成決定，也要尊重合法形成的共同結果。這個情境沒有要求支持任何政黨或人物。', encouragement: '答對了！你能理解民主參與的做法。',
  },
  {
    id: 'jiejie-social-studies-3', topic: '社會變遷中的個人發展與族群文化', type: 'basic', title: '社會變遷', instruction: '請選出最符合社會變遷的例子。',
    question: '下列哪一個例子最能說明「社會變遷」？',
    options: ['一個人今天穿藍色衣服，明天穿紅色衣服', '一棵樹在一天內長高一點', '隨著交通與科技改變，人們工作的方式和生活安排也跟著改變', '一本書放在書架上的位置沒有改變'], answer: 2,
    hint: '社會變遷談的是一段時間中，群體生活方式或社會關係的改變。',
    explanation: '社會變遷是社會中的生活方式、工作方式或人與人互動等，隨時間產生改變。交通與科技改變，可能讓許多人的生活安排一起改變，因此選項 3 最符合。', encouragement: '答對了！你能辨認社會生活的變化。',
  },
  {
    id: 'jiejie-social-studies-4', topic: '社會變遷中的個人發展與族群文化', type: 'application', title: '尊重族群文化', instruction: '請選出適當的文化介紹方式。',
    question: '學校要辦理族群文化介紹活動。小芸想介紹一項文化做法，最適當的做法是什麼？',
    options: ['把自己猜測的內容當成所有族人的共同特徵', '為了好玩，模仿可能讓人不舒服的刻板印象', '不查資料，直接把網路留言當成正式介紹', '先查證資料並向文化持有者請教，依對方意願尊重呈現'], answer: 3,
    hint: '介紹別人的文化時，想想資料是否可靠，以及是否尊重文化持有者。',
    explanation: '族群文化可能有多樣的歷史、語言、生活經驗與表現方式。介紹時應查證資料、避免把單一例子說成所有人的特徵，也要尊重文化持有者的意願。選項 4 最符合。', encouragement: '答對了！你能用尊重的方式認識不同文化。',
  },
  {
    id: 'jiejie-social-studies-5', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '教育機會與個人發展', instruction: '請判斷社會變遷的影響。',
    question: '隨著教育機會增加，更多人可以依照自己的興趣和能力繼續學習。這項社會變遷可能帶來什麼影響？',
    options: ['每個人都必須選擇相同的工作', '個人有更多學習與發展能力的機會', '所有人都不需要再學習新知識', '個人的興趣與未來選擇完全沒有關係'], answer: 1,
    hint: '想想有更多機會接受教育，對個人未來的選擇可能有什麼影響。',
    explanation: '教育機會增加，可能讓更多人取得知識、培養能力，並依興趣與條件探索不同的發展方向。', encouragement: '答對了！你理解教育機會與個人發展的關係。',
  },
  {
    id: 'jiejie-social-studies-6', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '族群文化交流', instruction: '請判斷文化交流的影響。',
    question: '臺灣不同族群在生活中互相交流，有些料理會結合不同族群使用的食材與烹調方式。這種現象最能說明什麼？',
    options: ['不同族群交流後，所有飲食習慣都會完全相同', '不同族群的文化只能分開存在', '料理的改變一定代表原有文化完全消失', '族群交流可能讓不同文化互相影響，產生新的生活樣貌'], answer: 3,
    hint: '想想不同族群分享食材與料理方式後，生活文化可能發生什麼變化。',
    explanation: '不同族群透過生活往來分享飲食文化，可能互相影響並發展出新的料理方式。文化交流不代表原有文化必須消失。', encouragement: '答對了！你能理解文化交流帶來的影響。',
  },
  {
    id: 'jiejie-social-studies-7', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '家庭角色變遷', instruction: '請選出符合現代家庭分工的說法。',
    question: '下列哪一項最符合現代家庭分工的觀念？', options: ['家事只能由女性負責', '家庭成員可依能力、時間與需要協調分工', '只有收入最高者能決定所有事', '小孩完全不能參與家庭工作'], answer: 1,
    hint: '分工應看需要，不應只用性別決定。', explanation: '家庭角色會隨社會變遷調整，成員可協調分工並共同承擔責任。', encouragement: '答對了！你了解家庭分工可以一起協調。',
  },
  {
    id: 'jiejie-social-studies-8', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '個人興趣與發展', instruction: '請判斷尊重個人發展的做法。',
    question: '同學對未來興趣不同，哪一種做法最符合個人發展的學習？', options: ['要求所有人選同一興趣', '依自己的興趣與能力探索，並尊重別人的選擇', '只以別人的成績決定方向', '因為不同就不合作'], answer: 1,
    hint: '個人發展可以有差異，也要尊重他人。', explanation: '個人可有多元發展選擇，探索自我不等於否定他人。', encouragement: '答對了！你能尊重自己和別人的發展選擇。',
  },
  {
    id: 'jiejie-social-studies-9', topic: '族群交流如何影響臺灣社會？', type: 'basic', title: '文化形成背景', instruction: '請選出有助於理解文化背景的資料。',
    question: '要了解一項族群文化活動，哪一項資料最有助於理解它的背景？', options: ['只看活動名稱', '了解生活環境、歷史交流與活動意義', '只用自己的習慣判斷', '以一句刻板印象概括所有人'], answer: 1,
    hint: '文化特色通常和哪些背景有關？', explanation: '理解環境、歷史與交流能避免只看表面或刻板化。', encouragement: '答對了！你能從背景理解文化特色。',
  },
  {
    id: 'jiejie-social-studies-10', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '文化交流與尊重', instruction: '請選出適合介紹文化的說法。',
    question: '介紹不同族群的飲食文化時，哪一種說法最合適？', options: ['每個族群的人都一定吃同樣的食物', '只比較誰的文化比較好', '說明文化交流形成的特色，也尊重同一族群內的差異', '不查資料只靠印象'], answer: 2,
    hint: '介紹文化要同時做到理解與尊重。', explanation: '文化交流可能形成新特色，但不能把單一例子說成所有人的共同特徵。', encouragement: '答對了！你能理解文化交流並尊重差異。',
  },
  {
    id: 'jiejie-social-studies-11', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '科技與學習方式', instruction: '請判斷社會變遷對個人發展的影響。',
    question: '網路和數位工具普及後，學生可以用線上資料輔助學習。這個例子說明什麼？', options: ['科技改變可能增加人們學習與取得資訊的方式', '科技出現後每個人的興趣都會完全相同', '只要使用工具就一定不用思考', '社會變遷只會影響交通，不會影響學習'], answer: 0,
    hint: '比較以前和現在取得學習資料的方式有什麼不同。', explanation: '科技發展使取得資料和學習的方式增加，但仍需要判斷資料與主動思考；這是社會變遷影響個人發展的例子。', encouragement: '答對了！你能看見科技變化和學習方式的關係。',
  },
  {
    id: 'jiejie-social-studies-12', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '文化交流的態度', instruction: '請選出尊重文化交流的做法。',
    question: '小組要介紹不同族群的節慶，哪一種做法最適當？', options: ['只用自己的習慣猜測節慶意義', '把一個人的做法說成所有人都一樣', '查找可靠資料並說明不同家庭或地區可能有差異', '只挑自己覺得奇怪的地方取笑'], answer: 2,
    hint: '介紹文化時，資料來源和對差異的態度都很重要。', explanation: '查證資料並承認同一族群內也可能有不同做法，能較完整且尊重地介紹文化；不能靠猜測或刻板印象。', encouragement: '答對了！你能用尊重和查證的方式認識文化。',
  },
  {
    id: 'jiejie-social-studies-13', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '社會變遷與家庭分工', instruction: '請根據資料判斷。',
    question: '以前許多家庭由一位家人專心工作，現在家庭中可能有不同成員工作，也分擔家務。這最能說明什麼？', options: ['所有家庭都必須採用同一分工', '家務只應由某一種性別負責', '家庭角色永遠不會改變', '社會變遷可能影響家庭分工與個人角色'], answer: 3,
    hint: '比較「以前」和「現在」的生活安排。', explanation: '社會變化可能帶來家庭分工與個人角色的改變，但不同家庭仍可能有不同安排。', encouragement: '答對了！你能從生活資料看見社會變遷。',
  },
  {
    id: 'jiejie-social-studies-14', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '文化交流與尊重', instruction: '請選出最適當的做法。',
    question: '班上同學分享不同家庭的節慶食物與故事時，哪種做法最能展現尊重？', options: ['先聆聽並詢問分享者的說法', '直接說自己的習慣一定比較好', '未了解就替對方下結論', '因為不同就要求對方不要分享'], answer: 0,
    hint: '尊重不同文化時，先理解再表達意見。', explanation: '先聆聽並詢問能避免刻板印象，也讓交流建立在理解上。', encouragement: '答對了！你能用理解和尊重的態度與人交流。',
  },
  {
    id: 'jiejie-social-studies-15', topic: '個人發展如何受到社會變遷的影響？', type: 'application', title: '生活方式的改變', instruction: '請根據生活資料判斷。',
    question: '以前買東西常要準備現金，現在有些商店也能用行動裝置付款。這個例子最能說明什麼？', options: ['所有人都必須使用同一種付款方式', '社會與科技變化可能改變人們的生活方式', '只要有行動裝置就不需要學習新規則', '以前的生活方式一定比現在好'], answer: 1,
    hint: '比較以前和現在付款時使用的工具與方法。', explanation: '付款工具從現金增加到行動裝置，顯示社會與科技變化可能影響人們的日常生活方式；不能因此推論所有人都必須使用同一種方式。', encouragement: '答對了！你能從生活例子看見社會變遷的影響。',
  },
  {
    id: 'jiejie-social-studies-16', topic: '族群交流如何影響臺灣社會？', type: 'application', title: '交流帶來的生活變化', instruction: '請根據情境判斷。',
    question: '市場裡有不同地區的人分享食物、語言和節慶故事，居民也因此認識新的做法。這個情境最能說明什麼？', options: ['不同族群交流後，每個人的習慣一定完全相同', '只要有不同習慣就不能一起生活', '族群交流可能讓社會增加認識彼此與互相學習的機會', '交流只會讓原本的文化消失'], answer: 2,
    hint: '注意情境中「分享」和「認識新的做法」帶來的結果。', explanation: '不同族群分享生活經驗，能增加彼此理解和互相學習的機會；交流不代表所有人的習慣都會完全相同，也不表示原有文化必然消失。', encouragement: '答對了！你能理解族群交流如何豐富社會生活。',
  },
];

const sprint37Questions: Question[] = Array.from({ length: 46 }, (_, offset) => {
  const index = offset + 17;
  const type = offset < 15 ? 'basic' : 'application';
  const answer = offset % 4;
  const cases = [
    ['社區新增圖書館後，小晴可以利用放學時間查資料和參加閱讀活動。', '公共設施和生活環境的改變，可能帶來新的學習與生活機會。'],
    ['家中長輩小時候用紙本聯絡，現在家人也會使用訊息，但重要事情仍約定要當面確認。', '工具改變溝通方式，但清楚表達與互相確認仍然重要。'],
    ['市集裡有不同族群帶來的食物、音樂和手工藝，居民互相介紹做法並一起參加活動。', '不同族群交流能讓生活文化更豐富，也需要互相尊重。'],
    ['同學分享家中的節慶習俗，大家先聆聽再比較相同與不同，沒有用自己的習慣否定別人。', '了解差異並尊重彼此，有助於不同族群友善相處。'],
    ['社區比較不同年代的照片，發現交通改善後商店和公共服務也增加了。', '比較不同時間的資料，可以看見社會環境如何改變。'],
    ['小組討論是否保留老建築，先查資料、聽居民意見，再比較保存價值和使用需求。', '公共議題需要蒐集資料並聽取不同觀點，再作出有根據的判斷。'],
    ['新住民家長在學校分享家鄉故事，學校安排翻譯並邀請大家提問。', '提供理解與交流的機會，有助於尊重不同背景的人。'],
    ['家庭成員依年齡和能力分工，孩子記錄活動內容，長輩分享經驗。', '家庭成員可以依能力合作，讓共同活動順利進行。'],
  ];
  const [question, correct] = cases[offset % cases.length];
  const wrongs = ['只要和自己習慣不同，就一定不能在社會中出現。', '社會改變只會影響物品外觀，不會影響生活方式。', '遇到不同意見時，不需要資料或討論就能直接否定。'];
  const options = [correct, ...wrongs]; const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `jiejie-social-studies-${index}`, topic: offset % 2 === 0 ? '個人發展如何受到社會變遷的影響' : '族群交流如何影響臺灣社會', type, title: '社會情境判讀', instruction: '請根據情境選出合理答案。', question: `${question}（自編情境第${Math.floor(offset / 8) + 1}組）從題目可以知道什麼？`, options, answer, hint: '先找出情境中的改變、交流或合作，再判斷它帶來的影響。', explanation: `情境中的具體做法支持「${correct}」；其他選項把內容過度簡化或與題意相反。`, encouragement: '答對了！你能從生活情境理解社會變化。' };
});
questions.push(...sprint37Questions);

// Keep the two out-of-scope democracy questions for history lookup,
// but exclude them from current practice, review, and reinforcement flows.
export const practiceQuestions: Question[] = questions.filter(({ id }) => ![
  'jiejie-social-studies-1',
  'jiejie-social-studies-2',
].includes(id));
