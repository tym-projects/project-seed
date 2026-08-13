# Sprint 14 — 複習時間控制 v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為姐姐與妹妹今日複習加入同日本地日期 session 計時與 10/15 分鐘非強制提醒，不改變既有複習資料與選題行為。

**Architecture:** `lib/review-sessions.ts` 是唯一 localStorage domain helper，以既有 `getLocalDateKey` 限制 session 恢復鍵為 `student + subject + localReviewDate`；跨日資料為 stale 並由今天 session 取代。純時間 helper 處理邊界，React hook 只更新整分鐘，頁面僅在開始／完成呼叫 session helper。

**Tech Stack:** Next.js 16、React 19、TypeScript、Node built-in test runner、既有 `typescript.transpileModule` + `vm` 純資料測試模式、localStorage。

## Global Constraints

- 不新增 dependency、全域 state manager、秒級顯示或倒數。
- 不修改 `project-seed:learning-records:v1`、`LearningRecord` schema／寫入時機、`lib/spaced-review.ts`，或 `lib/today-review.ts`。
- 日期一律使用 `getLocalDateKey(now, timeZone)`，不得以 UTC ISO date 判斷。
- 只有 `student`、`subject`、`localReviewDate` 三者全相同才可恢復；同 student／subject 的舊日期 session 必須移除或被今天 session 取代。
- timer 只影響 UI/session，不能鎖題、停用按鈕、導頁或中斷作答。
- 所有 storage 操作都用 browser guard 與 `try/catch`；SSR/hydration 期間不讀 storage。

---

## File Structure

- Create `lib/review-sessions.ts`：schema、驗證、讀取、同日建立／恢復、指定 session 結束。
- Create `lib/review-sessions.test.mjs`：storage/domain 純資料測試。
- Create `lib/review-session-time.ts` 與 `lib/review-session-time.test.mjs`：分鐘與提醒邊界純函式及測試。
- Create `components/review/useReviewElapsedMinutes.ts`：分鐘邊界 client hook。
- Modify `components/review/TodayReviewPage.tsx`：開始／完成接線，不改選題 effect。
- Modify `components/question/ChineseQuestionFlow.tsx`：選用時間 UI 和 completion callback。
- Modify `PROJECT_STATUS.md` 與必要時 `docs/sprint-log.md`：僅功能完成並驗證後。

## Interfaces

    export type ReviewSession = {
      student: StudentId; subject: string; localReviewDate: string; startedAt: string;
    };
    export const REVIEW_SESSIONS_STORAGE_KEY = 'project-seed:review-sessions:v1';
    export function readReviewSessions(): ReviewSession[];
    export function getOrCreateReviewSession(options: {
      student: StudentId; subject: string; now: Date; timeZone: string;
    }): ReviewSession;
    export function endReviewSession(student: StudentId, subject: string): void;

    export type ReviewTimeNotice = 'ten-minutes' | 'fifteen-minutes' | null;
    export function getElapsedReviewMinutes(startedAt: string, now: Date): number;
    export function getReviewTimeNotice(elapsedMinutes: number): ReviewTimeNotice;
    export function useReviewElapsedMinutes(startedAt: string): number;

### Task 1: Session Storage Domain Helper

**Files:** Create `lib/review-sessions.ts`; test `lib/review-sessions.test.mjs`.

**Consumes:** `StudentId` from `lib/learning-records.ts`, `getLocalDateKey` from `lib/spaced-review.ts`.

**Produces:** Task 3 的 `ReviewSession`, `getOrCreateReviewSession`, `endReviewSession`。

- [ ] **Step 1: Write failing storage tests**

