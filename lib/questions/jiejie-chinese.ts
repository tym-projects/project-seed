export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  encouragement: string;
  title: string;
  instruction: string;
}

export const questions: Question[] = [
  {
    id: 'jiejie-chinese-1',
    title: '第一題',
    instruction: '請選出正確的注音。',
    question: '香蕉 的「蕉」讀音是？',
    options: ['① ㄐㄧㄠ', '② ㄑㄧㄠ', '③ ㄒㄧㄠ'],
    answer: 0,
    explanation: '「蕉」讀作 ㄐㄧㄠ。你已經掌握這個字的讀音！',
    encouragement: '🎉 答對了！',
  },
  {
    id: 'jiejie-chinese-2',
    title: '第二題',
    instruction: '請選出正確的部首。',
    question: '「天空」的「天」是什麼部首？',
    options: ['① 大', '② 一', '③ 人'],
    answer: 0,
    explanation: '「天」的部首是「大」。',
    encouragement: '🎉 答對了！',
  },
];
