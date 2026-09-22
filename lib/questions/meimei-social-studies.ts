import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type Question = QuestionCardQuestion;

export const questions: Question[] = [
  {
    id: 'meimei-social-studies-1', topic: '家庭與我', type: 'basic', title: '家庭成員分工合作', instruction: '請選出符合家庭分工的說法。',
    question: '下列哪一個說法最符合家庭生活中的分工合作？',
    options: ['家庭成員可以依能力和需要一起分擔生活中的工作', '家事只能由一個人永遠負責', '年紀小的人不能做任何家庭工作', '只有賺錢的人才算對家庭有貢獻'], answer: 0,
    hint: '想想家庭成員如何互相幫忙，讓生活更順利。',
    explanation: '家庭成員可以依年齡、能力與當時需要，分擔整理、準備物品或照顧等工作。不同成員的貢獻不只一種形式，選項 1 最完整。', encouragement: '答對了！你了解家庭成員可以合作分工。',
  },
  {
    id: 'meimei-social-studies-2', topic: '家庭與我', type: 'application', title: '家庭溝通', instruction: '請選出適合解決家庭問題的做法。',
    question: '週末姐姐和弟弟都想使用客廳，但時間重疊了。下列哪一種做法最適合解決問題？',
    options: ['不告訴任何人，直接把別人的物品藏起來', '先說明自己的需要，再和家人一起討論使用時間', '誰先大聲喊叫，誰就可以使用全部時間', '以後都不和家人溝通'], answer: 1,
    hint: '解決家庭中的不同需要時，可以用什麼方式讓大家都被聽見？',
    explanation: '家庭成員有不同需要時，可以先清楚說明，再互相聆聽、討論時間安排，找出大家較能接受的方式。選項 2 能保留溝通與合作，其他做法會傷害信任或無法解決問題。', encouragement: '答對了！你能用溝通來解決問題。',
  },
  {
    id: 'meimei-social-studies-3', topic: '學習和成長', type: 'basic', title: '學習來源', instruction: '請選出對學習和成長的正確理解。',
    question: '下列哪一項最能說明「學習和成長」？',
    options: ['只有考試得到滿分才算學習', '只要年紀變大，就會自動學會所有事情', '我們可以在學校、家庭和生活經驗中學會新的知識與做法', '學習只發生在課本裡，生活中不會學到東西'], answer: 2,
    hint: '想想除了課堂之外，還有哪些地方會讓你學會新的事情。',
    explanation: '學習可以發生在學校、家庭和日常生活中，也可能透過練習、觀察和請教別人逐步進步。考試分數只是其中一種結果，不是學習的全部。', encouragement: '答對了！你知道學習可以發生在不同地方。',
  },
  {
    id: 'meimei-social-studies-4', topic: '學習和成長', type: 'application', title: '面對學習困難', instruction: '請選出有助於學習進步的做法。',
    question: '小華練習寫字時，發現有幾個字一直寫不好。下列哪一種做法最能幫助他學習和進步？',
    options: ['因為一次寫不好，就永遠不再練習', '把作業藏起來，假裝自己已經學會', '只看別人寫，自己完全不動筆', '請教老師或家人，找出問題後再分段練習'], answer: 3,
    hint: '遇到不會的事情時，可以先找出困難，再用什麼方式逐步練習？',
    explanation: '學習遇到困難時，可以請教可信任的大人或老師，找出需要改進的地方，再把任務分成小步驟練習。選項 4 有助於真正學會；其他做法沒有處理困難。', encouragement: '答對了！你能用適合的方法面對學習困難。',
  },
];