沿用 `lib/learning-records.test.mjs` 的 in-memory/failing localStorage mock，為無 browser、malformed JSON、非 array、無效欄位、建立新 session、同日 refresh 恢復、姐妹隔離、不同 subject 隔離，以及只清除目前 session 各寫一個測試。使用 `Asia/Taipei` 與 `2026-08-12T16:30:00.000Z` 驗證日期是 `2026-08-13`。

    test('replaces stale previous-local-date session', () => {
      save([{ student: 'jiejie', subject: 'chinese', localReviewDate: '2026-08-12', startedAt: '2026-08-12T10:00:00.000Z' }]);
      const session = getOrCreateReviewSession({ student: 'jiejie', subject: 'chinese', now: new Date('2026-08-12T16:30:00.000Z'), timeZone: 'Asia/Taipei' });
      assert.equal(session.localReviewDate, '2026-08-13');
      assert.equal(session.startedAt, '2026-08-12T16:30:00.000Z');
      assert.equal(readReviewSessions().filter((item) => item.student === 'jiejie' && item.subject === 'chinese').length, 1);
    });

- [ ] **Step 2: Run failing test**

Run: `node --test lib/review-sessions.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement minimal helper**

Validate accepted student, non-empty subject, strict `YYYY-MM-DD`, finite ISO `startedAt`; safely parse an array under browser guard. Calculate `today = getLocalDateKey(now, timeZone)`. Return an exact triple match; otherwise filter all same-student/same-subject stale sessions, append today’s `{ ..., startedAt: now.toISOString() }`, and preserve unrelated records. Write failures return the new in-memory session. `endReviewSession` filters exactly one student/subject pair.

- [ ] **Step 4: Run helper tests**

Run: `node --test lib/review-sessions.test.mjs`

Expected: PASS for creation, refresh, stale reset, isolation, malformed fallback, and scoped deletion.

- [ ] **Step 5: Commit helper slice**

Run: `git add lib/review-sessions.ts lib/review-sessions.test.mjs`

Run: `git commit -m "feat: add review session storage"`

### Task 2: Pure Timer Boundary Helper

**Files:** Create `lib/review-session-time.ts`; test `lib/review-session-time.test.mjs`.

**Produces:** Task 3 的 elapsed minutes 和 `null | 'ten-minutes' | 'fifteen-minutes'`。

- [ ] **Step 1: Write failing time tests**

    test('uses exact 10 and 15 minute boundaries', () => {
      assert.equal(getElapsedReviewMinutes('2026-08-13T00:00:00.000Z', new Date('2026-08-13T00:09:59.999Z')), 9);
      assert.equal(getReviewTimeNotice(9), null);
      assert.equal(getReviewTimeNotice(10), 'ten-minutes');
      assert.equal(getReviewTimeNotice(14), 'ten-minutes');
      assert.equal(getReviewTimeNotice(15), 'fifteen-minutes');
    });

另測 invalid 或 future `startedAt` 回傳 `0` 且無提醒。

- [ ] **Step 2: Run failing test**

Run: `node --test lib/review-session-time.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement pure functions**

確認 timestamp 有效後，以 `Math.floor(Math.max(0, now.getTime() - Date.parse(startedAt)) / 60_000)` 計算。小於 10 回 `null`；10–14 回 ten-minute；15 以上回 fifteen-minute。

- [ ] **Step 4: Run timer tests**

Run: `node --test lib/review-session-time.test.mjs`

Expected: PASS for `<10`, `>=10`, `>=15`、invalid、future。

- [ ] **Step 5: Commit timer slice**

Run: `git add lib/review-session-time.ts lib/review-session-time.test.mjs`

Run: `git commit -m "feat: add review time thresholds"`

### Task 3: Minute-aligned Hook and UI Integration

**Files:** Create `components/review/useReviewElapsedMinutes.ts`; modify `components/review/TodayReviewPage.tsx`, `components/question/ChineseQuestionFlow.tsx`.

**Consumes:** Tasks 1–2 interfaces.

**Produces:** review-only UI；非 review Chinese flow 完全維持現況。

- [ ] **Step 1: Establish pure integration contract**

在 Tasks 1–2 測試中明確確認同日 `startedAt` 不變、final completion 只移除 current student/subject、以及 notice enum 三種輸出；不新增 React test dependency。

