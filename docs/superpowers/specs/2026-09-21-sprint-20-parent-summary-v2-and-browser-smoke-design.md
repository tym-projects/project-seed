# Sprint 20 Parent Learning Summary v2 and Isolated Browser Smoke Design

## Status and approval boundary

- **Sprint:** Sprint 20
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`
- **Human-approved direction:**
  1. Parent Learning Summary v2: record-derived actionable summary.
  2. Reusable isolated Browser smoke test environment.
- **This document:** Design only. The detailed metric and test-harness choices below are proposed design decisions for Human Review; no production code, tests, dependency, browser runtime, or persistent data is changed by this document.
- **Out of this stage:** Implementation Plan, Playwright installation, Chromium installation, production changes, test changes, commit, and push.

## 1. Problem, goals, and non-goals

### Problem

The existing `/parent` page shows reliable Learning Record counts and a small set of attention items, but it does not yet give a compact, actionable picture of what a parent can review with a child. Sprint 18 and Sprint 19 also left UI paths that are covered primarily by pure automated tests because the repository has no safe disposable browser context with synthetic localStorage.

### Goals

1. Extend the existing `/parent` page with a conservative, read-only summary derived from existing Learning Records.
2. Keep the summary separated by student and subject, using the project’s existing local-day rules.
3. Make metric names explicit so a parent does not mistake attempts for mastery or time spent.
4. Show recent learning groups that merit attention and due groups that were not completed, without changing Today Review selection or its five-group limit.
5. Establish a reusable Playwright + Chromium smoke harness with one-time browser contexts and synthetic storage.
6. Use the harness to close the Sprint 18 and Sprint 19 manual UI verification gaps without touching real user data.

### Non-goals

- No Learning Record or ReviewSession schema change.
- No new analytics, mastery, `recordSource`, practice-history, or other permanent persistence state.
- No historical write-back or data repair.
- No inference that a record is a Sprint 18 confirmation from `questionId` alone.
- No Sprint 19 practice usage count, result, or improvement trend; practice intentionally writes no record.
- No actual learning-time measurement. Existing `startedAt` is an active-session timer input, not historical duration data.
- No AI analysis, ability score, charting platform, new parent settings page, or cross-device storage.
- No change to normal review, retry, 1/3/7 scheduling, Sprint 18 confirmation semantics, or Sprint 17 timer behavior.

## 2. Existing architecture and data contracts

### Repository and UI

- Next.js App Router pages live under `app/`.
- `/parent` renders `components/parent/ParentLearningRecords.tsx`.
- Shared parent data derivation is in `lib/parent-learning-summary.ts`.
- Learning question identity is `reviewGroupId ?? question.id`.
- Today Review selection is in `lib/today-review.ts` and derives state through `lib/spaced-review.ts`.
- Review UI is shared through `components/question/ChineseQuestionFlow.tsx`.
- Sprint 19 practice uses the same question flow with `mode="reinforcement-practice"` and does not persist records.

### Learning Record

The existing browser storage key is `project-seed:learning-records:v1`. A valid record contains:

`id`, `student`, `subject`, `questionId`, `firstAnswer`, `finalAnswer`, `attempts`, `correct`, `completed`, and `createdAt`.

Only valid completed records are used for the summary. The record’s `questionId` is the actual displayed question. It is not a role marker and must not be relabeled as primary or confirmation by guessing.

### ReviewSession and timer

Review sessions use `project-seed:review-sessions:v1` and contain student, subject, local review date, and `startedAt`. They represent an active review session, not historical elapsed time. Summary v2 reads Learning Records only and does not create, clear, or modify ReviewSessions.

### Student and subject isolation

Every derivation receives `student` and `subject`, filters records with both values, and maps only that student’s question bank. A record from the other student or another subject cannot affect counts, attention items, due items, or browser fixtures.

### Local-day rule

All date windows use the existing `getLocalDateKey` and `addLocalDays` behavior from `lib/spaced-review.ts`, with the resolved or explicitly supplied project timezone. “Today” is the current local calendar day. “Recent 7 days” is today plus the six preceding local calendar days. UTC timestamps at local midnight boundaries are tested explicitly; no new timezone algorithm is introduced.

## 3. Parent summary data semantics

All output is a pure read-only derivation. The UI reads records after mount using the existing browser guard and renders the result; it never writes summary state to storage.

### 3.1 Completed learning quantity

The primary quantity is the number of valid completed Learning Records, not distinct learning groups.

- Display label: **完成作答紀錄**.
- Today: records whose `createdAt` maps to today’s local date.
- Recent 7 days: records whose local date is between today minus six days and today, inclusive.
- A same-group primary plus confirmation produces two completed records and is intentionally counted as two completed answer records.
- A secondary line may show **完成 learning groups** as a deduplicated contextual count, but the two values must not be mixed or shown under the same label.
- The page must explain that the quantity counts recorded answer completions, not unique concepts mastered.

This preserves visibility of actual answered questions while preventing a parent from interpreting records as a mastery score.

### 3.2 First-try correct rate

- Numerator: valid completed records with `attempts === 1`.
- Denominator: all valid completed records in the same period.
- `attempts > 1` contributes to the denominator but not the numerator.
- No valid records: display **尚無有效作答紀錄**, not `0%`.
- Label: **首次答對率（作答紀錄）**.
- Supporting text: this is a record-level indicator, not an understanding or ability score.

### 3.3 Retry count

The v2 metric is the count of completed records where `attempts > 1`, not `attempts - 1`.

- Display label: **曾需再次嘗試的作答紀錄**.
- It answers how many completed answer records required more than one attempt.
- It must not be called “重試次數” if that phrase could imply the arithmetic number of extra clicks or submissions.
- Existing `attempts` remains unchanged; no record is expanded or rewritten.

### 3.4 Recent groups that may need support

The actionable list is a bounded, neutral reminder, not a diagnosis.

Eligibility for a learning group:

1. The group is identified by `reviewGroupId ?? question.id`.
2. It has at least one valid completed record for the selected student and subject within the recent seven local days.
3. It has retry-bearing records (`attempts > 1`) on at least **two distinct local calendar dates** in that window.
4. The group is not converted into a permanent label; the list is recomputed from the current seven-day window.

Why distinct dates: two records on one day can be a Sprint 18 primary plus confirmation pair and do not by themselves prove repeated difficulty. Requiring two local dates avoids overstating that evidence while still identifying recurring retry signals.

Aggregation and display:

- Multiple variations in one group count as one learning group.
- Show the group’s configured question/topic label and the number of retry-bearing dates, not a mastery judgment.
- Sort by most recent retry date descending, then retry-bearing date count descending, then stable group ID ascending.
- Display at most three groups to keep the parent page readable.
- If there are no qualifying groups, show **目前沒有跨日期反覆需要再次嘗試的紀錄**.
- If a group no longer has two retry-bearing dates in the rolling window, it disappears automatically.

Suggested neutral copy: **最近 7 天曾在不同日期需要再次嘗試，可以陪孩子換個方式複習。**

### 3.5 Due but not completed

Due status continues to use existing `deriveReviewState` semantics over the student’s group question IDs and existing 1/3/7/retry rules.

For the parent list:

- Derive all question groups, not only the five groups selected for Today Review.
- Include groups whose derived state is due and that have no valid record today for that student, subject, and group.
- Do not impose Today Review’s five-group display cap on the parent’s due count/list; the parent view is an overview, not the review queue.
- A group completed today is not shown as “尚未完成”, even if it would otherwise be due.
- A pending Sprint 18 confirmation is shown in a separate status area as **今日複習尚有理解確認待完成**, never as a normal uncompleted due group.
- Do not infer confirmation from a question ID. Pending confirmation is identified only by the existing `findPendingConfirmation` pure derivation using group membership, today’s primary-only record, historical eligibility, and due state.
- Sort due groups by existing due date, then unstable/retry state, then stable group ID.
- Show at most five itemized due groups with a separate total count when more exist; never imply that the omitted groups are not due.
- If none are due, show **目前沒有尚未完成的到期複習**.

Suggested neutral copy: **這些內容依現有複習規則已到時間；可以依孩子狀況安排複習。**

## 4. Parent UX

The existing `/parent` page remains the only parent route. Each student section remains independent and contains:

1. **今日** card: completed answer records, first-try correct rate, retry-bearing record count.
2. **最近 7 天** card: the same metrics for the rolling local-day window.
3. **可以陪同複習** section: up to three recurring retry-signal groups with neutral wording.
4. **到期但尚未完成** section: total due count and a bounded list, separate from the five-group Today Review queue.
5. Existing latest-learning date, current due-unit summary, record list, and review-time settings remain in place unless a focused design review finds a direct UI collision.

Empty and insufficient-data states:

- No records: explain that the summary will appear after a completed formal review; do not show misleading zero mastery.
- Records but no recent activity: show the actual empty recent-period state and retain the latest recorded date.
- No actionable groups: show the neutral empty message above.
- No due groups: show the neutral empty message above.
- Sprint 19 practice has no summary footprint because it creates no Learning Record; the page must not mention practice usage or results.

The page should remain scannable: no charts, no additional settings panel, no ability score, and no more than the bounded actionable lists described above.

## 5. Browser smoke harness architecture

### 5.1 Tooling choice

The repository currently has Node’s built-in test runner, TypeScript transpile-based pure-data tests, ESLint, and Next production build. It has no Playwright package, browser smoke script, or browser runtime. The optional Playwright peer reference in the Next lockfile is not an installed test harness.

The proposed harness adds:

- `@playwright/test` as a dev dependency.
- Chromium installed through the Playwright-supported browser installation command.
- `playwright.config.ts`.
- `tests/browser/` for smoke specs and synthetic fixtures.
- A separate `npm run test:browser` script.

`npm test` remains the existing Node unit/integration regression command. Browser smoke is intentionally separate so ordinary tests do not require a browser download.

### 5.2 Server lifecycle

The browser script runs against the canonical production build:

1. A precondition or CI job runs `npm run build`.
2. Playwright `webServer` starts `npm run start -- --hostname 127.0.0.1 --port <isolated-port>`.
3. The runner waits for the local URL, executes smoke tests, then terminates the server.
4. No user Chrome or Edge process, profile, cookies, or existing storage directory is used.

The harness must use a deterministic port or Playwright-managed port collision handling and must fail clearly if the server cannot start.

### 5.3 Context and storage isolation

Every test or test group creates a new `browser.newContext()` and closes it in teardown. No persistent context is permitted.

Synthetic fixture policy:

- Fixtures live under `tests/browser/fixtures/` and contain only deterministic fake records.
- Fixture IDs use a `smoke-` prefix and dates fixed in the test timezone.
- The whitelist of injected storage keys is explicit: `project-seed:learning-records:v1`, `project-seed:review-sessions:v1`, and `project-seed:review-settings:v1` only when a test needs them.
- Injection happens before page code reads storage, using the isolated context/page init script or a new-page storage seeding step.
- No fixture reads from the real machine’s localStorage, cookies, environment profile, or user account.
- After the test, the context is closed and the test verifies only the isolated context’s storage state; it never compares against or edits a real profile.

Production code is not modified to support injection. The app continues to use its existing storage keys and browser guards.

### 5.4 Diagnostics and Git safety

- Keep screenshots, traces, videos, and reports under an ignored `test-results/` directory.
- Enable trace or screenshot retention only on failure, and ensure fixtures contain synthetic data only.
- Do not commit generated browser binaries, reports, videos, traces, or local storage state files.
- Add ignore rules in the later implementation only after confirming they do not hide source fixtures or test code.
- Windows local execution uses the same npm script as CI; CI additionally installs the pinned Chromium runtime and should run with a headless context.

### 5.5 Cost and CI policy

The initial harness requires a dependency installation, lockfile update, and Chromium download. It adds local disk/time cost and a CI browser cache concern. Browser smoke should initially remain an explicit independent command and not be silently appended to `npm test`. CI inclusion can follow after the first stable run; no product behavior should depend on the availability of the browser harness.

## 6. Browser smoke scope

### Sprint 18

- Ordinary primary review.
- Synthetic eligible history → primary → confirmation.
- Deterministic alternate question and actual `questionId` records.
- Confirmation refresh/reopen.
- Same-group same-day records advance 1/3/7 only once.
- Confirmation retry schedules the group for the next local day.
- ReviewSession `startedAt` and Sprint 17 timer remain unchanged.
- No console errors.

### Sprint 19

- Separate 姐姐／妹妹 practice entries.
- Synthetic retry candidates, group aggregation, and maximum three groups.
- Hint, explanation, retry, next question, and completion feedback.
- Refresh resets unsaved practice progress.
- No new Learning Record.
- No ReviewSession create, update, or delete.
- No confirmation trigger and no parent-summary change.
- Student and subject isolation.
- No console errors.

### Sprint 20

- Parent page with synthetic empty, single-record, multi-day, and mixed-group fixtures.
- Today and recent-seven-day metrics.
- Same-group multi-record count semantics.
- Recurring retry-support groups and improvement/removal from the rolling window.
- Due-but-not-completed groups beyond the Today Review five-group cap.
- Pending confirmation shown separately or excluded from normal due wording.
- Empty states, student isolation, subject isolation, and no console errors.

## 7. Workstreams and dependencies

### Workstream A — Browser infrastructure and Sprint 18/19 verification

1. Add and install the approved Playwright dependency and Chromium runtime.
2. Add isolated configuration, fixtures, lifecycle, diagnostics, and separate npm script.
3. Run Sprint 18 and Sprint 19 smoke coverage against the current production behavior.
4. Record actual pass/fail and limitations without changing product semantics.

### Workstream B — Parent summary v2

1. Add failing pure summary tests for metric definitions and local-day boundaries.
2. Implement read-only derivation by extending the existing parent summary boundary.
3. Add parent UI cards and bounded actionable lists.
4. Add regression tests for formal review, confirmation, practice no-write policy, timer/session, and isolation.
5. Run the Sprint 20 browser smoke for the parent page.

Dependencies:

- Workstream A can begin independently and should establish the smoke environment before final UI acceptance.
- Workstream B’s pure derivation and tests do not depend on Playwright and may proceed after Design/Plan approval.
- Workstream B browser verification depends on Workstream A’s disposable context and synthetic fixture mechanism.
- A browser harness failure must not cause a change to summary semantics or production persistence.
- Product acceptance and infrastructure acceptance must be reported separately.

## 8. Test-first implementation strategy

Future implementation must begin with failing tests for:

1. Today and seven-local-day boundaries, including local midnight and cross-month behavior.
2. Completed answer-record counts versus deduplicated learning-group counts.
3. Same-group primary plus confirmation counted as two records but one learning group.
4. First-try numerator/denominator and empty data.
5. Retry-bearing record count with `attempts > 1`, without treating it as `attempts - 1`.
6. Recurring support groups requiring retry-bearing records on two distinct local dates.
7. Removal of a support group after it leaves the rolling seven-day window.
8. Student and subject isolation.
9. Due-but-not-completed groups, today completion exclusion, pending confirmation separation, and due groups beyond the five-group Today Review cap.
10. No Learning Record, ReviewSession, summary write, 1/3/7, confirmation, or timer mutation from summary rendering.
11. Sprint 13–19 regression.
12. Browser smoke for all Sprint 18, Sprint 19, and Sprint 20 flows, including console errors and context teardown.

## 9. Regression safeguards

- Preserve `LearningRecord` and `ReviewSession` schemas and storage keys.
- Keep `createParentLearningSummary` pure and student/subject scoped.
- Do not call `saveLearningRecord`, `getOrCreateReviewSession`, or `endReviewSession` from parent summary rendering.
- Reuse `deriveReviewState`, `getLocalDateKey`, `addLocalDays`, group identity, and `findPendingConfirmation` rather than duplicating scheduling rules.
- Do not change `selectTodayReviewItems`’ five-group limit while deriving the parent overview.
- Keep Sprint 19 practice in no-write mode; a practice page refresh remains non-restoring and absent from parent history.
- Verify `startedAt` before and after formal review smoke and ensure parent rendering does not touch review sessions.

## 10. Out of scope

- Any schema migration or new durable storage key.
- Confirmation role tagging or retrospective classification of records.
- Historical practice analytics.
- Time tracking or completed-session history.
- Mastery, understanding, or ability scoring.
- AI recommendations or adaptive difficulty.
- Charts, exports, accounts, backend storage, or cross-device synchronization.
- Changes to question content, 1/3/7 intervals, retry semantics, or Sprint 17 timer behavior.
- Using a real user profile or real localStorage as a fixture.

## 11. Open Human Decisions

The product direction is approved. The following detail decisions are explicitly proposed for Design Review confirmation before implementation planning:

1. Use **完成作答紀錄** rather than distinct groups as the primary quantity, with an optional separate group count.
2. Define recurring support as retry-bearing records on two distinct local dates within the latest seven local days, capped at three displayed groups.
3. Keep Playwright smoke as a separate `npm run test:browser` command and defer mandatory CI inclusion until the first stable local run.
4. Add Playwright/Chromium only after this Design and the later Implementation Plan are approved.
