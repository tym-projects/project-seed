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
  {
    id: 'meimei-social-studies-5', topic: '我和我的家人', type: 'basic', title: '親屬稱謂', instruction: '請選出適當的親屬稱謂。',
    question: '媽媽的弟弟來家裡作客。你通常應該怎麼稱呼他？',
    options: ['伯伯', '舅舅', '叔叔', '姑丈'], answer: 1,
    hint: '想想媽媽的兄弟應該使用哪一種親屬稱謂。',
    explanation: '媽媽的兄弟通常稱為舅舅。這題中的人物是媽媽的弟弟，因此選舅舅。', encouragement: '答對了！你能依家庭關係判斷稱謂。',
  },
  {
    id: 'meimei-social-studies-6', topic: '學習的方法', type: 'application', title: '安排學習步驟', instruction: '請選出有助於完成學習任務的做法。',
    question: '小安明天要交一份報告，但還沒有整理資料，也還沒開始寫。下列哪一種做法比較有助於完成報告？',
    options: ['先列出需要完成的工作，再安排時間依序進行', '一直等到明天早上，完全不做準備', '只挑自己喜歡的部分做，其他全部不處理', '因為事情很多，所以直接放棄'], answer: 0,
    hint: '想想把工作分成幾個步驟，是否有助於安排時間與完成任務。',
    explanation: '先整理需要完成的工作，再安排資料蒐集、撰寫與檢查的時間，有助於依序完成報告。', encouragement: '答對了！你會安排學習步驟。',
  },
  {
    id: 'meimei-social-studies-7', topic: '我和我的家人', type: 'basic', title: '家庭組成多樣性', instruction: '請選出對家庭的合適理解。',
    question: '下列哪一項最適合說明家庭的樣子？', options: ['每個家庭成員數量都一樣', '家庭組成可能不同，但都可以互相照顧與合作', '只有和自己同住的人才算家人', '家庭一定要有相同職業'], answer: 1,
    hint: '想想不同家庭可能有哪些成員。', explanation: '家庭組成與生活方式可能不同，成員仍可互相照顧與合作。', encouragement: '答對了！你知道不同家庭都能互相照顧。',
  },
  {
    id: 'meimei-social-studies-8', topic: '我和我的家人', type: 'application', title: '自己的家庭責任', instruction: '請選出適合的家庭責任做法。',
    question: '小安要整理自己的書包，哪一種做法最符合家庭與自己的責任？', options: ['把所有物品交給家人整理', '先自己整理，再在需要時請家人協助', '故意把物品丟在地上', '說謊表示已經整理好'], answer: 1,
    hint: '自己的事情可以先怎麼做？', explanation: '先負責自己的物品，遇到需要時再尋求協助，是合作而非推卸責任。', encouragement: '答對了！你會先負責自己的事情，也知道何時求助。',
  },
  {
    id: 'meimei-social-studies-9', topic: '我和我的家人', type: 'application', title: '家人的關心與聯絡', instruction: '請選出合適的家庭互動方式。',
    question: '住在不同地方的家人想知道彼此近況，哪一種做法最合適？', options: ['完全不聯絡，也不關心對方', '用電話或訊息互相問候，並在需要時提供幫助', '只在發生爭吵時聯絡', '要求每個家人每天做完全相同的事'], answer: 1,
    hint: '家人即使不住在一起，也可以用什麼方式保持關心？', explanation: '家人可以透過電話、訊息或見面互相問候，在需要時提供支持；家庭互動不必要求每個人生活完全相同。', encouragement: '答對了！你知道家人可以用不同方式互相關心。',
  },
  {
    id: 'meimei-social-studies-10', topic: '學習的方法', type: 'basic', title: '準備學習環境', instruction: '請選出有助於學習的準備方式。',
    question: '開始寫作業前，哪一種準備最有助於專心完成？', options: ['先準備需要的文具，整理桌面並安排安靜的時間', '把所有玩具放在桌上，邊玩邊寫', '不看題目，直接猜答案', '把作業放到最後一刻才想起來'], answer: 0,
    hint: '先準備好用品和時間，能不能減少學習中斷？', explanation: '準備需要的用品、整理桌面並安排時間，可以減少找東西和被打擾的情況，較有助於專心學習。', encouragement: '答對了！你會先準備適合的學習環境。',
  },
  {
    id: 'meimei-social-studies-11', topic: '我和我的家人', type: 'application', title: '家庭溝通與合作', instruction: '請選出適合的家庭溝通方式。',
    question: '家人對週末活動有不同想法時，哪種做法最適合？', options: ['大聲要求大家照自己的想法', '先聽聽每個人的理由，再一起討論', '不告訴家人就自己決定', '因為不同意就不再說話'], answer: 1,
    hint: '合作前要先了解彼此的想法。', explanation: '傾聽理由再討論，能讓家人一起找適合的安排，也尊重不同意見。', encouragement: '答對了！你能用溝通和合作解決問題。',
  },
  {
    id: 'meimei-social-studies-12', topic: '學習的方法', type: 'application', title: '安排學習時間', instruction: '請選出有助於完成任務的安排。',
    question: '小安明天要交閱讀紀錄和美勞作品，哪種安排最有幫助？', options: ['先列出兩件事，再分配今天和明天的時間', '到明天早上才同時開始', '只做自己喜歡的那一件', '等別人提醒才開始'], answer: 0,
    hint: '把工作列出來並分配時間，比全部留到最後更容易完成。', explanation: '列出任務並分配時間，可以掌握先後與完成情形，較容易按計畫完成兩件事。', encouragement: '答對了！你會安排時間完成學習任務。',
  },
  {
    id: 'meimei-social-studies-13', topic: '我和我的家人', type: 'application', title: '家庭責任的調整', instruction: '請選出適合的家庭合作方式。',
    question: '爸爸今天生病需要休息，家裡的晚餐和整理工作還沒完成。哪種做法最適合？', options: ['假裝沒有看見，讓爸爸自己完成', '因為有人生病，所以所有事情都不用做', '把工作全部交給年紀最小的人', '家人先討論需要做的事，再依能力分工並互相幫忙'], answer: 3,
    hint: '想想家人遇到臨時狀況時，如何一起分擔工作。', explanation: '家人需要休息時，可以先討論工作，再依每個人的能力分工並互相幫忙；這樣既照顧家人，也能完成生活中的事情。', encouragement: '答對了！你能在家庭變化中想出合作的方法。',
  },
  {
    id: 'meimei-social-studies-14', topic: '學習的方法', type: 'application', title: '檢查與修正學習', instruction: '請選出有助於進步的學習方法。',
    question: '小美檢查作業時發現有幾題算錯，她接下來怎麼做最有幫助？', options: ['把錯題撕掉，不再查看', '只把答案抄成和同學一樣，不想原因', '找出錯在哪一步，改正後再做一題確認', '因為算錯就停止所有數學練習'], answer: 2,
    hint: '學習時不只要改答案，也要找出錯誤的地方。', explanation: '找出錯誤步驟、改正並再做一題確認，可以知道自己是否真的理解；其他做法沒有處理錯誤原因。', encouragement: '答對了！你知道檢查和修正能幫助學習。',
  },
];

