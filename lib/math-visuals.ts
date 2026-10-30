import type { QuestionCardQuestion } from '@/components/question/QuestionCard';

export type MathVisualType = 'FRACTION_PART_BAR' | 'DECIMAL_MEASURE_SEGMENTS' | 'CIRCLE_RADIUS_DIAMETER' | 'RECTANGLE_DIMENSIONS' | 'RATIO_PARTS' | 'GROUPING_ARRAY' | 'PLACE_VALUE_COLUMNS' | 'MEASUREMENT_RELATION' | 'BAR_MODEL';
type UnknownResult = { readonly resultRole: 'unknown' };
export type FractionVisualData = UnknownResult & { readonly wholeAmount?: number; readonly wholeUnit?: string; readonly quantityFraction?: { readonly numerator: number; readonly denominator: number }; readonly divisorFraction?: { readonly numerator: number; readonly denominator: number }; readonly containerUnit?: string; readonly parts?: number };
export type DecimalVisualData = { readonly total: number; readonly segment: number; readonly unit: string; readonly count: 'unknown'; readonly remainder: 'unknown' };
export type CircleVisualData = UnknownResult & { readonly radius?: number; readonly diameter?: number; readonly secondaryRadius?: number; readonly unit: string; readonly pi?: number; readonly count?: number; readonly contextLabel?: string };
export type RectangleVisualData = UnknownResult & { readonly length: number; readonly width: number; readonly unit?: string };
export type GroupingVisualData = { readonly groupCount?: number; readonly perGroup?: number; readonly firstQuantity?: number; readonly secondQuantity?: number; readonly itemLabel?: string; readonly groupLabel?: string; readonly firstLabel?: string; readonly secondLabel?: string; readonly layout: 'grouped-known' | 'neutral-unpartitioned'; readonly total?: 'unknown'; readonly result?: 'unknown' };
export type PlaceValueVisualData = { readonly digits?: readonly number[]; readonly addends?: readonly number[]; readonly places: '千百十個'; readonly carrySlots?: 'blank'; readonly result?: 'unknown'; readonly targetPlace?: string };
export type MeasurementVisualData = { readonly firstMeasurement: { readonly centimeters: number; readonly millimeters: number }; readonly secondMeasurement?: { readonly centimeters: number; readonly millimeters: number }; readonly relation: 'cm-mm'; readonly conversionMillimetersPerCentimeter?: 10; readonly showMeasurements?: boolean; readonly result: 'unknown' };
export type BarVisualData = UnknownResult & { readonly firstQuantity: number; readonly secondQuantity: number; readonly firstLabel: string; readonly secondLabel: string; readonly resultLabel: '?' };
export type MathVisualData = FractionVisualData | DecimalVisualData | CircleVisualData | RectangleVisualData | GroupingVisualData | PlaceValueVisualData | MeasurementVisualData | BarVisualData;
export type MathVisualSpec = { readonly type: MathVisualType; readonly purpose: string; readonly data: MathVisualData; readonly knownFacts: readonly string[]; readonly unknowns: readonly string[]; readonly accessibilityLabel: string; readonly fidelityNotes: readonly string[]; readonly leakageNotes: readonly string[] };

const spec = (type: MathVisualType, purpose: string, data: MathVisualData, knownFacts: readonly string[], unknowns: readonly string[], accessibilityLabel: string, fidelityNotes: readonly string[], leakageNotes: readonly string[]): MathVisualSpec => ({ type, purpose, data, knownFacts, unknowns, accessibilityLabel, fidelityNotes, leakageNotes });

