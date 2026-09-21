# Sprint 20 Parent Learning Summary v2 and Browser Smoke Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可重複使用的隔離 Browser smoke harness，並在不改變既有學習資料與排程語意的前提下，為 `/parent` 加上由 Learning Records 純推導的 actionable summary v2。

**Architecture:** Workstream A 先建立獨立 Playwright + Chromium smoke 基礎設施，以一次性 browser context 與 synthetic storage 驗證 Sprint 18／19。Workstream B 延伸既有 `lib/parent-learning-summary.ts` 與 `/parent` UI，所有資料都由既有 Learning Records、題庫、`deriveReviewState` 與 `findPendingConfirmation` read-only 推導；兩條工作線在 final browser acceptance 前會合，但 B 的純函式測試可獨立進行。

**Tech Stack:** Next.js 16、React 19、TypeScript 5、Node built-in `node:test`、既有 TypeScript transpile test harness、ESLint、Next production server、`@playwright/test`、Chromium。

**Spec:** `docs/superpowers/specs/2026-09-21-sprint-20-parent-summary-v2-and-browser-smoke-design.md`

## Global Constraints

- 正式 repository 僅為 `C:\Users\admin\Documents\2026AST-dev`；不得在 OneDrive backup 開發或執行工具。
- 不修改 `LearningRecord` 或 `ReviewSession` schema、storage key、1/3/7、retry、Sprint 18 confirmation 或 Sprint 17 timer／`startedAt` 語意。
- 家長摘要只讀取並推導既有有效 Learning Records；不得寫回、修正或分類歷史 records。
- Sprint 19 practice 不保存 Learning Record；不得在摘要中宣稱 practice 使用次數、結果或改善趨勢。
- 主要完成量顯示「完成作答紀錄」：計 valid completed records；同 group 同日 primary + confirmation 是 2 筆 records、1 個 distinct learning group。
- 首次答對率為 `attempts === 1` records ÷ valid completed records；無資料顯示「尚無有效作答紀錄」。
- Retry 指標只計 `attempts > 1` 的 completed records，不計 `attempts - 1`。
- 持續需協助 group 必須在最近 7 個 local days 內、至少 2 個不同 local dates 出現 `attempts > 1`；同 group 聚合，最多顯示 3 組，離開時間窗即移除。
- Due overview 使用既有 `deriveReviewState`，排除今日已完成 group；pending confirmation 必須獨立顯示，不得列為一般未完成 due group。
- Parent overview 不受 Today Review 的每日 5 groups 選題上限限制。
- 姐姐／妹妹與 subject 嚴格隔離；不得用另一學生或 subject 的 record 影響摘要或 fixture。
- Browser smoke 僅使用一次性 context、synthetic fixtures、明確 storage key whitelist；不得使用既有 Chrome／Edge profile 或真實 localStorage。
- `npm test` 維持既有 Node unit／integration regression；Browser smoke 使用獨立 `npm run test:browser`，初期不納入 `npm test` 或 CI 強制 gate。
- 本 Plan 階段不得安裝 dependency、Chromium、修改 production code/tests、建立 Browser harness、commit 或 push。

## Review Focus

- 同日兩筆同 group records 不能被誤解成兩個 learning groups；由 Task 6 的 metric tests 固定。
- 同日 primary + confirmation 的 confirmation 身分不能由 `questionId` 猜測；由 Task 7 的 pending tests 固定使用既有純推導。
- 兩筆同日 retry records 不能直接變成「持續需協助」；由 Task 5 的 distinct-local-date test 固定。
- Parent due overview 不能偷偷套用 Today Review 五組上限；由 Task 7 的 over-five-groups test 固定。
- Browser fixture 或測試失敗不能回退到真實 profile；由 Task 2 的 whitelist／context teardown smoke 固定。

## File Map

### Workstream A — Browser smoke

