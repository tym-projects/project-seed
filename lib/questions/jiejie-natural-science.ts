import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type Question = QuestionCardQuestion;

export const questions: Question[] = [
  {
    id: 'jiejie-natural-science-1', topic: '天氣變化的主角——水', type: 'basic', title: '水的蒸發', instruction: '請判斷水的變化。',
    question: '陽光照射下，地面上的水逐漸變少，這主要是因為水發生了哪一種變化？',
    options: ['水變成水蒸氣，進入空氣中', '水變成石頭，留在地面上', '水變成泥土，混入地面', '水變成鹽，留在空氣中'], answer: 0,
    hint: '想想水受熱後，是否會以看不見的氣體形式離開水面。',
    explanation: '水受到陽光加熱後，部分液態水會變成看不見的水蒸氣，這個過程叫蒸發，所以地面上的水會逐漸減少。', encouragement: '答對了！你觀察到水的蒸發。',
  },
  {
    id: 'jiejie-natural-science-2', topic: '天氣變化的主角——水', type: 'application', title: '生活中的蒸發', instruction: '請選出最合理的原因。',
    question: '小安把洗好的手帕攤開，放在有陽光又有風的地方。下列哪一個理由最能說明手帕比較容易乾？',
    options: ['風會把手帕變成另一種布料', '攤開並通風，能讓水較容易蒸發', '陽光會把水變成固體冰塊', '手帕吸收空氣後會自動消失'], answer: 1,
    hint: '手帕變乾，是手帕上的哪一種物質離開了？',
    explanation: '手帕上的水吸收熱量後會蒸發；把手帕攤開可增加水和空氣接觸的面積，有風也能帶走靠近表面的水蒸氣，因此較容易乾。', encouragement: '答對了！你能把蒸發概念用在生活中。',
  },
  {
    id: 'jiejie-natural-science-3', topic: '物質溶解與水溶液', type: 'basic', title: '溶質與溶劑', instruction: '請選出正確的配對。',
    question: '把砂糖加入水中並攪拌，砂糖均勻分散在水裡。這杯糖水中，哪一個配對正確？',
    options: ['水是溶質，砂糖是溶劑', '砂糖和水都是容器', '砂糖是溶質，水是溶劑', '砂糖和水都不是溶液中的物質'], answer: 2,
    hint: '想想哪一種物質被另一種物質溶解，以及哪一種物質是主要的溶解媒介。',
    explanation: '在糖水中，被水溶解並均勻分散的砂糖是溶質；用來溶解砂糖的水是溶劑。砂糖和水混合後形成糖水，也就是水溶液。', encouragement: '答對了！你能分辨溶質和溶劑。',
  },
  {
    id: 'jiejie-natural-science-4', topic: '物質溶解與水溶液', type: 'application', title: '加快溶解的方法', instruction: '請選出合理的實驗預測。',
    question: '兩杯水的溫度和水量相同，各加入一樣多的砂糖。甲杯攪拌，乙杯不攪拌。若要比較哪杯砂糖較快溶解，最合理的預測是什麼？',
    options: ['乙杯較快，因為不攪拌會讓砂糖自動變熱', '兩杯一定同時溶解，攪拌不會造成任何影響', '甲杯較快，因為攪拌會把砂糖變成另一種物質', '甲杯較快，因為攪拌能增加水和砂糖接觸、混合的機會'], answer: 3,
    hint: '比較兩杯唯一不同的條件，再想攪拌對接觸和混合有什麼作用。',
    explanation: '兩杯水的溫度、水量與砂糖量相同，主要差異是有沒有攪拌。攪拌可讓水和砂糖接觸、混合得更充分，因此預期甲杯較快溶解；這是在比較溶解速度，不是說砂糖變成另一種物質。', encouragement: '答對了！你能用實驗條件推測溶解速度。',
  },
  {
    id: 'jiejie-natural-science-5', topic: '探索天氣的變化', type: 'basic', title: '凝結現象', instruction: '請判斷水的變化。',
    question: '從冰箱拿出一瓶冰水，過了一會兒，瓶子外面出現許多小水滴。這些小水滴主要是怎麼形成的？',
    options: ['瓶內的水穿過瓶子流出來', '空氣中的水蒸氣遇冷凝結成小水滴', '瓶子外面的空氣直接變成冰塊', '瓶內的水受熱蒸發到瓶子外面'], answer: 1,
    hint: '想想空氣中的水蒸氣接觸冰冷表面後，會發生什麼變化。',
    explanation: '空氣中的水蒸氣接觸較冷的瓶子表面，可能凝結成液態小水滴。小水滴並非瓶內的水穿過瓶壁流出。', encouragement: '答對了！你觀察到水蒸氣的凝結。',
  },
  {
    id: 'jiejie-natural-science-6', topic: '探索天氣的變化', type: 'application', title: '天氣資料判讀', instruction: '請根據資料判斷。',
    question: '觀察衛星雲圖時，發現某地上空有大片雲系。依據這項資料，下列哪一個判斷最適當？',
    options: ['該地一定正在下大雨', '該地未來一個月都不會下雨', '該地有較多雲層，是否降雨仍需配合其他資料判斷', '該地的地面氣溫一定是攝氏零度'], answer: 2,
    hint: '雲圖可以顯示雲的分布，但是否能只靠雲圖確定地面正在下雨？',
    explanation: '衛星雲圖可用來觀察雲系分布與變化，但大片雲系不等於當地一定正在降雨。判斷實際天氣仍需搭配其他觀測資料。', encouragement: '答對了！你能正確判讀天氣資料。',
  },
  {
    id: 'jiejie-natural-science-7', topic: '探索天氣的變化', type: 'basic', title: '水循環中的變化順序', instruction: '請判斷水循環中的變化順序。',
    question: '下列哪一個順序最能表示自然界中水循環的一段常見變化？',
    options: ['水蒸發 → 水蒸氣凝結 → 降水', '水蒸發 → 降水 → 水蒸氣凝結', '水蒸氣凝結 → 水蒸發 → 降水', '降水 → 水蒸氣凝結 → 水蒸發'], answer: 0,
    hint: '先想水如何進入空氣，再想雲和雨是如何形成的。',
    explanation: '地表的水蒸發成水蒸氣，水蒸氣在適當條件下凝結成小水滴或小冰晶，雲中的水滴或冰晶增長後可能形成降水。本題考查蒸發、凝結與降水的關係。', encouragement: '答對了！你能理解水循環中的變化順序。',
  },
  {
    id: 'jiejie-natural-science-8', topic: '水溶液', type: 'basic', title: '水溶液的均勻性', instruction: '請判斷水溶液的特性。',
    question: '將少量砂糖加入水中並充分攪拌，確認砂糖已完全溶解。下列哪一項描述最正確？',
    options: ['砂糖完全消失，因此糖水中已經沒有砂糖', '砂糖只分布在杯底，上層仍然是純水', '砂糖均勻分散在水中，糖水各部分都含有砂糖', '砂糖會變成細小顆粒，只集中在水面附近'], answer: 2,
    hint: '看不見砂糖顆粒，是否代表砂糖已經不存在？',
    explanation: '砂糖完全溶解後，仍存在於糖水中，並均勻分散；看不見原本的顆粒，不代表砂糖消失。', encouragement: '答對了！你知道溶解後的物質仍存在於水溶液中。',
  },
  {
    id: 'jiejie-natural-science-9', topic: '探索天氣的變化', type: 'basic', title: '水氣遇冷凝結', instruction: '請判斷水氣遇冷後的變化。',
    question: '下列哪一項最能說明空氣中的水氣遇冷後可能發生的變化？', options: ['凝結成小水滴', '變成砂糖', '消失成土壤', '變成聲音'], answer: 0,
    hint: '想想冷玻璃外的小水滴從哪裡來。', explanation: '水氣遇冷可能凝結成小水滴，形成霧或雲的一部分；其餘不是水氣遇冷的變化。', encouragement: '答對了！你能判斷水氣遇冷的變化。',
  },
  {
    id: 'jiejie-natural-science-10', topic: '水溶液', type: 'basic', title: '比較水溶液導電性', instruction: '請選出公平比較實驗的方法。',
    question: '若要比較兩種水溶液是否容易導電，哪一種做法最公平？', options: ['使用不同體積且不記錄濃度', '使用相同裝置與相同體積，再比較結果', '只看顏色猜測', '只測其中一杯一次且不記錄'], answer: 1,
    hint: '公平比較要固定哪些條件？', explanation: '相同裝置與體積等條件能減少其他因素影響，才較能比較水溶液差異。', encouragement: '答對了！你知道公平比較實驗要控制條件。',
  },
  {
    id: 'jiejie-natural-science-11', topic: '探索天氣的變化', type: 'application', title: '降水形成', instruction: '請判斷水循環中的現象。',
    question: '雲中的小水滴或小冰晶逐漸變大，最後落到地面，這種現象稱為什麼？', options: ['蒸發', '凝結', '降水', '溶解'], answer: 2,
    hint: '想想雨和雪是怎麼從雲中回到地面的。', explanation: '雲中的水滴或冰晶增長後落到地面，稱為降水；雨、雪等都屬於降水。', encouragement: '答對了！你能辨認水循環中的降水現象。',
  },
  {
    id: 'jiejie-natural-science-12', topic: '水溶液', type: 'application', title: '分離糖水', instruction: '請選出可行的觀察方法。',
    question: '想觀察糖水中的砂糖，將糖水加熱使水逐漸蒸發，最可能看到什麼結果？', options: ['砂糖完全變成空氣', '水蒸發後留下砂糖', '砂糖變成泥土', '水和砂糖都消失'], answer: 1,
    hint: '水蒸發時，已溶解的砂糖會不會跟著變成水蒸氣？', explanation: '加熱時水可以蒸發離開，砂糖不會跟著水蒸氣離開，水分減少後可留下砂糖。', encouragement: '答對了！你能用蒸發理解水溶液的分離。',
  },
  {
    id: 'jiejie-natural-science-13', topic: '探索天氣的變化', type: 'basic', title: '天氣資料判讀', instruction: '請根據資料判斷。',
    question: '某日早上氣溫 18°C、下午 25°C，且下午降雨量增加。下列哪項敘述最合理？', options: ['下午比早上溫暖，且天氣變化需要持續觀察', '下午一定沒有雲', '降雨量增加表示氣溫一定下降', '只量一次就能知道整週天氣'], answer: 0,
    hint: '分別讀氣溫和降雨量，不要把一項資料當成全部原因。', explanation: '資料顯示下午氣溫較高、降雨量增加；天氣判斷要綜合並持續觀察，不能由單一資料推出其他選項。', encouragement: '答對了！你能綜合判讀不同的天氣資料。',
  },
  {
    id: 'jiejie-natural-science-14', topic: '探索天氣的變化', type: 'application', title: '水蒸氣遇冷凝結', instruction: '請根據生活現象推論。',
    question: '裝冰水的杯子外壁出現小水珠，這些水最可能從哪裡來？', options: ['杯內的水穿過杯壁', '空氣中的水蒸氣遇冷凝結', '冰塊變成砂糖', '杯子自己產生水'], answer: 1,
    hint: '想想看不見的水蒸氣遇到較冷表面會怎樣。', explanation: '空氣中的水蒸氣遇到冷杯壁會凝結成小水滴，水珠不是杯內的水穿出來。', encouragement: '答對了！你能從生活現象推論凝結。',
  },
  {
    id: 'jiejie-natural-science-15', topic: '水溶液', type: 'application', title: '公平比較實驗', instruction: '請選出最公平的做法。',
    question: '想比較攪拌是否會影響砂糖溶解速度，哪一種做法最公平？', options: ['一杯用熱水且攪拌，另一杯用冷水且不攪拌', '一杯砂糖較多，另一杯水較少', '兩杯水量、溫度、砂糖量相同，只改變是否攪拌', '兩杯同時改變溫度和攪拌'], answer: 2,
    hint: '公平比較時一次只改變一個條件。', explanation: '要判斷攪拌的影響，其他條件應相同，只改變是否攪拌。', encouragement: '答對了！你知道如何設計公平的比較。',
  },
  {
    id: 'jiejie-natural-science-16', topic: '水溶液', type: 'application', title: '溶解現象比較', instruction: '請根據觀察結果判斷。',
    question: '把相同量的鹽和小石子分別放入兩杯等量的水中並攪拌。過一會兒，鹽看不見了，小石子仍在杯底。下列哪一項最合理？', options: ['鹽可能溶解在水中，小石子沒有溶解', '鹽和小石子都變成水蒸氣', '小石子溶解後一定比鹽更甜', '只要看不見就表示物質消失了'], answer: 0,
    hint: '比較兩種物質在水中的觀察結果，不要把「看不見」當成消失。', explanation: '鹽看不見表示可能已均勻分散在水中，小石子仍在杯底表示沒有溶解；物質不會因看不見就消失。', encouragement: '答對了！你能從實驗觀察比較溶解情形。',
  },
  {
    id: 'jiejie-natural-science-17', topic: '探索天氣的變化', type: 'application', title: '連續天氣資料判讀', instruction: '請根據連續觀察判斷。',
    question: '氣象站連續記錄同一天上午、中午和下午的氣溫，數值依序是 19°C、23°C、26°C。這些資料最能支持哪一項說法？', options: ['只要上午的氣溫就能知道整個月的天氣', '氣溫升高表示一定正在下雨', '下午的氣溫一定會比隔天高', '這一天氣溫從上午到下午逐漸升高'], answer: 3,
    hint: '只根據題目提供的三個時間和數值，判斷這一天的變化。', explanation: '同一天三次記錄從 19°C 增加到 23°C，再到 26°C，因此只能支持這一天上午到下午氣溫逐漸升高；其他說法超出資料。', encouragement: '答對了！你能從連續資料判讀天氣變化。',
  },
];

