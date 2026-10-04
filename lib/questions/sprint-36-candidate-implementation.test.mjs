import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';

function loadQuestionModule(fileName) {
  const modulePath = join(process.cwd(), 'lib', 'questions', fileName);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

const expectedBanks = {
  'jiejie-chinese.ts': ['jiejie-chinese-18', 'jiejie-chinese-19', 'jiejie-chinese-20', 'jiejie-chinese-21'],
  'jiejie-mathematics.ts': ['jiejie-mathematics-16', 'jiejie-mathematics-17', 'jiejie-mathematics-18', 'jiejie-mathematics-19', 'jiejie-mathematics-20'],
  'jiejie-natural-science.ts': ['jiejie-natural-science-13', 'jiejie-natural-science-14', 'jiejie-natural-science-15', 'jiejie-natural-science-16', 'jiejie-natural-science-17'],
  'jiejie-social-studies.ts': ['jiejie-social-studies-13', 'jiejie-social-studies-14', 'jiejie-social-studies-15', 'jiejie-social-studies-16'],
  'meimei-chinese.ts': ['meimei-chinese-13', 'meimei-chinese-14', 'meimei-chinese-15', 'meimei-chinese-16'],
  'meimei-mathematics.ts': ['meimei-mathematics-13', 'meimei-mathematics-14', 'meimei-mathematics-15', 'meimei-mathematics-16', 'meimei-mathematics-17'],
  'meimei-natural-science.ts': ['meimei-natural-science-13', 'meimei-natural-science-14', 'meimei-natural-science-15', 'meimei-natural-science-16', 'meimei-natural-science-17'],
  'meimei-social-studies.ts': ['meimei-social-studies-11', 'meimei-social-studies-12', 'meimei-social-studies-13', 'meimei-social-studies-14'],
};

const expectedAnswers = {
  'jiejie-chinese-18': 0,
  'jiejie-chinese-19': 1,
  'jiejie-chinese-20': 2,
  'jiejie-chinese-21': 3,
  'jiejie-mathematics-16': 1,
  'jiejie-mathematics-17': 2,
  'jiejie-mathematics-18': 3,
  'jiejie-mathematics-19': 0,
  'jiejie-mathematics-20': 1,
  'jiejie-natural-science-13': 0,
  'jiejie-natural-science-14': 1,
  'jiejie-natural-science-15': 2,
  'jiejie-natural-science-16': 0,
  'jiejie-natural-science-17': 3,
  'jiejie-social-studies-13': 3,
  'jiejie-social-studies-14': 0,
  'jiejie-social-studies-15': 1,
  'jiejie-social-studies-16': 2,
  'meimei-chinese-13': 2,
  'meimei-chinese-14': 3,
  'meimei-chinese-15': 0,
  'meimei-chinese-16': 1,
  'meimei-mathematics-13': 1,
  'meimei-mathematics-14': 2,
  'meimei-mathematics-15': 3,
  'meimei-mathematics-16': 0,
  'meimei-mathematics-17': 3,
  'meimei-natural-science-13': 2,
  'meimei-natural-science-14': 3,
  'meimei-natural-science-15': 0,
  'meimei-natural-science-16': 1,
  'meimei-natural-science-17': 2,
  'meimei-social-studies-11': 1,
  'meimei-social-studies-12': 0,
  'meimei-social-studies-13': 3,
  'meimei-social-studies-14': 2,
};

test('Sprint 36 implemented candidates exist with valid singleton metadata', () => {
  for (const [fileName, ids] of Object.entries(expectedBanks)) {
    const { questions } = loadQuestionModule(fileName);
    const byId = new Map(questions.map((question) => [question.id, question]));

    for (const id of ids) {
      const question = byId.get(id);
      assert.ok(question, `${fileName}: missing ${id}`);
      assert.equal(question.options.length, 4, `${id}: expected four options`);
      assert.equal(new Set(question.options).size, 4, `${id}: options must be unique`);
      assert.equal(question.answer, expectedAnswers[id], `${id}: answerIndex changed`);
      assert.equal(Number.isInteger(question.answer), true, `${id}: answerIndex must be an integer`);
      assert.ok(question.hint?.trim(), `${id}: missing hint`);
      assert.ok(question.explanation?.trim(), `${id}: missing explanation`);
      assert.equal(question.reviewGroupId, undefined, `${id}: new candidate must be a singleton unit`);
    }
  }
});

test('Sprint 36 adds exactly thirty-six learning units without changing existing question IDs', () => {
  const allQuestions = Object.keys(expectedBanks).flatMap((fileName) => loadQuestionModule(fileName).questions);
  const implementedIds = Object.values(expectedBanks).flat();
  assert.equal(implementedIds.length, 36);
  assert.equal(new Set(implementedIds).size, 36);
  assert.equal(allQuestions.length, 493);
  assert.equal(new Set(allQuestions.map(({ id }) => id)).size, 493);
});

test('Sprint 36 new answer positions are distributed across all four indices', () => {
  const distribution = [0, 1, 2, 3].map((answerIndex) =>
    Object.values(expectedAnswers).filter((answer) => answer === answerIndex).length,
  );
  assert.deepEqual(distribution, [9, 9, 9, 9]);
});
