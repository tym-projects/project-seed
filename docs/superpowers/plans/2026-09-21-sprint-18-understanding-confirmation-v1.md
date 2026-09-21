# Sprint 18 Understanding Confirmation v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Each task follows test-first order: write a failing test, verify the failure, implement the smallest change, then run focused and regression verification.

**Goal:** 在既有 Today Review 中，於下一次到期 review 對符合條件的 variation group 增加最多一題不同問法的理解確認，同時維持既有 Learning Record、ReviewSession、1/3/7 與 Sprint 17 timer 語意。

**Architecture:** 保留 `LearningRecord` 與 `ReviewSession` schema 不變。新增純函式的 confirmation eligibility／variation／pending-plan 邏輯，讓 `today-review` 以 learning group 為單位產生最多 5 個 review items；`ChineseQuestionFlow` 只增加 optional confirmation step，並沿用現有 QuestionCard 與 record 寫入路徑。Refresh 時以今日已完成的 primary `questionId` 與 group question list 推導 pending confirmation，不保存新的永久 state。

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Node `node:test`, TypeScript transpile-based library tests, existing localStorage review/session helpers。

**Spec:** `docs/superpowers/specs/2026-09-21-sprint-18-understanding-confirmation-v1-design.md`

## Global Constraints

- 理解確認只發生在「下一次到期 review」，不是首次接觸 primary 後無條件追加。
- group 至少有 2 個 variations，且在今天以前只完成過 1 個 distinct variation，才可成為 confirmation candidate。
- 今日到期且今日尚無該 group record；legacy／單 variation 維持原行為。
- 每個 review session 最多一個 confirmation；不建立第三題 chain。
- `LearningRecord`、`ReviewSession` schema、localStorage keys、1/3/7 間隔與 retry reset 語意不變。
- 同 group 同 local date 的 primary／confirmation records 只形成一次 progression，確認不能以第二筆 record 再推進一次。
- daily limit 仍是最多 5 個 learning groups，不是最多 5 個展開後題目。
- student、subject、local date 必須沿用既有 isolation 條件。
- 不新增永久 selected question、pending confirmation、record role 或 session state。
- Sprint 17 `startedAt`、timer、target setting、advisory reminder 文案與責任邊界不變。
- 不新增 dependency，不修改 Sprint 17 歷史，不在本計畫執行中自行 commit 或 push。

## Review Focus

1. 今日 primary 已完成但 confirmation 未完成時，selector 必須辨識為 pending，而不是因「今日有 record」直接排除；由 Task 2 的 pending-plan tests 固定。
2. primary 與 confirmation 必須保存各自實際 `questionId`，但 schedule 必須用 `reviewGroupId ?? question.id` 聚合；由 Task 3 的 record／spaced-review tests 固定。
3. 兩筆同日 group records 只能形成一個 1/3/7 review day；由 Task 3 的 same-day progression tests 固定。
4. confirmation retry 必須讓整個 group `hadWrong = true` 並隔日重試，不能開始第三題；由 Task 4 的 flow tests 與 Task 3 的 schedule tests 固定。
5. refresh/reopen 恢復 confirmation 時不得重建 ReviewSession 或 reset `startedAt`；由 Task 5 的 session/timer tests 與 Browser smoke 固定。

## File Map

- Create: `lib/understanding-confirmation.ts` — pure eligibility、alternate variation、pending confirmation 與 review-item types。
- Modify: `lib/today-review.ts` — 保留既有 `selectTodayReviewQuestions` API，新增以 group 為單位的 review-item selection wrapper。
- Modify: `components/review/TodayReviewPage.tsx` — 使用 review items，讓 refresh 後顯示 pending confirmation。
- Modify: `components/question/ChineseQuestionFlow.tsx` — 支援每個 item 最多一個 confirmation step，沿用既有 record callback、timer props 與 completion callback。
- Create: `lib/understanding-confirmation-flow.ts` — pure UI state transition helper，避免把 confirmation chain 判斷散落在 React state callback。
- Modify: `lib/today-review.test.mjs` — eligibility、selection、limit、student/subject isolation 與 pending plan tests。
- Create: `lib/understanding-confirmation.test.mjs` — alternate variation and eligibility unit tests。
- Create: `lib/understanding-confirmation-flow.test.mjs` — primary/confirmation transition tests。
- Modify: `lib/spaced-review.test.mjs` — actual question IDs plus group aggregation/progression regression tests。
- Modify: `lib/learning-records.test.mjs` — record preservation regression tests where the existing helpers are used.
- Modify: `lib/review-sessions.test.mjs` and/or `lib/review-session-time.test.mjs` — refresh and timer preservation tests where current pure helpers permit it.
- No changes: `lib/learning-records.ts`, `lib/review-sessions.ts`, `lib/review-session-time.ts`, `lib/review-time-settings.ts` schemas and storage contracts remain unchanged unless a focused test proves an existing bug unrelated to Sprint 18.

