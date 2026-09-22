# Sprint 22 Mathematics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改變既有 Learning Record／ReviewSession persisted schema 或學習語意的前提下，為姐姐與妹妹接入各 6 個南一版上學期數學 learning units，並沿用既有答題、複習、再練一次與家長摘要流程。

**Architecture:** 擴充現有 `SubjectId` 為 `chinese | mathematics`，將目前必要的國語 subject 硬編碼改成 flow／page 傳入的 subject。數學題庫各自放在既有 `lib/questions/`，每題沒有 `reviewGroupId`，因此 learning unit ID fallback 為 question ID，Sprint 18 confirmation 自然不會觸發。

**Tech Stack:** Next.js App Router、React、TypeScript、Node `node:test`、Playwright／Chromium、現有 localStorage helpers。

**Spec:** `docs/superpowers/specs/2026-09-22-sprint-22-mathematics-design.md`

## Global Constraints

- 正式 repository 只能是 `C:\Users\admin\Documents\2026AST-dev`。
- 不修改 Learning Record persisted schema、ReviewSession persisted schema 或既有 storage key。
- `SubjectId` 必須接受既有 `chinese` 與新增 `mathematics`，且 student／subject isolation 必須維持。
- 12 題採已核准 Design 文字；不得自行改題、宣稱南一教材審核或加入未核准 variation。
- 每個數學 learning unit 只有一題，不設定 `reviewGroupId`，不得觸發 Sprint 18 confirmation。
- 不新增數字輸入、圖形操作、AI 出題、能力評分、教材管理、第二套答題／複習引擎或新資料 schema。
- 既有 1/3/7、retry、practice no-write、timer／`startedAt`、Parent Summary 指標語意不得改變。
- Browser smoke 只能使用 disposable Chromium context 與 synthetic whitelisted storage，不得使用真實 browser profile 或 localStorage。
- TypeScript 最終驗證使用 `npx tsc --noEmit --incremental false`。
- 每個 Task 先寫 failing test、確認 RED 原因，再做最小 production implementation；本 Plan 不包含自動 commit。

## File Map

### 題庫與內容驗證

- Create: `lib/questions/jiejie-mathematics.ts` — 姐姐 6 題數學題庫。
- Create: `lib/questions/meimei-mathematics.ts` — 妹妹 6 題數學題庫。
- Create: `lib/questions/sprint-22-mathematics.test.mjs` — 12 題 exact-content、metadata、計算與唯一答案測試。

### Subject 與共用流程

- Modify: `lib/learning-records.ts` — 擴充 `SubjectId` 與 record validator。
- Modify: `lib/review-time-settings.ts` — 接受 `mathematics`，保留現有 settings shape。
- Modify: `components/question/ChineseQuestionFlow.tsx` — 接收 `SubjectId`，完成 record 使用傳入 subject。
- Modify: `components/review/TodayReviewPage.tsx` — 接收 subject 並傳給 selection／session／flow。
- Modify: `components/practice/ChineseReinforcementPracticePage.tsx` — 接收 subject 並傳給 practice selection／flow。

### 路由與頁面

- Create: `app/jiejie/mathematics/page.tsx`。
- Create: `app/meimei/mathematics/page.tsx`。
- Create: `app/jiejie/mathematics/review/page.tsx`。
- Create: `app/meimei/mathematics/review/page.tsx`。
- Create: `app/jiejie/mathematics/reinforce/page.tsx`。
- Create: `app/meimei/mathematics/reinforce/page.tsx`。
- Modify: `app/jiejie/page.tsx`、`app/meimei/page.tsx` — 將數學佔位文字改為連結。
- Modify: `app/parent/page.tsx` — 將只描述國語的頁面文字改為涵蓋數學。

### Summary、records 與測試

