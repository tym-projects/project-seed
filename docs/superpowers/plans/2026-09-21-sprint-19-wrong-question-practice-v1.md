# Sprint 19 Wrong Question Practice v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立孩子端最多 3 個 learning units 的「再練一次」流程，從近期 Learning Records deterministic 推導候選，但不寫入正式 Learning Record、不建立 ReviewSession，也不影響正常 review、1/3/7 或 Sprint 18 confirmation。

**Architecture:** 新增純函式 `lib/reinforcement-practice.ts`，以 `reviewGroupId ?? question.id` 聚合、套用既有 local-day 與 `deriveReviewState` 語意，輸出最多 3 個 practice items。新增一個明確的 practice persistence policy，讓共用 `ChineseQuestionFlow` 可以重用 QuestionCard 與既有互動，但在 practice mode 跳過 `saveLearningRecord`；practice page 不建立 ReviewSession。兩個學生入口各自傳入題庫與 student，所有 localStorage 讀取仍由既有學生／科目過濾界線保護。

**Tech Stack:** Next.js App Router、React、TypeScript、既有 `QuestionCard`／`ChineseQuestionFlow`、Node `node:test`、ESLint、TypeScript compiler、Next production build；不新增 dependency 或 browser test framework。

**Spec:** `docs/superpowers/specs/2026-09-21-sprint-19-wrong-question-practice-v1-design.md`

## Global Constraints

- learning unit 一律使用 `reviewGroupId ?? question.id`；同 group variations 只佔一個 practice 名額。
- 候選只使用今日以前 7 個 local calendar days 內的有效 Learning Records；local-day 計算沿用 `getLocalDateKey`／`addLocalDays` 與傳入 `timeZone`。
- `attempts > 1` 是 bounded recent reinforcement signal，不建立永久錯題標籤。
- 今日已有任何有效 group record、目前 `isDue`、或 Sprint 18 confirmation pending 的 group 不得進入 practice candidates。
- 候選排序 deterministic，最多 3 個 groups；不得使用 random。
- legacy 單題可成為一個 learning unit；無歷史 record 的題目不進入 practice。
- practice 不呼叫 `saveLearningRecord`、`getOrCreateReviewSession` 或 `endReviewSession`。
- 不修改 Learning Record／ReviewSession schema、1/3/7、retry、same-day progression、Sprint 18 confirmation、Sprint 17 timer／`startedAt` 或 parent summary 語意。
- practice completion、答題 attempts 與目前題目只存在當次 React/UI state；refresh、離開或中斷不恢復。
- 姐姐／妹妹與 subject 必須在 selector、page 與 UI entry 全程隔離。
- 不建立永久 practice storage key、`recordSource`、AI 選題、mastery score、新題庫或新的 retry chain。
- 本階段只建立 plan，不修改 production code、tests、治理文件，不 commit、push、merge、rebase、tag 或 release。

## Review Focus

- Local-day boundary：同一 UTC timestamp 在不同 timezone 的日期歸屬必須遵循既有 helper；Task 1 以跨午夜案例固定行為。
- A retry followed by a later first-try success：7-day bounded signal 可短期保留，但 due group 或今日已作答仍排除；Task 1 固定此優先順序。
- Sprint 18 pending primary-only record：不得被 practice selector 當成普通 retry candidate，也不得觸發第二個 confirmation；Task 2 固定 before/after selection。
- Shared flow persistence：practice 必須重用 QuestionCard 但不能呼叫正式 record side effect；Task 3 以 policy test 加上 isolated browser localStorage assertion 固定。
- Refresh/re-entry：未保存的 practice state 必須重置，重新進入可再次顯示相同 deterministic candidates；Task 4 的 page contract 與 Task 5 browser smoke 固定。

## File Map

