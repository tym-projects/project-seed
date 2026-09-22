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
];