## Interfaces and invariants

The implementation must expose pure functions with stable, testable contracts. Names may be adjusted only if the same inputs and outputs remain explicit and all callers/tests are updated together.

```ts
type ReviewQuestionLike = {
  id: string;
  reviewGroupId?: string;
  topic: string;
  type: 'basic' | 'application';
};

type ConfirmationPlan<T extends ReviewQuestionLike> = {
  groupId: string;
  primary: T;
  confirmation: T | null;
};

type PendingConfirmation<T extends ReviewQuestionLike> = {
  groupId: string;
  primaryQuestionId: string;
  confirmation: T;
};

function getReviewGroupId(question: ReviewQuestionLike): string;

function isConfirmationEligible<T extends ReviewQuestionLike>(args: {
  group: { id: string; questions: T[] };
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
}): boolean;

function selectConfirmationVariation<T extends ReviewQuestionLike>(args: {
  group: { id: string; questions: T[] };
  primaryQuestionId: string;
  records: unknown[];
  student: string;
  subject: string;
  localReviewDate: string;
}): T | null;

function findPendingConfirmation<T extends ReviewQuestionLike>(args: {
  group: { id: string; questions: T[] };
  records: unknown[];
  student: string;
  subject: string;
  now: Date;
  timeZone: string;
}): PendingConfirmation<T> | null;
```

`findPendingConfirmation` must require exactly the pending shape needed by v1: a valid completed primary record for today, no completed confirmation record for today, and a confirmation question different from that primary. It must not infer pending state from “some record exists today” alone.

`selectTodayReviewItems` should return at most 5 `ConfirmationPlan` items in the existing selected group order. A fresh eligible group returns `{ primary, confirmation }`; a group with a pending confirmation returns `{ primary: pendingConfirmationQuestion, confirmation: null }` so refresh does not replay the completed primary; all other groups return `{ primary, confirmation: null }`. The existing `selectTodayReviewQuestions` remains a compatibility wrapper returning each item’s `primary` question for non-confirmation callers and existing tests.

## Task 1: Add pure eligibility and alternate-variation tests

**Files:**
- Create: `lib/understanding-confirmation.test.mjs`
- Create: `lib/understanding-confirmation.ts`
- Read only: `lib/spaced-review.ts`, `lib/today-review.ts`, `lib/learning-records.ts`

**Interfaces:**
- Consumes: existing completed-record shape and `deriveReviewState`/`getLocalDateKey` behavior.
- Produces: `getReviewGroupId`, `isConfirmationEligible`, `selectConfirmationVariation`, `findPendingConfirmation` as specified above.

- [x] **Step 1: Write failing tests for group identity and eligibility.**

  Add Node tests that assert:

  - `reviewGroupId ?? question.id` is the group identity.
  - a never-completed group is not eligible;
  - a group with exactly one historical distinct completed variation is eligible only when due and today has no record;
  - a group with two historical distinct variations is not eligible;
  - a first-try record today makes the group ineligible for a fresh trigger;
  - a retry record today also makes the group ineligible;
  - malformed, incomplete, incorrect, unknown-question, other-student, and other-subject records do not become triggers;
  - single-variation and missing-`reviewGroupId` groups return false.

  Use fixed `Asia/Taipei` dates and the existing test record factory shape. Do not use random values; the test harness must throw if `Math.random` is called.

