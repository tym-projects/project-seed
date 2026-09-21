# Sprint 17 — Parent Review Time Setting v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓家長分別設定姐姐、妹妹中文今日複習的 10 或 15 分鐘建議時長，並只改變孩子 review timer 的非強制提醒門檻。

**Architecture:** 新增 `lib/review-time-settings.ts` 作為唯一 settings localStorage domain；它與 Learning Record、review sessions 完全分離。`TodayReviewPage` 開始 review 時同時讀取既有 session 與目前 target，將 target 作為 review-only prop 傳入 `ChineseQuestionFlow`；純 timer helper 依 target 回傳語意化 notice，絕不修改 session。

**Tech Stack:** Next.js 16、React 19、TypeScript、Node built-in test runner、既有 `typescript.transpileModule` + `vm` test pattern、browser localStorage。

**Spec:** `docs/superpowers/specs/2026-08-20-sprint-17-parent-review-time-setting-v1-design.md`

## Global Constraints

- 只新增 `project-seed:review-settings:v1`；不 migration 任何既有資料。
- 不修改 `LearningRecord` schema、`project-seed:learning-records:v1`、其寫入時機或 `questionId` 語意。
- 不修改 `ReviewSession` schema、`project-seed:review-sessions:v1`、`lib/review-sessions.ts` 或 stale-session reset 規則。
- `getOrCreateReviewSession` 仍是同一 `(student, subject, localReviewDate)` 恢復原 `startedAt` 的唯一機制；setting helper 不得 import、呼叫或寫入 session domain。
- 未設定必須保留 Sprint 14：10 分鐘溫和提醒、15 分鐘完成提醒。
- 10 分鐘 mode 在 `elapsedMinutes >= 10` 永遠維持 10 分鐘完成提醒；不得在 15 分鐘改套 Sprint 14 的 hard-coded 15 分鐘 threshold 或顯示第二個狀態。
- 所有提醒都是 inline、advisory only：不得跳頁、提交、結束題目、清除 session、停用作答或阻斷 progression。
- 不改 `today-review.ts`、`spaced-review.ts`、review selection、每天最多 5 groups、1/3/7、retry、`reviewGroupId ?? question.id`、variation、parent summary 或 hint。
- 不新增 dependency、global state、navigation、Save 按鈕、設定頁或測試框架。
- 本計畫的執行階段才可改 code/tests；本回合不改 production code/tests、不 commit、不 push。

---

## File Structure

- Create `lib/review-time-settings.ts`：合法 setting validation、dedupe read、lookup、safe upsert write。
- Create `lib/review-time-settings.test.mjs`：settings persistence、isolation、malformed fallback 與 session non-interference。
- Modify `lib/review-session-time.ts`：保持 elapsed 算法，讓 notice 依 default／10／15 target 回傳語意 state。
- Modify `lib/review-session-time.test.mjs`：Sprint 14 default、10-minute persistent completion、15-minute behaviour。
- Modify `components/parent/ParentLearningRecords.tsx`：hydration 後讀 setting，於每位孩子卡片顯示立即保存的 radio group。
- Modify `components/review/TodayReviewPage.tsx`：開始時讀 setting，且不改既有 session helper 呼叫。
- Modify `components/question/ChineseQuestionFlow.tsx`：只在 review flow 顯示 notice；不改 Learning Record callback。

## Interfaces

```ts
// lib/review-time-settings.ts
export const REVIEW_TIME_SETTINGS_STORAGE_KEY = 'project-seed:review-settings:v1';
export type ReviewTargetMinutes = 10 | 15;
export type ReviewTimeSetting = {
  student: StudentId;
  subject: SubjectId;
  targetMinutes: ReviewTargetMinutes;
};
export function readReviewTimeSettings(): ReviewTimeSetting[];
export function getReviewTargetMinutes(
  student: StudentId,
  subject: SubjectId,
): ReviewTargetMinutes | null;
export function saveReviewTargetMinutes(
  student: StudentId,
  subject: SubjectId,
  targetMinutes: ReviewTargetMinutes,
): void;

// lib/review-session-time.ts
export type ReviewTimeNotice =
  | { kind: 'gentle-ten-minute' }
  | { kind: 'target-complete'; targetMinutes: ReviewTargetMinutes }
  | null;
export function getElapsedReviewMinutes(startedAt: string, now: Date): number;
export function getReviewTimeNotice(
  elapsedMinutes: number,
  targetMinutes: ReviewTargetMinutes | null,
): ReviewTimeNotice;
```

### Task 1: Review-time Settings Storage Domain (test-first)

**Files:** Create `lib/review-time-settings.ts`; create `lib/review-time-settings.test.mjs`.