- Modify: `components/parent/ParentLearningRecords.tsx` — 以最小 subject configuration 顯示兩位學生的數學摘要，不混合國語資料。
- Modify: `lib/learning-record-display.ts` — 若現有顯示邏輯以固定國語題庫解析 question ID，改為依 student／subject 題庫解析。
- Modify: `lib/learning-records.test.mjs`、`lib/review-time-settings.test.mjs` — mathematics acceptance／isolation。
- Modify: `lib/today-review.test.mjs`、`lib/spaced-review.test.mjs`、`lib/understanding-confirmation.test.mjs` — 數學 scheduling／singleton confirmation regression。
- Modify: `lib/reinforcement-practice.test.mjs`、`lib/parent-learning-summary.test.mjs`、`lib/review-sessions.test.mjs` — practice／summary／session isolation。
- Create or modify: `tests/browser/sprint-22.spec.ts` — disposable browser smoke。

## Review Focus

1. **Legacy Chinese storage:** 舊有只有 `subject='chinese'` 的 records、settings、sessions 必須仍可讀取；由 Task 2 的 compatibility tests 鎖定。
2. **Cross-student／cross-subject records:** 姐姐數學不得讀妹妹數學或姐姐國語；由 Task 2、Task 4、Task 6 的 isolation tests 鎖定。
3. **Singleton unit confirmation:** 沒有 variation 的數學題不得產生 Sprint 18 confirmation；由 Task 4 的 eligibility test 鎖定。
4. **Exact numeric content:** fraction、decimal、π、弧長、單位與 answer index 必須同時正確；由 Task 1 的 exact-content／calculation tests 鎖定。
5. **No-write practice and session state:** 數學 practice 不得新增 record，formal review session／timer 仍依 student + subject 隔離；由 Task 5 與 Task 7 鎖定。

## Tasks

### Task 1: Lock the 12 approved mathematics questions

**Files:**
- Create: `lib/questions/jiejie-mathematics.ts`
- Create: `lib/questions/meimei-mathematics.ts`
- Create: `lib/questions/sprint-22-mathematics.test.mjs`
- Reference: `docs/superpowers/specs/2026-09-22-sprint-22-mathematics-design.md`

**Interfaces:**
- Consumes: existing `QuestionCardQuestion` shape and approved Design copy.
- Produces: `questions: Question[]` arrays with exactly 6 questions per student; every question has `reviewGroupId` absent, unique ID, valid `answer` index, hint, explanation, and approved topic.

- [x] **Step 1: Write the failing exact-content tests.**

  Assert the following IDs and answers before creating the banks:

  ```js
  assert.deepEqual(jiejie.map((q) => q.id), [
    'jiejie-mathematics-1', 'jiejie-mathematics-2', 'jiejie-mathematics-3',
    'jiejie-mathematics-4', 'jiejie-mathematics-5', 'jiejie-mathematics-6',
  ]);
  assert.deepEqual(jiejie.map((q) => q.answer), [0, 2, 1, 2, 1, 1]);
  assert.deepEqual(meimei.map((q) => q.answer), [0, 1, 1, 2, 2, 0]);
  assert.equal(Object.hasOwn(jiejie[5], 'reviewGroupId'), false);
  assert.equal(Object.hasOwn(meimei[5], 'reviewGroupId'), false);
  ```

  Also assert approved copy: J6 contains `圓心角 90°` and `π = 3.14`; M2 contains `向百位進 1` and `所以答案為 5639`; M6 contains `每人分得幾顆？剩下幾顆？`.

- [x] **Step 2: Run the focused test to verify RED.**

  Run: `node --test lib/questions/sprint-22-mathematics.test.mjs`

  Expected: FAIL because both mathematics question-bank modules do not exist yet.

- [x] **Step 3: Add the minimal two question-bank modules.**

  Copy only the 12 approved candidate objects from the Design. Keep the existing `QuestionCardQuestion` type, use the approved `basic`／`application` values, and do not add `reviewGroupId` or any new field.

- [x] **Step 4: Add calculation, answer-index, uniqueness, metadata and copy assertions.**

  For every question, assert `options.length >= 2`, `answer` is an in-range integer, all options are distinct, `hint` and `explanation` are non-empty, and the mathematical expected result is represented by the specified answer index. Assert 6 distinct topics/units per student and 12 globally unique question IDs.