- `lib/reinforcement-practice.ts`: 純函式 candidate aggregation、7-day eligibility、due/today/pending exclusion、deterministic ranking 與 variation selection。
- `lib/reinforcement-practice.test.mjs`: selector 的 failing-first 與完整純資料測試。
- `lib/practice-persistence.ts`: formal review 與 reinforcement practice 的 persistence policy，禁止 practice 直接寫正式 records。
- `lib/practice-persistence.test.mjs`: policy contract 測試。
- `components/question/ChineseQuestionFlow.tsx`: 增加顯式 practice mode／退出入口支援；維持正式 review 的 default side effect 與 timer 行為。
- `components/practice/ChineseReinforcementPracticePage.tsx`: client page，讀取 records、建立 practice items、管理當次 start state；不使用 ReviewSession。
- `app/jiejie/reinforce/page.tsx`: 姐姐國語再練入口。
- `app/meimei/reinforce/page.tsx`: 妹妹國語再練入口。
- `app/jiejie/page.tsx`, `app/meimei/page.tsx`: 各自加入再練一次連結，不能共用另一位學生的 props 或 records。
- `lib/parent-learning-summary.test.mjs`, `lib/spaced-review.test.mjs`, `lib/today-review.test.mjs`：必要時補上 no-side-effect／formal-review regression assertions；不得改變既有 production semantics。

### Task 1: Build the deterministic reinforcement candidate selector

**Files:**
- Create: `lib/reinforcement-practice.ts`
- Create: `lib/reinforcement-practice.test.mjs`
- Reuse without modification: `lib/spaced-review.ts`, `lib/today-review.ts`, `lib/understanding-confirmation.ts`, question bank modules

**Interfaces:**
- Consumes: question objects with `{ id, reviewGroupId?, topic, type }`, `records: unknown[]`, `student`, `subject`, `now`, `timeZone`, optional `maxItems`.
- Produces:

  ```ts
  export type ReinforcementPracticeItem<T extends PracticeQuestion> = {
    groupId: string;
    primary: T;
  };

  export function selectReinforcementPracticeItems<T extends PracticeQuestion>(args: {
    questions: T[];
    records: unknown[];
    student: string;
    subject: string;
    now: Date;
    timeZone: string;
    maxItems?: number;
  }): ReinforcementPracticeItem<T>[];
  ```

  `PracticeQuestion` must contain `id`, optional `reviewGroupId`, `topic`, and `type`; the implementation may preserve the complete question object in `primary`.

- Candidate algorithm to pin in tests:
  1. Filter to valid completed records for the requested student and subject.
  2. Build groups by `reviewGroupId ?? question.id` and ignore record question IDs not in the current question bank.
  3. Define `today = getLocalDateKey(now, timeZone)` and `lookbackStart = addLocalDays(today, -7)`. Include records with local date `>= lookbackStart` and `< today`; this is exactly the seven prior local calendar days.
  4. Require at least one lookback record with `attempts > 1`.
  5. Exclude any group with a valid requested-student／subject record on `today`.
  6. Exclude any group whose history-derived `ReviewState.isDue` is true, including retry groups due the next day. The state must use the group’s question IDs and existing `deriveReviewState`.
  7. Rank by latest retry local date descending, retry count descending, latest completed local date descending, then group ID ascending.
  8. Truncate to `Math.min(Math.max(maxItems ?? 3, 0), 3)` groups.
  9. Choose one deterministic variation per group using a practice-specific key containing student, subject, group ID, and today; when possible advance past the latest completed question ID. A one-question legacy group returns that question.

- [x] **Step 1: Add failing tests for empty, bounded, and capped candidates.**

  Add fixtures that create valid completed records with explicit `createdAt` values and assert:

  - no retry signal gives `[]`;
  - one eligible group returns one item;
  - four eligible groups return exactly three items;
  - a negative or oversized `maxItems` is safely bounded to zero or three;
  - returned items contain one group ID each.

  Run:

  ```text
  node --test lib/reinforcement-practice.test.mjs
  ```

  Expected failure: module/function does not exist before implementation.

