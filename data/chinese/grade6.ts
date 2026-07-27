export const questions = [
  {
    id: 'question-1',
    title: '第一題',
    instruction: '請選出正確的注音。',
    question: '香蕉 的「蕉」讀音是？',
    options: [
      { id: 'jiao', label: '① ㄐㄧㄠ' },
      { id: 'qiao', label: '② ㄑㄧㄠ' },
      { id: 'xiao', label: '③ ㄒㄧㄠ' },
    ],
    answer: 'jiao',
    explanation: ['🎉 答對了！', '「蕉」讀作 ㄐㄧㄠ。', '你已經掌握這個字的讀音！'],
    hint: ['❌ 答錯了。', '提示：「蕉」跟「交朋友」的「交」讀音相同。', '再想一次！'],
  },
  {
    id: 'question-2',
    title: '第二題',
    instruction: '請選出正確的部首。',
    question: '「天空」的「天」是什麼部首？',
    options: [
      { id: 'big', label: '① 大' },
      { id: 'one', label: '② 一' },
      { id: 'person', label: '③ 人' },
    ],
    answer: 'big',
    explanation: ['🎉 答對了！', '「天」的部首是「大」。'],
    hint: ['❌ 答錯了。', '提示：想想天空很大的樣子。', '再想一次！'],
  },
];