- [x] **Step 5: Run focused verification.**

  Run: `node --test lib/questions/sprint-22-mathematics.test.mjs lib/questions/question-bank-validation.test.mjs`

  Expected: PASS with 12 exact approved questions and no variation groups.

- [x] **Step 6: Completion condition.**

  Task is complete when the 12 question objects match the approved Design exactly, all 12 calculations and answer indices pass, and no production route imports them yet.

### Task 2: Extend subject acceptance without changing persisted shapes

**Files:**
- Modify: `lib/learning-records.ts`
- Modify: `lib/review-time-settings.ts`
- Test: `lib/learning-records.test.mjs`
- Test: `lib/review-time-settings.test.mjs`

**Interfaces:**
- Consumes: existing `StudentId`, `SubjectId`, `LearningRecord`, and review-time setting types.
- Produces: `SubjectId = 'chinese' | 'mathematics'`; existing storage readers accept both subjects while retaining the same object fields and keys.

- [x] **Step 1: Write failing acceptance and compatibility tests.**

  Add records with `subject: 'mathematics'` and existing records with `subject: 'chinese'`; assert both survive `readLearningRecords()`. Add one invalid subject and assert it is filtered. Add both subjects to review-time settings and assert both survive with the same `{ student, subject, targetMinutes }` shape.

  ```js
  const stored = [record({ subject: 'chinese' }), record({ subject: 'mathematics' })];
  window.localStorage.setItem(LEARNING_RECORDS_STORAGE_KEY, JSON.stringify(stored));
  assert.deepEqual(readLearningRecords().map((item) => item.subject), ['chinese', 'mathematics']);
  ```

- [x] **Step 2: Run focused tests to verify RED.**

  Run: `node --test lib/learning-records.test.mjs lib/review-time-settings.test.mjs`

  Expected: FAIL because the current record validator and review-time validator accept only `chinese`.

- [x] **Step 3: Make the smallest type and validator change.**

  Extend the union and replace the literal subject check with membership in the two allowed `SubjectId` values. Do not rename the storage keys, add migration code, or alter record fields.

- [x] **Step 4: Verify both subjects and legacy data.**

  Run the focused tests again. Expected: PASS for Chinese compatibility, Mathematics acceptance, invalid-subject rejection, student isolation, and unchanged serialized shape.

- [x] **Step 5: Completion condition.**

  Task is complete when old Chinese fixtures pass unchanged, Mathematics fixtures are accepted, and no persisted schema or key changes appear in the diff.

### Task 3: Make the existing answer flow subject-aware and add first-practice routes

**Files:**
- Modify: `components/question/ChineseQuestionFlow.tsx`
- Modify: `app/jiejie/chinese/page.tsx`
- Modify: `app/meimei/chinese/page.tsx`
- Create: `app/jiejie/mathematics/page.tsx`
- Create: `app/meimei/mathematics/page.tsx`
- Modify: `app/jiejie/page.tsx`
- Modify: `app/meimei/page.tsx`
- Test: `tests/browser/sprint-22.spec.ts`

**Interfaces:**
- Consumes: `SubjectId`, the two Mathematics question banks, existing `QuestionCard`, and existing persistence policy.
- Produces: first-practice routes that call the same flow with `subject="mathematics"`; Chinese routes explicitly keep `subject="chinese"`.

- [x] **Step 1: Write failing browser tests for the two entry routes.**

  Add disposable-context tests that visit `/jiejie/mathematics` and `/meimei/mathematics`, assert the first approved question text is visible, answer the approved option, and inspect `project-seed:learning-records:v1` for one completed record with the correct student and `subject: 'mathematics'`.

- [x] **Step 2: Run the focused browser test to verify RED.**

  Run: `npm run test:browser -- tests/browser/sprint-22.spec.ts`

  Expected: FAIL because the mathematics routes do not exist and the current flow hard-codes `subject: 'chinese'`.