**Consumes:** `StudentId` and `SubjectId` type imports from `lib/learning-records.ts`; browser localStorage only.

**Produces:** safe `readReviewTimeSettings`, `getReviewTargetMinutes`, and `saveReviewTargetMinutes` for Tasks 3–4.

- [x] **Step 1: Write failing storage contract tests**

Copy the in-memory `createLocalStorage()` / `vm` setup style from `lib/review-sessions.test.mjs`. Write these exact cases before creating the helper:

```js
test('returns null until a target is explicitly saved and restores it after refresh', () => {
  globalThis.window = { localStorage: createLocalStorage() };
  let settings = loadSettingsModule();
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), null);
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  settings = loadSettingsModule();
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), 10);
});

test('upserts one pair without changing sister or subject settings', () => {
  const settings = loadSettingsModule();
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 10);
  settings.saveReviewTargetMinutes('meimei', 'chinese', 15);
  settings.saveReviewTargetMinutes('jiejie', 'chinese', 15);
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'chinese'), 15);
  assert.equal(settings.getReviewTargetMinutes('meimei', 'chinese'), 15);
  assert.equal(settings.getReviewTargetMinutes('jiejie', 'math'), null);
});
```

Add tests that: invalid JSON and a non-array yield `[]` / `null`; invalid student, subject, or target records are dropped; duplicate valid records choose the last valid record; one `saveReviewTargetMinutes` normalizes its pair to exactly one record; absent `window` and throwing `setItem` do not throw.

In the same shared mock storage, seed a valid `project-seed:review-sessions:v1` session, call `saveReviewTargetMinutes`, and assert the raw session key string is byte-for-byte unchanged. This is the direct regression guard that a setting write cannot reset `startedAt`.

- [x] **Step 2: Run the new test file and confirm red**

Run: `node --test lib/review-time-settings.test.mjs`

Expected: FAIL because `lib/review-time-settings.ts` does not exist.

- [x] **Step 3: Implement the minimal isolated helper**

Implement browser guard plus `try/catch`. `isReviewTimeSetting` accepts only `jiejie`／`meimei`, the known `SubjectId` value `chinese`, and numeric literal `10` or `15`. `readReviewTimeSettings` parses only arrays, skips invalid items, and dedupes by scanning in stored order while replacing the map value for each identical `${student}:${subject}` key; return the deduped records in last-occurrence order.

`getReviewTargetMinutes` returns the matching target or `null`. `saveReviewTargetMinutes` reads settings, filters only the matching pair, appends the replacement, then writes this settings key. It must not import `review-sessions`, `today-review`, `spaced-review`, or Learning Record read/write functions.

- [x] **Step 4: Run focused storage tests and inspect the storage boundary**

Run: `node --test lib/review-time-settings.test.mjs`

Expected: PASS for persistence, sister/subject isolation, malformed fallback, duplicate handling, write failure safety, and unchanged session key.

Run: `rg -n "review-sessions|readLearningRecords|saveLearningRecord|getOrCreateReviewSession|endReviewSession" lib/review-time-settings.ts`

Expected: no matches.

### Task 2: Target-aware Timer Notice Contract (test-first)

**Files:** Modify `lib/review-session-time.ts`; modify `lib/review-session-time.test.mjs`.

**Consumes:** `ReviewTargetMinutes` from Task 1 as a type-only import.

**Produces:** target-aware `ReviewTimeNotice` consumed only by Task 4’s review UI.

- [x] **Step 1: Replace Sprint 14 notice assertions with explicit target cases**

Keep the elapsed-minute tests. Change notice assertions to deep equality and add these exact cases:

```js
test('keeps Sprint 14 thresholds when target is unset', () => {
  assert.equal(getReviewTimeNotice(9, null), null);
  assert.deepEqual(getReviewTimeNotice(10, null), { kind: 'gentle-ten-minute' });
  assert.deepEqual(getReviewTimeNotice(14, null), { kind: 'gentle-ten-minute' });
  assert.deepEqual(getReviewTimeNotice(15, null), { kind: 'target-complete', targetMinutes: 15 });
});

test('keeps ten-minute completion after the old fifteen-minute boundary', () => {
  assert.deepEqual(getReviewTimeNotice(10, 10), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(getReviewTimeNotice(14, 10), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(getReviewTimeNotice(15, 10), { kind: 'target-complete', targetMinutes: 10 });
  assert.deepEqual(getReviewTimeNotice(31, 10), { kind: 'target-complete', targetMinutes: 10 });
});

test('uses gentle ten then complete fifteen for an explicit fifteen-minute target', () => {
  assert.deepEqual(getReviewTimeNotice(10, 15), { kind: 'gentle-ten-minute' });
  assert.deepEqual(getReviewTimeNotice(15, 15), { kind: 'target-complete', targetMinutes: 15 });
});
```