- [x] **Step 2: Run the new focused test and verify it fails.**

  Run: `node --test lib/understanding-confirmation.test.mjs`

  Expected: FAIL because the new module and exports do not exist yet.

- [x] **Step 3: Write failing deterministic alternate-selection tests.**

  Add tests for:

  - two variations always selecting the non-primary variation, even when it is the older historical variation;
  - three or more variations excluding primary and, when a candidate remains, the most recent historical variation;
  - repeated calls with the same student, subject, group, date, and primary returning the same confirmation;
  - changing student, subject, group, date, or primary changing only the deterministic key domain, never introducing random selection;
  - no valid alternate returning `null`.

- [x] **Step 4: Implement the smallest pure module.**

  Reuse the existing completed-record validation/filtering and `deriveReviewState` semantics. Filter history by student, subject, group question IDs, valid completed records, and records before today where the trigger requires prior history. Count distinct historical `questionId`s for eligibility. Use a deterministic hash key of the form:

  ```text
  ${student}:${subject}:${group.id}:${localReviewDate}:confirmation:${primaryQuestionId}
  ```

  For two variations, return the only non-primary candidate. For three or more, first exclude primary and latest historical question when possible, then fall back to any non-primary candidate. Never write storage or add schema fields.

- [x] **Step 5: Run focused tests and existing selection/spaced-review tests.**

  Run: `node --test lib/understanding-confirmation.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs`

  Expected: all pass; the existing tests remain unchanged and no random selection is used.

## Task 2: Add review-item planning and explicit pending-confirmation reconstruction

**Files:**
- Modify: `lib/today-review.ts`
- Modify: `lib/today-review.test.mjs`
- Modify: `lib/understanding-confirmation.ts` only if the pure contracts from Task 1 need a narrowly scoped shared helper

**Interfaces:**
- Consumes: existing group sorting, due ordering, topic spread, `MAX_QUESTIONS = 5`, primary `selectVariation`, and Task 1 selectors.
- Produces: `selectTodayReviewItems(args): ConfirmationPlan<T>[]`, while retaining `selectTodayReviewQuestions(args): T[]` as a compatibility wrapper.

- [x] **Step 1: Write failing review-plan tests.**

  Add tests that prove:

  - first-ever group returns one primary and `confirmation: null`;
  - due group with one historical variation returns primary plus exactly one different confirmation;
  - due group with two historical variations does not get a confirmation;
  - legacy and single-variation groups never get one;
  - when multiple groups are eligible, only the first group in the existing selected order gets confirmation;
  - the selected result contains at most 5 groups, with confirmation being an optional extra question inside one group rather than a sixth group;
  - primary selection retains recent-question avoidance;
  - student and subject records cannot create pending plans or alter selection for another student/subject;
  - a group with today’s primary record and no today confirmation returns the confirmation as the next `primary` item and does not replay the completed primary;
  - a group with today’s primary and today’s confirmation is excluded by same-day protection;
  - today’s record from a different group does not satisfy pending confirmation.

- [x] **Step 2: Run the focused plan tests and verify failure.**

  Run: `node --test lib/today-review.test.mjs`

  Expected: FAIL for the new `selectTodayReviewItems` and pending-plan assertions while the pre-existing compatibility assertions continue to identify the missing implementation.

- [x] **Step 3: Implement the smallest review-item layer.**

  Keep the existing group construction, record filtering, due sorting, topic spread, and five-group limit. After primary groups are selected:

  1. detect a pending confirmation from an exact today-primary-only shape;
  2. otherwise evaluate fresh eligibility only for the first eligible selected group;
  3. attach at most one alternate confirmation;
  4. return no confirmation for all other groups;
  5. keep the compatibility wrapper returning the item primary questions.

  The pending test must distinguish these record sets explicitly:

  | Today records for one group | Returned item |
  |---|---|
  | none | normal primary; fresh eligibility may attach confirmation only when due/history rules allow |
  | exactly one completed primary variation, no other completed variation | confirmation question as next item; no replay of primary |
  | completed primary plus completed confirmation | group excluded by existing same-day guard |
  | primary retry record | no confirmation; existing retry scheduling |