- [ ] **Step 2: Re-run pure contract tests**

Run: `node --test lib/review-sessions.test.mjs lib/review-session-time.test.mjs`

Expected: PASS before UI wiring.

- [ ] **Step 3: Implement hook**

hook mount、`startedAt` 改變、頁面回到 visible 時重新算 elapsed；以一個 timeout 排到 `60_000 - (Date.now() % 60_000)` 的下一個分鐘邊界，更新後再次排程；分鐘值未改不 set state；cleanup 清 timeout/listener。不得讀 storage 或使用 `setInterval`。

- [ ] **Step 4: Wire components**

`TodayReviewPage` 保持既有 `selectTodayReviewQuestions` effect 原封不動。新增 `ReviewSession | null` state；開始 handler 呼叫 `getOrCreateReviewSession({ student, subject: 'chinese', now: new Date(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })`，存入 state 再開始。只對 review flow 傳入 `reviewStartedAt` 與 `onReviewComplete={() => endReviewSession(student, 'chinese')}`。

`ChineseQuestionFlow` 新增 optional `reviewStartedAt?: string`、`onReviewComplete?: () => void`。有開始時間才使用 hook、顯示 `已複習 N 分鐘` 和一個 inline reminder；10–14 分鐘使用指定 10 分鐘文案，15 分鐘以上使用指定 15 分鐘文案。最後題 `onComplete` 先呼叫 callback，再 `setIsComplete(true)`。Learning Record、QuestionCard callback、非 review caller 均不變。

- [ ] **Step 5: Run focused checks**

Run: `node --test lib/review-sessions.test.mjs lib/review-session-time.test.mjs`

Run: `npx tsc --noEmit`

Run: `npm run lint`

Expected: all PASS.

- [ ] **Step 6: Commit UI slice**

Run: `git add components/review/useReviewElapsedMinutes.ts components/review/TodayReviewPage.tsx components/question/ChineseQuestionFlow.tsx`

Run: `git commit -m "feat: show review time reminders"`

### Task 4: Regression, Browser Verification, and Documentation

**Files:** Verify `lib/spaced-review.test.mjs`, `lib/today-review.test.mjs`, all tests; modify `PROJECT_STATUS.md` and `docs/sprint-log.md` only after observed success.

- [ ] **Step 1: Full Node regression**

Run: `npm test`

Expected: PASS, including Sprint 12 1/3/7 and Sprint 13 group, deterministic variation, no-random, five-group, student/subject isolation tests.

- [ ] **Step 2: Full repository checks**

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run build`

Run: `git diff --check`

Expected: all exit 0.

- [ ] **Step 3: Browser smoke**

Check both `/jiejie/review` and `/meimei/review`: start, refresh, confirm same-date elapsed time continues; check no notice below 10; verify 10/15 copy with controlled time or fixture; complete one review and confirm only its session is deleted. Confirm reminders never lock or redirect.

- [ ] **Step 4: Record observed results only**

Write exact test counts and browser outcome to status/log. If controlled browser time is unavailable, explicitly record that time-boundary browser verification did not run.

- [ ] **Step 5: Commit completion docs**

Run: `git diff --check`

Run: `git add PROJECT_STATUS.md docs/sprint-log.md`

Run: `git commit -m "docs: record Sprint 14 completion"`

Run: `git status --short --branch`

## Plan Self-Review

- Tests cover storage creation, same-day refresh, stale cross-date reset, sisters, subjects, malformed fallback, and scoped completion deletion.
- Timer tests cover all requested thresholds without React timer flakiness.
- Existing Sprint 12 / 13 code remains outside the new session data flow and is explicitly run in full regression.
- The approved cross-date rule overrides the earlier design’s cross-midnight recovery: yesterday’s time is never restored today.
- No placeholders, dependencies, countdown, forced interruption, global state manager, or unscoped deletion are planned.
