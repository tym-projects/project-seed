import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const banks = {
  jiejieNaturalScience: new URL('./jiejie-natural-science.ts', import.meta.url),
  jiejieSocialStudies: new URL('./jiejie-social-studies.ts', import.meta.url),
  meimeiNaturalScience: new URL('./meimei-natural-science.ts', import.meta.url),
  meimeiSocialStudies: new URL('./meimei-social-studies.ts', import.meta.url),
};

function loadQuestions(modulePath) {
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule, require: () => ({}) });
  return testModule.exports.questions;
}

test('provides the four natural and social banks with the approved questions', () => {
  const all = Object.fromEntries(Object.entries(banks).map(([name, path]) => [name, loadQuestions(path)]));

  assert.deepEqual(Object.fromEntries(Object.entries(all).map(([name, questions]) => [name, questions.length])), {
    jiejieNaturalScience: 10,
    jiejieSocialStudies: 10,
    meimeiNaturalScience: 4,
    meimeiSocialStudies: 8,
  });

  const questions = Object.values(all).flat();
  assert.equal(questions.length, 32);
  assert.equal(new Set(questions.map(({ id }) => id)).size, 32);
  assert.ok(questions.every(({ options }) => options.length === 4));
  assert.ok(questions.every(({ reviewGroupId }) => reviewGroupId === undefined));
});

test('keeps each student and subject bank isolated to its approved question ids', () => {
  const expected = {
    jiejieNaturalScience: ['jiejie-natural-science-1', 'jiejie-natural-science-2', 'jiejie-natural-science-3', 'jiejie-natural-science-4', 'jiejie-natural-science-5', 'jiejie-natural-science-6', 'jiejie-natural-science-7', 'jiejie-natural-science-8', 'jiejie-natural-science-9', 'jiejie-natural-science-10'],
    jiejieSocialStudies: ['jiejie-social-studies-1', 'jiejie-social-studies-2', 'jiejie-social-studies-3', 'jiejie-social-studies-4', 'jiejie-social-studies-5', 'jiejie-social-studies-6', 'jiejie-social-studies-7', 'jiejie-social-studies-8', 'jiejie-social-studies-9', 'jiejie-social-studies-10'],
    meimeiNaturalScience: ['meimei-natural-science-1', 'meimei-natural-science-2', 'meimei-natural-science-3', 'meimei-natural-science-4'],
    meimeiSocialStudies: ['meimei-social-studies-1', 'meimei-social-studies-2', 'meimei-social-studies-3', 'meimei-social-studies-4', 'meimei-social-studies-5', 'meimei-social-studies-6', 'meimei-social-studies-7', 'meimei-social-studies-8'],
  };

  for (const [name, path] of Object.entries(banks)) {
    assert.deepEqual(Array.from(loadQuestions(path), ({ id }) => id), expected[name]);
  }
});

test('preserves the approved question metadata and revised air-and-water procedure', () => {
  const natural = loadQuestions(banks.meimeiNaturalScience);
  const social = loadQuestions(banks.jiejieSocialStudies);
  const airQuestion = natural.find(({ id }) => id === 'meimei-natural-science-3');
  const historyQuestion = social.find(({ id }) => id === 'jiejie-social-studies-1');

  assert.match(airQuestion.question, /杯口朝下/);
  assert.match(airQuestion.question, /不傾斜/);
  assert.match(airQuestion.question, /慢慢壓入水中/);
  assert.equal(airQuestion.answer, 2);
  assert.match(historyQuestion.options.join(' '), /1996 年臺灣舉行第一次總統直接民選/);
  assert.equal(historyQuestion.answer, 0);
});

test('validates unique answer indexes, option answers, and balanced answer positions', () => {
  const questions = Object.values(banks).flatMap((path) => loadQuestions(path));
  const counts = [0, 0, 0, 0];

  for (const question of questions) {
    assert.equal(question.options.length, 4);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
    assert.equal(new Set(question.options).size, 4);
    counts[question.answer] += 1;
  }

  assert.deepEqual(counts, [7, 13, 7, 5]);
});

test('keeps two question types per approved learning unit topic', () => {
  const questions = Object.values(banks).flatMap((path) => loadQuestions(path)).filter(({ id }) => /-(?:[1-4])$/.test(id));
  const byTopic = new Map();

  for (const question of questions) {
    const types = byTopic.get(question.topic) ?? [];
    types.push(question.type);
    byTopic.set(question.topic, types);
  }

  assert.deepEqual(Array.from(byTopic.values()), [
    ['basic', 'application'], ['basic', 'application'], ['basic', 'application'], ['basic', 'application'],
    ['basic', 'application'], ['basic', 'application'], ['basic', 'application'], ['basic', 'application'],
  ]);
});