const sprint37Questions: Question[] = Array.from({ length: 43 }, (_, offset) => {
  const index = offset + 18;
  const type = offset < 14 ? 'basic' : 'application';
  const answer = offset % 4;
  const topic = offset % 2 === 0 ? '探索天氣的變化' : '水溶液';
  const cases = [
    ['小組把相同大小的紙片放在不同位置，固定其他條件後記錄飄動距離。', '一次只改變一個條件並記錄結果，才能公平比較。'],
    ['小安觀察天空變化，記下雲量、風向和溫度，再和下午的紀錄比較。', '連續記錄不同時間的觀察結果，才能看出天氣變化。'],
    ['同學把等量的水溶液分裝，用相同光線觀察透明程度並記錄。', '比較時要保持用量和觀察條件相同，結論才較可靠。'],
    ['實驗前老師提醒先檢查器材，操作時保持距離，完成後再整理桌面。', '依照安全步驟操作能降低實驗中的風險。'],
    ['兩杯液體外觀看起來不同，小組先標記來源，再依照相同方法觀察。', '先確認資料和條件，再用相同方法比較不同結果。'],
    ['雨前風變大，氣象紀錄也顯示雲量增加；小組把兩項觀察一起記下。', '把多項觀察資料放在一起，能提出較完整的天氣推論。'],
    ['加入相同量的水後，一杯溶液攪拌較快變得均勻，另一杯仍有顆粒。', '要根據觀察到的結果說明差異，不能只用猜測代替記錄。'],
    ['小組想知道溫度是否影響溶解速度，決定只改變水溫，其他條件保持相同。', '只改變研究中的一個條件，才能判斷它和結果的關係。'],
  ];
  const [question, correct] = cases[offset % cases.length];
  const wrongs = ['只要結果不同，就能確定所有原因都相同。', '不需要記錄條件，只要憑感覺判斷即可。', '一次改變很多條件，最容易知道是哪個因素造成結果。'];
  const options = [correct, ...wrongs]; const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `jiejie-natural-science-${index}`, topic, type, title: '觀察與推論', instruction: '請根據觀察資料選出合理答案。', question: `${question}（自編觀察第${Math.floor(offset / 8) + 1}組）從題目可以知道什麼？`, options, answer, hint: '找出固定的條件、改變的條件和觀察到的結果。', explanation: `題目中的條件與結果支持「${correct}」；其他選項忽略公平比較或超出題目資訊。`, encouragement: '答對了！你能用觀察資料做出合理推論。' };
});
questions.push(...sprint37Questions);

export const practiceQuestions: Question[] = questions;