- Create: `playwright.config.ts` — Playwright project、Chromium、webServer、timeout、artifact policy。
- Modify: `package.json` — `@playwright/test` dev dependency and `test:browser` script。
- Modify: `package-lock.json` — generated lockfile update from the approved dependency installation。
- Modify: `.gitignore` — generated browser artifacts, reports, traces, videos, and local storage state only。
- Create: `tests/browser/smoke-bootstrap.spec.ts` — runner, server, console, and context-isolation bootstrap assertions。
- Create: `tests/browser/fixtures/storage.ts` — synthetic records/settings/session fixtures and explicit storage-key whitelist。
- Create: `tests/browser/helpers/context.ts` — disposable context creation, storage injection, and teardown helpers。
- Create: `tests/browser/sprint-18.spec.ts` — real primary/confirmation/timer browser flows。
- Create: `tests/browser/sprint-19.spec.ts` — real practice browser flows and no-write assertions。
- Create: `tests/browser/sprint-20-parent-summary.spec.ts` — parent UI smoke after Workstream B。

### Workstream B — Parent summary v2

- Modify: `lib/parent-learning-summary.ts` — extend pure summary types and derivation; retain existing function boundary and storage-free behavior。
- Modify: `lib/parent-learning-summary.test.mjs` — failing-first metric, grouping, due, pending, date, and isolation tests。
- Modify: `components/parent/ParentLearningRecords.tsx` — render v2 cards/sections without storage writes or review-session calls。
- Modify: `PROJECT_STATUS.md` — record implementation result and actual browser limitation/result only after implementation verification。
- Modify: `docs/roadmap.md` — record Sprint 20 scope/result only after implementation verification。
- Modify: `docs/sprint-log.md` — record Workstream A/B verification and known limitations only after implementation verification。

## Execution Order

1. Workstream A Task 1–3 establishes dependency/config/context safety and runs Sprint 18/19 smoke before product UI changes.
2. Workstream B Task 4–8 can proceed after the Design and Plan are approved; pure tests do not require Playwright.
3. Workstream A Task 9 runs Sprint 20 parent browser smoke after the summary UI is complete.
4. Task 10 runs full regression, final diff checks, docs synchronization, and final evidence. It must not mark Sprint 20 Completed before Final Human Review.

---

## Workstream A — Isolated Browser Smoke

### Task 1: Add Playwright runner and Chromium lifecycle configuration — [x] complete

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces `npm run test:browser` as a separate command.
- Produces a Chromium project using a fresh context per test and a Playwright-managed local server.
- Does not change `npm test`, production code, Learning Record storage, or ReviewSession storage.

- [ ] **Step 1: Write the failing harness smoke test.**

  Create `tests/browser/smoke-bootstrap.spec.ts` with one test that opens the local app, asserts the page title/primary heading, and records console errors. The test must use the planned `test` fixture rather than a persistent browser profile.

- [ ] **Step 2: Run the new browser test to confirm the expected infrastructure failure.**

  Run:

  ```powershell
  npx playwright test tests/browser/smoke-bootstrap.spec.ts
  ```

  Expected before implementation: Playwright package/config or browser runtime is unavailable; this failure confirms the test is blocked by missing infrastructure, not by a product assertion.

- [ ] **Step 3: Add the minimum dependency, script, and config.**

  After Implementation approval, install only `@playwright/test` as a dev dependency and install Chromium with the Playwright-supported runtime command. Configure `playwright.config.ts` with:

  - `testDir: './tests/browser'`.
  - Chromium only for v1.
  - `use.baseURL` pointing to a local `127.0.0.1` server.
  - headless execution by default.
  - no persistent `userDataDir`.
  - trace/screenshot/video retained only on failure.
  - `webServer` running the existing production server command after `npm run build`, with `reuseExistingServer: false` and cleanup on completion.

  Add `"test:browser": "playwright test"` without changing `npm test`. Add only generated `test-results/`, reports, traces, videos, storage-state files, and browser output to `.gitignore`; never ignore `tests/browser` source fixtures.

- [ ] **Step 4: Verify configuration and runtime failure handling.**

  Run:

  ```powershell
  npm run test:browser -- --list
  npx playwright install --dry-run chromium
  ```

  Expected: the test list resolves and the runtime check reports the exact Chromium installation state. If install/runtime setup fails, stop Browser Workstream execution safely, record the failure, do not use an existing profile, and leave Workstream B product semantics unchanged.

