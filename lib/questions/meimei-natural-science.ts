import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type Question = QuestionCardQuestion;

export const questions: Question[] = [
  {
    id: 'meimei-natural-science-1', topic: '認識植物', type: 'basic', title: '植物根的功能', instruction: '請選出根的主要功能。',
    question: '觀察一株完整的植物，根通常最主要的功能是什麼？',
    options: ['固定植物，並幫助植物吸收水分', '把陽光變成聲音', '讓植物可以在空中飛行', '把土壤全部變成水'], answer: 0,
    hint: '想想根長在土裡，植物需要從土壤取得什麼。',
    explanation: '根通常長在土壤中，可以幫助植物固定，也能吸收水分；植物的不同構造各有功能。其他選項不是根的功能。', encouragement: '答對了！你認識植物根的功能。',
  },
  {
    id: 'meimei-natural-science-2', topic: '認識植物', type: 'application', title: '植物與陽光', instruction: '請選出合理的觀察推論。',
    question: '把兩盆相同的幼苗分別放在窗邊和完全沒有光線的櫃子裡。幾天後觀察，哪一項說法最合理？',
    options: ['植物完全不需要光線也能一直健康生長', '植物需要適當的光線才能正常生長', '只要沒有水，植物會長得更好', '植物只要放進櫃子就會變成動物'], answer: 1,
    hint: '比較兩盆植物獲得的光線條件，以及植物生長需要的基本條件。',
    explanation: '植物生長需要適當的光線、水分與其他條件。窗邊幼苗有機會獲得光線；完全沒有光線的幼苗較難正常生長，因此選項 2 最合理。題目沒有要求預測固定的高度或天數。', encouragement: '答對了！你能觀察植物生長需要的條件。',
  },
  {
    id: 'meimei-natural-science-3', topic: '空氣和水', type: 'basic', title: '空氣占有空間', instruction: '請根據觀察判斷原因。',
    question: '把乾紙巾塞在杯底，讓杯口朝下、杯子保持不傾斜，再慢慢壓入水中，最後把杯子直直拿出來。若紙巾仍是乾的，最合理的解釋是什麼？',
    options: ['紙巾會把所有的水變成空氣', '水只會進入透明的杯子，不會進入紙巾', '杯子裡的空氣占有空間，水沒有直接進入紙巾所在的位置', '紙巾遇到水會自動變成塑膠'], answer: 2,
    hint: '杯子看起來是空的嗎？想想杯子裡原本有什麼。',
    explanation: '杯子裡原本有空氣。當杯口向下且沒有讓空氣離開時，空氣占著杯內的空間，水就不容易進入紙巾所在的位置，所以紙巾可以保持乾燥。', encouragement: '答對了！你觀察到空氣會占有空間。',
  },
  {
    id: 'meimei-natural-science-4', topic: '空氣和水', type: 'application', title: '生活中的水資源使用', instruction: '請選出適合的節水方法。',
    question: '小明刷牙時想節約用水，下列哪一種做法最適合？',
    options: ['刷牙全程讓水龍頭一直流', '為了節水，把用過的水倒進飲水機', '把水龍頭開到最大，讓水更快流完', '刷牙時先關緊水龍頭，需要漱口時再打開'], answer: 3,
    hint: '想想刷牙過程中，什麼時候真的需要用到流動的水。',
    explanation: '刷牙時不需要一直使用流動的水，先關緊水龍頭，漱口時再打開，可以減少不必要的用水。其他做法會浪費水或造成不安全的使用。', encouragement: '答對了！你能在生活中節約用水。',
  },
  {
    id: 'meimei-natural-science-5', topic: '認識植物', type: 'basic', title: '植物莖的功能', instruction: '請選出植物莖的主要功能。',
    question: '植物的莖通常可以幫助植物做什麼？',
    options: ['把陽光變成聲音', '支撐植物，並運送水分和養分', '讓植物不用根就能走路', '把所有葉子變成石頭'], answer: 1,
    hint: '想想莖連接根、葉和花，像植物中的通道。',
    explanation: '莖可以支撐植物，也能協助水分和養分在植物各部分之間運送。', encouragement: '答對了！你認識植物莖的功能。',
  },
  {
    id: 'meimei-natural-science-6', topic: '認識植物', type: 'application', title: '觀察葉子的作用', instruction: '請根據植物的生長條件判斷。',
    question: '如果一株植物長時間得不到適當的光線，哪一項說法最合理？',
    options: ['植物一定會立刻變成動物', '植物不需要水也會一直健康', '植物可能無法正常生長', '植物會把葉子變成玻璃'], answer: 2,
    hint: '植物生長需要適當的光線、水分和其他條件。',
    explanation: '適當光線是植物正常生長的重要條件之一；長時間缺少光線，植物可能無法正常生長。', encouragement: '很好！你能判斷植物生長的必要條件。',
  },
  {
    id: 'meimei-natural-science-7', topic: '認識植物', type: 'basic', title: '觀察植物特徵', instruction: '請選出可以用來比較植物的特徵。',
    question: '想比較校園裡兩種植物的外形，下列哪一項是可以直接觀察的特徵？',
    options: ['植物昨天想了什麼', '植物最喜歡哪一首歌', '植物長大後一定要去哪裡', '葉子的形狀'], answer: 3,
    hint: '可以用眼睛觀察植物的外形和構造。',
    explanation: '葉子的形狀是植物外形上可以直接觀察和比較的特徵，其他選項不是可直接觀察的植物外形。', encouragement: '答對了！你會用可觀察的特徵比較植物。',
  },
  {
    id: 'meimei-natural-science-8', topic: '認識植物', type: 'application', title: '公平的植物觀察', instruction: '請選出較公平的觀察方法。',
    question: '想研究光線對植物生長的影響，哪一種做法比較公平？',
    options: ['只改變光線，其他條件盡量相同', '一盆每天澆水，另一盆完全不澆水', '同時改變光線、土壤和水量', '只觀察一片葉子就下結論'], answer: 0,
    hint: '一次研究一個因素時，其他條件要盡量保持相同。',
    explanation: '研究光線的影響時，應只改變光線，並讓植物種類、水量和其他條件盡量相同，才比較容易判斷結果。', encouragement: '很棒！你知道如何進行公平的觀察。',
  },
  {
    id: 'meimei-natural-science-9', topic: '空氣和水', type: 'basic', title: '空氣可以被壓縮', instruction: '請根據操作現象判斷。',
    question: '用手推有空氣的針筒活塞時，感覺空氣被擠在裡面。這個現象表示什麼？',
    options: ['空氣完全沒有占有空間', '空氣的體積可以被壓小', '空氣會變成固體石頭', '空氣不能流動也不能改變'], answer: 1,
    hint: '想想活塞往前推時，針筒裡的空氣發生了什麼變化。',
    explanation: '空氣可以占有空間，也能在受到力量時被壓縮，使占有的體積變小。', encouragement: '答對了！你觀察到空氣可以被壓縮。',
  },
  {
    id: 'meimei-natural-science-10', topic: '空氣和水', type: 'application', title: '觀察空氣流動', instruction: '請根據觀察判斷。',
    question: '在紙條旁揮動扇子，紙條跟著飄動，最合理的解釋是什麼？',
    options: ['紙條自己長出了翅膀', '扇子把紙條變成水', '空氣流動帶動了紙條', '空氣只停在原地沒有移動'], answer: 2,
    hint: '揮動扇子時，周圍的空氣會不會跟著移動？',
    explanation: '扇子揮動會使周圍的空氣流動，流動的空氣可以帶動輕的紙條。', encouragement: '很好！你能從現象判斷空氣正在流動。',
  },
  {
    id: 'meimei-natural-science-11', topic: '空氣和水', type: 'basic', title: '水的形狀', instruction: '請根據觀察判斷水的特性。',
    question: '把同樣多的水倒入不同形狀的容器，水面形狀會跟著改變。這表示水有什麼特性？',
    options: ['水永遠保持球形', '水只能停在第一個容器裡', '水會變成容器本身', '水沒有固定形狀，會隨容器改變形狀'], answer: 3,
    hint: '比較水在不同容器中的外形。',
    explanation: '液體通常沒有固定形狀，會隨著所放容器的形狀改變；水仍然是水，不會變成容器。', encouragement: '答對了！你認識水的形狀特性。',
  },
  {
    id: 'meimei-natural-science-12', topic: '空氣和水', type: 'application', title: '水會往低處流', instruction: '請根據生活經驗判斷。',
    question: '下雨後，操場上的水沿著有坡度的地面流向較低的地方。這個現象說明什麼？',
    options: ['水會受到地勢影響，通常往較低處流', '水一定會往最高的地方流', '水只會在沒有地面的地方流動', '水流動時會消失不見'], answer: 0,
    hint: '觀察水在有高低差的地面上往哪裡移動。',
    explanation: '地面有高低差時，水通常會受到重力影響往較低處流動，所以雨水會沿坡度流向低處。', encouragement: '很棒！你能從生活現象認識水的流動。',
  },
  {
    id: 'meimei-natural-science-13', topic: '認識植物', type: 'application', title: '植物部位功能比較', instruction: '請選出最合理的配對。',
    question: '哪一組植物部位和功能的配對最合理？', options: ['葉—固定植物在土裡；根—接收光線；莖—把植物變成種子', '莖—只負責開花；花—吸收土壤中的水分；根—製造陽光', '根—負責固定與吸收水分；莖—支撐和運送；葉—接收光線', '根—把空氣壓進土裡；葉—讓植物走路；莖—變成石頭'], answer: 2,
    hint: '想想根、莖、葉各自在植物中的位置和作用。', explanation: '根通常負責固定並吸收水分，莖能支撐和運送，葉能接收光線；第一組配對最完整。', encouragement: '答對了！你能比較不同植物部位的功能。',
  },
  {
    id: 'meimei-natural-science-14', topic: '認識植物', type: 'application', title: '植物與生活用途', instruction: '請選出合理的生活應用。',
    question: '校園種植樹木，哪一項是可能帶來的生活用途？', options: ['讓校園完全不需要清潔', '讓所有植物都不必澆水', '讓天氣每天都一樣', '提供遮蔭，也可能改善校園環境'], answer: 3,
    hint: '想想樹木長大後可以為附近的人和環境做什麼。', explanation: '樹木可以提供遮蔭，也可能讓校園環境更舒適；但不能因此推論完全不需清潔或澆水，也不能改變每天的天氣。', encouragement: '答對了！你能把植物功能連結到生活。',
  },
  {
    id: 'meimei-natural-science-15', topic: '空氣和水', type: 'application', title: '空氣和水的特性比較', instruction: '請根據實驗現象判斷。',
    question: '針筒分別裝入空氣和水並推壓活塞，哪一項描述最合理？', options: ['空氣較容易被壓縮，水較不容易被壓縮', '水和空氣都會立刻變成固體', '只有水占有空間，空氣不占有空間', '空氣完全不能流動，水也不能改變位置'], answer: 0,
    hint: '比較推壓兩種物質時，活塞移動的難易。', explanation: '空氣受到推壓時體積較容易變小，水則較不容易被壓縮；這是兩者特性的差異。', encouragement: '答對了！你能比較空氣和水的特性。',
  },
  {
    id: 'meimei-natural-science-16', topic: '認識植物', type: 'application', title: '植物向光生長觀察', instruction: '請根據觀察情境判斷。',
    question: '窗邊的幼苗長出新葉後，莖和葉慢慢朝向窗戶的一側。下列哪一項最合理？', options: ['植物會自己走到窗戶旁', '光線可能影響植物生長的方向', '植物只要有光線就不需要水', '葉子朝向哪裡完全不能觀察'], answer: 1,
    hint: '比較新葉和窗戶的位置，想想光線可能和生長方向有什麼關係。', explanation: '題目觀察到莖和葉朝向光線較多的窗戶，表示光線可能影響植物生長方向；不能由此推論植物不需要水。', encouragement: '答對了！你能從植物外形變化推想環境影響。',
  },
  {
    id: 'meimei-natural-science-17', topic: '空氣和水', type: 'application', title: '公平觀察水分變化', instruction: '請選出較公平的觀察方法。',
    question: '想比較陽光是否會影響濕布變乾的速度，哪一種做法較公平？', options: ['一塊布很大且有很多水，另一塊布很小且只有一點水', '兩塊布同時改變大小、風向和水量', '一塊布放在陽光下，另一塊布放在陰涼處，兩塊布大小和含水量相同', '只觀察一塊布一次就下結論'], answer: 2,
    hint: '比較一個因素時，其他條件要盡量相同。', explanation: '要比較陽光的影響，兩塊布的大小和含水量應相同，只改變放置的位置；這樣觀察結果才較能比較。', encouragement: '答對了！你知道如何公平比較水分變化。',
  },
];