- [x] **Step 4: Run focused plan and regression tests.**

  Run: `node --test lib/understanding-confirmation.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs`

  Expected: all pass, including the existing five-group, topic-spread, local-date, malformed-record, student-isolation, subject-isolation, and recent-variation tests.

## Task 3: Pin Learning Record IDs and one-progression scheduling semantics

**Files:**
- Modify: `lib/spaced-review.test.mjs`
- Modify: `lib/learning-records.test.mjs` if its existing helpers are the correct boundary for persistence assertions
- No schema changes: `lib/learning-records.ts`, `lib/spaced-review.ts`

**Interfaces:**
- Consumes: Task 2 item plan and existing `saveLearningRecord` record shape.
- Produces: regression proof that actual variation IDs are persisted and group scheduling remains deduplicated.

- [x] **Step 1: Write failing record and schedule regression tests.**

  Add tests that construct two completed records on the same local date:

  ```js
  record('variation-primary', { createdAt: sameLocalDateTime });
  record('variation-confirmation', { createdAt: laterSameLocalDateTime });
  ```

  Assert that both `questionId` values remain the actual displayed IDs, with no role/confirmation/schema field added. Pass both IDs as `questionIds` to `deriveReviewState` and assert:

  - `stableSuccessStreak` increases once, not twice;
  - `nextReviewLocalDate` is the one progression date;
  - a confirmation record with `attempts: 2` makes the same group `hadWrong: true`, resets streak, and schedules the next local day;
  - records from another student or subject do not affect the group state.

- [x] **Step 2: Run the focused tests and verify the new assertions fail if the implementation would count records independently.**

  Run: `node --test lib/spaced-review.test.mjs lib/learning-records.test.mjs`

  Expected: the new tests expose any accidental per-record progression or question-ID rewriting before UI integration is attempted.

- [x] **Step 3: Implement only the minimum integration correction required by the tests.**

  Keep aggregation in `deriveReviewState` by local date and `questionIds`; do not add a second progression call for confirmation. Ensure the flow passes each `QuestionCompletion.questionId` unchanged to the existing `LearningRecord` object and `saveLearningRecord`.

- [x] **Step 4: Re-run focused scheduling and full library regression.**

  Run: `node --test lib/spaced-review.test.mjs lib/learning-records.test.mjs lib/*.test.mjs lib/questions/*.test.mjs`

  Expected: all existing Sprint 13–17 library tests and the new record/schedule tests pass.

## Task 4: Add test-first primary-to-confirmation flow transitions

**Files:**
- Create: `lib/understanding-confirmation-flow.ts`
- Create: `lib/understanding-confirmation-flow.test.mjs`
- Modify: `components/question/ChineseQuestionFlow.tsx`

**Interfaces:**
- Consumes: Task 2 `ConfirmationPlan` items and existing `QuestionCompletion` values.
- Produces: a pure transition contract used by React state, for example:

  ```ts
  type ConfirmationFlowState = {
    itemIndex: number;
    phase: 'primary' | 'confirmation';
    isComplete: boolean;
  };

  function getInitialConfirmationFlowState(itemCount: number): ConfirmationFlowState;
  function advanceAfterCompletion(args: {
    state: ConfirmationFlowState;
    item: ConfirmationPlan<QuestionCardQuestion>;
    completion: QuestionCompletion;
    itemCount: number;
  }): ConfirmationFlowState;
  ```

- [x] **Step 1: Write failing transition tests.**

  Test exact transitions:

  - primary first-try correct with confirmation → same item, phase `confirmation`;
  - primary retry (`attempts > 1`) → next item or complete, never confirmation;
  - primary incomplete is not passed as a completion and cannot transition;
  - confirmation first-try correct → next group or complete;
  - confirmation retry → next group or complete after that one question, never a third phase;
  - no-confirmation item → existing one-question progression;
  - a plan with at most five items never creates a sixth group or infinite loop.

- [x] **Step 2: Run the focused flow test and verify it fails.**

  Run: `node --test lib/understanding-confirmation-flow.test.mjs`

  Expected: FAIL because the transition helper does not exist.

