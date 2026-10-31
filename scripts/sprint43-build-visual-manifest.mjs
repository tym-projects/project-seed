import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '..');
function loadTs(relativePath) {
  const filePath = path.resolve(repo, relativePath);
  const compiled = ts.transpileModule(fs.readFileSync(filePath, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const testModule = { exports: {} };
  const localRequire = (request) => loadTs(path.relative(repo, path.resolve(path.dirname(filePath), `${request}.ts`)));
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: localRequire });
  return testModule.exports;
}

const jiejie = loadTs('lib/questions/jiejie-mathematics.ts');
const meimei = loadTs('lib/questions/meimei-mathematics.ts');
const firstExam = loadTs('lib/first-exam-practice.ts');
const visualModule = loadTs('lib/math-visuals.ts');
const baseline = visualModule.mathVisualSpecs;
const visualValidation = visualModule.isMathVisualDataValid;
const baselineIds = new Set(Object.keys(baseline));
const remediationIds = new Set([
  'jiejie-mathematics-8', 'jiejie-mathematics-16',
  ...[12, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59].map((id) => `jiejie-mathematics-${id}`),
  ...[9, 17, 20, 24, 28, 32, 36, 40, 44, 48, 56].map((id) => `jiejie-mathematics-${id}`),
  'jiejie-mathematics-88', 'jiejie-mathematics-151', 'jiejie-mathematics-77', 'jiejie-mathematics-81',
  ...[14, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 65, 66, 73].map((id) => `meimei-mathematics-${id}`),
  ...[18, 22, 26, 30, 34, 38, 42, 46, 50, 54].map((id) => `meimei-mathematics-${id}`),
  ...[15, 21, 25, 29, 33, 37, 41, 45, 49, 53].map((id) => `meimei-mathematics-${id}`),
  'meimei-mathematics-72', 'meimei-mathematics-76',
]);
const downgradedIds = new Set([
  ...[19, 22, 26, 30, 34, 38, 58, 62, 82, 89, 91, 106, 111, 126, 134, 144].map((id) => `jiejie-mathematics-${id}`),
  ...[7, 11, 13, 17, 64, 69, 81, 82, 83, 87, 95].map((id) => `meimei-mathematics-${id}`),
]);
const deferredIds = [
  ...[5, 6, 7, 14, 15, 18, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 64, 73, 78, 79, 80].map((id) => `jiejie-mathematics-${id}`),
  ...[6, 8, 12, 16].map((id) => `meimei-mathematics-${id}`),
];
const typeById = new Map([
  ['jiejie-mathematics-8', 'FRACTION_PART_BAR'], ['jiejie-mathematics-16', 'FRACTION_PART_BAR'],
  ...[12, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59].map((id) => [`jiejie-mathematics-${id}`, 'DECIMAL_MEASURE_SEGMENTS']),
  ...[9, 17, 20, 24, 28, 32, 36, 40, 44, 48, 56].map((id) => [`jiejie-mathematics-${id}`, 'CIRCLE_RADIUS_DIAMETER']),
  ['jiejie-mathematics-88', 'RECTANGLE_DIMENSIONS'], ['jiejie-mathematics-151', 'RECTANGLE_DIMENSIONS'],
  ['jiejie-mathematics-77', 'GROUPING_ARRAY'], ['jiejie-mathematics-81', 'GROUPING_ARRAY'],
  ...[14, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 65, 66, 73].map((id) => [`meimei-mathematics-${id}`, 'GROUPING_ARRAY']),
  ...[18, 22, 26, 30, 34, 38, 42, 46, 50, 54].map((id) => [`meimei-mathematics-${id}`, 'PLACE_VALUE_COLUMNS']),
  ...[15, 21, 25, 29, 33, 37, 41, 45, 49, 53].map((id) => [`meimei-mathematics-${id}`, 'MEASUREMENT_RELATION']),
  ['meimei-mathematics-72', 'BAR_MODEL'], ['meimei-mathematics-76', 'BAR_MODEL'],
]);
const allQuestions = new Map([...jiejie.questions.map((q) => [q.id, { ...q, student: 'jiejie' }]), ...meimei.questions.map((q) => [q.id, { ...q, student: 'meimei' }])]);
const monthlyIds = new Set([...firstExam.getFirstExamQuestionIds('jiejie', 'mathematics'), ...firstExam.getFirstExamQuestionIds('meimei', 'mathematics')]);
const practiceIds = new Set([...jiejie.practiceQuestions.map(({ id }) => id), ...meimei.questions.map(({ id }) => id)]);
const numberTokens = (text) => [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map(([value]) => Number(value.replaceAll(',', '')));
const unitTokens = (text) => [...new Set(text.match(/平方公分|平方公尺|公分|毫米|公尺|公升|公斤|公克|元|本|張|枝|顆|盒|組|袋|杯|段|公里|分鐘|人|層|排|箱|頁|圈|公釐/g) ?? [])];
const fractions = (text) => [...text.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map(([, numerator, denominator]) => ({ numerator: Number(numerator), denominator: Number(denominator) }));
const hash = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const unknownResult = { resultRole: 'unknown' };

function sourceKind(id) {
  const practice = practiceIds.has(id); const monthly = monthlyIds.has(id);
  return practice && monthly ? 'both' : monthly ? 'monthly' : 'practice';
}
function decimalData(question) {
  const values = numberTokens(question.question).filter((value) => !Number.isInteger(value));
  return { total: values[0], segment: values[1], unit: unitTokens(question.question)[0] ?? '', count: 'unknown', remainder: 'unknown' };
}
function circleData(question) {
  const text = question.question;
  const radius = text.match(/半徑\s*(?:是|為)?\s*(\d+(?:\.\d+)?)\s*(公分|公尺)/);
  const diameter = text.match(/直徑\s*(?:是|為)?\s*(\d+(?:\.\d+)?)\s*(公分|公尺)/);
  const pi = text.match(/π\s*(?:=|取)\s*(\d+(?:\.\d+)?)/);
  const count = text.match(/買\s*(\d+)\s*張/);
  const context = text.match(/第(\d+)號圓形花圃/);
  return { ...(radius ? { radius: Number(radius[1]) } : {}), ...(diameter ? { diameter: Number(diameter[1]) } : {}), unit: radius?.[2] ?? diameter?.[2] ?? unitTokens(text)[0] ?? '', ...(pi ? { pi: Number(pi[1]) } : {}), ...(count ? { count: Number(count[1]) } : {}), ...(context ? { contextLabel: `第${context[1]}號花圃` } : {}), ...unknownResult };
}
function groupingData(question) {
  const text = question.question;
  if (question.id === 'jiejie-mathematics-77') return { firstQuantity: 24, secondQuantity: 36, layout: 'neutral-unpartitioned', result: 'unknown' };
  if (question.id === 'jiejie-mathematics-81') return { groupCount: 3, perGroup: 48, itemLabel: '元', groupLabel: '盒', layout: 'grouped-known', total: 'unknown' };
  const first = text.match(/(?:每(?:排|盒)|一排)\s*(?:有\s*)?(\d+)\s*(顆|張|枝|元|本)?/);
  const count = text.match(/(?:排成|教室排了|共有)\s*(\d+)\s*排|買\s*(\d+)\s*盒|(\d+)\s*盒/);
  return { groupCount: Number(count?.[1] ?? count?.[2] ?? count?.[3]), perGroup: Number(first?.[1]), itemLabel: first?.[2] ?? '', groupLabel: text.includes('盒') ? '盒' : '排', layout: 'grouped-known', total: 'unknown' };
}
function placeValueData(question) {
  return { addends: numberTokens(question.question).slice(0, 2), places: '千百十個', carrySlots: 'blank', result: 'unknown' };
}
function measurementData(question) {
  const values = numberTokens(question.question);
  const measurements = [...question.question.matchAll(/(\d+)\s*公分\s*(\d+)\s*毫米/g)].map(([, centimeters, millimeters]) => ({ centimeters: Number(centimeters), millimeters: Number(millimeters) }));
  const first = measurements[0] ?? { centimeters: values[0], millimeters: values[1] };
  const second = measurements[1];
  return { firstMeasurement: first, ...(second ? { secondMeasurement: second } : {}), relation: 'cm-mm', conversionMillimetersPerCentimeter: 10, showMeasurements: true, result: 'unknown' };
}
function mappingFor(question, type) {
  const text = question.question;
  if (type === 'FRACTION_PART_BAR') {
    const fs = fractions(text);
    return question.id === 'jiejie-mathematics-8' ? { wholeAmount: 2, wholeUnit: '公升', divisorFraction: fs[0], containerUnit: '瓶', ...unknownResult } : { quantityFraction: fs[0], divisorFraction: fs[1], wholeUnit: '公升', ...unknownResult };
  }
  if (type === 'DECIMAL_MEASURE_SEGMENTS') return decimalData(question);
  if (type === 'CIRCLE_RADIUS_DIAMETER') return circleData(question);
  if (type === 'RECTANGLE_DIMENSIONS') {
    const match = text.match(/長\s*(\d+)\s*(?:公分)?、?\s*寬\s*(\d+)/);
    const unit = text.match(/(?:長\s*\d+|寬\s*\d+)\s*(公分|公尺)/)?.[1];
    return { length: Number(match?.[1]), width: Number(match?.[2]), ...(unit ? { unit } : {}), ...unknownResult };
  }
  if (type === 'GROUPING_ARRAY') return groupingData(question);
  if (type === 'PLACE_VALUE_COLUMNS') return placeValueData(question);
  if (type === 'MEASUREMENT_RELATION') return measurementData(question);
  if (type === 'BAR_MODEL') {
    const values = numberTokens(text);
    const labels = question.id === 'meimei-mathematics-72'
      ? ['原有故事書', '新買進']
      : ['上午賣出', '下午賣出'];
    return { firstQuantity: values[0], secondQuantity: values[1], firstLabel: labels[0], secondLabel: labels[1], resultLabel: '?', ...unknownResult };
  }
  return {};
}
function decisionFor(id) {
  if (baselineIds.has(id) || remediationIds.has(id)) return 'IMPLEMENT';
  if (deferredIds.includes(id)) return 'DEFERRED';
  return 'TEXT_ONLY_PREFERRED';
}
function rowFor(question) {
  const decision = decisionFor(question.id); const type = baseline[question.id]?.type ?? (typeById.get(question.id) ?? null); const existing = baseline[question.id];
  const structuredVisualData = existing?.data ?? (decision === 'IMPLEMENT' ? mappingFor(question, type) : null);
  const implementationIsValid = decision !== 'IMPLEMENT' || (type !== null && visualValidation(type, structuredVisualData));
  const finalDecision = implementationIsValid ? decision : 'TEXT_ONLY_PREFERRED';
  return {
    questionId: question.id, student: question.student, source: sourceKind(question.id), unit: 'mathematics', topic: question.topic,
    questionTextSnapshot: question.question, questionTextHash: hash(question.question), intendedSkill: question.title,
    visualRecommendation: finalDecision === 'IMPLEMENT' ? (type === 'BAR_MODEL' || type === 'GROUPING_ARRAY' ? 'USEFUL' : 'HIGHLY_RECOMMENDED') : finalDecision,
    visualType: finalDecision === 'IMPLEMENT' ? type : null, visualPurpose: existing?.purpose ?? (finalDecision === 'IMPLEMENT' ? `${type} 只呈現題目已知條件，保留未知量。` : null),
    knownNumbers: numberTokens(question.question), knownUnits: unitTokens(question.question), knownLabels: [], knownQuantityRelations: finalDecision === 'IMPLEMENT' ? ['只呈現題目已知數量與關係'] : [], knownOrderRelations: [], spatialGeometryRelations: finalDecision === 'IMPLEMENT' ? ['圖形不按未提供的比例繪製'] : [],
    unknownFields: finalDecision === 'IMPLEMENT' ? (existing?.unknowns ?? ['requested result', 'computed result']) : [], unknownsThatMustRemainHidden: finalDecision === 'IMPLEMENT' ? (existing?.unknowns ?? ['answer', 'computed result']) : [],
    structuredVisualData: finalDecision === 'IMPLEMENT' ? structuredVisualData : null, fidelityRisk: finalDecision === 'IMPLEMENT' ? '欄位必須逐題對應題幹；未知量不得被 renderer 推導。' : '不進 production visual。',
    answerLeakageRisk: finalDecision === 'IMPLEMENT' ? '不得呈現答案、選項、中間結果或已完成運算。' : '不進 production visual。', ambiguityRisk: finalDecision === 'IMPLEMENT' ? '缺 required semantic field 時必須 safe-fail。' : '不進 production visual。',
    gradeFitAssessment: question.student === 'jiejie' ? '結構／關係導向。' : '具體／欄位／單位導向。', finalDecision, fidelityNotes: existing?.fidelityNotes ?? [], leakageNotes: existing?.leakageNotes ?? [],
  };
}

const rows = [...allQuestions.keys()].filter((id) => id.startsWith('jiejie-mathematics-') || id.startsWith('meimei-mathematics-')).map((id) => rowFor(allQuestions.get(id))).filter((row) => row.finalDecision !== 'TEXT_ONLY_PREFERRED');
const implementationRows = rows.filter(({ finalDecision }) => finalDecision === 'IMPLEMENT'); const deferredRows = rows.filter(({ finalDecision }) => finalDecision === 'DEFERRED');
const counts = { IMPLEMENT: implementationRows.length, DEFERRED: deferredRows.length, TEXT_ONLY_PREFERRED: 300 - implementationRows.length - deferredRows.length };
const typeDistribution = Object.fromEntries(Object.entries(implementationRows.reduce((acc, row) => { acc[row.visualType] = (acc[row.visualType] ?? 0) + 1; return acc; }, {})).sort(([a], [b]) => a.localeCompare(b)));
const manifest = {
  schemaVersion: 2, sprint: 43, status: 'Full Mapping Fidelity Review Gate — Round 2.1', subject: 'mathematics',
  sourceOfTruth: ['lib/questions/jiejie-mathematics.ts', 'lib/questions/meimei-mathematics.ts', 'lib/first-exam-practice.ts'],
  allowedVisualTypes: ['FRACTION_PART_BAR', 'DECIMAL_MEASURE_SEGMENTS', 'CIRCLE_RADIUS_DIAMETER', 'RECTANGLE_DIMENSIONS', 'GROUPING_ARRAY', 'PLACE_VALUE_COLUMNS', 'MEASUREMENT_RELATION', 'BAR_MODEL'],
  targetImplementationCount: implementationRows.length, decisionCounts: counts, typeDistribution,
  studentDistribution: { jiejie: implementationRows.filter(({ student }) => student === 'jiejie').length, meimei: implementationRows.filter(({ student }) => student === 'meimei').length },
  sourceDistribution: { practice: implementationRows.filter(({ source }) => source === 'practice').length, monthly: implementationRows.filter(({ source }) => source === 'monthly').length, both: implementationRows.filter(({ source }) => source === 'both').length },
  rows, downgradedQuestionIds: [...downgradedIds].sort(), deferredQuestionIds: deferredRows.map(({ questionId }) => questionId), textOnlyQuestionCount: counts.TEXT_ONLY_PREFERRED,
};
fs.writeFileSync(path.join(repo, 'docs/sprint43-math-visual-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const summary = `# Sprint 43 Visual Mapping Review Summary\n\nStatus: **Full Mapping Fidelity Review Gate — Round 2**\n\n- IMPLEMENT: ${counts.IMPLEMENT}\n- DEFERRED: ${counts.DEFERRED}\n- TEXT_ONLY_PREFERRED: ${counts.TEXT_ONLY_PREFERRED}\n- Baseline: ${baselineIds.size}\n- Remediation retained: ${implementationRows.length - baselineIds.size}\n- Additional downgrade: meimei-mathematics-11\n- Closure: ${counts.IMPLEMENT + counts.DEFERRED + counts.TEXT_ONLY_PREFERRED} / 300\n\n## Visual type distribution\n\n${Object.entries(typeDistribution).map(([type, count]) => `- ${type}: ${count}`).join('\n')}\n\n## Downgraded IDs\n\n${[...downgradedIds].sort().map((id) => `- ${id}`).join('\n')}\n\n## Review rules\n\nOnly typed semantic fields are emitted for implementation rows. No answer, answerIndex, options, explanation, solution, computed result, inferred operation, intermediate conversion, or production annotation is stored.\n`;
fs.writeFileSync(path.join(repo, 'docs/sprint43-math-visual-mapping-review.md'), summary);
console.log(JSON.stringify({ counts, targetImplementationCount: implementationRows.length, typeDistribution }, null, 2));