- [x] **Step 3: Add a subject prop to the existing flow.**

  Import `SubjectId`, require `subject` in the flow props, use it when constructing `LearningRecord`, and preserve all existing confirmation, retry, hint, explanation, completion, persistence-policy, and timer behavior. Pass `subject="chinese"` from both existing Chinese pages.

- [x] **Step 4: Add the two mathematics first-practice routes and homepage links.**

  Reuse the existing pink/green themes and home links. Import the appropriate Mathematics bank and pass `student`, `subject="mathematics"`, and the existing flow labels. Replace each homepage Mathematics item with a link.

- [x] **Step 5: Run focused verification.**

  Run: `npm run test:browser -- tests/browser/sprint-22.spec.ts`

  Expected: PASS for both students, answer completion, correct subject, and unchanged Chinese route smoke.

- [x] **Step 6: Completion condition.**

  Both students can complete one Mathematics question through the existing QuestionCard flow, and no second answer engine or schema field exists.

### Task 4: Connect Mathematics Today Review and preserve spaced-review semantics

**Files:**
- Modify: `components/review/TodayReviewPage.tsx`
- Create: `app/jiejie/mathematics/review/page.tsx`
- Create: `app/meimei/mathematics/review/page.tsx`
- Modify: `lib/today-review.test.mjs`
- Modify: `lib/spaced-review.test.mjs`
- Modify: `lib/understanding-confirmation.test.mjs`
- Test: `tests/browser/sprint-22.spec.ts`

**Interfaces:**
- Consumes: existing `selectTodayReviewItems({ questions, records, student, subject, now, timeZone })` signature and subject-aware flow from Task 3.
- Produces: Mathematics review routes that isolate records by student and subject and keep 1/3/7, retry, five-group limit, and confirmation eligibility unchanged.

- [x] **Step 1: Write failing pure tests for Mathematics selection and singleton confirmation.**

  Add a Mathematics question fixture and records for Chinese, the other student, and Mathematics. Assert only matching Mathematics records affect `deriveReviewState`/`selectTodayReviewItems`. Assert each singleton Mathematics group returns one item and `confirmation === null`.

  ```js
  const items = selectTodayReviewItems({ questions: mathQuestions, records: [chineseRecord, sisterMathRecord, dueMathRecord], student: 'jiejie', subject: 'mathematics', now, timeZone });
  assert.equal(items.length, 1);
  assert.equal(items[0].confirmation, null);
  ```

- [x] **Step 2: Run focused tests to verify RED.**

  Run: `node --test lib/today-review.test.mjs lib/spaced-review.test.mjs lib/understanding-confirmation.test.mjs`

  Expected: FAIL because no Mathematics route/fixture wiring exists and the page still sends `'chinese'` to review helpers.

- [x] **Step 3: Parameterize TodayReviewPage subject.**

  Add required `subject: SubjectId`, pass it to `selectTodayReviewItems`, `getOrCreateReviewSession`, `endReviewSession`, target-minute lookup, and the flow. Keep the existing page/session lifecycle intact.

- [x] **Step 4: Add the two Mathematics review routes.**

  Reuse the existing page component, Mathematics bank, student, theme, and home links; do not create a second selection algorithm.

- [x] **Step 5: Run focused and browser verification.**

  Run the three Node test files and `npm run test:browser -- tests/browser/sprint-22.spec.ts`.

  Expected: PASS for Mathematics 1/3/7 and retry isolation, singleton no-confirmation, both Mathematics review routes, and existing Chinese review routes.

- [x] **Step 6: Completion condition.**

  Mathematics Today Review uses only Mathematics history, never invents a confirmation item, and all existing Chinese scheduling assertions remain unchanged.

### Task 5: Connect Mathematics practice, review-time settings, sessions and timer isolation

**Files:**
- Modify: `components/practice/ChineseReinforcementPracticePage.tsx`
- Create: `app/jiejie/mathematics/reinforce/page.tsx`
- Create: `app/meimei/mathematics/reinforce/page.tsx`
- Modify: `lib/reinforcement-practice.test.mjs`
- Modify: `lib/review-sessions.test.mjs`
- Modify: `lib/review-time-settings.test.mjs`
- Test: `tests/browser/sprint-22.spec.ts`

