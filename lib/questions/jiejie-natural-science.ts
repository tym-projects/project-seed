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
];