- [x] **Step 2: Run the timer tests and confirm red**

Run: `node --test lib/review-session-time.test.mjs`

Expected: FAIL because current one-argument implementation returns legacy string states.

- [x] **Step 3: Implement the minimal pure decision table**

Retain `getElapsedReviewMinutes` unchanged. Implement `getReviewTimeNotice(elapsedMinutes, targetMinutes)` in this order:

```ts
if (elapsedMinutes < 10) return null;
if (targetMinutes === 10) return { kind: 'target-complete', targetMinutes: 10 };
if (elapsedMinutes < 15) return { kind: 'gentle-ten-minute' };
return { kind: 'target-complete', targetMinutes: 15 };
```

This order is mandatory: the `targetMinutes === 10` branch must precede the 15-minute comparison. `null` and `15` share the Sprint 14 10/15 behavior.

- [x] **Step 4: Run focused timer tests**

Run: `node --test lib/review-session-time.test.mjs`

Expected: PASS, including the 15- and 31-minute assertions for 10-minute mode.

### Task 3: Parent Inline Setting Control (test-first where the current suite supports it)

**Files:** Modify `components/parent/ParentLearningRecords.tsx`; reuse Task 1 tests.

**Consumes:** Task 1 helpers and existing `StudentSection` mapping.

**Produces:** a client-only, immediately persistent 10／15 setting control per existing parent card.

- [x] **Step 1: Extend the storage test with UI-facing state expectations**

Add a test confirming the helper reports `null` for a new student/subject pair rather than silently returning `15`; then save `10` and assert the sibling remains `null`. This is the data contract used by the initial UI rendering and prevents a false preselected 15-minute radio.

- [x] **Step 2: Run the focused test and confirm red**

Run: `node --test lib/review-time-settings.test.mjs`

Expected: FAIL until Task 1’s helper correctly returns `null` for an unset pair. If Task 1 already established this case, retain the passing test and proceed; do not add a React test dependency solely for this UI.

- [x] **Step 3: Add hydration-safe component state and the minimal radio group**

Add `ReviewTargetMinutes | null` state keyed by `StudentId`, initialized only after existing `readLearningRecords()` hydration effect runs. In the same client-only effect, call `getReviewTargetMinutes('jiejie', 'chinese')` and `getReviewTargetMinutes('meimei', 'chinese')`; set both values together with records.

Inside each existing student card directly below the `h2`, render a `fieldset` with unique `id` based on `section.id`, a `legend` 「今日複習時間」, a visible unset explanation 「未設定（10 分鐘提醒、15 分鐘完成提醒）」 only when target is `null`, and two labelled radio inputs for 10 and 15. Their checked value is `target === 10` / `target === 15`; no radio is checked when unset. On change, call `saveReviewTargetMinutes(section.id, 'chinese', minutes)` then update only that student’s state. Do not add a Save button or success toast.

- [x] **Step 4: Run type and lint checks**

Run: `npx tsc --noEmit`

Run: `npm run lint`

Expected: PASS without hydration warnings, unused imports, or inaccessible radio labels.

### Task 4: Read Settings at Review Start Without Session Mutation (test-first)

**Files:** Modify `components/review/TodayReviewPage.tsx`; modify `components/question/ChineseQuestionFlow.tsx`; extend `lib/review-time-settings.test.mjs` and `lib/review-session-time.test.mjs`.

**Consumes:** Task 1 lookup, Task 2 notice helper, existing `getOrCreateReviewSession` and `endReviewSession` unchanged.

**Produces:** current target reaches a review-only prop while active session restoration still returns the original `startedAt`.

- [x] **Step 1: Add the cross-domain active-session regression case before UI edits**

In `lib/review-time-settings.test.mjs`, use the shared storage mock to seed this exact session:

```js
const originalSession = {
  student: 'meimei', subject: 'chinese', localReviewDate: '2026-08-20',
  startedAt: '2026-08-20T00:00:00.000Z',
};
```

Save `15`, then save `10`; assert the raw `project-seed:review-sessions:v1` array still equals `[originalSession]`. Then use the timer helper with elapsed 10 and the current `getReviewTargetMinutes('meimei', 'chinese')`; assert `{ kind: 'target-complete', targetMinutes: 10 }`. This locks setting change + reopened review to the old session clock and new threshold.

- [x] **Step 2: Run the two focused test files**

Run: `node --test lib/review-time-settings.test.mjs lib/review-session-time.test.mjs`

Expected: PASS before React wiring; the proof is pure and does not depend on browser timer timing.

- [x] **Step 3: Wire the target at the existing start boundary**