const sprint37Questions: QuestionCardQuestion[] = Array.from({ length: 43 }, (_, offset) => {
  const index = offset + 18;
  const type = offset < 14 ? 'basic' : 'application';
  const answer = offset % 4;
  const topic = offset % 2 === 0 ? '認識植物' : '空氣和水';
  const cases = [
    ['小組觀察校園植物，記下根、莖、葉所在的位置，再比較不同植物。', '先觀察植物的身體構造，再依共同特徵比較。'],
    ['同學發現向光處的植物葉片較多，便把位置和葉片數量一起記錄。', '同時記錄條件與結果，才能提出有資料支持的比較。'],
    ['小安用透明袋套住葉子，過一段時間看到袋內有小水珠。', '根據觀察到的水珠提出推論，不能只說植物把水變不見。'],
    ['把空氣打進兩個相同的袋子，一個壓緊、一個不壓，再比較形狀變化。', '相同物品和方法能幫助比較空氣被壓縮時的變化。'],
    ['用注射筒裝入空氣後堵住出口，再慢慢推壓活塞，感覺到阻力。', '空氣占有空間，受到壓縮時會產生推回的力量。'],
    ['杯子底部貼著乾紙巾倒扣入水中，取出後紙巾仍是乾的。', '杯中的空氣占有空間，水不容易立刻進入紙巾所在位置。'],
    ['把植物放在有水和沒有水的兩種條件下，其他條件盡量相同並觀察數日。', '只改變水分條件並記錄結果，才能比較水對植物的影響。'],
    ['同學用紙條觀察窗邊空氣流動，先固定紙條位置，再比較開窗前後。', '保持觀察位置相同，才能比較空氣流動前後的差異。'],
  ];
  const [question, correct] = cases[offset % cases.length];
  const wrongs = ['看不見的東西就一定不存在，也不需要觀察。', '一次改變很多條件，最容易知道哪個因素造成結果。', '只要一次觀察不同，就能推論所有情況永遠相同。'];
  const options = [correct, ...wrongs]; const first = options.shift()!; options.splice(answer, 0, first);
  return { id: `meimei-natural-science-${index}`, topic, type, title: '觀察與推論', instruction: '請根據題目提供的觀察選出答案。', question: `${question}（自編觀察第${Math.floor(offset / 8) + 1}組）從題目可以知道什麼？`, options, answer, hint: '注意題目中的觀察條件和結果，不要加入沒有提供的知識。', explanation: `題目中的條件與結果支持「${correct}」；其他選項不是由題目資訊推出。`, encouragement: '答對了！你能從觀察結果做出合理判斷。' };
});
questions.push(...sprint37Questions);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sprint38QuestionModule = typeof require === 'function' ? require('./sprint38-question-additions') : undefined;
const sprint38QuestionsByBank = (sprint38QuestionModule?.sprint38QuestionsByBank ?? {}) as Record<string, QuestionCardQuestion[]>;
questions.push(...(sprint38QuestionsByBank['meimei/natural_science'] ?? []));