- [ ] **Step 5: Run the bootstrap test.**

  Run:

  ```powershell
  npm run build
  npm run test:browser -- tests/browser/smoke-bootstrap.spec.ts
  ```

  Expected: the local production server starts, the test completes in a disposable context, and no real profile or storage is accessed.

**Focused verification:** Task 1 bootstrap spec and Playwright config list.

**Regression verification:** `npm test` remains the existing command and is not required to download Chromium; `npm run lint`, `npx tsc --noEmit`, and `npm run build` must still pass after config/package changes.

**Completion condition:** Playwright can start and stop the local production server with Chromium in a fresh context; generated artifacts are ignored; `npm test` command semantics are unchanged; installation failure has a documented safe stop path.

### Task 2: Build synthetic storage fixtures and disposable context helpers — [x] complete

**Files:**
- Create: `tests/browser/fixtures/storage.ts`
- Create: `tests/browser/helpers/context.ts`
- Modify: `tests/browser/smoke-bootstrap.spec.ts`

**Interfaces:**
- `createSyntheticStorageState(overrides)` returns only whitelisted keys: `project-seed:learning-records:v1`, optional `project-seed:review-sessions:v1`, and optional `project-seed:review-settings:v1`.
- `newIsolatedContext(browser, storageState)` returns a context with synthetic storage injected before application code reads it.
- `closeIsolatedContext(context)` always closes the context in `finally`/fixture teardown.

- [ ] **Step 1: Write failing isolation assertions.**

  Extend the bootstrap browser test to seed a `smoke-jiejie` record, open `/parent`, assert the synthetic data appears only for the intended student, and assert the context storage contains no non-whitelisted keys. Add a second context with no fixture and assert it starts empty.

- [ ] **Step 2: Run the isolation test before helpers exist.**

  Run:

  ```powershell
  npm run test:browser -- tests/browser/smoke-bootstrap.spec.ts
  ```

  Expected: FAIL because the fixture/helper exports and pre-navigation injection do not yet exist.

- [ ] **Step 3: Implement fixture and context helpers.**

  Keep fixtures deterministic, use `smoke-` IDs, fixed `Asia/Taipei` timestamps, and only valid schema-shaped synthetic records. Inject storage before navigation with the isolated context/page init mechanism. Never read the host profile, never use `launchPersistentContext`, and never clear host storage.

- [ ] **Step 4: Verify isolation and teardown.**

  Run the focused bootstrap test twice and assert each run begins from its own fixture state. In `finally`, close the context and assert the test does not write a storage-state file. A failure must preserve synthetic diagnostics only under ignored `test-results/`.

**Focused verification:** bootstrap isolation spec, fixture whitelist, student/subject filtering.

**Regression verification:** no production file imports the fixture helper; `npm test`, lint, TypeScript, and build remain green.

**Completion condition:** Every browser test can create and destroy an isolated context with synthetic storage, no real profile is used, and a context with no fixture cannot see another test’s records.

### Task 3: Sprint 18 and Sprint 19 real browser smoke — [x] complete

**Files:**
- Create: `tests/browser/sprint-18.spec.ts`
- Create: `tests/browser/sprint-19.spec.ts`
- Modify: `tests/browser/fixtures/storage.ts`
- Modify: `tests/browser/helpers/context.ts`

- [ ] **Step 1: Write failing Sprint 18 flow specs.**

  Seed eligible historical records for a variation group, an active review session with known `startedAt`, and review settings. The specs must perform the actual UI actions: navigate to `/jiejie/review`, click the answer, inspect the hint/explanation/result, continue through primary and confirmation, refresh while confirmation is pending, and reopen. Assert the alternate question is deterministic, the saved records contain actual displayed question IDs, and the same group does not advance 1/3/7 twice. Add a retry case and assert next-day scheduling plus unchanged `startedAt`.

- [ ] **Step 2: Run Sprint 18 specs to identify missing harness/product selectors.**

  Run:

  ```powershell
  npm run test:browser -- tests/browser/sprint-18.spec.ts
  ```

  Expected before the spec/harness implementation: FAIL at missing fixture/context or flow assertions. Do not weaken assertions to make a load-only smoke pass.

