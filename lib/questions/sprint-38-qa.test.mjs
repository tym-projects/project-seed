import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const banks = {
  'jiejie/chinese': 'jiejie-chinese.ts',
  'jiejie/mathematics': 'jiejie-mathematics.ts',
  'jiejie/natural_science': 'jiejie-natural-science.ts',
  'jiejie/social_studies': 'jiejie-social-studies.ts',
  'meimei/chinese': 'meimei-chinese.ts',
  'meimei/mathematics': 'meimei-mathematics.ts',
  'meimei/natural_science': 'meimei-natural-science.ts',
  'meimei/social_studies': 'meimei-social-studies.ts',
};
const additionsByBank = {
  'jiejie/chinese': ['jiejie-chinese-70', 'jiejie-chinese-71', 'jiejie-chinese-72', 'jiejie-chinese-73', 'jiejie-chinese-74', 'jiejie-chinese-75', 'jiejie-chinese-76', 'jiejie-chinese-77', 'jiejie-chinese-78', 'jiejie-chinese-79'],
  'jiejie/mathematics': ['jiejie-mathematics-63', 'jiejie-mathematics-64', 'jiejie-mathematics-65', 'jiejie-mathematics-66', 'jiejie-mathematics-67', 'jiejie-mathematics-68', 'jiejie-mathematics-69', 'jiejie-mathematics-70', 'jiejie-mathematics-71', 'jiejie-mathematics-72'],
  'jiejie/natural_science': ['jiejie-natural-science-61', 'jiejie-natural-science-62', 'jiejie-natural-science-63', 'jiejie-natural-science-64', 'jiejie-natural-science-65', 'jiejie-natural-science-66', 'jiejie-natural-science-67', 'jiejie-natural-science-68', 'jiejie-natural-science-69', 'jiejie-natural-science-70'],
  'jiejie/social_studies': ['jiejie-social-studies-63', 'jiejie-social-studies-64', 'jiejie-social-studies-65', 'jiejie-social-studies-66', 'jiejie-social-studies-67', 'jiejie-social-studies-68', 'jiejie-social-studies-69', 'jiejie-social-studies-70', 'jiejie-social-studies-71', 'jiejie-social-studies-72'],
  'meimei/chinese': ['meimei-chinese-61', 'meimei-chinese-62', 'meimei-chinese-63', 'meimei-chinese-64', 'meimei-chinese-65', 'meimei-chinese-66', 'meimei-chinese-67', 'meimei-chinese-68', 'meimei-chinese-69', 'meimei-chinese-70'],
  'meimei/mathematics': ['meimei-mathematics-61', 'meimei-mathematics-62', 'meimei-mathematics-63', 'meimei-mathematics-64', 'meimei-mathematics-65', 'meimei-mathematics-66', 'meimei-mathematics-67', 'meimei-mathematics-68', 'meimei-mathematics-69', 'meimei-mathematics-70'],
  'meimei/natural_science': ['meimei-natural-science-61', 'meimei-natural-science-62', 'meimei-natural-science-63', 'meimei-natural-science-64', 'meimei-natural-science-65', 'meimei-natural-science-66', 'meimei-natural-science-67', 'meimei-natural-science-68', 'meimei-natural-science-69', 'meimei-natural-science-70'],
  'meimei/social_studies': ['meimei-social-studies-61', 'meimei-social-studies-62', 'meimei-social-studies-63', 'meimei-social-studies-64', 'meimei-social-studies-65', 'meimei-social-studies-66', 'meimei-social-studies-67', 'meimei-social-studies-68', 'meimei-social-studies-69', 'meimei-social-studies-70'],
};
const manifest = JSON.parse(readFileSync(new URL('../../docs/sprint38-candidate-manifest.json', import.meta.url), 'utf8'));

function loadTs(fileName) {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  const localRequire = (request) => {
    const file = request.endsWith('.ts') ? request : `${request}.ts`;
    return loadTs(file.replace('./', ''));
  };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: localRequire });
  return testModule.exports;
}