- [x] **Step 3: Implement the smallest pure transition helper.**

  Treat only `correct === true`, `completed === true`, and `attempts === 1` on primary as permission to enter confirmation. Confirmation completion always advances once; retry is represented by the existing QuestionCard attempts and record, not a new flow phase. The helper must never produce a third phase or persist state.

- [x] **Step 4: Wire `ChineseQuestionFlow` to the helper without changing record schema.**

  Add an optional review-item prop while preserving the existing `questions` prop for ordinary practice pages. Use the current `QuestionCard` for both phases, change its `key` when moving from primary to confirmation, and pass `hasNextQuestion`/`onNextQuestion` according to the pure transition. Keep the existing `onQuestionComplete` record construction so primary and confirmation save their actual `completion.questionId`, answer values, attempts, and timestamps. Display the approved inline copy only when entering confirmation. Do not alter `reviewStartedAt`, `reviewTargetMinutes`, `useReviewElapsedMinutes`, or timer notices.

- [x] **Step 5: Run focused flow tests and type-check the touched components.**

  Run: `node --test lib/understanding-confirmation-flow.test.mjs lib/understanding-confirmation.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs`; then `npx tsc --noEmit`.

  Expected: all focused tests pass and TypeScript reports no new errors.

## Task 5: Integrate Today Review refresh/reopen and protect Sprint 17 timer

**Files:**
- Modify: `components/review/TodayReviewPage.tsx`
- Modify: `components/question/ChineseQuestionFlow.tsx` only where the Task 4 interface is consumed
- Modify: `lib/review-sessions.test.mjs` and/or `lib/review-session-time.test.mjs`
- Add or update a browser smoke test location only if the repository’s existing browser harness already supports it; do not add a new browser framework dependency

**Interfaces:**
- Consumes: Task 2 `selectTodayReviewItems`, Task 4 flow transitions, existing `getOrCreateReviewSession` and `endReviewSession`.
- Produces: refresh-safe review UI that reopens pending confirmation while preserving the active session timestamp and target reminder behavior.

- [x] **Step 1: Write failing refresh/session tests.**

  Cover the pure boundaries available in the existing test harness:

  - selecting after a primary record is saved returns the same deterministic confirmation question;
  - selecting after both primary and confirmation records are saved returns no item for that group;
  - a confirmation retry that has not completed has no confirmation record and reconstructs the same pending confirmation;
  - calling `getOrCreateReviewSession` on reopen with the same student/subject/local date returns the existing `startedAt`, not a new timestamp;
  - review target setting and `getReviewTimeNotice` inputs remain unchanged across pending-confirmation reopen.

- [x] **Step 2: Run the focused tests and verify failure for the new pending/reopen assertions.**

  Run: `node --test lib/today-review.test.mjs lib/review-sessions.test.mjs lib/review-session-time.test.mjs`

- [x] **Step 3: Implement the smallest page integration.**

  Read records and compute review items through the existing selection effect. On refresh, the plan’s exact today-primary-only shape supplies the confirmation item. Reuse the existing ReviewSession; do not clear/recreate it merely because the item is pending. Pass the same `reviewStartedAt` and `reviewTargetMinutes` into `ChineseQuestionFlow`. Keep `endReviewSession` at the existing review completion boundary.

- [x] **Step 4: Run focused tests plus TypeScript.**

  Run: `node --test lib/today-review.test.mjs lib/understanding-confirmation*.test.mjs lib/review-sessions.test.mjs lib/review-session-time.test.mjs`; then `npx tsc --noEmit`.

  Expected: pending confirmation is deterministic, timer/session timestamp is unchanged, and no new persistence key or schema field appears.

## Task 6: Full Sprint 13–17 regression and browser smoke

**Files:**
- Modify only tests if a regression assertion needs to be added; no production changes should be introduced in this task.
- Review: `lib/questions/*.test.mjs`, `lib/parent-learning-summary.test.mjs`, `lib/review-time-settings.test.mjs`, `lib/review-session-time.test.mjs`, `lib/review-sessions.test.mjs`, `lib/learning-record-display.test.mjs`.

