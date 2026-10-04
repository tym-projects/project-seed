import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type Question = QuestionCardQuestion;

export const questions: Question[] = [
  {
    id: 'jiejie-chinese-1',
    reviewGroupId: 'jiejie-chinese-jiao-pronunciation',
    topic: '注音辨識',
    type: 'basic',
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
    reviewGroupId: 'jiejie-chinese-tian-radical',
    topic: '部首辨識',
    type: 'basic',
    title: '第二題',
    instruction: '請選出正確的部首。',
    question: '「天空」的「天」是什麼部首？',
    options: ['① 大', '② 一', '③ 人'],
    answer: 0,
    explanation: '「天」的部首是「大」。',
    encouragement: '🎉 答對了！',
  },
  {
    id: 'jiejie-chinese-3',
    reviewGroupId: 'jiejie-chinese-jiao-pronunciation',
    topic: '注音辨識',
    type: 'basic',
    title: '注音練習',
    instruction: '請選出正確的注音。',
    question: '校園裡有一棵芭蕉樹，「芭蕉」的「蕉」讀音是？',
    options: ['① ㄐㄧㄠ', '② ㄑㄧㄠ', '③ ㄒㄧㄠ'],
    answer: 0,
    explanation: '「蕉」不管出現在「香蕉」或「芭蕉」，都讀作「ㄐㄧㄠ」。',
    encouragement: '🎉 答對了！你會讀「蕉」了！',
  },
  {
    id: 'jiejie-chinese-4',
    reviewGroupId: 'jiejie-chinese-tian-radical',
    topic: '部首辨識',
    type: 'basic',
    title: '部首練習',
    instruction: '想查字典時，請選出要查的部首。',
    question: '想查「天」字時，應該查哪一個部首？',
    options: ['① 大部', '② 一部', '③ 人部'],
    answer: 0,
    explanation: '「天」的部首是「大」，所以查字典時要查「大部」。',
    encouragement: '🎉 答對了！你知道怎麼查「天」字了！',
  },
  {
    id: 'jiejie-chinese-5',
    topic: '成語運用',
    type: 'basic',
    title: '成語填空',
    instruction: '根據句子的意思，選出最適合的成語。',
    question: '得知自己代表學校參加比賽後，小晴每天認真練習，絲毫不敢＿＿＿＿，希望能有最好的表現。',
    options: ['自暴自棄', '掉以輕心', '得意忘形', '隨遇而安'],
    answer: 1,
    hint: '她很重視比賽，沒有因為任何原因而放鬆或輕忽。',
    explanation: '「掉以輕心」指對事情採取輕率、不重視的態度。句中「絲毫不敢」表示小晴非常認真，因此最適合填入「掉以輕心」。',
    encouragement: '答對了！你能根據上下文判斷成語的用法。',
  },
  {
    id: 'jiejie-chinese-6',
    topic: '成語運用',
    type: 'application',
    title: '情境成語填空',
    instruction: '閱讀情境，選出最適合形容人物表現的成語。',
    question: '上臺報告前，小安準備了很久，但是一看到臺下坐滿觀眾，原本背得很熟的內容突然一句也想不起來。這時最適合用哪個成語形容他？',
    options: ['胸有成竹', '滔滔不絕', '張口結舌', '對答如流'],
    answer: 2,
    hint: '他原本準備充分，但緊張得一時說不出話。',
    explanation: '「張口結舌」形容因緊張、害怕或理屈而說不出話。小安面對觀眾突然忘詞，最符合這個情境。',
    encouragement: '很好！成語不只要知道意思，也要能放進正確的情境。',
  },
  {
    id: 'jiejie-chinese-7',
    topic: '錯別字辨識',
    type: 'basic',
    title: '找出錯別字',
    instruction: '找出句子中使用錯誤的詞語。',
    question: '「經過全班熱烈討論，我們終於達成共視，決定一起參加校慶活動。」哪一個詞語寫錯了？',
    options: ['熱烈', '討論', '共視', '校慶'],
    answer: 2,
    hint: '大家取得一致的意見，稱為達成「ㄍㄨㄥˋ ㄕˋ」。',
    explanation: '「共視」應寫成「共識」。「共識」表示共同的認識或一致的意見。',
    encouragement: '答對了！讀懂詞義能幫助你判斷正確用字。',
  },
  {
    id: 'jiejie-chinese-8',
    topic: '錯別字辨識',
    type: 'basic',
    title: '辨認正確用字',
    instruction: '找出句子中使用錯誤的詞語。',
    question: '「我們必須先分晰失敗的原因，才能找到改進的方法。」哪一個詞語寫錯了？',
    options: ['必須', '分晰', '原因', '改進'],
    answer: 1,
    hint: '這個詞表示把事情拆開研究，其中一個字和「解析」相同。',
    explanation: '「分晰」應寫成「分析」。「析」有分開、解析的意思，因此正確寫法是「分析」。',
    encouragement: '很好！你能分辨讀音相近但意思不同的字。',
  },
  {
    id: 'jiejie-chinese-9',
    topic: '錯別字辨識',
    type: 'application',
    title: '挑戰錯別字',
    instruction: '閱讀短文，找出使用錯誤的詞語。',
    question: '班級準備成果發表時，小芸寫下工作紀錄：「大家先蒐集資料，再仔細分析內容。遇到不同意見時，我們也會互相溝通、協調。雖然準備過程十分繁鎖，但大家仍按部就班完成工作。」哪一個詞語的用字有誤？',
    options: ['蒐集', '協調', '繁鎖', '按部就班'],
    answer: 2,
    hint: '這個詞形容事情繁雜、瑣碎；想想「瑣碎」使用的是哪一個字。',
    explanation: '「繁鎖」應寫成「繁瑣」。「瑣」有細小、零碎的意思，「繁瑣」用來形容事情繁雜而細碎。「鎖」則是鎖住、鎖頭的意思。',
    encouragement: '很棒！你能在較長的文章中運用字義找出錯別字。',
  },
  {
    id: 'jiejie-chinese-10', topic: '第壹單元詞語理解', type: 'basic', title: '理解詞語意思', instruction: '請根據句子選出詞語的意思。',
    question: '「安排時間」中的「安排」最接近哪一個意思？',
    options: ['把事情全部忘記', '先做好規畫與分配', '故意把時間浪費掉', '只在事情結束後猜想'], answer: 1,
    hint: '想想做事前先把順序和時間想好。',
    explanation: '「安排」是事先規畫、分配事情或時間，所以「先做好規畫與分配」最符合句意。', encouragement: '答對了！你能從語境理解詞語。',
  },
  {
    id: 'jiejie-chinese-11', topic: '第壹單元語詞運用', type: 'application', title: '詞語運用', instruction: '請選出詞語使用最恰當的句子。',
    question: '下列哪一句使用「珍惜」最恰當？',
    options: ['我把鉛筆珍惜在地上滾來滾去。', '雨水珍惜得很大，所以地面濕了。', '我們要珍惜時間，按計畫完成作業。', '弟弟珍惜地把門推開，發出很大聲音。'], answer: 2,
    hint: '「珍惜」通常表示重視並愛護有價值的人事物。',
    explanation: '「珍惜時間」表示重視時間、不任意浪費，使用方式正確。其他句子中的詞語和動作不相配。', encouragement: '很好！你能在句子中正確運用詞語。',
  },
  {
    id: 'jiejie-chinese-12', topic: '第壹單元錯別字辨識', type: 'basic', title: '辨認正確用字', instruction: '請選出用字正確的詞語。',
    question: '下列哪一個詞語用字正確？',
    options: ['凖時', '準吋', '準蒔', '準時'], answer: 3,
    hint: '這個詞表示按照預定的時間，不早也不晚。',
    explanation: '表示按照預定時間的詞語寫作「準時」；其他選項的字形不正確。', encouragement: '答對了！你能辨認正確的字形。',
  },
  {
    id: 'jiejie-chinese-13', topic: '第壹單元閱讀理解', type: 'application', title: '讀懂事情順序', instruction: '閱讀短文後回答問題。',
    question: '小晴每天放學先看功課表，把需要較多時間的作業寫在前面，再利用剩下的時間整理書包。她這樣做的主要原因是什麼？',
    options: ['先規畫做事順序，較不容易忘記重要工作', '故意把所有作業留到最後', '只想把書包弄得更重', '希望每天都不必完成作業'], answer: 0,
    hint: '想想她為什麼先看功課表，再安排作業順序。',
    explanation: '先看功課表並安排順序，可以掌握需要完成的工作，減少遺漏重要作業的機會。', encouragement: '很棒！你能找出短文中的主要原因。',
  },
  {
    id: 'jiejie-chinese-14', topic: '第貳單元詞語辨識', type: 'basic', title: '詞語近義辨識', instruction: '請選出最接近詞語意思的說法。',
    question: '「仔細」最接近下面哪一個意思？',
    options: ['快速而不查看', '認真而不馬虎', '大聲而不停止', '隨便而不思考'], answer: 1,
    hint: '做事「仔細」時，通常會注意細節。',
    explanation: '「仔細」表示認真注意、不粗心，所以「認真而不馬虎」最接近它的意思。', encouragement: '答對了！你能辨認詞語的意思。',
  },
  {
    id: 'jiejie-chinese-15', topic: '第貳單元語句理解', type: 'application', title: '理解語句順序', instruction: '請判斷句子中事情發生的順序。',
    question: '「先整理桌面，再開始寫作業」表示哪一種做事順序？',
    options: ['先開始寫作業，後整理桌面', '整理桌面和寫作業都不用做', '先整理桌面，後開始寫作業', '每天只要整理桌面就好'], answer: 2,
    hint: '注意「先……再……」兩個詞的先後。',
    explanation: '「先……再……」表示前面的事情先做，後面的事情接著做，因此要先整理桌面，再開始寫作業。', encouragement: '很好！你能讀懂句子的先後關係。',
  },
  {
    id: 'jiejie-chinese-16', topic: '第貳單元錯別字辨識', type: 'basic', title: '辨認正確用字', instruction: '請選出用字正確的詞語。',
    question: '下列哪一個詞語用字正確？',
    options: ['提省', '提形', '提警', '提醒'], answer: 3,
    hint: '這個詞表示叫人注意某件事情。',
    explanation: '表示叫人注意、不要忘記的詞語寫作「提醒」；其他選項不是正確詞語。', encouragement: '答對了！你能從詞義辨認正確用字。',
  },
  {
    id: 'jiejie-chinese-17', topic: '第貳單元閱讀理解', type: 'application', title: '讀懂留言目的', instruction: '閱讀短文後回答問題。',
    question: '小安在便利貼上寫著「帶水壺、交作業」，並把便利貼貼在書包上。他這樣做的主要目的是什麼？',
    options: ['提醒自己不要忘記要做的事', '讓書包看起來完全沒有東西', '把今天的作業全部取消', '請便利貼替他完成作業'], answer: 0,
    hint: '便利貼可以幫助人記下重要的事情。',
    explanation: '小安把要帶和要交的事情寫下來，是為了在需要時查看，提醒自己不要遺忘。', encouragement: '很棒！你能理解留言的目的。',
  },
  {
    id: 'jiejie-chinese-18', topic: '第伍單元段落主旨', type: 'application', title: '統整段落主旨', instruction: '閱讀短文後選出最適合的主旨。',
    question: '校園角落有一棵老樹。它的樹枝曾被風吹斷，卻在園丁和同學照顧下重新長出嫩芽。小樹苗也在老樹旁慢慢長高，兩棵樹一起為路過的人遮陽。小芸看著它們，想到成長不一定順利，但只要堅持，也能在別人的幫助下變得更強壯。最適合當作這段文字主旨的是哪一項？',
    options: ['樹木的成長讓人明白，面對困難要堅持，也要互相幫助。', '老樹的枝葉可以在天氣炎熱時遮陽。', '小樹苗需要在老樹旁邊才有辦法長大。', '同學可以每天觀察樹木長出多少嫩芽。'], answer: 0,
    hint: '先找出短文最後小芸想到的事情，再回頭看看前文哪些內容支持這個想法。',
    explanation: '短文先寫老樹受傷後重新長出嫩芽，再寫老樹和小樹一起成長，最後明確指出小芸得到的想法，因此主旨是從樹木成長聯想到堅持與互助。其他選項只提到局部細節。', encouragement: '答對了！你能統整段落中的重要訊息。',
  },
  {
    id: 'jiejie-chinese-19', topic: '第陸單元人物觀點推論', type: 'application', title: '推論人物行動原因', instruction: '閱讀情境後回答問題。',
    question: '班級報告時，小傑不小心把投影片順序放反了。他笑著說：「我的投影片今天想玩猜謎遊戲，請大家先猜下一頁在哪裡。」同學笑了出來，小傑趁大家等待時重新整理檔案，接著說：「好了，這次輪到正確順序上場。」他沒有責怪自己，也沒有嘲笑別人。小傑這樣說、這樣做，最主要的原因是什麼？',
    options: ['他想故意把報告時間拖得更久。', '他想讓氣氛放鬆，並冷靜處理自己的錯誤。', '他認為報告內容不重要，可以不用完成。', '他希望同學一直取笑他的失誤。'], answer: 1,
    hint: '注意他說完玩笑後，接著做了什麼。',
    explanation: '小傑用輕鬆的話化解投影片順序錯誤，接著重新整理檔案完成報告；這兩個線索都表示他是為了讓氣氛放鬆並處理問題，不是逃避或貶低自己。', encouragement: '很好！你能從人物的話和行動推想原因。',
  },
  {
    id: 'jiejie-chinese-20', topic: '第壹單元閱讀理解', type: 'application', title: '統整短文重點', instruction: '閱讀短文後選出最適合的重點。',
    question: '學校舉辦舊物再利用活動，同學先把不再使用的紙盒分類，再設計成筆筒和收納盒。雖然第一次做得不整齊，他們仍互相討論、修改，最後讓原本要丟掉的紙盒有了新的用途。這段文字最想告訴我們什麼？',
    options: ['紙盒只能拿來做筆筒。', '第一次做作品一定會很整齊。', '動手改造和合作討論，可以讓舊物重新發揮用途。', '學校活動只要分類物品，不必完成作品。'], answer: 2,
    hint: '看看同學做了哪些事，以及最後舊紙盒有了什麼改變。', explanation: '短文寫到分類、設計、討論和修改，最後讓舊紙盒重新被使用，因此主旨是透過合作改造讓舊物發揮新用途；其他選項只說局部或與短文相反。', encouragement: '答對了！你能整合短文中的做法和結果。',
  },
  {
    id: 'jiejie-chinese-21', topic: '第貳單元語句理解', type: 'application', title: '根據線索推論', instruction: '閱讀短文後回答問題。',
    question: '放學前，老師發現窗外風勢變大，便請同學把窗邊的輕物品移到桌內，並提醒大家離開教室前再檢查一次。老師這樣安排，最主要是因為什麼？',
    options: ['她想讓同學把物品帶回家。', '她不希望同學在教室裡學習。', '窗戶一定已經破掉，不能再使用。', '她根據風勢變大的情況，先降低物品被吹落的風險。'], answer: 3,
    hint: '把「風勢變大」和老師接著做的安排連起來想。', explanation: '風勢變大可能使窗邊的輕物品移動或掉落，所以老師先請同學移開並再次檢查，是為了降低風造成的風險。短文沒有說窗戶已經破掉。', encouragement: '很好！你能用前後線索推想人物安排的原因。',
  },
];