test('Sprint 38 additions contain ten singleton questions per bank', () => {
  const all = [];
  for (const [key, fileName] of Object.entries(banks)) {
    const bank = loadTs(fileName);
    const additions = bank.questions.filter(({ id }) => additionsByBank[key].includes(id));
    assert.equal(additions.length, 10, `${key}: expected 10 additions`);
    assert.equal(new Set(additions.map(({ id }) => id)).size, 10, `${key}: duplicate addition id`);
    all.push(...additions);
    for (const question of additions) {
      assert.equal(question.options.length, 4, `${question.id}: four options required`);
      assert.equal(new Set(question.options).size, 4, `${question.id}: duplicate option`);
      assert.equal(question.options[question.answer] !== undefined, true, `${question.id}: invalid answer`);
      assert.ok(question.question && question.explanation && question.hint, `${question.id}: incomplete content`);
    }
  }
  assert.equal(all.length, 80);
  assert.equal(new Set(all.map(({ id }) => id)).size, 80);
});

test('Sprint 38 additions stay within confirmed scope and avoid forbidden meimei science topics', () => {
  const all = Object.entries(banks).flatMap(([key, fileName]) => loadTs(fileName).questions.filter(({ id }) => additionsByBank[key].includes(id)));
  for (const question of all) {
    assert.doesNotMatch(`${question.question} ${question.explanation}`, /磁鐵|動物/, `${question.id}: forbidden scope`);
  }
  const meimeiScience = banks['meimei/natural_science'];
  for (const question of loadTs(meimeiScience).questions.filter(({ id }) => additionsByBank['meimei/natural_science'].includes(id))) {
    assert.match(question.topic, /認識植物|空氣和水/);
  }
});

test('Sprint 38 monthly allowlist expands by five scoped questions per bank', () => {
  const source = readFileSync(new URL('../first-exam-practice.ts', import.meta.url), 'utf8');
  const ids = [...source.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1));
  assert.equal(new Set(ids).size, 127);
  assert.equal(ids.filter((id) => /-(?:70|71|72|73|74)$/.test(id) || /-(?:63|64|65|66|67)$/.test(id) || /-(?:61|62|63|64|65)$/.test(id)).length >= 40, true);
});

test('Sprint 38 active views preserve prior exclusions and add new in-scope practice', () => {
  const excluded = {
    'jiejie-chinese.ts': ['jiejie-chinese-1', 'jiejie-chinese-2', 'jiejie-chinese-3', 'jiejie-chinese-4', 'jiejie-chinese-5', 'jiejie-chinese-6', 'jiejie-chinese-7', 'jiejie-chinese-8', 'jiejie-chinese-9'],
    'jiejie-mathematics.ts': ['jiejie-mathematics-5', 'jiejie-mathematics-6'],
    'jiejie-natural-science.ts': [],
    'jiejie-social-studies.ts': ['jiejie-social-studies-1', 'jiejie-social-studies-2'],
  };
  for (const [fileName, ids] of Object.entries(excluded)) {
    const bank = loadTs(fileName);
    assert.equal(bank.practiceQuestions.length, 70);
    for (const id of ids) assert.equal(bank.practiceQuestions.some((question) => question.id === id), false, `${fileName}: ${id}`);
  }
});

test('Sprint 38 manifest and normalized question text are complete and non-duplicated', () => {
  const manifestIds = manifest.entries.flatMap(({ questionIds }) => questionIds);
  assert.equal(manifestIds.length, 80);
  assert.equal(new Set(manifestIds).size, 80);
  const allQuestions = Object.entries(banks).flatMap(([key, fileName]) => loadTs(fileName).questions.map((question) => ({ ...question, key })));
  const additions = allQuestions.filter(({ id }) => manifestIds.includes(id));
  assert.equal(additions.length, 80);
  const additionIdSet = new Set(manifestIds);
  const normalize = (value) => value.replace(/[\s，。！？：；（）「」、,.!?]/g, '');
  const allFingerprints = new Map();
  for (const question of allQuestions) {
    const fingerprint = normalize(question.question);
    const prior = allFingerprints.get(fingerprint);
    if (prior !== undefined && (additionIdSet.has(question.id) || additionIdSet.has(prior))) {
      assert.fail(`Sprint 38 duplicate normalized question text: ${question.id} and ${prior}`);
    }
    allFingerprints.set(fingerprint, question.id);
  }
});
