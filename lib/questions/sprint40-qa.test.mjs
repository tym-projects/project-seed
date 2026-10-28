import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const banks = {
  chinese: 'meimei-chinese.ts',
  mathematics: 'meimei-mathematics.ts',
  natural_science: 'meimei-natural-science.ts',
};

const expectedIds = {
  chinese: Array.from({ length: 8 }, (_, index) => `meimei-chinese-${76 + index}`),
  mathematics: Array.from({ length: 8 }, (_, index) => `meimei-mathematics-${76 + index}`),
  natural_science: Array.from({ length: 10 }, (_, index) => `meimei-natural-science-${76 + index}`),
};

const monthlyIdSource = readFileSync(new URL('../first-exam-practice.ts', import.meta.url), 'utf8');

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

test('Sprint 40 adds the planned original singleton questions', () => {
  for (const [subject, fileName] of Object.entries(banks)) {
    const questions = loadTs(fileName).questions;
    const selected = questions.filter(({ id }) => expectedIds[subject].includes(id));
    assert.equal(selected.map(({ id }) => id).join('|'), expectedIds[subject].join('|'), `${subject}: candidate IDs`);
    for (const question of selected) {
      assert.equal(question.options.length, 4, `${question.id}: four options required`);
      assert.equal(new Set(question.options).size, 4, `${question.id}: duplicate option`);
      assert.equal(question.reviewGroupId, undefined, `${question.id}: singleton only`);
      assert.ok(question.options[question.answer], `${question.id}: invalid answer`);
      assert.ok(question.question && question.hint && question.explanation, `${question.id}: incomplete content`);
    }
  }
});

test('Sprint 40 additions are all monthly-eligible and natural science stays in scope', () => {
  const additions = Object.values(expectedIds).flat();
  const monthlyIds = [...monthlyIdSource.matchAll(/'[^']+'/g)].map(([id]) => id.slice(1, -1));
  for (const id of additions) assert.ok(monthlyIds.includes(id), `${id}: missing monthly allowlist`);

  const questions = Object.values(banks).flatMap((fileName) => loadTs(fileName).questions);
  for (const question of questions.filter(({ id }) => additions.includes(id))) {
    assert.doesNotMatch(`${question.question} ${question.explanation}`, /磁鐵|動物/, `${question.id}: forbidden scope`);
  }
  for (const question of questions.filter(({ id }) => expectedIds.natural_science.includes(id))) {
    assert.match(question.topic, /認識植物|空氣和水|根／莖／葉／花／果實辨識|植物構造功能|葉序|莖分類|根分類|植物觀察方法|植物特徵判斷|植物與生活應用|圖片／特徵辨識|是非／選擇判斷/, `${question.id}: topic outside first-month scope`);
  }
});

test('Sprint 40 monthly allowlists include the full candidate set', () => {
  const additions = Object.values(expectedIds).flat();
  const monthlyIds = [...monthlyIdSource.matchAll(/'[^']+-\d+'/g)].map(([id]) => id.slice(1, -1));
  assert.equal(new Set(monthlyIds).size, 170);
  assert.equal(additions.every((id) => monthlyIds.includes(id)), true);
});

