import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const repo = path.resolve(import.meta.dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'docs/sprint43-math-visual-manifest.json'), 'utf8'));

function loadTs(relativePath) {
  const filePath = path.join(repo, relativePath);
  const source = fs.readFileSync(filePath, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  const localRequire = (request) => loadTs(path.relative(repo, path.resolve(path.dirname(filePath), `${request}.ts`)));
  vm.runInNewContext(compiled, { exports: module.exports, module, require: localRequire });
  return module.exports;
}

const jiejie = loadTs('lib/questions/jiejie-mathematics.ts');
const meimei = loadTs('lib/questions/meimei-mathematics.ts');
const firstExam = loadTs('lib/first-exam-practice.ts');
const visualModule = loadTs('lib/math-visuals.ts');
const questions = new Map([...jiejie.questions, ...meimei.questions].map((question) => [question.id, question]));
const monthlyIds = new Set([...firstExam.getFirstExamQuestionIds('jiejie', 'mathematics'), ...firstExam.getFirstExamQuestionIds('meimei', 'mathematics')]);
const practiceIds = new Set([...jiejie.practiceQuestions.map(({ id }) => id), ...meimei.questions.map(({ id }) => id)]);
const allowedTypes = new Set(manifest.allowedVisualTypes);
const baselineIds = [
  'jiejie-mathematics-2', 'jiejie-mathematics-4', 'jiejie-mathematics-11', 'jiejie-mathematics-13',
  'jiejie-mathematics-63', 'jiejie-mathematics-67', 'jiejie-mathematics-72', 'jiejie-mathematics-110',
  'meimei-mathematics-1', 'meimei-mathematics-2', 'meimei-mathematics-3', 'meimei-mathematics-4',
  'meimei-mathematics-9', 'meimei-mathematics-10', 'meimei-mathematics-61', 'meimei-mathematics-62',
];
const forbiddenKeys = new Set(['answer', 'answerIndex', 'options', 'correctOption', 'explanation', 'solution', 'computedResult', 'quotient', 'calculatedTotal', 'calculatedDifference', 'calculatedArea', 'calculatedPerimeter', 'inferredOperation']);
const walkKeys = (value, callback) => {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) { callback(key, child); walkKeys(child, callback); }
};
const hash = (text) => crypto.createHash('sha256').update(text, 'utf8').digest('hex');

test('manifest closes 108 implementation, 26 deferred, and 166 text-only decisions', () => {
  assert.deepEqual(manifest.decisionCounts, { IMPLEMENT: 108, DEFERRED: 26, TEXT_ONLY_PREFERRED: 166 });
  assert.equal(manifest.rows.length, 134);
  assert.equal(manifest.targetImplementationCount, 108);
});

test('manifest rows are unique, real, student-consistent, and source-consistent', () => {
  assert.equal(new Set(manifest.rows.map(({ questionId }) => questionId)).size, manifest.rows.length);
  for (const row of manifest.rows) {
    const question = questions.get(row.questionId);
    assert.ok(question, `${row.questionId}: question exists`);
    assert.equal(row.student, row.questionId.startsWith('jiejie-') ? 'jiejie' : 'meimei');
    assert.equal(row.questionTextHash, hash(question.question), `${row.questionId}: question hash`);
    assert.equal(row.questionTextSnapshot, question.question, `${row.questionId}: question snapshot`);
    assert.equal(row.source, practiceIds.has(row.questionId) && monthlyIds.has(row.questionId) ? 'both' : monthlyIds.has(row.questionId) ? 'monthly' : 'practice');
  }
});

test('manifest uses only the approved eight visual types and has no undecided rows', () => {
  for (const row of manifest.rows) {
    assert.notEqual(row.finalDecision, 'UNDECIDED');
    if (row.finalDecision === 'IMPLEMENT') assert.ok(allowedTypes.has(row.visualType), `${row.questionId}: visual type`);
    else assert.equal(row.structuredVisualData, null, `${row.questionId}: non-implementation data`);
  }
});

test('visual data contains no answer, options, explanation, or computed-result fields', () => {
  for (const row of manifest.rows) {
    walkKeys(row.structuredVisualData, (key) => assert.equal(forbiddenKeys.has(key), false, `${row.questionId}: forbidden ${key}`));
  }
});

test('all implementation rows retain explicit unknowns and only known numeric tokens', () => {
  for (const row of manifest.rows.filter(({ finalDecision }) => finalDecision === 'IMPLEMENT')) {
    assert.ok(row.unknownFields.length > 0, `${row.questionId}: unknown fields`);
    const sourceNumbers = new Set((row.questionTextSnapshot.replaceAll(',', '').match(/\d+(?:\.\d+)?/g) ?? []).map(Number));
    const checkNumbers = (value, parentKey = '') => {
      if (!value || typeof value !== 'object' || ['knownNumbers', 'knownDecimals', 'knownFractions', 'digits', 'conversionMillimetersPerCentimeter'].includes(parentKey)) return;
      for (const [key, child] of Object.entries(value)) {
        if (['knownNumbers', 'knownDecimals', 'knownFractions', 'digits', 'conversionMillimetersPerCentimeter'].includes(key)) continue;
        if (typeof child === 'number') assert.equal(sourceNumbers.has(child), true, `${row.questionId}: inferred number ${child}`);
        else checkNumbers(child, key);
      }
    };
    checkNumbers(row.structuredVisualData);
  }
});

test('all 16 approved representative mappings are preserved exactly', () => {
  for (const id of baselineIds) {
    const row = manifest.rows.find(({ questionId }) => questionId === id);
    const original = visualModule.mathVisualSpecs[id];
    assert.equal(row.finalDecision, 'IMPLEMENT', `${id}: implementation decision`);
    assert.equal(row.visualType, original.type, `${id}: type`);
    assert.deepEqual(JSON.parse(JSON.stringify(row.structuredVisualData)), JSON.parse(JSON.stringify(original.data)), `${id}: data`);
    assert.equal(row.visualPurpose, original.purpose, `${id}: purpose`);
    assert.deepEqual(JSON.parse(JSON.stringify(row.unknownFields)), JSON.parse(JSON.stringify(original.unknowns)), `${id}: unknowns`);
    assert.deepEqual(JSON.parse(JSON.stringify(row.fidelityNotes)), JSON.parse(JSON.stringify(original.fidelityNotes)), `${id}: fidelity notes`);
    assert.deepEqual(JSON.parse(JSON.stringify(row.leakageNotes)), JSON.parse(JSON.stringify(original.leakageNotes)), `${id}: leakage notes`);
  }
});