const sprint37Questions: Question[] = Array.from({ length: 48 }, (_, offset) => {
  const index = offset + 22;
  const lessons = ['遇見自己', '為什麼大家不理我？', '孔子說的話', '向大自然學習', '樹的聯想', '善用自嘲，展現幽默'];
  const skills = ['段落主旨', '行動原因', '語句意思', '事件順序', '人物觀點', '證據判斷', '情境推論', '適當用語'];
  const situations = [
    '小芸把大任務分成幾個小步驟，每天記下完成的部分，最後順利完成原本不熟悉的工作。',
    '新同學剛加入小組，大家先介紹規則，再邀請他一起討論，幾天後他主動提出想法。',
    '小組先聽完每個人的理由，再整理共同重點，最後依照專長分配工作。',
    '雨後地面有積水，小安先觀察安全路線，再提醒同學放慢腳步並告知老師。',
    '小樹苗被風吹歪，園丁先固定枝幹，再持續照顧，過了一段時間它長出新葉。',
    '小傑報告時排錯投影片，便用輕鬆的話化解尷尬，接著重新整理檔案。',
    '小偉看到公告改了集合時間，便寫下提醒並提早準備用品，隔天準時到達。',
    '組員把活動的材料、時間和安全性列成表格，再比較各方案的優缺點。',
  ];
  const answers = [
    '分段行動並記錄進步，能幫助自己面對不熟悉的事情。',
    '主動理解與邀請，能幫助新同學融入團體。',
    '先聆聽和整理意見，再分工合作，能讓討論更有效率。',
    '觀察情況並採取合適行動，可以降低生活中的危險。',
    '持續照顧能幫助成長，也要逐漸學會面對環境。',
    '適度幽默可以緩和尷尬，但仍要負責處理問題。',
    '記下重要資訊並提早準備，有助於按時完成安排。',
    '列出條件比較，能讓團體決定更有根據。',
  ];
  const answer = offset % 4;
  const options = [answers[offset % 8], '只要做得很快，就不需要觀察或討論。', '遇到問題時最好完全交給別人處理。', '短文只是在介紹物品的外觀。'];
  const correct = options.shift() ?? '';
  options.splice(answer, 0, correct);
  const type = offset < 16 ? 'basic' : 'application';
  return { id: `jiejie-chinese-${index}`, topic: `第${lessons[offset % lessons.length]}｜${skills[offset % skills.length]}`, type, title: '自編短文理解', instruction: '閱讀自編短文後選出最佳答案。', question: `${situations[offset % situations.length]}（自編情境第${Math.floor(offset / 8) + 1}組）這段文字最想說明什麼？`, options, answer, hint: '先找出人物做了哪些事，再思考這些做法帶來的結果。', explanation: `短文中的行動和結果都支持「${answers[offset % 8]}」，其他選項不是主旨或與短文不符。`, encouragement: '答對了！你能統整短文的重要訊息。' };
});
questions.push(...sprint37Questions);

// Keep retired early test questions available for historical Learning Records,
// but exclude them from current formal practice and review flows.
export const practiceQuestions: Question[] = questions.filter(({ id }) => {
  const numericId = Number(id.replace('jiejie-chinese-', ''));
  return Number.isInteger(numericId) && numericId >= 10;
});