- [x] **Step 2: Add failing tests for the seven local-day boundary and attempts signal.**

  Use a fixed `now` and `timeZone: 'Asia/Taipei'`. Pin records exactly at:

  - `today - 7` local days: included;
  - `today - 8` local days: excluded;
  - today at a different UTC offset: excluded because its local date is today;
  - a record with `attempts: 1`: not a retry signal;
  - a record with `attempts: 2`: a retry signal;
  - a timestamp around local midnight: classified by `getLocalDateKey`, not by UTC date slicing.

  Re-run the focused test and confirm the expected missing-module or missing-function failures.

- [x] **Step 3: Add failing tests for grouping, legacy fallback, selection, and ranking.**

  Assert that:

  - two variations sharing one `reviewGroupId` produce one candidate;
  - a legacy question without `reviewGroupId` is its own candidate;
  - repeated calls with identical inputs return the same group and question IDs;
  - the latest completed question ID is avoided when another variation exists;
  - ranking follows latest retry date, retry count, latest completion date, and group ID tie-breaks;
  - a later first-try success does not permanently erase the bounded seven-day reinforcement signal, but a window-expired signal disappears.

- [x] **Step 4: Implement the smallest pure selector.**

  Reuse existing record validation shape and `getLocalDateKey`, `addLocalDays`, and `deriveReviewState`. Keep all filtering in memory; do not read or write browser storage from this module. Do not call Today Review selection and do not add a new scheduling state.

- [x] **Step 5: Run the focused selector tests and existing scheduling regression.**

  Run:

  ```text
  node --test lib/reinforcement-practice.test.mjs lib/spaced-review.test.mjs lib/today-review.test.mjs
  ```

  Completion condition: all selector tests pass; existing 5-group, group aggregation, student／subject isolation, 1/3/7, retry, and Sprint 18 selection tests remain green; no production files other than the new pure selector have changed.

### Task 2: Pin formal review and Sprint 18 isolation at the selector boundary

**Files:**
- Modify: `lib/reinforcement-practice.test.mjs`
- Modify: `lib/today-review.test.mjs` only for explicit non-interference assertions
- Modify: `lib/understanding-confirmation.test.mjs` only if a boundary assertion is missing
- Modify: `lib/spaced-review.test.mjs` only if a before／after state regression is missing
- No production change is expected in this task after Task 1; if a production change appears necessary, stop for design review rather than weakening an existing semantic.

**Interfaces:**
- Consumes: `selectReinforcementPracticeItems`, `selectTodayReviewItems`, `findPendingConfirmation`, and `deriveReviewState`.
- Produces: regression evidence that reinforcement selection is a read-only optional branch and cannot consume, alter, or replace formal review selection.

- [x] **Step 1: Write failing conflict tests.**

  Add records and assertions for:

  - a group with today’s primary record: absent from practice and absent from normal Today Review through the existing same-day guard;
  - a group with today’s primary plus confirmation: absent from practice and absent from normal Today Review;
  - a group with today’s primary-only pending confirmation: absent from practice, while `selectTodayReviewItems` returns the confirmation item as before;
  - a currently due group with no today record: absent from practice but still available to normal Today Review;
  - a due group not selected because normal review has already reached five groups: still absent from practice;
  - a record belonging to the other student or another subject: cannot make the requested student／subject group eligible or pending;
  - practice selection does not change the input records array or the result of a second normal review selection.

  Run:

  ```text
  node --test lib/reinforcement-practice.test.mjs lib/today-review.test.mjs lib/understanding-confirmation.test.mjs
  ```

  Expected failure: the conflict fixtures fail until Task 1’s exclusion rules are implemented; any failure in existing Sprint 18 behavior identifies a regression that must be fixed before proceeding.

- [x] **Step 2: Add failing before／after scheduling and parent-summary tests.**

  Build a snapshot with a grouped variation history, call reinforcement selection, then derive:

  - `deriveReviewState` for the group;
  - `createParentLearningSummary` for the student and subject;
  - `selectTodayReviewItems` for the same records.

  Assert all three results are byte-for-byte or structurally equal before and after selection. This test must not call a persistence API; it proves the selector itself has no scheduling or summary side effect.

