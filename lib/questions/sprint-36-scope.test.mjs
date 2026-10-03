import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

function loadQuestionModule(fileName) {
  const modulePath = new URL(`./${fileName}`, import.meta.url);
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

test('姐姐 active practice pools exclude out-of-scope and uncertain questions', () => {
  const expectations = [
    ['jiejie-chinese.ts', 8, ['jiejie-chinese-2', 'jiejie-chinese-4', 'jiejie-chinese-1', 'jiejie-chinese-3', 'jiejie-chinese-5', 'jiejie-chinese-6', 'jiejie-chinese-7', 'jiejie-chinese-8', 'jiejie-chinese-9']],
    ['jiejie-mathematics.ts', 13, ['jiejie-mathematics-5', 'jiejie-mathematics-6']],
    ['jiejie-natural-science.ts', 12, []],
    ['jiejie-social-studies.ts', 10, ['jiejie-social-studies-1', 'jiejie-social-studies-2']],
  ];

  for (const [fileName, expectedCount, excludedIds] of expectations) {
    const { questions, practiceQuestions } = loadQuestionModule(fileName);
    assert.equal(practiceQuestions.length, expectedCount, fileName);
    assert.deepEqual(
      practiceQuestions.map(({ id }) => id),
      questions.filter(({ id }) => !excludedIds.includes(id)).map(({ id }) => id),
      fileName,
    );
    for (const id of excludedIds) assert.equal(practiceQuestions.some((question) => question.id === id), false, `${fileName}: ${id}`);
  }
});

test('妹妹 question banks remain unchanged by the姐姐 scope filter', () => {
  const expected = [
    ['meimei-chinese.ts', 12],
    ['meimei-mathematics.ts', 12],
    ['meimei-natural-science.ts', 12],
    ['meimei-social-studies.ts', 10],
  ];

  for (const [fileName, expectedCount] of expected) {
    const { questions } = loadQuestionModule(fileName);
    assert.equal(questions.length, expectedCount, fileName);
  }
});

test('all姐姐 active review and reinforcement routes use the filtered practice views', () => {
  const root = new URL('../../', import.meta.url).pathname.replace(/^\/(\w):/, '$1:');
  const routes = [
    'app/jiejie/chinese/page.tsx',
    'app/jiejie/review/page.tsx',
    'app/jiejie/reinforce/page.tsx',
    'app/jiejie/mathematics/page.tsx',
    'app/jiejie/mathematics/review/page.tsx',
    'app/jiejie/mathematics/reinforce/page.tsx',
    'app/jiejie/natural-science/page.tsx',
    'app/jiejie/natural-science/review/page.tsx',
    'app/jiejie/natural-science/reinforce/page.tsx',
    'app/jiejie/social-studies/page.tsx',
    'app/jiejie/social-studies/review/page.tsx',
    'app/jiejie/social-studies/reinforce/page.tsx',
  ];

  for (const route of routes) {
    const source = readFileSync(join(root, route), 'utf8');
    assert.match(source, /practiceQuestions/);
    assert.doesNotMatch(source, /questions=\{questions\}/);
  }
});