**Interfaces:**
- Consumes: `selectReinforcementPracticeItems`, `shouldPersistLearningRecord`, `getOrCreateReviewSession`, and review-time settings using the subject passed by the page.
- Produces: Mathematics practice with no Learning Record write, plus independent Mathematics review session/settings state.

- [x] **Step 1: Write failing tests for practice no-write and subject-separated session/settings state.**

  Seed a Mathematics retry candidate and assert practice returns it without adding a record. Create Chinese and Mathematics sessions/settings for the same student and assert each is independently readable and ending Mathematics leaves Chinese intact.

- [x] **Step 2: Run focused tests to verify RED.**

  Run: `node --test lib/reinforcement-practice.test.mjs lib/review-sessions.test.mjs lib/review-time-settings.test.mjs`

  Expected: FAIL because the practice component and settings validator still hard-code Chinese at the page/storage boundary.

- [x] **Step 3: Parameterize the practice page and add Mathematics routes.**

  Add `subject: SubjectId`, pass it to practice selection and the shared flow, and preserve `mode="reinforcement-practice"`. Add both Mathematics reinforce routes using the existing no-write policy.

- [x] **Step 4: Extend review-time setting validation without changing storage shape.**

  Accept `mathematics` through the already-expanded `SubjectId`; keep keying by `${student}:${subject}` and preserve 10/15-minute semantics.

- [x] **Step 5: Run focused and browser verification.**

  Run the three focused Node test files and the Mathematics browser smoke. Expected: PASS for no-write practice, session/settings isolation, timer display, refresh persistence, and Chinese state preservation.

- [x] **Step 6: Completion condition.**

  Mathematics practice never writes formal records, and Chinese/Mathematics session or timer state cannot end, overwrite, or display the other subject’s state.

### Task 6: Add Mathematics to Parent Summary without mixing subjects

**Files:**
- Modify: `components/parent/ParentLearningRecords.tsx`
- Modify: `app/parent/page.tsx`
- Modify: `lib/learning-record-display.ts`
- Modify: `lib/parent-learning-summary.test.mjs`
- Modify: `lib/learning-record-display.test.mjs`
- Test: `tests/browser/sprint-22.spec.ts`

**Interfaces:**
- Consumes: `createParentLearningSummary({ records, student, subject, questions, now, timeZone })` and both students’ Chinese/Mathematics banks.
- Produces: per-student, per-subject summaries with unchanged counts, due items, retry attention, pending confirmation handling, and record display semantics.

- [x] **Step 1: Write failing summary isolation tests.**

  Seed records for both students and both subjects. Assert a Mathematics summary counts only Mathematics records, a Chinese summary counts only Chinese records, and a Mathematics question ID is not labelled through a Chinese bank.

  ```js
  const summary = createParentLearningSummary({ records, student: 'jiejie', subject: 'mathematics', questions: mathQuestions, now, timeZone });
  assert.equal(summary.today.completedRecordCount, 1);
  assert.equal(summary.today.completedLearningGroupCount, 1);
  ```

- [x] **Step 2: Run focused tests to verify RED.**

  Run: `node --test lib/parent-learning-summary.test.mjs lib/learning-record-display.test.mjs`

  Expected: FAIL because the Parent UI and display mapping currently import and assume only Chinese banks.

- [x] **Step 3: Make the display and summary configuration subject-aware.**

  Use a small explicit configuration containing `{ subject, questions, label }` for Chinese and Mathematics. Keep the existing student sections and render separate subject summaries; do not add analytics storage or cross-subject comparisons.

- [x] **Step 4: Update parent copy and settings controls.**

  Change the parent page description to cover Chinese and Mathematics. Pass the current subject to `getReviewTargetMinutes`/`saveReviewTargetMinutes` so controls remain isolated.

- [x] **Step 5: Run focused and browser verification.**

  Run the two Node test files and `npm run test:browser -- tests/browser/sprint-22.spec.ts`. Expected: PASS for Chinese/Mathematics counts, due/pending/retry separation, student isolation, and visible Mathematics summary sections.

