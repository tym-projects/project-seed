import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export const questions: QuestionCardQuestion[] = [
  {
    id: 'meimei-chinese-1',
    title: '詞語意思',
    instruction: '請選出和題目意思最接近的詞語。',
    question: '「高興」和下面哪一個詞語意思最接近？',
    options: ['快樂', '難過', '安靜'],
    answer: 0,
    explanation: '高興和快樂都表示心情很好。',
    encouragement: '答對了！你知道詞語的意思。',
  },
  {
    id: 'meimei-chinese-2',
    title: '認識動作詞',
    instruction: '請找出句子中表示動作的詞語。',
    question: '「小明把書放在書包裡。」哪一個詞語表示動作？',
    options: ['小明', '放', '書包'],
    answer: 1,
    explanation: '「放」表示把東西放到一個地方的動作。',
    encouragement: '答對了！你找到動作詞了。',
  },
  {
    id: 'meimei-chinese-3',
    title: '量詞練習',
    instruction: '請選出最適合的量詞。',
    question: '一（　）鉛筆',
    options: ['本', '枝', '條'],
    answer: 1,
    explanation: '細長的鉛筆常用「枝」來計算。',
    encouragement: '答對了！量詞用得很正確。',
  },
];