- [x] **Step 1: Run all focused confirmation tests.**

  Run: `node --test lib/understanding-confirmation.test.mjs lib/understanding-confirmation-flow.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs lib/learning-records.test.mjs`

  Expected: all confirmation, record, group aggregation, daily limit, isolation, retry, and pending-reopen assertions pass.

- [x] **Step 2: Run the complete automated test suite.**

  Run: `npm test`

  Expected: all existing Sprint 13–17 tests plus Sprint 18 tests pass; record the actual final count rather than assuming 95.

- [x] **Step 3: Run static and production verification.**

  Run, in order:

  ```text
  npm run lint
  npx tsc --noEmit
  npm run build
  git diff --check
  ```

  Expected: lint, TypeScript, build, and whitespace checks pass. A failure must be diagnosed before any completion claim.

- [x] **Step 4: Run browser smoke against the canonical repository build.**

  Verify at least:

  1. ordinary primary review still renders, answers, hints, explains, and completes;
  2. an eligible next-day group shows primary, then the alternate confirmation, with no third question;
  3. primary complete → confirmation pending → browser refresh/reopen shows the same confirmation;
  4. completed confirmation excludes the group for the remainder of the local day;
  5. 姐姐 and 妹妹 records do not cross-trigger or alter each other;
  6. subject isolation remains intact;
  7. daily review still selects at most 5 groups even when one group has a confirmation;
  8. Sprint 17 elapsed-time display, 10/15-minute advisory reminder, and existing `startedAt` behavior remain unchanged;
  9. browser console has no errors.

  Record any controlled timer wait limitation separately; do not change Sprint 17 timer behavior to make smoke easier.

- [x] **Step 5: Review the final diff without modifying Sprint 17 history.**

  Confirm the diff contains only Sprint 18 implementation/tests and any explicitly required Sprint 18 documentation synchronization. Confirm no build artifacts, cache, temporary test data, dependency lockfile churn, or unrelated refactor is included. This plan does not authorize commit, push, merge, or release.

## Acceptance Criteria

- All approved Design requirements are covered by a focused test or an explicit browser smoke check.
- Fresh confirmation occurs only for a due group with prior history and exactly one historical distinct variation.
- Pending confirmation is reconstructed from today’s primary-only completed record; today’s primary-plus-confirmation state is excluded.
- Primary and confirmation records preserve their actual `questionId` values and unchanged Learning Record schema.
- Same-group same-day records produce exactly one 1/3/7 progression; any retry resets the whole group to next-day review.
- No third question, infinite retry chain, mastery score, AI selection, or new persistence state is introduced.
- Daily selection remains capped at five groups and all student/subject isolation tests pass.
- ReviewSession `startedAt`, Sprint 17 target setting, timer, and reminder behavior remain unchanged.
- `npm test`, lint, TypeScript, build, `git diff --check`, and browser smoke complete with their actual results recorded before Sprint 18 close review.

## Self-Review Checklist

- [x] Design sections 1–17 are mapped to Tasks 1–6.
- [x] Eligibility, deterministic selection, two-/three-plus variation behavior, recent avoidance, legacy fallback, primary/confirmation transitions, record IDs, same-day progression, retry, refresh, five-group cap, both isolation dimensions, timer regression, and Sprint 13–17 regression are explicitly planned.
- [x] Pending confirmation is distinguished from both no-today-record and primary-plus-confirmation-today states.
- [x] No task changes Learning Record or ReviewSession schema.
- [x] No third question or infinite chain is permitted by the pure flow contract and tests.
- [x] No `TBD`, `TODO`, `FIXME`, or implementation placeholder is used.
- [x] At plan creation this phase created only the plan; implementation proceeded only after Human Review approval, with no merge or release.

## Execution Status

- Sprint 18 implementation executed and all six Tasks completed.
- Final verification: 115/115 tests, lint, TypeScript, build, and `git diff --check` passed.
- Browser smoke limitation accepted: seeded confirmation UI could not be manually exercised without unsafe localStorage mutation; automated confirmation flow and refresh tests passed.
- Implementation commit: `5a672cb` Complete Sprint 18 understanding confirmation v1.
- Sprint Close completed; documentation synchronized and pushed. Next Step: 等待 Sprint 19 規劃。
