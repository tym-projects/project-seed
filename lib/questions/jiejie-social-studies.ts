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
];
