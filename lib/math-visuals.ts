import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type MathVisualType =
  | 'FRACTION_PART_BAR'
  | 'DECIMAL_MEASURE_SEGMENTS'
  | 'CIRCLE_RADIUS_DIAMETER'
  | 'RECTANGLE_DIMENSIONS'
  | 'RATIO_PARTS'
  | 'GROUPING_ARRAY'
  | 'PLACE_VALUE_COLUMNS'
  | 'MEASUREMENT_RELATION'
  | 'BAR_MODEL';

export type MathVisualData = Readonly<Record<string, string | number | boolean | readonly number[]>>;

export type MathVisualSpec = {
  readonly type: MathVisualType;
  readonly purpose: string;
  readonly data: MathVisualData;
  readonly knownFacts: readonly string[];
  readonly unknowns: readonly string[];
  readonly accessibilityLabel: string;
  readonly fidelityNotes: readonly string[];
  readonly leakageNotes: readonly string[];
};

const spec = (
  type: MathVisualType,
  purpose: string,
  data: MathVisualData,
  knownFacts: readonly string[],
  unknowns: readonly string[],
  accessibilityLabel: string,
  fidelityNotes: readonly string[],
  leakageNotes: readonly string[],
): MathVisualSpec => ({ type, purpose, data, knownFacts, unknowns, accessibilityLabel, fidelityNotes, leakageNotes });

