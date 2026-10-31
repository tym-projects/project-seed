import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const banks = {
  'jiejie/chinese': { file: 'jiejie-chinese.ts', prefix: 'jiejie-chinese', start: 110, additions: 50, expectedActive: 150 },
  'jiejie/mathematics': { file: 'jiejie-mathematics.ts', prefix: 'jiejie-mathematics', start: 103, additions: 50, expectedActive: 150 },
  'jiejie/natural_science': { file: 'jiejie-natural-science.ts', prefix: 'jiejie-natural-science', start: 101, additions: 50, expectedActive: 150 },
  'jiejie/social_studies': { file: 'jiejie-social-studies.ts', prefix: 'jiejie-social-studies', start: 103, additions: 50, expectedActive: 150 },
  'meimei/chinese': { file: 'meimei-chinese.ts', prefix: 'meimei-chinese', start: 101, additions: 50, expectedActive: 150 },
  'meimei/mathematics': { file: 'meimei-mathematics.ts', prefix: 'meimei-mathematics', start: 101, additions: 50, expectedActive: 150 },
  'meimei/natural_science': { file: 'meimei-natural-science.ts', prefix: 'meimei-natural-science', start: 101, additions: 50, expectedActive: 186 },
  'meimei/social_studies': { file: 'meimei-social-studies.ts', prefix: 'meimei-social-studies', start: 101, additions: 50, expectedActive: 150 },
};

const monthlySource = readFileSync(new URL('../first-exam-practice.ts', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../../docs/sprint42-candidate-manifest.json', import.meta.url), 'utf8'));

function loadTs(fileName, cache = new Map()) {
  if (cache.has(fileName)) return cache.get(fileName);
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 } }).outputText;
  const testModule = { exports: {} };
  cache.set(fileName, testModule.exports);
  const localRequire = (request) => loadTs(`${request.replace('./', '')}.ts`.replace('.ts.ts', '.ts'), cache);
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: localRequire });
  return testModule.exports;
}

function additionsFor(bank, spec) {
  const active = (loadTs(spec.file).practiceQuestions ?? loadTs(spec.file).questions);
  return { active, additions: active.filter(({ id }) => id.startsWith(`${spec.prefix}-`) && Number(id.split('-').at(-1)) >= spec.start && Number(id.split('-').at(-1)) < spec.start + spec.additions) };
}

function normalize(text) { return text.replace(/[\s，。！？「」『』（）()：:、；;]/g, ''); }

test('Sprint 42 additions remain intact after Sprint 44 expands total Active to 1236', () => {
  let total = 0;
  for (const [bank, spec] of Object.entries(banks)) {
    const { active, additions } = additionsFor(bank, spec);
    assert.equal(active.length, spec.expectedActive, `${bank}: active count`);
    assert.equal(additions.length, spec.additions, `${bank}: additions`);
    total += active.length;
  }
  assert.equal(total, 1236);
});

test('Sprint 42 additions are singleton, four-option, answer-indexed questions', () => {
  for (const [bank, spec] of Object.entries(banks)) {
    const { additions } = additionsFor(bank, spec);
    for (const question of additions) {
      assert.equal(question.options.length, 4, `${bank}/${question.id}: four options`);
      assert.equal(new Set(question.options).size, 4, `${bank}/${question.id}: unique options`);
      assert.equal(question.reviewGroupId, undefined, `${bank}/${question.id}: singleton`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${bank}/${question.id}: answer index`);
      assert.ok(question.question && question.hint && question.explanation, `${bank}/${question.id}: complete content`);
      assert.ok(question.explanation.includes(question.options[question.answer]), `${bank}/${question.id}: explanation matches answer`);
    }
  }
});

test('Sprint 42 has application-heavy multi-form coverage and distributed answer indices', () => {
  const ids = new Set();
  for (const [bank, spec] of Object.entries(banks)) {
    const { additions } = additionsFor(bank, spec);
    const application = additions.filter(({ type }) => type === 'application').length;
    assert.ok(application >= 35, `${bank}: application coverage ${application}`);
    assert.ok(new Set(additions.map(({ topic }) => topic)).size >= 5, `${bank}: topic variety`);
    const answerCounts = [0, 0, 0, 0];
    for (const question of additions) {
      assert.equal(ids.has(question.id), false, `${bank}/${question.id}: duplicate ID across banks`);
      ids.add(question.id);
      answerCounts[question.answer] += 1;
    }
    assert.ok(answerCounts.every((count) => count >= 10), `${bank}: ${answerCounts.join('/')}`);
  }
  assert.equal(ids.size, 400);
});

test('Sprint 42 avoids exact and near duplicate stems and forbidden MeiMei science scope', () => {
  const stems = new Map();
  for (const [bank, spec] of Object.entries(banks)) {
    const { active, additions } = additionsFor(bank, spec);
    const existing = active.filter(({ id }) => !id.startsWith(`${spec.prefix}-`) || Number(id.split('-').at(-1)) < spec.start);
    for (const question of additions) {
      const key = normalize(question.question);
      assert.equal(stems.has(key), false, `${bank}/${question.id}: duplicate normalized stem`);
      stems.set(key, question.id);
      for (const prior of existing) {
        const priorKey = normalize(prior.question);
        const overlap = new Set(key.match(/[\u4e00-\u9fff]{2,}/g) ?? []).intersection?.(new Set(priorKey.match(/[\u4e00-\u9fff]{2,}/g) ?? []));
        assert.ok(!/動物|磁鐵/.test(`${question.topic}${question.question}${question.hint}${question.explanation}`) || bank !== 'meimei/natural_science', `${bank}/${question.id}: forbidden scope`);
        if (overlap && overlap.size >= 6) assert.fail(`${bank}/${question.id}: near duplicate with ${prior.id}`);
      }
      assert.ok(!question.hint.includes(question.options[question.answer]), `${bank}/${question.id}: hint leaks answer`);
    }
  }
});

test('Sprint 42 manifest records 400 deferred additions and monthly allowlist stays 170', () => {
  assert.equal(manifest.status, 'implementation-complete');
  assert.equal(manifest.requiredAdditionsTotal, 400);
  assert.equal(manifest.banks.reduce((sum, bank) => sum + bank.plannedAdditions, 0), 400);
  assert.equal(manifest.banks.every((bank) => bank.qaDisposition === 'ready' && bank.monthlyDisposition === 'defer'), true);
  const monthlyIds = [...monthlySource.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1));
  assert.equal(new Set(monthlyIds).size, 170);
  for (const spec of Object.values(banks)) {
    for (let index = spec.start; index < spec.start + spec.additions; index += 1) assert.equal(monthlyIds.includes(`${spec.prefix}-${index}`), false);
  }
});