- [x] **Step 3: Implement only test-driven boundary corrections.**

  If Task 1 has a defect, correct only the selector’s pure filters. Do not add a record source, a practice storage key, a ReviewSession, or a special schedule state. Keep pending confirmation detection owned by Sprint 18’s existing helper and treat any today record for that group as protected.

- [x] **Step 4: Run focused isolation and Sprint 13–18 regression tests.**

  Run:

  ```text
  node --test lib/reinforcement-practice.test.mjs lib/today-review.test.mjs lib/understanding-confirmation*.test.mjs lib/spaced-review.test.mjs lib/parent-learning-summary.test.mjs
  ```

  Completion condition: all conflict, isolation, schedule, parent summary, Today Review, and Sprint 18 tests pass; normal review output is unchanged for every fixture.

### Task 3: Add an explicit no-record practice policy and wire the shared question flow safely

**Files:**
- Create: `lib/practice-persistence.ts`
- Create: `lib/practice-persistence.test.mjs`
- Modify: `components/question/ChineseQuestionFlow.tsx`
- Reuse: `components/question/QuestionCard.tsx`, `components/question/QuestionResult.tsx`, `components/question/QuestionOptions.tsx`

**Interfaces:**
- Consumes: a literal mode `'formal-review' | 'reinforcement-practice'`.
- Produces:

  ```ts
  export type QuestionFlowMode = 'formal-review' | 'reinforcement-practice';
  export function shouldPersistLearningRecord(mode: QuestionFlowMode): boolean;
  ```

  `ChineseQuestionFlow` adds `mode?: QuestionFlowMode` defaulting to `'formal-review'`, plus an optional practice exit label/link if needed by the page. Existing review callers do not pass the new prop and retain current record persistence, ReviewSession callback, timer, copy, and confirmation behavior.

- [x] **Step 1: Write failing persistence policy tests.**

  Add Node tests asserting:

  ```text
  shouldPersistLearningRecord('formal-review') === true
  shouldPersistLearningRecord('reinforcement-practice') === false
  ```

  Also assert the mode type accepts only these two semantic values at the TypeScript boundary. Run the focused test and confirm the missing module/function failure.

- [x] **Step 2: Implement the smallest policy function.**

  Return `mode === 'formal-review'`; do not access `window`, localStorage, or ReviewSession. This function is a guardrail, not a new persistence state.

- [x] **Step 3: Write the flow integration change after the policy test is red.**

  In `ChineseQuestionFlow`, keep the current `QuestionCard` and `advanceAfterCompletion` path. On completion:

  - always keep completion in local React state so hint／explanation／next button behavior remains unchanged;
  - call the existing Learning Record construction and `saveLearningRecord` only when `shouldPersistLearningRecord(mode)` is true;
  - never create or end ReviewSession from the practice mode;
  - preserve the existing `reviewStartedAt`, `reviewTargetMinutes`, `useReviewElapsedMinutes`, timer notices, and `reviewItems` confirmation behavior for formal review;
  - use `confirmation: null` for practice items, so no primary→confirmation transition or third phase can occur;
  - expose the existing home link as an explicit exit affordance while practice is active, without auto-submitting or clearing records.

- [x] **Step 4: Run focused flow and type verification.**

  Run:

  ```text
  node --test lib/practice-persistence.test.mjs lib/understanding-confirmation-flow.test.mjs lib/learning-records.test.mjs
  npx tsc --noEmit
  ```

  Completion condition: policy tests pass; existing formal review flow and Sprint 18 transition tests remain green; TypeScript confirms the new mode is explicit and no caller accidentally becomes practice mode.

### Task 4: Build the student-isolated practice page and entries