export const mathVisualSpecs: Readonly<Record<string, MathVisualSpec>> = {
  'jiejie-mathematics-2': spec('FRACTION_PART_BAR', '以已知分數呈現分割關係，保留商為未知。', { numerator: 3, denominator: 4, divisorNumerator: 1, divisorDenominator: 2 }, ['3/4', '1/2'], ['商'], '一條分成四等份並標示已知三份的分數條，另一個已知半份關係以文字標籤呈現，商未標示。', ['只呈現題目給的分母與分數。'], ['不畫出可數出的半份數量或答案。']),
  'jiejie-mathematics-4': spec('CIRCLE_RADIUS_DIAMETER', '標示已知半徑，讓公式所需的幾何關係可見。', { radius: 5, radiusUnit: '公分', pi: 3.14 }, ['半徑 5 公分', 'π=3.14'], ['面積'], '一個圓與從圓心到圓周的半徑標記，面積未填。', ['不將圓畫成精確比例。'], ['不填色、不標面積數值。']),
  'jiejie-mathematics-11': spec('FRACTION_PART_BAR', '呈現已知總量與平分條件，保留每段長度為未知。', { numerator: 3, denominator: 4, parts: 3, unit: '公尺' }, ['3/4 公尺', '平均分成 3 段'], ['每段長度'], '一條分成四等份的 3/4 公尺分數條，平分段數以文字呈現，每段答案留白。', ['不把每段 1/4 公尺畫成答案。'], ['不標示 1/4 或任何選項值。']),
  'jiejie-mathematics-13': spec('CIRCLE_RADIUS_DIAMETER', '標示題目給的直徑，不替學生換算半徑。', { diameter: 10, diameterUnit: '公分', pi: 3.14 }, ['直徑 10 公分', 'π=3.14'], ['圓周長'], '直徑線穿過圓心並標示 10 公分，圓周長未標。', ['不另外標示半徑 5 公分。'], ['不在圓弧上寫答案或運算結果。']),
  'jiejie-mathematics-63': spec('GROUPING_ARRAY', '只呈現兩個原始數量，避免預先完成最大分組。', { firstQuantity: 36, secondQuantity: 48, firstLabel: '第一盒彩筆', secondLabel: '第二盒彩筆', layout: 'unpartitioned' }, ['36 枝', '48 枝', '大小相同且最多'], ['份數', '每份枝數'], '兩列中性排列的 36 與 48 枝數量標籤，沒有組界線、共同因數或切分。', ['不將物件畫成可被直接分組的答案排列。'], ['不畫 12 組、不畫每份 12 枝、不暗示共同因數。']),
  'jiejie-mathematics-67': spec('DECIMAL_MEASURE_SEGMENTS', '呈現總長與每段長，保留完整段數與餘長未知。', { total: 15.75, segment: 1.25, unit: '公尺' }, ['15.75 公尺', '每段 1.25 公尺'], ['完整段數', '剩餘長度'], '一條標示總長的線段與一個重複段模板，最後段數與餘長留白。', ['不按比例繪製，不預先切出段數。'], ['不畫 12 段或 0.75 公尺。']),
  'jiejie-mathematics-72': spec('CIRCLE_RADIUS_DIAMETER', '呈現兩個已知半徑的關係，不把面積倍數畫出來。', { firstRadius: 3, secondRadius: 6, radiusUnit: '公分' }, ['半徑 3 公分', '半徑 6 公分'], ['面積倍數'], '兩個圓各有半徑標記；圓的大小不代表精確面積比例。', ['不得用圓面積大小暗示答案。'], ['不填面積、不畫四倍區域或扇區。']),
  'jiejie-mathematics-110': spec('RECTANGLE_DIMENSIONS', '中性呈現長方形的已知長與寬。', { length: 12, width: 5, unit: '公分' }, ['長 12 公分', '寬 5 公分'], ['面積', '周長'], '只畫長方形與長、寬標籤，不加內部陰影或邊界提示文字。', ['圖形不按比例，不標示未給的邊。'], ['不以填色、粗框或箭頭提示 area/perimeter。']),
  'meimei-mathematics-1': spec('PLACE_VALUE_COLUMNS', '讓千、百、十、個的欄位關係可見。', { digits: [3, 4, 0, 7], places: '千百十個' }, ['3407', '千、百、十、個'], ['位值分解'], '四個位值欄含 3、4、0、7，分解答案列留白。', ['保留 0 個十，不把它移除。'], ['不預填 3000+400+7。']),
  'meimei-mathematics-2': spec('PLACE_VALUE_COLUMNS', '支援題目已明確要求的四位數加法對位。', { addends: [3482, 2157], operation: 'addition', places: '千百十個' }, ['3482', '2157', '加法'], ['進位', '和'], '對齊千百十個欄，進位格與答案列均留白。', ['運算子來自原題，不由 renderer 推測。'], ['不填進位、不填答案、不替學生完成直式。']),
  'meimei-mathematics-3': spec('GROUPING_ARRAY', '以等量分組呈現乘法的已知因子。', { groupCount: 3, perGroup: 24, groupLabel: '每組 24' }, ['3 組', '每組 24'], ['總數'], '三個相同的群組容器只標示每組 24，總數不畫出。', ['不以 72 個物件完成總數。'], ['不畫出 72 個圖示或總數標籤。']),
  'meimei-mathematics-4': spec('MEASUREMENT_RELATION', '呈現 cm 與 mm 的單位關係，不提供可直接數答案的完整尺。', { centimeter: 3, millimeter: 7, conversionMillimetersPerCentimeter: 10 }, ['3 公分', '7 毫米', '1 公分=10 毫米'], ['總毫米數'], '以單位關係卡呈現 1 公分與 10 個 1 毫米的關係，答案欄留白。', ['本題考單位換算，不模擬讀尺。'], ['不畫出 37 毫米終點或完整可數答案尺。']),
  'meimei-mathematics-9': spec('GROUPING_ARRAY', '以等組概念輔助三位數乘一位數。', { groupCount: 4, perGroup: 306, groupLabel: '每組 306' }, ['4 組', '每組 306'], ['總數'], '四個相同群組只標每組 306，總數保持未知。', ['不把 1224 畫成物件數量。'], ['不放總數或答案選項。']),
  'meimei-mathematics-10': spec('MEASUREMENT_RELATION', '呈現兩段已知長度與毫米進位關係。', { firstCentimeter: 6, firstMillimeter: 4, secondCentimeter: 2, secondMillimeter: 9, conversionMillimetersPerCentimeter: 10 }, ['6 公分 4 毫米', '2 公分 9 毫米', '10 毫米=1 公分'], ['合計長度'], '兩個單位關係卡並列，合計結果留白。', ['不以尺上終點直接呈現結果。'], ['不標示 9 公分 3 毫米。']),
  'meimei-mathematics-61': spec('BAR_MODEL', '呈現原有數量與新增數量的中性關係。', { firstQuantity: 3245, addedQuantity: 700, firstLabel: '原有故事書', addedLabel: '新買進', totalLabel: '現在共有？' }, ['3245 本', '增加 700 本'], ['現在總數'], '兩個未完成的數量條與空白總量框，不放加號或直式。', ['保留生活情境的數量關係，不替學生選運算。'], ['不放加號、進位格、計算式或答案。']),
  'meimei-mathematics-62': spec('PLACE_VALUE_COLUMNS', '讓百位位置可被定位，但不預先標示答案欄。', { digits: [6, 0, 8, 2], places: '千百十個', targetPlace: '百位' }, ['6082', '千、百、十、個'], ['百位數字'], '四個中性位值欄，目標欄不預先高亮。', ['0 百位需保持可見。'], ['不把百位欄染色或填入 0。']),
};

export function validateMathVisualSpec(candidate: unknown): candidate is MathVisualSpec {
  if (!candidate || typeof candidate !== 'object') return false;
  const value = candidate as Partial<MathVisualSpec>;
  if (!value.type || !value.data || typeof value.data !== 'object') return false;
  if (value.type === 'PLACE_VALUE_COLUMNS') return Array.isArray(value.data.digits) && value.data.digits.length === 4;
  if (value.type === 'MEASUREMENT_RELATION') return typeof value.data.centimeter === 'number' && typeof value.data.millimeter === 'number';
  return true;
}

export function attachMathVisuals<T extends QuestionCardQuestion>(questions: readonly T[]): T[] {
  return questions.map((question) => {
    const visual = mathVisualSpecs[question.id];
    return visual ? { ...question, visual } : { ...question };
  });
}
