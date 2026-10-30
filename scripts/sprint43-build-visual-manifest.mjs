import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '..');

function loadTs(relativePath) {
  const filePath = path.resolve(repo, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = (request) => loadTs(path.relative(repo, path.resolve(path.dirname(filePath), `${request}.ts`)));
  vm.runInNewContext(compiled, { exports: module.exports, module, require: localRequire });
  return module.exports;
}

const jiejie = loadTs('lib/questions/jiejie-mathematics.ts');
const meimei = loadTs('lib/questions/meimei-mathematics.ts');
const firstExam = loadTs('lib/first-exam-practice.ts');
const baseline = loadTs('lib/math-visuals.ts').mathVisualSpecs;

const plans = {
  'FRACTION_PART_BAR': [2, 8, 11, 16, 19, 22, 26, 30, 34, 38, 58, 62].map((id) => `jiejie-mathematics-${id}`),
  'DECIMAL_MEASURE_SEGMENTS': [12, 23, 27, 31, 35, 39, 43, 47, 51, 55, 59, 67].map((id) => `jiejie-mathematics-${id}`),
  'CIRCLE_RADIUS_DIAMETER': [4, 9, 13, 17, 20, 24, 28, 32, 36, 40, 44, 48, 56, 72].map((id) => `jiejie-mathematics-${id}`),
  'RECTANGLE_DIMENSIONS': [88, 110, 126, 134, 144, 151].map((id) => `jiejie-mathematics-${id}`),
  'GROUPING_ARRAY': [63, 77, 81, 82, 89, 91, 106, 111].map((id) => `jiejie-mathematics-${id}`),
  'PLACE_VALUE_COLUMNS': [1, 2, 7, 11, 13, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 62].map((id) => `meimei-mathematics-${id}`),
  'MEASUREMENT_RELATION': [4, 10, 15, 21, 25, 29, 33, 37, 41, 45, 49, 53].map((id) => `meimei-mathematics-${id}`),
  'GROUPING_ARRAY_MEIMEI': [3, 9, 14, 17, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 65, 66, 73].map((id) => `meimei-mathematics-${id}`),
  'BAR_MODEL': [61, 64, 69, 72, 76, 81, 82, 83, 87, 95].map((id) => `meimei-mathematics-${id}`),
};

const deferredIds = [
  ...[5, 6, 7, 14, 15, 18, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57, 61, 64, 73, 78, 79, 80].map((id) => `jiejie-mathematics-${id}`),
  ...[6, 8, 12, 16].map((id) => `meimei-mathematics-${id}`),
];

const typeById = new Map();
for (const [type, ids] of Object.entries(plans)) {
  for (const id of ids) typeById.set(id, type === 'GROUPING_ARRAY_MEIMEI' ? 'GROUPING_ARRAY' : type);
}

const allQuestions = new Map([
  ...jiejie.questions.map((question) => [question.id, { ...question, student: 'jiejie' }]),
  ...meimei.questions.map((question) => [question.id, { ...question, student: 'meimei' }]),
]);
const monthlyIds = new Set([
  ...firstExam.getFirstExamQuestionIds('jiejie', 'mathematics'),
  ...firstExam.getFirstExamQuestionIds('meimei', 'mathematics'),
]);
const practiceIds = new Set([
  ...jiejie.practiceQuestions.map(({ id }) => id),
  ...meimei.questions.map(({ id }) => id),
]);

const numberTokens = (text) => [...text.matchAll(/\d+(?:\.\d+)?/g)].map(([value]) => Number(value));
const unitTokens = (text) => [...new Set(text.match(/平方公分|平方公尺|公分|毫米|公尺|公升|公斤|公克|元|本|張|枝|顆|盒|組|袋|杯|段|公尺|公里|分鐘|人|層|排|箱|頁|圈|公釐/g) ?? [])];
const questionHash = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const nums = (text) => numberTokens(text);

function sourceKind(id) {
  const practice = practiceIds.has(id);
  const monthly = monthlyIds.has(id);
  return practice && monthly ? 'both' : monthly ? 'monthly' : 'practice';
}

function fractions(text) {
  return [...text.matchAll(/(\d+)\s*\/\s*(\d+)/g)].map(([, numerator, denominator]) => ({ numerator: Number(numerator), denominator: Number(denominator) }));
}

function labelsFor(question, type) {
  const text = question.question;
  if (type === 'PLACE_VALUE_COLUMNS') return ['千', '百', '十', '個'];
  if (type === 'MEASUREMENT_RELATION') return ['公分', '毫米'];
  if (type === 'CIRCLE_RADIUS_DIAMETER') return text.includes('直徑') ? ['圓心', '直徑'] : ['圓心', '半徑'];
  if (type === 'RECTANGLE_DIMENSIONS') return text.includes('正方形') ? ['正方形', '邊長'] : ['長方形', '長', '寬'];
  if (type === 'GROUPING_ARRAY') return text.includes('排') ? ['每排', '排數'] : ['等量分組', '總數未知'];
  if (type === 'BAR_MODEL') return ['已知數量', '關係', '結果未知'];
  return ['已知量', '未知量留白'];
}

function dataFor(question, type) {
  const text = question.question;
  const values = nums(text);
  const fs = fractions(text);
  if (type === 'FRACTION_PART_BAR') {
    const data = { knownFractions: fs, knownNumbers: values, unit: unitTokens(text)[0] ?? null };
    const partMatch = text.match(/分成\s*(\d+)\s*段/);
    if (partMatch) data.knownParts = Number(partMatch[1]);
    return data;
  }
  if (type === 'DECIMAL_MEASURE_SEGMENTS') {
    return { knownDecimals: values.filter((value) => !Number.isInteger(value)), unit: unitTokens(text)[0] ?? null, segmentRelation: 'total-and-segment-known; count-and-remainder-unknown' };
  }
  if (type === 'CIRCLE_RADIUS_DIAMETER') {
    return { knownNumbers: values, knownUnits: unitTokens(text), geometry: text.includes('直徑') ? 'diameter-through-centre' : 'radius-centre-to-edge' };
  }
  if (type === 'RECTANGLE_DIMENSIONS') {
    return { knownNumbers: values, knownUnits: unitTokens(text), geometry: text.includes('正方形') ? 'square' : 'rectangle', dimensionsAreNotToScale: true };
  }
  if (type === 'GROUPING_ARRAY') {
    return { knownNumbers: values, knownUnits: unitTokens(text), layout: 'neutral-unpartitioned', groupingBoundary: 'unknown' };
  }
  if (type === 'PLACE_VALUE_COLUMNS') {
    return { knownNumbers: values, places: '千百十個', carrySlots: 'blank', resultRow: 'blank' };
  }
  if (type === 'MEASUREMENT_RELATION') {
    return { knownNumbers: values, knownUnits: unitTokens(text), relationCardOnly: true, answerEndpoint: 'blank' };
  }
  return { knownNumbers: values, knownUnits: unitTokens(text), relation: 'known quantities shown; requested total remains unknown' };
}

function decisionFor(id) {
  if (typeById.has(id)) return 'IMPLEMENT';
  if (deferredIds.includes(id)) return 'DEFERRED';
  return 'TEXT_ONLY_PREFERRED';
}

function reasonFor(question, decision, type) {
  if (decision === 'IMPLEMENT') return `${type} 可由題目明確提供的數量／單位／關係建立；未知量保留空白，不放入答案或運算結果。`;
  if (decision === 'DEFERRED') return question.id === 'jiejie-mathematics-5'
    ? '既有 scope anomaly；不以 visual 合法化未確認的比／比例範圍。'
    : '本輪不新增 renderer type，或視覺化會增加操作／答案提示風險；保留至後續獨立 review。';
  return '文字已足夠精確，或視覺化會重複計算、需要未提供的比例尺／分組／運算判斷。';
}

function rowFor(question) {
  const decision = decisionFor(question.id);
  const type = typeById.get(question.id) ?? null;
  const existing = baseline[question.id];
  const exactBaseline = existing ? {
    purpose: existing.purpose,
    structuredVisualData: existing.data,
    knownFacts: existing.knownFacts,
    unknowns: existing.unknowns,
    accessibilityLabel: existing.accessibilityLabel,
    fidelityNotes: existing.fidelityNotes,
    leakageNotes: existing.leakageNotes,
  } : null;
  return {
    questionId: question.id,
    student: question.student,
    source: sourceKind(question.id),
    unit: 'mathematics',
    topic: question.topic,
    questionTextSnapshot: question.question,
    questionTextHash: questionHash(question.question),
    intendedSkill: question.title,
    visualRecommendation: decision === 'IMPLEMENT' ? (type === 'BAR_MODEL' || type === 'GROUPING_ARRAY' ? 'USEFUL' : 'HIGHLY_RECOMMENDED') : decision,
    visualType: decision === 'IMPLEMENT' ? type : null,
    visualPurpose: exactBaseline?.purpose ?? (decision === 'IMPLEMENT' ? `${type} 只呈現題目已知條件，讓關係可見並保留作答所需未知量。` : null),
    knownNumbers: nums(question.question),
    knownUnits: unitTokens(question.question),
    knownLabels: labelsFor(question, type),
    knownQuantityRelations: decision === 'IMPLEMENT' ? ['只呈現題目已知數量與關係'] : [],
    knownOrderRelations: [],
    spatialGeometryRelations: decision === 'IMPLEMENT' ? ['圖形不按未提供的比例繪製'] : [],
    unknownFields: decision === 'IMPLEMENT' ? (exactBaseline?.unknowns ?? ['requested result', 'computed total or operation result']) : [],
    unknownsThatMustRemainHidden: decision === 'IMPLEMENT' ? (exactBaseline?.unknowns ?? ['answer', 'computed result']) : [],
    structuredVisualData: decision === 'IMPLEMENT' ? (exactBaseline?.structuredVisualData ?? dataFor(question, type)) : null,
    fidelityRisk: decision === 'IMPLEMENT' ? '數字、單位與關係必須逐題對應題幹；圖形不可按答案或未提供比例繪製。' : reasonFor(question, decision, type),
    answerLeakageRisk: decision === 'IMPLEMENT' ? '不得呈現 answer、answerIndex、選項值、計算結果、正確分組或可直接讀出的終點。' : '不進 production visual。',
    ambiguityRisk: decision === 'IMPLEMENT' ? '若中性圖仍可能被讀成已完成運算或已完成分組，降為 TEXT_ONLY_PREFERRED。' : reasonFor(question, decision, type),
    gradeFitAssessment: question.student === 'jiejie' ? '結構／關係導向，符合姐姐視覺層級。' : '具體／欄位／單位導向，符合妹妹視覺層級。',
    finalDecision: decision,
    fidelityNotes: exactBaseline?.fidelityNotes ?? [],
    leakageNotes: exactBaseline?.leakageNotes ?? [],
  };
}

const orderedIds = [...typeById.keys()].sort((a, b) => {
  const [studentA, , , numberA] = a.split('-');
  const [studentB, , , numberB] = b.split('-');
  return studentA.localeCompare(studentB) || Number(numberA) - Number(numberB);
});
const rows = [...orderedIds, ...deferredIds].filter((id, index, ids) => ids.indexOf(id) === index).map((id) => rowFor(allQuestions.get(id)));
const implementationRows = rows.filter(({ finalDecision }) => finalDecision === 'IMPLEMENT');
const deferredRows = rows.filter(({ finalDecision }) => finalDecision === 'DEFERRED');
const counts = {
  IMPLEMENT: implementationRows.length,
  DEFERRED: deferredRows.length,
  TEXT_ONLY_PREFERRED: 300 - implementationRows.length - deferredRows.length,
};
const typeDistribution = Object.fromEntries(Object.entries(implementationRows.reduce((acc, row) => {
  acc[row.visualType] = (acc[row.visualType] ?? 0) + 1;
  return acc;
}, {})).sort(([a], [b]) => a.localeCompare(b)));

const manifest = {
  schemaVersion: 1,
  sprint: 43,
  status: 'Full Mapping Fidelity Review Gate',
  subject: 'mathematics',
  sourceOfTruth: ['lib/questions/jiejie-mathematics.ts', 'lib/questions/meimei-mathematics.ts', 'lib/first-exam-practice.ts'],
  allowedVisualTypes: ['FRACTION_PART_BAR', 'DECIMAL_MEASURE_SEGMENTS', 'CIRCLE_RADIUS_DIAMETER', 'RECTANGLE_DIMENSIONS', 'GROUPING_ARRAY', 'PLACE_VALUE_COLUMNS', 'MEASUREMENT_RELATION', 'BAR_MODEL'],
  targetImplementationCount: 108,
  decisionCounts: counts,
  typeDistribution,
  studentDistribution: {
    jiejie: implementationRows.filter(({ student }) => student === 'jiejie').length,
    meimei: implementationRows.filter(({ student }) => student === 'meimei').length,
  },
  sourceDistribution: {
    practice: implementationRows.filter(({ source }) => source === 'practice').length,
    monthly: implementationRows.filter(({ source }) => source === 'monthly').length,
    both: implementationRows.filter(({ source }) => source === 'both').length,
  },
  rows,
  deferredQuestionIds: deferredRows.map(({ questionId }) => questionId),
  textOnlyQuestionCount: counts.TEXT_ONLY_PREFERRED,
};

const docsDir = path.join(repo, 'docs');
fs.writeFileSync(path.join(docsDir, 'sprint43-math-visual-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const summary = `# Sprint 43 Visual Mapping Review Summary\n\nStatus: **Full Mapping Fidelity Review Gate**\n\n- Implementation target: ${manifest.targetImplementationCount}\n- IMPLEMENT: ${counts.IMPLEMENT}\n- DEFERRED: ${counts.DEFERRED}\n- TEXT_ONLY_PREFERRED: ${counts.TEXT_ONLY_PREFERRED}\n- Closure: ${counts.IMPLEMENT + counts.DEFERRED + counts.TEXT_ONLY_PREFERRED} / 300\n- Students: 姐姐 ${manifest.studentDistribution.jiejie}; 妹妹 ${manifest.studentDistribution.meimei}\n- IMPLEMENT source: practice ${manifest.sourceDistribution.practice}; monthly-only ${manifest.sourceDistribution.monthly}; both ${manifest.sourceDistribution.both}\n\n## Visual type distribution\n\n${Object.entries(typeDistribution).map(([type, count]) => `- ${type}: ${count}`).join('\n')}\n\n## Approved baseline\n\nAll 16 existing representative mappings are retained byte-for-byte in structuredVisualData, purpose, unknowns, fidelity notes, and leakage notes.\n\n## Deferred IDs\n\n${deferredRows.map(({ questionId }) => `- ${questionId}`).join('\n')}\n\n## Review rules\n\nThe manifest records only known question conditions. It stores no answer, answerIndex, options, explanation, solution, computed result, inferred operation, or production annotation. Mapping completion stops here for Owner / ChatGPT Full Mapping Fidelity Review; no renderer or question-bank changes are authorized by this artifact.\n`;
fs.writeFileSync(path.join(docsDir, 'sprint43-math-visual-mapping-review.md'), summary);

console.log(JSON.stringify({ manifest: 'docs/sprint43-math-visual-manifest.json', summary: 'docs/sprint43-math-visual-mapping-review.md', counts, typeDistribution }, null, 2));