export const mathVisualSpecs: Readonly<Record<string, MathVisualSpec>> = {
  'jiejie-mathematics-2': spec('FRACTION_PART_BAR', '以已知分數呈現分割關係，保留商為未知。', { quantityFraction: { numerator: 3, denominator: 4 }, divisorFraction: { numerator: 1, denominator: 2 }, resultRole: 'unknown' }, ['3/4', '1/2'], ['商'], '已知分數與除數關係，商未標示。', ['只呈現題目給的分母與分數。'], ['不畫出答案。']),
  'jiejie-mathematics-4': spec('CIRCLE_RADIUS_DIAMETER', '標示已知半徑，讓公式所需的幾何關係可見。', { radius: 5, unit: '公分', pi: 3.14, resultRole: 'unknown' }, ['半徑 5 公分', 'π=3.14'], ['面積'], '圓心至圓周的半徑標記，面積未填。', ['不按比例。'], ['不填面積。']),
  'jiejie-mathematics-11': spec('FRACTION_PART_BAR', '呈現已知總量與平分條件，保留每段長度為未知。', { quantityFraction: { numerator: 3, denominator: 4 }, parts: 3, wholeUnit: '公尺', resultRole: 'unknown' }, ['3/4 公尺', '平均分成 3 段'], ['每段長度'], '分數條與平分條件，答案留白。', ['不畫每段答案。'], ['不標示 1/4。']),
  'jiejie-mathematics-13': spec('CIRCLE_RADIUS_DIAMETER', '標示題目給的直徑，不替學生換算半徑。', { diameter: 10, unit: '公分', pi: 3.14, resultRole: 'unknown' }, ['直徑 10 公分', 'π=3.14'], ['圓周長'], '直徑線穿過圓心，圓周長未標。', ['不標半徑。'], ['不寫答案。']),
  'jiejie-mathematics-63': spec('GROUPING_ARRAY', '只呈現兩個原始數量，避免預先完成最大分組。', { firstQuantity: 36, secondQuantity: 48, firstLabel: '第一盒彩筆', secondLabel: '第二盒彩筆', layout: 'neutral-unpartitioned', result: 'unknown' }, ['36 枝', '48 枝', '大小相同且最多'], ['份數', '每份枝數'], '兩列中性數量標籤，沒有組界線。', ['不畫共同因數。'], ['不畫答案。']),
  'jiejie-mathematics-67': spec('DECIMAL_MEASURE_SEGMENTS', '呈現總長與每段長，保留完整段數與餘長未知。', { total: 15.75, segment: 1.25, unit: '公尺', count: 'unknown', remainder: 'unknown' }, ['15.75 公尺', '每段 1.25 公尺'], ['完整段數', '剩餘長度'], '總長與每段模板，段數與餘長留白。', ['不按比例。'], ['不畫 12 段或 0.75 公尺。']),
  'jiejie-mathematics-72': spec('CIRCLE_RADIUS_DIAMETER', '呈現兩個已知半徑的關係，不把面積倍數畫出來。', { radius: 3, secondaryRadius: 6, unit: '公分', resultRole: 'unknown' }, ['半徑 3 公分', '半徑 6 公分'], ['面積倍數'], '兩個圓各有半徑標記，大小不代表面積比例。', ['不按面積比例。'], ['不畫四倍區域。']),
  'jiejie-mathematics-110': spec('RECTANGLE_DIMENSIONS', '中性呈現長方形的已知長與寬。', { length: 12, width: 5, unit: '公分', resultRole: 'unknown' }, ['長 12 公分', '寬 5 公分'], ['面積', '周長'], '只畫長、寬標籤。', ['不按比例。'], ['不提示答案。']),
  'meimei-mathematics-1': spec('PLACE_VALUE_COLUMNS', '讓千、百、十、個的欄位關係可見。', { digits: [3, 4, 0, 7], places: '千百十個' }, ['3407', '千、百、十、個'], ['位值分解'], '四個位值欄，分解答案列留白。', ['保留 0 個十。'], ['不預填分解。']),
  'meimei-mathematics-2': spec('PLACE_VALUE_COLUMNS', '支援題目已明確要求的四位數加法對位。', { addends: [3482, 2157], places: '千百十個', carrySlots: 'blank', result: 'unknown' }, ['3482', '2157', '加法'], ['進位', '和'], '對齊欄位，進位格與答案列留白。', ['運算子來自原題。'], ['不填答案。']),
  'meimei-mathematics-3': spec('GROUPING_ARRAY', '以等量分組呈現乘法的已知因子。', { groupCount: 3, perGroup: 24, itemLabel: '個', groupLabel: '組', layout: 'grouped-known', total: 'unknown' }, ['3 組', '每組 24'], ['總數'], '三個抽象群組只標示每組 24。', ['不畫 72 個物件。'], ['不放總數。']),
  'meimei-mathematics-4': spec('MEASUREMENT_RELATION', '呈現 cm 與 mm 的單位關係，不提供可直接數答案的尺。', { firstMeasurement: { centimeters: 3, millimeters: 7 }, relation: 'cm-mm', conversionMillimetersPerCentimeter: 10, result: 'unknown' }, ['3 公分', '7 毫米', '1 公分=10 毫米'], ['總毫米數'], '已知長度與單位關係卡，答案留白。', ['不模擬讀尺。'], ['不畫 37 毫米終點。']),
  'meimei-mathematics-9': spec('GROUPING_ARRAY', '以等組概念輔助三位數乘一位數。', { groupCount: 4, perGroup: 306, itemLabel: '個', groupLabel: '組', layout: 'grouped-known', total: 'unknown' }, ['4 組', '每組 306'], ['總數'], '四個抽象群組只標示每組 306。', ['不畫 1224。'], ['不放答案。']),
  'meimei-mathematics-10': spec('MEASUREMENT_RELATION', '呈現兩段已知長度與毫米進位關係。', { firstMeasurement: { centimeters: 6, millimeters: 4 }, secondMeasurement: { centimeters: 2, millimeters: 9 }, relation: 'cm-mm', conversionMillimetersPerCentimeter: 10, result: 'unknown' }, ['6 公分 4 毫米', '2 公分 9 毫米'], ['合計長度'], '兩個已知單位量並列，合計留白。', ['不以尺上終點呈現結果。'], ['不標示 9 公分 3 毫米。']),
  'meimei-mathematics-61': spec('BAR_MODEL', '呈現原有數量與新增數量的中性關係。', { firstQuantity: 3245, secondQuantity: 700, firstLabel: '原有故事書', secondLabel: '新買進', resultLabel: '?', resultRole: 'unknown' }, ['3245 本', '增加 700 本'], ['現在總數'], '兩個中性數量條與空白總量框。', ['不預選運算。'], ['不放答案。']),
  'meimei-mathematics-62': spec('PLACE_VALUE_COLUMNS', '讓百位位置可被定位，但不預先標示答案欄。', { digits: [6, 0, 8, 2], places: '千百十個', targetPlace: '百位' }, ['6082', '千、百、十、個'], ['百位數字'], '四個中性位值欄，目標欄不高亮。', ['保留 0。'], ['不填百位答案。']),
};