- [ ] **Step 3: Implement only test fixtures/helpers needed for the approved flow.**

  Use existing accessible text/roles and the current question bank answers. Do not add test-only production branches, storage APIs, or confirmation markers. Capture browser console errors and fail the test when an unexpected error occurs.

- [ ] **Step 4: Write and run Sprint 19 failing flow specs.**

  For both `/jiejie/reinforce` and `/meimei/reinforce`, seed synthetic retry history, perform the entry click, assert at most three learning units, answer with hint/解析/retry/next/completion interactions, refresh mid-flow, and assert the unsaved flow restarts. Before and after the flow, read only the isolated context’s Learning Record and ReviewSession keys and assert byte-equivalent values; assert no confirmation UI is triggered and other student/subject data is unchanged.

  Run:

  ```powershell
  npm run test:browser -- tests/browser/sprint-19.spec.ts
  ```

- [ ] **Step 5: Run focused Sprint 18/19 browser regression.**

  ```powershell
  npm run test:browser -- tests/browser/sprint-18.spec.ts tests/browser/sprint-19.spec.ts
  ```

  Expected: actual interactions pass with zero unexpected console errors, all contexts close, and no artifacts contain real user data.

**Focused verification:** Sprint 18 and Sprint 19 browser specs.

**Regression verification:** Sprint 13–19 Node tests plus formal review/persistence tests; no production semantics may be changed for a browser selector problem.

**Completion condition:** Sprint 18 and Sprint 19 previously missing UI flows are exercised in isolated contexts with actual actions, storage invariance is proven, timer/session behavior is preserved, and the report distinguishes passed flows from unavailable runtime coverage.

---

## Workstream B — Parent Summary v2

### Task 4: Establish valid-record and local-day summary test contracts — [x] complete

**Files:**
- Modify: `lib/parent-learning-summary.test.mjs`
- Modify: `lib/parent-learning-summary.ts` only after the tests are red

**Interfaces:**
- Preserve `createParentLearningSummary({ records, student, subject, questions, now, timeZone })`.
- Extend returned data without changing the existing student/subject arguments.
- Continue to accept `unknown[]` and ignore malformed, invalid, incomplete, wrong-student, and wrong-subject records.

- [ ] **Step 1: Write failing tests for valid data and date boundaries.**

  Add fixtures for valid completed records, malformed records, `correct: false`, `completed: false`, invalid date, invalid attempts, another student, and another subject. Pin today, today-minus-six local days, today-minus-seven local days, local midnight, and a cross-month boundary in `Asia/Taipei`. Assert only today and the inclusive seven-local-day window are counted.

- [ ] **Step 2: Run the focused tests and confirm semantic failures.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs
  ```

  Expected: the new result fields/period boundaries fail against the current summary contract; malformed and isolation regressions must continue to pass.

- [ ] **Step 3: Implement the smallest pure validation/window changes.**

  Reuse existing `isCompletedRecord`, `getLocalDateKey`, and `addLocalDays`. Do not access `window`, localStorage, ReviewSession, or current time implicitly in the pure function. Keep all filtering scoped to the requested student and subject.

- [ ] **Step 4: Run focused and existing summary tests.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs lib/learning-records.test.mjs lib/learning-record-display.test.mjs
  ```

**Completion condition:** The summary contract has explicit valid-record and local-day behavior with no schema or storage change.

### Task 5: Add completed-record, group, first-try, and retry metrics — [x] complete

**Files:**
- Modify: `lib/parent-learning-summary.test.mjs`
- Modify: `lib/parent-learning-summary.ts`

**Interfaces:**
- Extend each period with `completedLearningGroupCount` while retaining `completedRecordCount`, `firstTryCorrectCount`, `firstTryCorrectRate`, and `retryRecordCount`.
- `completedRecordCount` counts valid records; `completedLearningGroupCount` deduplicates by `reviewGroupId ?? question.id`.
- `retryRecordCount` counts records with `attempts > 1`.

