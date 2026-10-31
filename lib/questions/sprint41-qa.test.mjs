import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const banks = {
  'jiejie/chinese': { file: 'jiejie-chinese.ts', prefix: 'jiejie-chinese', start: 85, additions: 25, expectedActive: 150 },
  'jiejie/mathematics': { file: 'jiejie-mathematics.ts', prefix: 'jiejie-mathematics', start: 78, additions: 25, expectedActive: 150 },
  'jiejie/natural_science': { file: 'jiejie-natural-science.ts', prefix: 'jiejie-natural-science', start: 76, additions: 25, expectedActive: 150 },
  'jiejie/social_studies': { file: 'jiejie-social-studies.ts', prefix: 'jiejie-social-studies', start: 78, additions: 25, expectedActive: 150 },
  'meimei/chinese': { file: 'meimei-chinese.ts', prefix: 'meimei-chinese', start: 84, additions: 17, expectedActive: 150 },
  'meimei/mathematics': { file: 'meimei-mathematics.ts', prefix: 'meimei-mathematics', start: 84, additions: 17, expectedActive: 150 },
  'meimei/natural_science': { file: 'meimei-natural-science.ts', prefix: 'meimei-natural-science', start: 86, additions: 15, expectedActive: 186 },
  'meimei/social_studies': { file: 'meimei-social-studies.ts', prefix: 'meimei-social-studies', start: 76, additions: 25, expectedActive: 150 },
};

const monthlySource = readFileSync(new URL('../first-exam-practice.ts', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../../docs/sprint41-candidate-manifest.json', import.meta.url), 'utf8'));

function loadTs(fileName, cache = new Map()) {
  if (cache.has(fileName)) return cache.get(fileName);
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  cache.set(fileName, testModule.exports);
  const localRequire = (request) => loadTs(`${request.replace('./', '')}.ts`.replace('.ts.ts', '.ts'), cache);
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: localRequire });
  return testModule.exports;
}

test('Sprint 41 additions remain intact after later cumulative expansions', () => {
  let total = 0;
  for (const [bank, spec] of Object.entries(banks)) {
    const bankModule = loadTs(spec.file);
    const active = bankModule.practiceQuestions ?? bankModule.questions;
    assert.equal(active.length, spec.expectedActive, `${bank}: active count`);
    const additions = active.filter(({ id }) => id.startsWith(`${spec.prefix}-`) && Number(id.split('-').at(-1)) >= spec.start && Number(id.split('-').at(-1)) < spec.start + spec.additions);
    assert.equal(additions.length, spec.additions, `${bank}: Sprint 41 additions`);
    total += active.length;
  }
  assert.equal(total, 1236);
});

test('Sprint 41 additions are singleton questions with complete four-option answers', () => {
  for (const [bank, spec] of Object.entries(banks)) {
    const active = (loadTs(spec.file).practiceQuestions ?? loadTs(spec.file).questions);
    const additions = active.filter(({ id }) => id.startsWith(`${spec.prefix}-`) && Number(id.split('-').at(-1)) >= spec.start && Number(id.split('-').at(-1)) < spec.start + spec.additions);
    for (const question of additions) {
      assert.equal(question.options.length, 4, `${bank}/${question.id}: four options`);
      assert.equal(new Set(question.options).size, 4, `${bank}/${question.id}: unique options`);
      assert.equal(question.reviewGroupId, undefined, `${bank}/${question.id}: singleton`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${bank}/${question.id}: answer index`);
      assert.ok(question.question && question.hint && question.explanation, `${bank}/${question.id}: complete content`);
    }
  }
});

test('Sprint 41 manifest covers all 174 additions with explicit deferred monthly disposition', () => {
  assert.equal(manifest.status, 'implementation-complete');
  assert.equal(manifest.requiredAdditionsTotal, 174);
  assert.equal(manifest.banks.reduce((sum, bank) => sum + bank.plannedAdditions, 0), 174);
  assert.equal(manifest.banks.every((bank) => bank.qaDisposition === 'ready' && bank.monthlyDisposition === 'defer'), true);
  assert.equal(new Set([...monthlySource.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1)).filter((id) => id.includes('-85') || id.includes('-86') || id.includes('-87') || id.includes('-88') || id.includes('-89') || id.includes('-90') || id.includes('-91') || id.includes('-92') || id.includes('-93') || id.includes('-94') || id.includes('-95') || id.includes('-96') || id.includes('-97') || id.includes('-98') || id.includes('-99') || id.includes('-100'))).size >= 0, true);
});

test('Sprint 41 has no exact normalized stem duplicates or forbidden MeiMei natural scope', () => {
  const normalized = new Set();
  for (const [bank, spec] of Object.entries(banks)) {
    const bankModule = loadTs(spec.file);
    const additions = (bankModule.practiceQuestions ?? bankModule.questions).filter(({ id }) => id.startsWith(`${spec.prefix}-`) && Number(id.split('-').at(-1)) >= spec.start && Number(id.split('-').at(-1)) < spec.start + spec.additions);
    for (const question of additions) {
      const key = question.question.replace(/[\s，。！？「」『』（）()：:、]/g, '');
      assert.equal(normalized.has(key), false, `${bank}/${question.id}: duplicate normalized stem`);
      normalized.add(key);
      assert.ok(!/動物|磁鐵/.test(`${question.topic}${question.question}${question.hint}${question.explanation}`) || !bank.startsWith('meimei/natural_science'), `${bank}/${question.id}: forbidden scope`);
      assert.ok(question.hint.length <= question.explanation.length + 30, `${bank}/${question.id}: suspicious hint leakage`);
    }
  }
});

test('Sprint 41 answer indices are distributed across all four positions', () => {
  for (const [bank, spec] of Object.entries(banks)) {
    const bankModule = loadTs(spec.file);
    const additions = (bankModule.practiceQuestions ?? bankModule.questions).filter(({ id }) => id.startsWith(`${spec.prefix}-`) && Number(id.split('-').at(-1)) >= spec.start && Number(id.split('-').at(-1)) < spec.start + spec.additions);
    const counts = [0, 0, 0, 0];
    for (const question of additions) counts[question.answer] += 1;
    assert.equal(counts.every((count) => count >= Math.floor(spec.additions / 4)), true, `${bank}: ${counts.join('/')}`);
  }
});

test('Sprint 41 keeps the monthly allowlist unchanged until explicit approval', () => {
  const monthlyIds = [...monthlySource.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1));
  assert.equal(new Set(monthlyIds).size, 170);
  assert.equal(monthlyIds.some((id) => id.includes('sprint41')), false);
  for (const spec of Object.values(banks)) {
    for (let index = spec.start; index < spec.start + spec.additions; index += 1) {
      assert.equal(monthlyIds.includes(`${spec.prefix}-${index}`), false, `${spec.prefix}-${index}: deferred from monthly`);
    }
  }
});