const sprint37Questions: QuestionCardQuestion[] = Array.from({ length: 46 }, (_, offset) => {
  const index = offset + 15;
  const type = offset < 15 ? 'basic' : 'application';
  const answer = offset % 4;
  const cases = [
    ['家人一起整理客廳，先討論要做的事，再依年齡和能力分工。', '先討論再依能力分工，能讓家庭合作更順利。'],
    ['小安完成作業前先看題目要求，再準備需要的文具，最後檢查答案。', '按照理解、準備、檢查的步驟學習，較能減少遺漏。'],
    ['姊姊用畫圖記住自然課內容，弟弟用朗讀和卡片複習，兩人都記下不懂的地方。', '每個人可以選擇適合自己的方法，也要整理不懂的地方。'],
    ['家人對假日安排有不同想法，先說明理由，再一起找出大家都能接受的方案。', '傾聽理由並共同討論，能處理家庭中的不同意見。'],
    ['小組讀書時把大任務分成每天一小段，完成後在表格上打勾。', '把任務分段並留下紀錄，有助於掌握學習進度。'],
    ['弟弟找不到作業本，家人陪他回想最後使用的地方，再一起整理固定放置的位置。', '先根據線索尋找，再建立固定位置，能改善整理和找物品的方法。'],
    ['同學介紹自己的讀書方法，大家先試做一週，再分享哪個方法最適合自己。', '實際嘗試並比較結果，能幫助選擇合適的學習方法。'],
    ['家中長輩需要休息，其他家人討論後分擔晚餐和整理工作。', '家人遇到狀況時互相分擔，能同時照顧需要休息的人和完成生活工作。'],
  ];
  const [question, correct] = cases[offset % cases.length];
  const wrongs = ['不需要了解任務，只要等別人提醒就好。', '家庭或學習中的事情都應該全部交給年紀最小的人。', '遇到不同想法時直接生氣，不必聽別人的理由。'];
  const options = [correct, ...wrongs]; const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `meimei-social-studies-${index}`, topic: offset % 2 === 0 ? '我和我的家人' : '學習的方法', type, title: '生活情境判讀', instruction: '請根據生活情境選出最適合的做法。', question: `${question}從短文可以知道什麼？（自編情境第${Math.floor(offset / 8) + 1}組）`, options, answer, hint: '注意人物如何溝通、分工、準備或檢查。', explanation: `題目中的做法支持「${correct}」；其他選項沒有運用題目提供的合作或學習線索。`, encouragement: '答對了！你能把學習方法用在生活中。' };
});
questions.push(...sprint37Questions);