- [ ] **Step 1: Write failing metric tests.**

  Add cases for empty data, one first-try record, one retry-bearing record, multiple variations in one group, and same-day primary + confirmation-shaped records. Assert two records but one group, `attempts === 1` numerator, all valid records as denominator, and retry count as records rather than `attempts - 1`.

- [ ] **Step 2: Run focused tests and verify the old contract fails the new assertions.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs
  ```

  Expected: new group-count and metric-label data are absent or incorrect before implementation.

- [ ] **Step 3: Implement pure period metrics.**

  Build the question-to-group map from the supplied question bank. Count only valid completed records in the period. Keep the rate `null` when the denominator is zero. Do not inspect or classify confirmation roles and do not read Sprint 19 practice state.

- [ ] **Step 4: Run focused summary and related scheduling tests.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs lib/spaced-review.test.mjs lib/today-review.test.mjs
  ```

**Completion condition:** Metric definitions match the approved Design and all existing scheduling behavior remains unchanged.

### Task 6: Derive recurring support groups from distinct local dates — [x] complete

**Files:**
- Modify: `lib/parent-learning-summary.test.mjs`
- Modify: `lib/parent-learning-summary.ts`

**Interfaces:**
- Extend `attentionItems` with the existing neutral `repeated-retry` shape or an explicitly equivalent shape containing `unitId`, `label`, `retryRecordCount`, and retry-date evidence.
- Aggregate by `reviewGroupId ?? question.id`.

- [ ] **Step 1: Write failing support-group tests.**

  Cover: one retry record, two retry records on one date, two retry records on two dates, three groups competing for the display cap, deterministic tie ordering, a group leaving the seven-day window, same-day primary + confirmation records, malformed records, and other-student/subject records. Assert only two distinct retry-bearing local dates qualify, maximum three groups, and no permanent label after the window moves.

- [ ] **Step 2: Run the focused test and confirm current behavior is insufficient.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs
  ```

  Expected: the current implementation’s “two retry records” rule incorrectly accepts same-day duplicates or lacks the approved cap/order.

- [ ] **Step 3: Implement bounded, read-only aggregation.**

  For each isolated group, collect local dates for valid records with `attempts > 1` in the latest seven local days. Require at least two distinct dates. Sort by latest retry date descending, retry-date count descending, group ID ascending, then slice to three. Recompute each invocation; do not create a storage label.

- [ ] **Step 4: Run focused summary and Sprint 19 no-write regression.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs lib/reinforcement-practice.test.mjs lib/practice-persistence.test.mjs
  ```

**Completion condition:** The parent list is neutral, bounded, distinct-date based, student/subject isolated, and automatically forgets groups outside the rolling window.

### Task 7: Derive due, pending-confirmation, and beyond-five-group overview data — [x] complete

**Files:**
- Modify: `lib/parent-learning-summary.test.mjs`
- Modify: `lib/parent-learning-summary.ts`

**Interfaces:**
- Extend the summary with `dueItems` and `pendingConfirmationItems` (or exact equivalent) while retaining `dueLearningUnitCount`.
- Due items contain group identity, display label, and existing derived due/unstable information; pending items contain only the group/display information needed for the separate status area, never a guessed confirmation role.

- [ ] **Step 1: Write failing due/pending tests.**

  Add cases for: one due incomplete group, due group completed today, pending confirmation from today’s primary-only record, primary + confirmation both completed today, more than five due groups, due retry group, legacy single question, and student/subject isolation. Assert all due groups are counted independent of Today Review’s five-group selection, today-completed groups are excluded, and pending confirmation is not in normal due items.