**Files:**
- Create: `components/practice/ChineseReinforcementPracticePage.tsx`
- Create: `app/jiejie/reinforce/page.tsx`
- Create: `app/meimei/reinforce/page.tsx`
- Modify: `app/jiejie/page.tsx`
- Modify: `app/meimei/page.tsx`
- Modify: `components/question/ChineseQuestionFlow.tsx` only if Task 3’s exit or completion props need the smallest integration adjustment
- Test through: `lib/reinforcement-practice.test.mjs`, `lib/practice-persistence.test.mjs`, TypeScript, and isolated browser smoke; no new browser framework

**Interfaces:**
- Each route passes its own question bank, `student`, theme, home href, and home label to `ChineseReinforcementPracticePage`.
- The client page reads `readLearningRecords()` only after mount, gets the browser’s resolved timezone, and calls `selectReinforcementPracticeItems` with `subject: 'chinese'`.
- The page stores only `items`, `hasStarted`, and the existing flow’s in-memory state. It must not call `getOrCreateReviewSession`, `endReviewSession`, `saveLearningRecord`, or any new storage API.
- It passes `reviewItems={items.map(item => ({ groupId: item.groupId, primary: item.primary, confirmation: null }))}`, `mode="reinforcement-practice"`, and no `reviewStartedAt`／`reviewTargetMinutes` to `ChineseQuestionFlow`.

- [x] **Step 1: Add failing page-contract tests or pure fixtures before route wiring.**

  Where the repository test harness cannot import TSX, keep the executable contract in the selector and policy tests and add explicit assertions in the implementation checklist:

  - empty selector result renders the empty state path;
  - 1–3 items render the start state with the exact count;
  - the route’s student parameter is the only student used for record filtering;
  - practice mode has no timer props and no ReviewSession call sites;
  - flow items all have `confirmation: null`.

  Run the available focused tests and confirm the page/route behavior is not yet present in TypeScript or browser smoke.

- [x] **Step 2: Implement the client page and two route wrappers.**

  Use the existing question bank imports and theme conventions. On initial mount, show a neutral loading shell; after selection show the count/start state or empty state. On start, reuse the shared flow. On exit or completion, link to that student’s home page. Do not use a separate answer engine.

- [x] **Step 3: Add independent home-page links.**

  Add `/jiejie/reinforce` only to 姐姐’s page and `/meimei/reinforce` only to 妹妹’s page. Keep Today Review links unchanged. The entry may always be visible; candidate availability is determined on the practice page so no existing home page needs unsafe localStorage access.

- [x] **Step 4: Verify refresh and re-entry semantics.**

  Confirm the page has no durable state: refreshing before start or during a question re-reads unchanged records, recomputes the same deterministic items, and resets `hasStarted`／QuestionCard attempts. Returning later the same day may show the same candidates; do not add sessionStorage or another persistence key.

- [x] **Step 5: Run page-level static verification.**

  Run:

  ```text
  npx tsc --noEmit
  npm run lint
  ```

  Completion condition: both routes build their own student-isolated page, no production caller writes records in practice mode, no ReviewSession or timer is introduced, and formal `/jiejie/review`／`/meimei/review` call paths remain unchanged.

### Task 5: Full regression, isolated browser smoke, and implementation handoff evidence

**Files:**
- Modify only tests if a missing regression assertion is discovered in Tasks 1–4.
- Review: `lib/reinforcement-practice.test.mjs`, `lib/practice-persistence.test.mjs`, `lib/today-review.test.mjs`, `lib/understanding-confirmation*.test.mjs`, `lib/spaced-review.test.mjs`, `lib/parent-learning-summary.test.mjs`, `lib/learning-records.test.mjs`, `lib/review-sessions.test.mjs`, `lib/review-session-time.test.mjs`, all question-bank tests.
- No production scope expansion in this task.

