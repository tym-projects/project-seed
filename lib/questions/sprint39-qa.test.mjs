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

const additions = {
  'jiejie/chinese': ['jiejie-chinese-80', 'jiejie-chinese-81', 'jiejie-chinese-82', 'jiejie-chinese-83', 'jiejie-chinese-84'],
  'jiejie/mathematics': ['jiejie-mathematics-73', 'jiejie-mathematics-74', 'jiejie-mathematics-75', 'jiejie-mathematics-76', 'jiejie-mathematics-77'],
  'jiejie/natural_science': ['jiejie-natural-science-71', 'jiejie-natural-science-72', 'jiejie-natural-science-73', 'jiejie-natural-science-74', 'jiejie-natural-science-75'],
  'jiejie/social_studies': ['jiejie-social-studies-73', 'jiejie-social-studies-74', 'jiejie-social-studies-75', 'jiejie-social-studies-76', 'jiejie-social-studies-77'],
  'meimei/chinese': ['meimei-chinese-71', 'meimei-chinese-72', 'meimei-chinese-73', 'meimei-chinese-74', 'meimei-chinese-75'],
  'meimei/mathematics': ['meimei-mathematics-71', 'meimei-mathematics-72', 'meimei-mathematics-73', 'meimei-mathematics-74', 'meimei-mathematics-75'],
  'meimei/natural_science': ['meimei-natural-science-71', 'meimei-natural-science-72', 'meimei-natural-science-73', 'meimei-natural-science-74', 'meimei-natural-science-75'],
  'meimei/social_studies': ['meimei-social-studies-71', 'meimei-social-studies-72', 'meimei-social-studies-73', 'meimei-social-studies-74', 'meimei-social-studies-75'],
};

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

test('Sprint 39 adds five singleton questions to every bank', () => {
  const ids = Object.values(additions).flat();
  assert.equal(ids.length, 40);
  assert.equal(new Set(ids).size, 40);
  for (const [key, fileName] of Object.entries(banks)) {
    const selected = loadTs(fileName).questions.filter(({ id }) => additions[key].includes(id));
    assert.equal(selected.length, 5, `${key}: expected five additions`);
    for (const question of selected) {
      assert.equal(question.options.length, 4, `${question.id}: four options required`);
      assert.equal(new Set(question.options).size, 4, `${question.id}: duplicate option`);
      assert.equal(question.reviewGroupId, undefined, `${question.id}: singleton only`);
      assert.equal(question.options[question.answer] !== undefined, true, `${question.id}: invalid answer`);
      assert.ok(question.question && question.hint && question.explanation, `${question.id}: incomplete content`);
    }
  }
});

test('Sprint 39 additions remain in confirmed monthly scope', () => {
  const all = Object.entries(banks).flatMap(([key, fileName]) => loadTs(fileName).questions.filter(({ id }) => additions[key].includes(id)));
  assert.equal(all.length, 40);
  for (const question of all) {
    assert.doesNotMatch(`${question.question} ${question.explanation}`, /磁鐵|動物/, `${question.id}: forbidden scope`);
  }
  for (const question of all.filter(({ id }) => id.startsWith('meimei-natural-science-'))) {
    assert.match(question.topic, /認識植物|空氣和水/);
  }
});

test('Sprint 39 balances monthly allowlists at eighteen per bank', () => {
  const source = readFileSync(new URL('../first-exam-practice.ts', import.meta.url), 'utf8');
  const ids = [...source.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1));
  assert.equal(new Set(ids).size, 144);
  for (const prefix of ['jiejie-chinese', 'jiejie-mathematics', 'jiejie-natural-science', 'jiejie-social-studies', 'meimei-chinese', 'meimei-mathematics', 'meimei-natural-science', 'meimei-social-studies']) {
    assert.equal(ids.filter((id) => id.startsWith(`${prefix}-`)).length, 18, `${prefix}: monthly count`);
  }
});

test('Sprint 39 addition question stems are unique against the full bank', () => {
  const allQuestions = Object.entries(banks).flatMap(([key, fileName]) => loadTs(fileName).questions.map((question) => ({ ...question, key })));
  const additionsSet = new Set(Object.values(additions).flat());
  const normalize = (value) => value.replace(/[\s，。！？：；（）「」、,.!?]/g, '');
  const seen = new Map();
  for (const question of allQuestions) {
    const fingerprint = normalize(question.question);
    const prior = seen.get(fingerprint);
    if (prior !== undefined && (additionsSet.has(question.id) || additionsSet.has(prior))) {
      assert.fail(`Sprint 39 duplicate normalized question text: ${question.id} and ${prior}`);
    }
    seen.set(fingerprint, question.id);
  }
});