- [ ] **Step 2: Run focused tests and verify current summary lacks the new overview.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs
  ```

  Expected: current summary does not expose the complete due list or separate pending confirmation collection.

- [ ] **Step 3: Implement pure derivation using existing scheduling helpers.**

  Reuse `deriveReviewState`, group question IDs, `getLocalDateKey`, and `findPendingConfirmation`. Iterate all question groups rather than `selectTodayReviewItems`, so the parent overview does not inherit the five-group cap. Exclude today-completed groups and pending groups from normal due items. Keep the function read-only and do not create ReviewSessions.

- [ ] **Step 4: Run focused scheduling/confirmation regression.**

  ```powershell
  node --test lib/parent-learning-summary.test.mjs lib/spaced-review.test.mjs lib/today-review.test.mjs lib/understanding-confirmation.test.mjs lib/understanding-confirmation-flow.test.mjs
  ```

**Completion condition:** Due and pending data are derived from existing semantics, all due groups remain visible to the parent overview beyond five, and Sprint 18/1/3/7 behavior is unchanged.

### Task 8: Integrate the summary into the existing parent UI — [x] complete

**Files:**
- Modify: `components/parent/ParentLearningRecords.tsx`
- Modify: `lib/parent-learning-summary.test.mjs` only for pure output contracts, not DOM snapshots
- Modify: `tests/browser/sprint-20-parent-summary.spec.ts` — failing visible-label and empty/partial-data UI assertions before final browser fixture expansion

- [ ] **Step 1: Write failing UI contract browser assertions.**

  Extend `tests/browser/sprint-20-parent-summary.spec.ts` with synthetic empty/partial data and pin the required visible labels and states: `完成作答紀錄`, `首次答對率（作答紀錄）`, `曾需再次嘗試的作答紀錄`, neutral no-data copy, recurring support copy, due-but-not-completed copy, and separate pending-confirmation copy. Assert both student sections receive only their own summary and no practice-history wording appears.

- [ ] **Step 2: Run the focused UI/type check before integration.**

  ```powershell
  npx tsc --noEmit
  ```

  Expected: TypeScript or the browser assertion is red because the new summary fields/labels are not yet available to the existing component.

- [ ] **Step 3: Implement the smallest UI integration.**

  Keep the existing delayed `useEffect` storage read. Pass the already-read records to the pure summary for each student’s own question bank. Render compact Today and Recent 7 Days cards, bounded support groups, due total/items, and separate pending status. Do not call `saveLearningRecord`, review-session helpers, or any setter that writes storage. Use neutral wording and preserve existing review-time settings and record list. Keep the current parent component as the integration boundary; do not introduce a second data source or parent route.

- [ ] **Step 4: Run focused UI verification.**

  ```powershell
  npx tsc --noEmit
  npm run lint
  npm run build
  ```

**Completion condition:** `/parent` presents the approved summary semantics for both students, remains readable for empty/partial data, and performs no storage writes or scheduling changes.

### Task 9: Sprint 20 parent Browser smoke in the isolated harness — [x] complete

**Files:**
- Create: `tests/browser/sprint-20-parent-summary.spec.ts`
- Modify: `tests/browser/fixtures/storage.ts`
- Modify: `tests/browser/helpers/context.ts`

- [ ] **Step 1: Write failing parent UI smoke specs.**

  Add synthetic contexts for empty data, today/7-day records, same-group primary + confirmation-shaped records, two-date retry groups, improved/out-of-window groups, due groups over five, pending confirmation, other student, and other subject. Perform actual `/parent` navigation and assert visible metrics, labels, group aggregation, due/pending separation, empty states, and both student sections. Capture console errors and fail on unexpected errors.

- [ ] **Step 2: Run the specs and confirm failures before final implementation is complete.**

  ```powershell
  npm run test:browser -- tests/browser/sprint-20-parent-summary.spec.ts
  ```

  Expected: FAIL until the parent summary fields and UI are integrated; never downgrade to page-load-only assertions.

- [ ] **Step 3: Complete fixture-only adjustments and run the real flow.**

  Seed only whitelisted synthetic keys before page navigation. Assert no storage key outside the whitelist appears, both student sections remain isolated, and the context closes even when a test fails.

- [ ] **Step 4: Run all browser smoke suites.**

  ```powershell
  npm run test:browser -- tests/browser/sprint-18.spec.ts tests/browser/sprint-19.spec.ts tests/browser/sprint-20-parent-summary.spec.ts
  ```

**Completion condition:** Sprint 20 parent UI and all Sprint 18/19 previously missing flows are exercised with actual browser interactions, with pass counts and any unverified cases recorded separately.

---

## Task 10: Full regression, evidence, and governance handoff — [x] complete

**Files:**
- Modify: `PROJECT_STATUS.md`
- Modify: `docs/roadmap.md`
- Modify: `docs/sprint-log.md`
- Modify: this Plan’s execution checkboxes and final status

- [ ] **Step 1: Run focused Sprint 20 tests.**

  Run the summary tests, existing confirmation/scheduling/practice tests, and all browser suites. Record Node focused count and Browser smoke test/pass count separately.

- [ ] **Step 2: Run full verification.**

  ```powershell
  npm test
  npm run lint
  npx tsc --noEmit
  npm run build
  npm run test:browser
  git diff --check
  ```

  A Browser runtime installation failure must be reported as Browser smoke unavailable; it must never be replaced with a claim of passed manual verification or unsafe real-profile testing.

- [ ] **Step 3: Confirm no side effects and no scope expansion.**

  Review the final diff for no Learning Record/ReviewSession schema change, no new analytics/mastery storage, no practice history, no 1/3/7 or confirmation changes, no timer change, no real storage fixture, and no build/browser artifacts. Confirm `npm test` remains Node regression and `test:browser` is independent.

- [ ] **Step 4: Synchronize governance documents.**

  Record actual implementation state, metric semantics, Node test count, Browser smoke pass/unverified counts, runtime limitations, lint/TypeScript/build/diff-check results, and the next Human Review gate. Do not mark Sprint 20 Completed before Final Human Review.

- [ ] **Step 5: Verify handoff state.**

  Run:

  ```powershell
  git diff --check
  git status --short --branch
  git diff --stat
  ```

  Expected before any later Human-approved commit: only intended Sprint 20 implementation/tests/docs and ignored generated artifacts absent from Git status. No commit, push, merge, rebase, tag, or release is part of this Plan stage.

**Completion condition:** All requested verification evidence is real and separately reported, documents match implementation, Browser smoke limitations are explicit, and the repository is ready for Final Human Review.

## Final Verification Matrix

| Area | Required evidence | Must remain unchanged |
|---|---|---|
| Node regression | `npm test`, focused parent/confirmation/practice tests | Sprint 13–19 behavior |
| Static/build | lint, TypeScript, production build, `git diff --check` | production architecture outside scope |
| Browser infrastructure | Chromium, fresh context, synthetic storage, cleanup | real profiles and user data untouched |
| Sprint 18 | actual primary → confirmation, refresh, retry, IDs, progression, timer | LearningRecord/ReviewSession schemas and `startedAt` |
| Sprint 19 | actual practice actions, refresh reset, no-write and isolation | no practice persistence |
| Sprint 20 | parent metrics, recurring groups, due/pending, empty/isolation UI | no scheduling or persistence changes |
| Governance | status/roadmap/sprint-log/Plan actual results | no premature Completed status |

## Execution Status

- Implementation executed from the approved Design and this Plan in the canonical repository; implementation commit `5382aed` was created and pushed to `origin/main`.
- Playwright 1.63.0 and Chromium were installed for the approved isolated smoke harness; generated browser artifacts remain ignored.
- Workstream A and B tasks completed: browser infrastructure, Sprint 18/19 smoke, parent summary derivation, parent UI, Sprint 20 smoke, regression, and governance synchronization.
- Final evidence: 136/136 Node tests passed; 9/9 Browser smoke tests passed; lint, TypeScript, production build, and `git diff --check` passed.
- Browser tests used only disposable contexts and synthetic whitelisted storage. No real profile or user localStorage was touched.
- Sprint 20 status: Completed after Human approval, implementation commit, push, and close documentation synchronization.
- Dependency Security follow-up: compatible patch upgrades resolved the original audit findings (`next`/`eslint-config-next` 16.3.5, `@eslint/eslintrc` 3.3.7, `typescript-eslint` 8.70.0, `nanoid` 3.3.18, `brace-expansion` 1.1.18). Final audit is 0 vulnerabilities; full regression and 9/9 Browser smoke passed.
- Implementation commit: `5382aed` Complete Sprint 20 parent summary v2 and isolated browser smoke. Push is synchronized. Next Step: 等待 Sprint 21 規劃。