- [x] **Step 6: Completion condition.**

  Parent Summary displays Mathematics data correctly without changing Sprint 20 indicator meanings or mixing any Chinese records.

### Task 7: Complete integrated browser smoke coverage

**Files:**
- Modify: `tests/browser/sprint-22.spec.ts`
- Reference: `tests/browser/fixtures/storage.ts`
- Reference: `playwright.config.ts`

**Interfaces:**
- Consumes: all subject-aware routes and helpers from Tasks 1–6 plus the existing disposable storage fixture.
- Produces: repeatable Sprint 22 smoke coverage with no real user profile access.

- [x] **Step 1: Write the complete smoke assertions before running them.**

  Cover: both Mathematics first-practice routes, answer/hint/explanation flow, record subject, Mathematics review, Mathematics reinforce no-write, Parent Summary, Chinese/Mathematics separation, sister isolation, existing Chinese routes, and console errors.

- [x] **Step 2: Run the Sprint 22 browser suite to identify remaining RED cases.**

  Run: `npm run test:browser -- tests/browser/sprint-22.spec.ts`

  Expected: any failure must identify a missing route, wrong subject, storage contamination, missing copy, or console error; do not weaken the assertions.

- [x] **Step 3: Fix only the smallest implementation defect exposed by the focused test.**

  Preserve disposable contexts, synthetic storage whitelist, and existing browser fixture behavior. Do not use the real profile or broaden storage access.

- [x] **Step 4: Re-run the complete Sprint 22 browser suite.**

  Expected: PASS with no console errors and no changes to unrelated storage keys.

- [x] **Step 5: Completion condition.**

  The complete requested Mathematics flow is exercised in Chromium, and all isolation assertions pass.

### Task 8: Run full regression and release-readiness verification

**Files:**
- No new product files; execute against all changed files from Tasks 1–7.

**Interfaces:**
- Consumes: the complete subject-aware implementation and focused tests.
- Produces: evidence for Sprint 13–21 regression, type safety, lint, build, browser smoke, and diff cleanliness.

- [x] **Step 1: Run focused Sprint 22 tests.**

  Run:

  ```powershell
  node --test lib/questions/sprint-22-mathematics.test.mjs lib/learning-records.test.mjs lib/review-time-settings.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs lib/understanding-confirmation.test.mjs lib/reinforcement-practice.test.mjs lib/review-sessions.test.mjs lib/parent-learning-summary.test.mjs lib/learning-record-display.test.mjs
  ```

  Expected: PASS with all Mathematics content and isolation assertions.

- [x] **Step 2: Run the complete Node suite.**

  Run: `npm test`

  Expected: all existing Sprint 1–21 tests and Sprint 22 tests pass; no test is skipped or weakened.

- [x] **Step 3: Run lint and TypeScript.**

  Run: `npm run lint` and `npx tsc --noEmit --incremental false`.

  Expected: both PASS; the incremental-disabled command avoids the known cache EPERM without changing source semantics.

- [x] **Step 4: Run production build.**

  Run: `npm run build`

  Expected: PASS with all existing and Mathematics routes compiled.

- [x] **Step 5: Run browser smoke.**

  Run: `npm run test:browser`

  Expected: existing smoke plus Sprint 22 smoke passes in disposable contexts with no console errors.

- [x] **Step 6: Run diff check and inspect scope.**

  Run: `git diff --check` and inspect `git diff --stat`/`git status`.

  Expected: no whitespace errors, no OneDrive changes, no dependency or unrelated-file changes, no schema/storage-key changes.

- [x] **Step 7: Completion condition.**

  All focused and full verification commands pass, the diff contains only approved Sprint 22 implementation files, and Human can review the result before any commit or push.

## Plan-level completion boundary

This document records the Human-approved Implementation Plan, execution evidence, and Sprint Close. Tasks 1–8 were executed and final verification passed. Sprint 22 is Completed after the approved close commit and push.