In `TodayReviewPage`, add `reviewTargetMinutes: ReviewTargetMinutes | null` state. In the existing start button handler, preserve the current `getOrCreateReviewSession(...)` call exactly, store its returned session, read `getReviewTargetMinutes(student, 'chinese')`, store that target, then set `hasStarted(true)`. Pass `reviewTargetMinutes={reviewTargetMinutes}` with existing `reviewStartedAt` to `ChineseQuestionFlow`.

Do not put setting reads in `selectTodayReviewQuestions`, do not add settings to `ReviewSession`, and do not call `endReviewSession` on setting changes. A refresh/reopen goes through this same start handler: it restores the prior session first and resolves the current target separately.

- [x] **Step 4: Render notice by semantic state only**

Add optional prop `reviewTargetMinutes?: ReviewTargetMinutes | null` to `ChineseQuestionFlow`. When `reviewStartedAt` exists, call `getReviewTimeNotice(elapsedMinutes, reviewTargetMinutes ?? null)`. Render:

```tsx
{reviewTimeNotice?.kind === 'gentle-ten-minute' && (
  <p>已經複習 10 分鐘，可以完成目前題目後休息。</p>
)}
{reviewTimeNotice?.kind === 'target-complete' && reviewTimeNotice.targetMinutes === 10 && (
  <p>今天已經複習 10 分鐘，可以休息囉！</p>
)}
{reviewTimeNotice?.kind === 'target-complete' && reviewTimeNotice.targetMinutes === 15 && (
  <p>已經複習 15 分鐘，完成目前題目後，現在就休息吧。</p>
)}
```

Retain the inline styles’ existing visual hierarchy. Do not alter `QuestionCard`, `onQuestionComplete`, `saveLearningRecord`, question index logic, `onReviewComplete`, or the non-review caller’s behaviour.

- [x] **Step 5: Run focused integration checks**

Run: `node --test lib/review-time-settings.test.mjs lib/review-session-time.test.mjs lib/review-sessions.test.mjs`

Run: `npx tsc --noEmit`

Run: `npm run lint`

Expected: all PASS. The existing session suite must still pass unchanged, proving Sprint 14 same-day persistence and stale reset remain intact.

### Task 5: Full Regression and Safe Browser Smoke

**Files:** Verify all repository tests; do not update `PROJECT_STATUS.md`, roadmap, sprint log, spec, or plan until observed implementation evidence is reviewed separately.

**Consumes:** Tasks 1–4.

**Produces:** evidence for a later Sprint 17 close decision only; no commit in this task.

- [x] **Step 1: Run complete automated regression**

Run: `npm test`

Expected: PASS for Sprint 14 sessions/timer, Sprint 15 parent summary, Sprint 16 hint, and existing spaced-review/today-review suites. Record the observed count; do not reuse a historic count.

- [x] **Step 2: Run repository quality checks**

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run build`

Run: `git diff --check`

Expected: every command exits 0.

- [x] **Step 3: Run a storage-safe browser smoke**

Use an isolated browser storage context if available. Open `/parent`, verify two independent setting groups and refresh persistence. For a controlled 10-minute session, verify the 10-minute completion copy remains the same after 15 minutes and that the current question stays answerable. For 15 / unset, verify 10-minute gentle then 15-minute completion. Reopen a same-date session after changing 15 to 10 and verify the elapsed basis remains its original `startedAt` while the notice switches to 10-minute completion.

If isolated storage or controlled time is unavailable, do not modify the existing profile. Report the browser limitation and retain automated pure boundary/session evidence as the supported proof.

- [x] **Step 4: Inspect scope before proposing Sprint close**

Run: `git status --short`

Run: `git diff --check`

Expected: only files listed in this plan changed. Do not change Sprint status, commit, push, or begin a closeout task without a separate Human Approval.

## Plan Self-Review

- Settings storage, local persistence, malformed fallback, duplicate resolution, sister/subject isolation, and write-failure behaviour map to Task 1.
- Default, 10-minute, and 15-minute timer behaviours map to Task 2. The `>= 15` 10-minute assertion and mandatory branch order prevent a hard-coded Sprint 14 fallback.
- Existing parent-page structure and immediate persistence map to Task 3 without adding a new route or React test framework.
- The unchanged raw session key plus old `startedAt` / new threshold scenario map to Task 1 and Task 4; no planned module writes session data.
- Learning Records, review selection, 1/3/7, groups, retry, variation, parent summary, and hint are protected by Global Constraints and Task 5 full regression.
- No placeholders, dependencies, implementation code, tests, commits, pushes, or Sprint-status changes are part of this plan-writing turn.

## Human Approval Gate

Human approved the design, plan, and implementation. Tasks 1–5 are complete. Sprint 17 remains awaiting the separate Final Human Review Gate; do not commit, push, or mark it complete before that approval.
