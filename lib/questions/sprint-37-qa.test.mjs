import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

const manifest = JSON.parse(readFileSync(new URL('../../docs/sprint37-candidate-manifest.json', import.meta.url), 'utf8'));
const bankFiles = {
  'jiejie/chinese': 'jiejie-chinese.ts',
  'jiejie/mathematics': 'jiejie-mathematics.ts',
  'jiejie/natural_science': 'jiejie-natural-science.ts',
  'jiejie/social_studies': 'jiejie-social-studies.ts',
  'meimei/chinese': 'meimei-chinese.ts',
  'meimei/mathematics': 'meimei-mathematics.ts',
  'meimei/natural_science': 'meimei-natural-science.ts',
  'meimei/social_studies': 'meimei-social-studies.ts',
};
const expectedActive = {
  'jiejie/chinese': 12,
  'jiejie/mathematics': 18,
  'jiejie/natural_science': 17,
  'jiejie/social_studies': 14,
  'meimei/chinese': 16,
  'meimei/mathematics': 17,
  'meimei/natural_science': 17,
  'meimei/social_studies': 14,
};

function loadBank(fileName) {
  const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

test('Sprint 37 manifest has unique planned IDs and exact difficulty allocation', () => {
  const ids = manifest.entries.map((entry) => entry.candidateId);
  assert.equal(new Set(ids).size, 355);
  assert.equal(manifest.entries.filter((entry) => entry.difficultyClass === 'basic').length, 116);
  assert.equal(manifest.entries.filter((entry) => entry.difficultyClass === 'application').length, 141);
  assert.equal(manifest.entries.filter((entry) => entry.difficultyClass === 'reasoning').length, 98);
  for (const entry of manifest.entries) {
    assert.match(entry.candidateId, /^S37-(JC|JM|JN|JS|MC|MM|MN|MS)-\d{3}$/);
    assert.equal(entry.implementationStatus, 'Planned');
    assert.equal(entry.scopeStatus, 'in_scope_planned');
  }
});

test('Sprint 37 baseline bank IDs are collision-free and active views preserve Sprint 36 counts', () => {
  const allIds = [];
  for (const [key, fileName] of Object.entries(bankFiles)) {
    const bank = loadBank(fileName);
    const ids = bank.questions.map(({ id }) => id);
    allIds.push(...ids);
    assert.equal(new Set(ids).size, ids.length, `${key}: duplicate question ID`);
    const activeQuestions = bank.practiceQuestions ?? bank.questions;
    assert.equal(activeQuestions.length, expectedActive[key], `${key}: baseline active count changed`);
    for (const question of bank.questions) {
      assert.equal(new Set(question.options).size, question.options.length, `${question.id}: duplicate option`);
      assert.ok(Number.isInteger(question.answer), `${question.id}: invalid answer index`);
      assert.ok(question.answer >= 0 && question.answer < question.options.length, `${question.id}: answer outside options`);
    }
  }
  assert.equal(new Set(allIds).size, allIds.length, 'question IDs collide across banks');
});

test('Sprint 37 planning preserves the monthly and Learning Record boundaries', () => {
  assert.equal(manifest.monthlyAllowlistCount, 87);
  assert.equal(manifest.learningRecordSchema, 'project-seed:learning-records:v1 unchanged');
  assert.equal(manifest.entries.every(({ reviewGroupId }) => reviewGroupId === undefined), true);
  assert.equal(manifest.entries.every(({ finalQuestionId }) => finalQuestionId === null), true);
});

test('Sprint 37 final count gate is strict when the manifest leaves Planning', () => {
  if (manifest.status === 'Planning') return;
  assert.equal(manifest.status, 'Implementation Complete / Awaiting Human Acceptance');
  for (const [key, fileName] of Object.entries(bankFiles)) {
    assert.equal(loadBank(fileName).practiceQuestions.length, 60, `${key}: final active count is not 60`);
  }
});
