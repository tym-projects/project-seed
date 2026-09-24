import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const modulePath = new URL('./subject-navigation.ts', import.meta.url);

function loadNavigationModule() {
  const compiled = ts.transpileModule(readFileSync(modulePath, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  }).outputText;
  const testModule = { exports: {} };
  vm.runInNewContext(compiled, { exports: testModule.exports, module: testModule });
  return testModule.exports;
}

test('defines four explicit actions for each of the four subjects', () => {
  const { SUBJECT_NAVIGATION } = loadNavigationModule();

  assert.deepEqual(Array.from(SUBJECT_NAVIGATION, ({ subject, label, practice, exam, review, reinforce }) => ({ subject, label, practice, exam, review, reinforce })), [
    { subject: 'chinese', label: '國語', practice: '/chinese', exam: '/exam/chinese', review: '/review', reinforce: '/reinforce' },
    { subject: 'mathematics', label: '數學', practice: '/mathematics', exam: '/exam/mathematics', review: '/mathematics/review', reinforce: '/mathematics/reinforce' },
    { subject: 'natural_science', label: '自然', practice: '/natural-science', exam: '/exam/natural-science', review: '/natural-science/review', reinforce: '/natural-science/reinforce' },
    { subject: 'social_studies', label: '社會', practice: '/social-studies', exam: '/exam/social-studies', review: '/social-studies/review', reinforce: '/social-studies/reinforce' },
  ]);
});

test('builds twelve student-scoped targets without defaulting non-Chinese actions to Chinese', () => {
  const { getStudentSubjectNavigation } = loadNavigationModule();
  const jiejie = getStudentSubjectNavigation('jiejie');
  const meimei = getStudentSubjectNavigation('meimei');

  assert.equal(jiejie.length, 4);
  assert.equal(meimei.length, 4);
  for (const [student, items] of [['jiejie', jiejie], ['meimei', meimei]]) {
    for (const item of items) {
      assert.equal(item.student, student);
      assert.deepEqual(Object.keys(item.actions).sort(), ['exam', 'practice', 'reinforce', 'review']);
      assert.ok(item.actions.practice.startsWith(`/${student}/`));
      assert.ok(item.actions.review.startsWith(`/${student}/`));
      assert.ok(item.actions.reinforce.startsWith(`/${student}/`));
    }
  }

  const math = jiejie.find(({ subject }) => subject === 'mathematics');
  const natural = meimei.find(({ subject }) => subject === 'natural_science');
  assert.deepEqual(JSON.parse(JSON.stringify(math.actions)), {
    practice: '/jiejie/mathematics',
    exam: '/jiejie/exam/mathematics',
    review: '/jiejie/mathematics/review',
    reinforce: '/jiejie/mathematics/reinforce',
  });
  assert.deepEqual(JSON.parse(JSON.stringify(natural.actions)), {
    practice: '/meimei/natural-science',
    exam: '/meimei/exam/natural-science',
    review: '/meimei/natural-science/review',
    reinforce: '/meimei/natural-science/reinforce',
  });
});
