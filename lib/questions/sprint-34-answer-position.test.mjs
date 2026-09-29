import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const banks = {
  jiejie: {
    chinese: new URL('./jiejie-chinese.ts', import.meta.url),
    mathematics: new URL('./jiejie-mathematics.ts', import.meta.url),
    natural_science: new URL('./jiejie-natural-science.ts', import.meta.url),
    social_studies: new URL('./jiejie-social-studies.ts', import.meta.url),
  },
  meimei: {
    chinese: new URL('./meimei-chinese.ts', import.meta.url),
    mathematics: new URL('./meimei-mathematics.ts', import.meta.url),
    natural_science: new URL('./meimei-natural-science.ts', import.meta.url),
    social_studies: new URL('./meimei-social-studies.ts', import.meta.url),
  },
};

function loadModule(path, require = () => ({})) {
  const compiled = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require });
  return testModule.exports;
}

function getAllMonthlyQuestions() {
  const firstExam = loadModule(new URL('../first-exam-practice.ts', import.meta.url));
  return Object.entries(banks).flatMap(([student, subjects]) => Object.entries(subjects).map(([subject, path]) => {
    const bank = loadModule(path).questions;
    const questionsById = new Map(bank.map((question) => [question.id, question]));
    return {
      student,
      subject,
      questions: Array.from(firstExam.getFirstExamQuestionIds(student, subject), (id) => questionsById.get(id)),
    };
  }));
}

test('all eight monthly banks keep answer positions reasonably distributed', () => {
  const banksWithQuestions = getAllMonthlyQuestions();
  const overallCounts = [0, 0, 0, 0];

  for (const { student, subject, questions } of banksWithQuestions) {
    assert.ok(questions.every(Boolean), `${student}/${subject} allowlist contains an unknown question`);
    const counts = [0, 0, 0, 0];
    for (const question of questions) {
      assert.ok(question.options.length === 3 || question.options.length === 4, `${question.id} has an unsupported option count`);
      assert.equal(new Set(question.options).size, question.options.length, `${question.id} must have unique options`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
      counts[question.answer] += 1;
      overallCounts[question.answer] += 1;
    }
    const maximumAllowed = Math.max(3, Math.ceil(questions.length * 0.6));
    assert.ok(Math.max(...counts) <= maximumAllowed, `${student}/${subject} answer positions are concentrated: ${counts}`);
  }

  assert.ok(Math.max(...overallCounts) <= Math.ceil(overallCounts.reduce((sum, count) => sum + count, 0) * 0.4),
    `overall answer positions are concentrated: ${overallCounts}`);

  for (const { student, subject, questions } of banksWithQuestions) {
    if ((student === 'jiejie' && subject === 'chinese') || (student === 'meimei' && subject === 'natural_science')) {
      const newQuestionPositions = questions.filter(({ id }) => Number(id.split('-').at(-1)) >= (student === 'jiejie' ? 10 : 5)).map(({ answer }) => answer);
      assert.ok(new Set(newQuestionPositions).size > 1, `${student}/${subject} Sprint 34 answers must not all use index 0`);
    }
  }
});