- [x] **Step 1: Run focused Sprint 19 tests.**

  Run:

  ```text
  node --test lib/reinforcement-practice.test.mjs lib/practice-persistence.test.mjs lib/today-review.test.mjs lib/understanding-confirmation*.test.mjs lib/spaced-review.test.mjs lib/learning-records.test.mjs lib/parent-learning-summary.test.mjs
  ```

  Verify candidate boundaries, grouping, deterministic selection, due／today／pending exclusions, no record persistence policy, no schedule or summary changes, and no Sprint 18 regression.

- [x] **Step 2: Run the complete automated suite.**

  Run:

  ```text
  npm test
  ```

  Record the actual final count; do not assume the Sprint 18 count of 115.

- [x] **Step 3: Run static and production verification.**

  Run in order:

  ```text
  npm run lint
  npx tsc --noEmit
  npm run build
  git diff --check
  ```

  A failure must be diagnosed and the affected focused tests rerun before continuing. Build output, cache, localStorage dumps, and temporary browser data must remain outside the commit diff.

- [x] **Step 4: Evaluate isolated browser smoke without touching the user profile.**

  Use a disposable browser profile/context or an existing safe isolated browser harness. Seed only synthetic localStorage records for one student and subject. If the available browser tool cannot isolate storage, do not manually seed the existing profile; record the limitation and rely on automated selector／flow tests.

  Result: the available browser tool could not provide a disposable isolated localStorage profile/context. No existing profile was touched; the limitation and automated-test coverage are recorded in the Sprint 19 governance documents.

  Verify:

  1. 姐姐 and 妹妹 each see only their own `/reinforce` entry and candidates.
  2. Empty, one-item, and three-item states render correctly; no fourth item appears.
  3. A retry candidate uses the existing QuestionCard, hint, explanation, retry, next-question, and completion feedback.
  4. Practice completion leaves `project-seed:learning-records:v1` and `project-seed:review-sessions:v1` unchanged.
  5. Normal Today Review output, Sprint 18 pending confirmation, parent summary, 1/3/7 state, and Sprint 17 timer／`startedAt` remain unchanged before and after practice.
  6. Refresh while in progress resets the UI rather than restoring progress; re-entry uses deterministic candidates.
  7. No console errors occur.

- [x] **Step 5: Final diff and handoff review.**

  Confirm the diff contains only Sprint 19 implementation/test files required by this plan. Confirm no schema, new durable storage key, Sprint 18 history rewrite, build artifact, cache, browser data, or unrelated refactor is present. Update the plan checkboxes only as tasks actually complete; Sprint status remains implementation-in-progress until later Human Review.

  This plan does not authorize commit, push, merge, release, or Sprint 19 close.

## Acceptance Criteria

- Candidate selection is deterministic, isolated, bounded to the seven prior local days, grouped by `reviewGroupId ?? question.id`, and capped at three groups.
- Today records, due groups, pending confirmation groups, and cross-student／subject records cannot enter practice.
- Legacy single questions remain supported.
- Practice reuses QuestionCard and existing hint／explanation／retry behavior without creating a parallel answer engine.
- Practice does not write Learning Records, create ReviewSessions, add storage keys, alter 1/3/7, alter retry semantics, trigger Sprint 18 confirmation, change parent summaries, or affect Sprint 17 timer／`startedAt`.
- Refresh, exit, interruption, and same-day re-entry follow the explicitly non-persistent v1 behavior.
- `npm test`, lint, TypeScript, build, `git diff --check`, focused regression, and safe isolated browser smoke are completed with actual results recorded.

## Execution Status

- All five implementation Tasks completed in the canonical repository.
- Final automated verification: 131/131 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed.
- Browser smoke was not run because the available browser tooling could not provide a disposable isolated localStorage profile without risking existing user data; the limitation is recorded and automated tests cover selector, flow, isolation, and no-write behavior.
- Sprint 19 status: Completed after Final Human Review.
- Implementation commit: `6b0b637` Complete Sprint 19 wrong question practice v1.
- Push status: pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- Browser smoke remains not manually executed because safe isolated localStorage setup was unavailable; this is recorded as a limitation, not a passed result.
- Next Step: 等待 Sprint 20 規劃。