function isNumber(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value); }
function hasFraction(value: unknown): value is { numerator: number; denominator: number } { if (!value || typeof value !== 'object') return false; const fraction = value as { numerator?: unknown; denominator?: unknown }; return isNumber(fraction.numerator) && isNumber(fraction.denominator) && fraction.denominator > 0; }
function hasMeasurement(value: unknown): value is { centimeters: number; millimeters: number } { if (!value || typeof value !== 'object') return false; const measurement = value as { centimeters?: unknown; millimeters?: unknown }; return isNumber(measurement.centimeters) && isNumber(measurement.millimeters); }
function hasNumberArray(value: unknown, length?: number): value is readonly number[] { return Array.isArray(value) && (length === undefined || value.length === length) && value.every(isNumber); }
function isDataFor(type: MathVisualType, data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const value = data as Record<string, unknown>;
  if (type === 'FRACTION_PART_BAR') return value.resultRole === 'unknown' && (hasFraction(value.quantityFraction) || (isNumber(value.wholeAmount) && hasFraction(value.divisorFraction)));
  if (type === 'DECIMAL_MEASURE_SEGMENTS') return isNumber(value.total) && isNumber(value.segment) && typeof value.unit === 'string' && value.count === 'unknown' && value.remainder === 'unknown';
  if (type === 'CIRCLE_RADIUS_DIAMETER') return typeof value.unit === 'string' && (isNumber(value.radius) || isNumber(value.diameter)) && value.resultRole === 'unknown';
  if (type === 'RECTANGLE_DIMENSIONS') return isNumber(value.length) && isNumber(value.width) && value.resultRole === 'unknown';
  if (type === 'GROUPING_ARRAY') return (value.layout === 'neutral-unpartitioned' && isNumber(value.firstQuantity) && isNumber(value.secondQuantity)) || (value.layout === 'grouped-known' && isNumber(value.groupCount) && isNumber(value.perGroup) && value.total === 'unknown');
  if (type === 'PLACE_VALUE_COLUMNS') return value.places === '千百十個' && ((hasNumberArray(value.digits, 4)) || (hasNumberArray(value.addends) && value.addends.length > 0 && value.result === 'unknown'));
  if (type === 'MEASUREMENT_RELATION') return value.relation === 'cm-mm' && hasMeasurement(value.firstMeasurement) && (!value.secondMeasurement || hasMeasurement(value.secondMeasurement)) && value.result === 'unknown';
  if (type === 'BAR_MODEL') return isNumber(value.firstQuantity) && isNumber(value.secondQuantity) && typeof value.firstLabel === 'string' && typeof value.secondLabel === 'string' && value.resultLabel === '?';
  return false;
}

export function validateMathVisualSpec(candidate: unknown): candidate is MathVisualSpec {
  if (!candidate || typeof candidate !== 'object') return false;
  const value = candidate as Partial<MathVisualSpec>;
  return typeof value.type === 'string' && isDataFor(value.type as MathVisualType, value.data);
}

export function isMathVisualDataValid(type: MathVisualType, data: unknown): boolean { return isDataFor(type, data); }
export function attachMathVisuals<T extends QuestionCardQuestion>(questions: readonly T[]): T[] { return questions.map((question) => { const visual = mathVisualSpecs[question.id]; return visual ? { ...question, visual } : { ...question }; }); }
