import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

function loadTs(fileName) {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

function loadTsWithRelativeRequires(fileName, cache = new Map()) {
  const resolved = path.isAbsolute(fileName)
    ? path.resolve(fileName)
    : path.resolve(fileURLToPath(new URL(`./${fileName}`, import.meta.url)));
  if (cache.has(resolved)) return cache.get(resolved);
  const source = readFileSync(resolved, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  cache.set(resolved, testModule.exports);
  const localRequire = (request) => loadTsWithRelativeRequires(`${path.resolve(path.dirname(resolved), request)}.ts`, cache);
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: localRequire });
  return testModule.exports;
}

const visualModule = () => loadTs('math-visuals.ts');

const representativeIds = [
  'jiejie-mathematics-2', 'jiejie-mathematics-4', 'jiejie-mathematics-11', 'jiejie-mathematics-13',
  'jiejie-mathematics-63', 'jiejie-mathematics-67', 'jiejie-mathematics-72', 'jiejie-mathematics-110',
  'meimei-mathematics-1', 'meimei-mathematics-2', 'meimei-mathematics-3', 'meimei-mathematics-4',
  'meimei-mathematics-9', 'meimei-mathematics-10', 'meimei-mathematics-61', 'meimei-mathematics-62',
];

test('representative math visual specs cover exactly 16 approved IDs', () => {
  const { mathVisualSpecs } = visualModule();
  assert.deepEqual(Object.keys(mathVisualSpecs).sort(), [...representativeIds].sort());
  for (const id of representativeIds) {
    assert.ok(mathVisualSpecs[id].type, `${id}: visual type`);
    assert.ok(mathVisualSpecs[id].accessibilityLabel, `${id}: accessibility label`);
    assert.ok(mathVisualSpecs[id].unknowns.length > 0, `${id}: unknown remains explicit`);
  }
});

test('visual specs never store answer, options, or answer-coupled values', () => {
  const { mathVisualSpecs } = visualModule();
  for (const [id, spec] of Object.entries(mathVisualSpecs)) {
    assert.equal('answer' in spec, false, `${id}: answer field`);
    assert.equal('answerIndex' in spec, false, `${id}: answerIndex field`);
    assert.equal('options' in spec, false, `${id}: options field`);
    assert.equal(spec.unknowns.some((value) => /答案|正確|result/i.test(value)), false, `${id}: answer-like unknown`);
  }
});

test('visual attachment is optional and preserves questions without a visual', () => {
  const { attachMathVisuals } = visualModule();
  const source = [
    { id: 'jiejie-mathematics-2', question: 'original', options: ['a', 'b'], answer: 1 },
    { id: 'unannotated-question', question: 'unchanged', options: ['a', 'b'], answer: 0 },
  ];
  const attached = attachMathVisuals(source);
  assert.notEqual(attached, source);
  assert.equal(attached[0].question, 'original');
  assert.ok(attached[0].visual);
  assert.equal(attached[1].id, source[1].id);
  assert.equal(attached[1].question, source[1].question);
  assert.equal(attached[1].answer, source[1].answer);
  assert.equal('visual' in source[0], false);
});

test('missing required visual data fails safely instead of inventing values', () => {
  const { validateMathVisualSpec } = visualModule();
  assert.equal(validateMathVisualSpec({ type: 'PLACE_VALUE_COLUMNS', data: {} }), false);
  assert.equal(validateMathVisualSpec({ type: 'MEASUREMENT_RELATION', data: { centimeter: 1, millimeter: 10 } }), true);
});

test('the two mathematics banks attach visuals to exactly the 16 representative questions', () => {
  const { mathVisualSpecs } = visualModule();
  const jiejie = loadTsWithRelativeRequires('questions/jiejie-mathematics.ts');
  const meimei = loadTsWithRelativeRequires('questions/meimei-mathematics.ts');
  const allIds = [...jiejie.questions, ...meimei.questions].map(({ id }) => id);
  const annotatedIds = allIds.filter((id) => mathVisualSpecs[id]);
  assert.equal(annotatedIds.length, 16);
  assert.equal(mathVisualSpecs['meimei-mathematics-61'].type, 'BAR_MODEL');
  assert.equal(mathVisualSpecs['jiejie-mathematics-63'].type, 'GROUPING_ARRAY');
  assert.equal(jiejie.questions.some(({ visual }) => visual), false);
  assert.equal(meimei.questions.some(({ visual }) => visual), false);
});

test('implemented visual types have deterministic accessible SVG branches without answer coupling', () => {
  const rendererSource = readFileSync(new URL('../components/question/MathVisual.tsx', import.meta.url), 'utf8');
  for (const type of ['FRACTION_PART_BAR', 'DECIMAL_MEASURE_SEGMENTS', 'CIRCLE_RADIUS_DIAMETER', 'RECTANGLE_DIMENSIONS', 'GROUPING_ARRAY', 'PLACE_VALUE_COLUMNS', 'MEASUREMENT_RELATION', 'BAR_MODEL']) {
    assert.match(rendererSource, new RegExp(`case '${type}'`), `${type}: renderer branch`);
  }
  assert.match(rendererSource, /role="img"/);
  assert.doesNotMatch(rendererSource, /question\.(answer|answerIndex|options)/);
});

test('representative renderer preserves diameter geometry and shows explicit addends', () => {
  const rendererSource = readFileSync(new URL('../components/question/MathVisual.tsx', import.meta.url), 'utf8');
  assert.match(rendererSource, /isDiameter \? cx - r : cx/);
  assert.match(rendererSource, /addends/);
});
