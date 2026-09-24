# Project Status

## Sprint 29 — First-practice random order

- **Current Sprint:** Sprint 29
- **Sprint Status:** Awaiting Human Tablet Re-test; not Completed.
- **Scope:** Added one-time Fisher–Yates random ordering only when `ChineseQuestionFlow` initializes a first-practice flow. All original questions, including Chinese variations, remain present once per flow; the order is held in React state for the duration of that flow.
- **Protected flows:** Today Review continues to use `selectTodayReviewItems` with its existing 1/3/7, topic spread, deterministic variation, and five-group limit. Reinforcement practice continues to use `selectReinforcementPracticeItems` with its existing retry selection, three-group limit, and no-write behavior.
- **Data protection:** No Learning Record／ReviewSession schema, storage key, question content, metadata, or learning rule changed. Cross-session avoidance and unfinished-progress resumption were not implemented.
- **Failure diagnosis:** The tablet failure was reproduced in an isolated Browser diagnostic as React minified error `#418` on all eight first-practice routes. Shuffle ran in the `useState` initializer during both SSR and client hydration, producing different markup. This caused the page-load failure; it was not a question-bank or persisted-data failure.
- **Fix:** `ChineseQuestionFlow` now initializes with an SSR/client-stable copied list and performs one client-side shuffle in `useEffect`, guarded by `useRef`. Today Review and reinforcement remain unchanged; no schema, storage key, or learning-semantic change was made.
- **Verification:** Focused unit 8/8; Sprint 29 Browser 3/3 including hydration diagnostic; Node 170/170; full Browser 35/35 using disposable Chromium and synthetic storage; lint, TypeScript `--incremental false`, build, and `git diff --check` passed. Existing 768×1024 portrait and 1024×768 landscape checks passed.
- **Planning documents:** `docs/superpowers/specs/2026-09-24-sprint-29-first-practice-random-order-design.md`, `docs/superpowers/plans/2026-09-24-sprint-29-first-practice-random-order.md`
- **Next step:** Restart the rebuilt Sprint 29 LAN server and await Human tablet re-test; do not commit or push in this phase.

## Sprint 28 — First mathematics question expansion

- **Current Sprint:** Sprint 28
- **Sprint Status:** Completed.
- **Scope:** Added the seven Human-approved original mathematics questions: 姐姐南一六上第 1、2、4 單元 3 題 and 妹妹南一三上第 1–4 單元 4 題. 姐姐第 3 單元小數除法估算題 remains excluded pending textbook confirmation. Actual production inventory is 56 questions and 51 learning units.
- **Evidence boundary:** Public curriculum references were used only as supporting evidence. Codex cannot directly access the original textbook screenshots from the prior chat, so lesson-level details and assessment alignment remain marked pending image review. 姐姐國語 and 妹妹自然 ranges remain unconfirmed.
- **Data protection:** Added only the seven approved mathematics questions. Existing question content, persisted schemas, storage keys, learning records, review rules, and real user data were not changed. All additions are singleton learning units; no variation or review-group migration was made.
- **Verification:** Focused 5/5; Node 167/167; Browser smoke 32/32 passed with disposable Chromium and synthetic storage; lint, TypeScript `--incremental false`, build, and `git diff --check` passed. Build required clearing only confirmed `.next` artifacts; Browser smoke required clearing only the confirmed Playwright `.last-run.json` artifact. Human tablet acceptance passed 6/6.
- **Planning documents:** `docs/superpowers/specs/2026-09-23-sprint-28-candidate-questions.md`, `docs/superpowers/specs/2026-09-24-sprint-28-mathematics-design.md`, `docs/superpowers/plans/2026-09-24-sprint-28-mathematics.md`
- **Implementation commit:** `742cfc7` Complete Sprint 28 first mathematics question expansion.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Next step:** 規劃題目隨機順序的最小安全方案；不得在本 Sprint 收尾中實作。

## Sprint 27 — Website home navigation

- **Current Sprint:** Sprint 27
- **Sprint Status:** Completed.
- **Scope:** Added a shared high-contrast 「返回網站首頁」 link to `/jiejie`、`/meimei`、and `/parent`; all links target the existing site home route `/`.
- **Navigation protection:** Sprint 26 student-home links remain separate and unchanged. The site home still reaches both student modes and parent mode. No Learning Record／ReviewSession schema, storage key, question bank, selection, review, practice, timer, or Parent Summary semantics changed.
- **Verification:** Sprint 27 focused Browser 3/3 passed with disposable contexts and synthetic storage; full Node 165/165 and Browser 32/32 passed; lint, `npx tsc --noEmit --incremental false`, production build, and `git diff --check` passed. Tablet viewport checks passed at 768×1024 and 1024×768.
- **Human tablet verification:** Human completed the five approved actual tablet checks successfully.
- **Implementation commit:** `9cf33de` Complete Sprint 27 site home navigation.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`; OneDrive backup was not modified.
- **Next step:** Sprint 28 規劃。

## Sprint 26 — LAN Learning Record fallback and return navigation

- **Current Sprint:** Sprint 26
- **Sprint Status:** Completed.
- **Root cause:** On an HTTP LAN address, some browsers do not expose `crypto.randomUUID`; the existing Learning Record creation path then failed before saving the record. ReviewSession has no UUID call; the affected production path was `components/question/ChineseQuestionFlow.tsx`.
- **Implementation:** Added `lib/learning-record-id.ts`: native `crypto.randomUUID` remains preferred; when unavailable, `crypto.getRandomValues` creates a UUID v4 with correct version／variant bits. If neither secure API exists, the flow shows a clear unsaved-record error and does not create an unreliable ID. No schema, storage key, or learning-rule change was made.
- **Navigation:** Unified all two-student／four-subject practice, Today Review, and 再練一次 labels to 「返回姐姐首頁／返回妹妹首頁」 and moved start-page links near the title while retaining the shared leave confirmation.
- **Navigation:** Unified all two-student／four-subject practice, Today Review, and 再練一次 labels to 「返回姐姐首頁／返回妹妹首頁」 and moved start-page links near the title. The shared `FlowExitLink` now uses a high-contrast touch-friendly button and an in-page accessible dialog for unfinished-answer exits; Continue／Escape preserve state, Confirm returns to the current student's home, and no incomplete record is written.
- **Verification:** Sprint 26 focused Node ID tests 4/4 and focused Browser smoke 5/5 passed. Full Node tests passed 165/165; full disposable Chromium Browser smoke passed 29/29; lint, `npx tsc --noEmit --incremental false`, production build, and `git diff --check` passed. Browser used disposable contexts and synthetic storage, including `randomUUID` unavailable／`getRandomValues` available, dialog focus／ARIA／Escape, both tablet viewports, and parent-record readback.
- **Data protection:** Learning Record／ReviewSession schemas and storage keys, student／subject isolation, 1/3/7, retry, confirmation, practice no-write, timer／`startedAt`, and Parent Summary semantics remain unchanged. No question bank or real learning data was modified.
- **Human tablet verification:** Human completed the six post-fix tablet checks successfully. Browser smoke remains a technical supplement, not a substitute for the physical tablet.
- **Implementation commit:** `0a0646e` Complete Sprint 26 LAN record and tablet navigation fixes.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`; OneDrive backup was not modified.
- **Next step:** Sprint 27 網站總首頁導覽改善規劃；backlog includes a clear 「返回網站首頁」 entry for 姐姐學習、妹妹學習及家長模式 pages.

## Sprint 25 — Return controls and parent center integration

- **Current Sprint:** Sprint 25
- **Sprint Status:** Completed.
- **Human trial baseline:** The Human's tablet trial found the four-subject learning flows, question text, options, Hint／Explanation, portrait／landscape use, Parent Summary, and review-time settings normal. This implementation addresses the two approved follow-ups: clear return-home controls and one compact parent center.
- **Implementation:** Added shared return-home controls to first practice, Today Review, and 再練一次 flows for both students and all four subjects. If a selected answer is unfinished or incorrect, leaving asks for confirmation; cancelling preserves the current screen, while completed or untouched states leave without an unnecessary prompt. Completed Learning Records remain unchanged and unfinished answers are not persisted.
- **Parent center:** `/parent` now switches between 姐姐／妹妹 and 國語／數學／自然／社會, showing only the selected student+subject summary and its review-time setting. Existing summary calculations, setting persistence, legacy route, and student／subject boundaries are preserved.
- **Data protection:** Learning Record／ReviewSession persisted schemas and storage keys are unchanged. 1/3/7, retry, confirmation, practice no-write, timer／`startedAt`, and Parent Summary metric semantics are unchanged. No question bank was expanded and no real user storage was used.
- **Verification:** Focused flow tests 2/2 passed; Sprint 25 Browser smoke 4/4 passed with synthetic storage, including return cancellation, completed-record preservation, settings readback, and 768×1024 portrait／1024×768 landscape checks. Affected Sprint 20–23 Browser regression passed 13/13. Full Node tests passed 161/161; full disposable Chromium Browser smoke passed 28/28; lint, `npx tsc --noEmit --incremental false`, production build, and `git diff --check` passed.
- **Known limitation:** Browser tablet viewport checks are technical simulations; the Human's actual tablet trial was normal.新版返回與家長中心仍待安排實際平板複驗。
- **Implementation commit:** `8f8a7c0` Complete Sprint 25 tablet usability improvements.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Close record:** Final Verification、純文件結案同步、main／origin 同步與 working-tree clean 已完成。
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`; OneDrive backup was not modified.
- **Next step:** 安排新版返回與家長中心的實際平板複驗，再進入 Sprint 26 規劃。

## Sprint 24 — Four-subject home navigation

- **Current Sprint:** Sprint 24
- **Sprint Status:** Completed.
- **Scope:** Fixed the P1 home-navigation gap. 姐姐 and 妹妹 now each have four clearly grouped subjects—國語、數學、自然、社會—with explicit 練習、今日複習、再練一次 links: 12 links per student, 24 total. No question bank expansion was made.
- **Implementation:** Added one shared typed subject-navigation configuration and wired both student home pages to existing student- and subject-specific routes. Existing Question Flow, review, practice, and subject-specific routes were reused.
- **Data protection:** Learning Record／ReviewSession persisted schemas and storage keys are unchanged. Student／subject isolation, 1/3/7, retry, confirmation, practice no-write, timer／`startedAt`, and Parent Summary semantics were not changed.
- **Verification:** Sprint 24 focused navigation tests 2/2 passed; npm tests 159/159 passed; lint, `npx tsc --noEmit --incremental false`, production build, `git diff --check`, and full disposable Chromium Browser smoke 24/24 passed. The mobile viewport smoke passed basic visibility, clickability, and no-horizontal-overflow checks using synthetic storage.
- **Known limitation:** The mobile check is a basic viewport smoke only; real-device testing and 姐姐、妹妹 child usability trials remain pending. The first final Build attempt hit the known `.next\\trace` EPERM; only the confirmed Next build cache was cleared, then Build passed. Browser smoke likewise required removing only the confirmed Playwright `.last-run.json` artifact before passing.
- **Implementation commit:** `05284fa` Complete Sprint 24 four-subject home navigation.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`; OneDrive backup was not modified.
- **Next step:** Sprint 25 規劃，以真實使用回饋及已知限制為依據。

## Sprint 23 — Natural and Social Implementation

- **Current Sprint:** Sprint 23
- **Sprint Status:** Completed.
- **Scope:** Added the Human-approved 16-question foundation: 姐姐康軒六上自然／社會第 1–2 單元各 4 題、妹妹南一三上自然與康軒三上社會第 1–2 單元各 4 題. Each question is an independent learning unit; no `reviewGroupId` or variation was added.
- **Implementation:** Added `natural_science` and `social_studies`, four student／subject banks, first-practice routes, Today Review, 1/3/7, retry, reinforcement no-write practice, review settings, Learning Record display, and Parent Summary sections by composing the existing shared flows.
- **Data protection:** Learning Record／ReviewSession persisted schemas and storage keys are unchanged. Existing Chinese／Mathematics records remain readable; student and subject isolation, singleton confirmation protection, practice no-write, timer／`startedAt`, and Parent Summary semantics remain protected.
- **Verification:** 159/159 Node tests passed; lint passed; `npx tsc --noEmit --incremental false` passed; production build passed; full disposable Chromium Browser smoke passed 21/21; `git diff --check` passed. Browser tests used synthetic whitelisted storage only and no real user profile or localStorage.
- **Known limitation:** The 16 questions are original candidates based on the Human-provided unit scope; they are not claimed to be official textbook questions or a complete textbook audit. Only units 1–2 are included; later expansion remains deferred.
- **Implementation commit:** `1264d1b` Complete Sprint 23 natural and social studies foundation.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`; OneDrive backup was not modified.
- **Next step:** Sprint 24 規劃。

## Sprint 22 — Mathematics Implementation

- **Current Sprint:** Sprint 22 (completed historical record)
- **Sprint Status:** Completed.
- **Scope:** Added the 12 Human-approved original Mathematics questions: 姐姐 and 妹妹 each have 南一版指定年級上學期第 1–6 單元、6 learning units、6 questions. Each `questionId` is its own learning unit; no `reviewGroupId` or variation was added.
- **Implementation:** Reused QuestionCard／Question Flow, hint／explanation／retry, Learning Record, Today Review, 1/3/7, practice no-write, ReviewSession, timer, review settings, and Parent Summary. Added Mathematics first-practice, review, and reinforcement routes; parameterized only the existing Chinese hard-coded subject points.
- **Data protection:** Learning Record／ReviewSession persisted schemas and storage keys are unchanged. Student and subject isolation, singleton confirmation eligibility, practice no-write, timer／`startedAt`, and Parent Summary indicator semantics remain protected by tests.
- **Verification:** 147/147 Node tests passed; lint passed; `npx tsc --noEmit --incremental false` passed; production build passed; full disposable Chromium browser smoke passed 16/16; `git diff --check` passed. Browser tests used synthetic whitelisted storage only and no real user profile or localStorage.
- **Known limitation:** Question content is original practice content based on the Human-approved scope; it is not claimed to be an official Nan-I textbook question or textbook audit. The 12-question initial bank is intentionally small.
- **Implementation Commit:** `28af403` Complete Sprint 22 mathematics foundation.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Canonical repository:** `C:\Users\admin\Documents\2026AST-dev`.
- **Next step:** Sprint 23 規劃。

## Sprint 21 — Question Bank Quality and Understanding Feedback v2

- **Current Sprint:** Sprint 21
- **Sprint Status:** Completed.
- **Repository:** `C:\Users\admin\Documents\2026AST-dev` (canonical development repository). The OneDrive copy remains migration safety backup only.
- **Implementation:** Updated only the approved 妹妹 questions `meimei-chinese-1`, `-4`, `-2`, and `-5` with the approved Hint／Explanation copy, including the corrected `meimei-chinese-5` Explanation. Added only the approved `meimei-chinese-action-word-identification-3` V1A「寫」variation to the existing action-word review group. No highxing variation, V1「收進」, schema, scheduling, confirmation, practice, parent-summary, or timer semantics changed.
- **Tests:** 139/139 Node tests passed, including exact content, question-bank validation, deterministic variation/confirmation, 1/3/7, practice, Learning Record, Parent Summary, and isolation regressions.
- **Lint / TypeScript / Build / diff check:** passed. TypeScript was verified with `npx tsc --noEmit --incremental false` because the canonical workspace denied updating the ignored incremental cache for the exact command.
- **Browser smoke:** 10/10 passed in disposable Chromium contexts with synthetic whitelisted storage, including the approved V1A confirmation rendering and existing Sprint 18／19／20 protections. No real user profile or localStorage was touched; only the expected `NO_COLOR`/`FORCE_COLOR` Node warnings appeared.
- **Implementation Commit:** `9630477` Complete Sprint 21 question bank quality and feedback v2.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- **Next Step:** Sprint 22 數學規劃；國語擴充暫停，社會與自然保留為後續方向。

## Sprint 20 — Parent Learning Summary v2 and Isolated Browser Smoke

- **Current Sprint:** Sprint 20
- **Sprint Status:** Completed.
- **Repository:** `C:\Users\admin\Documents\2026AST-dev` (canonical development repository). The OneDrive copy remains migration safety backup only.
- **Implementation:** Added a disposable Playwright + Chromium smoke harness with synthetic, whitelisted storage fixtures. Added read-only parent summary v2 for completed answer records, distinct learning-group counts, first-try rate, retry-bearing records, recurring cross-date retry signals, all-group due overview, and separate pending-confirmation status. Learning Record／ReviewSession schemas, 1/3/7, retry, Sprint 18 confirmation, Sprint 17 timer／`startedAt`, and Sprint 19 no-write practice semantics remain unchanged.
- **Tests:** 136/136 Node tests passed. Browser smoke: 9/9 passed (bootstrap 2, Sprint 18 3, Sprint 19 2, Sprint 20 parent summary 2).
- **Lint / TypeScript / Build / diff check:** passed after the final implementation changes.
- **Browser smoke:** Executed only in disposable headless Chromium contexts with synthetic Learning Records and explicit storage-key whitelist. Sprint 18 primary → confirmation, refresh/reopen, deterministic variation, actual question IDs, timer/session preservation; Sprint 19 practice flow/no-write/isolation; and Sprint 20 parent summary UI/empty state/student isolation all passed. No real user profile or localStorage was touched.
- **Dependency security:** Updated `next` and `eslint-config-next` to `16.3.5`, `@eslint/eslintrc` to `3.3.7`, `typescript-eslint` to `8.70.0`, `nanoid` to `3.3.18`, and `brace-expansion` to `1.1.18`. `npm audit` now reports 0 vulnerabilities (0 critical/high/moderate/low). Browser artifacts remain local ignored output; `npm run test:browser` remains separate from `npm test` and CI enforcement.
- **Implementation Commit:** `5382aed` Complete Sprint 20 parent summary v2 and isolated browser smoke.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- **Next Step:** 等待 Sprint 21 規劃。

## Sprint 19 — Wrong Question Practice v1 Completed

- **Current Sprint:** Sprint 19
- **Sprint Status:** Completed.
- **Repository:** `C:\Users\admin\Documents\2026AST-dev` (canonical development repository). The OneDrive copy remains migration safety backup only.
- **Implementation:** Added deterministic, student／subject-isolated reinforcement candidate selection from the prior seven local calendar days, capped at three learning units and excluding today’s records, due groups, and Sprint 18 pending confirmation groups. Added independent 姐姐／妹妹「再練一次」entries and routes. Practice reuses the existing QuestionCard flow in explicit no-write mode and does not create Learning Records, ReviewSessions, permanent state, or timer effects.
- **Tests:** 131/131 Node tests passed, including candidate boundaries, deterministic grouping, timestamp tie-break determinism, formal review isolation, no-persistence policy, primary-only flow, student／subject isolation, and Sprint 13–18 regression coverage.
- **Lint / TypeScript / Build / diff check:** passed. Initial sandboxed TypeScript/build attempts could not write ignored incremental/build files; the exact commands passed with canonical repository permission. `git diff --check` passed with expected LF/CRLF normalization warnings only.
- **Browser smoke:** Not manually executed. Available browser tooling could not create a disposable isolated localStorage profile/context, and existing user localStorage was not touched. Automated tests cover candidate selection, refresh reset semantics, primary-only flow, no Learning Record write policy, schedule/summary invariance, and student／subject isolation.
- **Implementation Commit:** `6b0b637` Complete Sprint 19 wrong question practice v1
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- **Next Step:** 等待 Sprint 20 規劃。

## Sprint 18 — Understanding Confirmation v1 Implementation

- **Current Sprint:** Sprint 18
- **Sprint Status:** Completed.
- **Repository:** `C:\Users\admin\Documents\2026AST-dev` (canonical development repository). The OneDrive copy remains migration safety backup only.
- **Implementation:** Added due-review-only deterministic alternate-variation confirmation. Eligibility requires prior history with one distinct variation, at least two group variations, due state, and no record today. Pending confirmation is reconstructed from today’s primary-only record; primary plus confirmation is same-day excluded. Learning Record and ReviewSession schemas remain unchanged.
- **Tests:** 115/115 Node tests passed, including 57 focused Sprint 18 confirmation/flow/selection/scheduling tests.
- **Lint / TypeScript / Build / diff check:** passed. `git diff --check` emitted only expected LF/CRLF normalization warnings.
- **Browser smoke:**姐姐 primary review answer flow, 妹妹 review, sister isolation, refresh/reopen of active review session, and Sprint 17 elapsed-time display (`已複習 0 分鐘`) verified. Primary → confirmation with seeded historical records and confirmation refresh were not manually run because safe browser tooling could not seed isolated localStorage without changing test data; automated tests cover deterministic pending reconstruction, flow transitions, record IDs, progression, retry, and timer/session preservation. No browser console error was observed in the exercised flows.
- **Implementation Commit:** `5a672cb` Complete Sprint 18 understanding confirmation v1
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- **Next Step:** 等待 Sprint 19 規劃。

## Sprint 17 Completion

- **Current Sprint:** Sprint 17
- **Sprint Status:** Completed
- **Repository:** `C:\Users\admin\Documents\2026AST-dev` (canonical development repository). The OneDrive copy is retained only as a migration safety backup.
- **Implementation:** Parent Review Time Setting v1 adds independent 10／15-minute Chinese review targets for 姐姐／妹妹 in `project-seed:review-settings:v1`; Learning Records and review sessions remain unchanged.
- **Tests:** 95/95 Node tests passed.
- **Lint / TypeScript / Build / diff check:** passed.
- **Browser smoke:** Isolated in-app storage verified both parent setting groups, sister isolation, refresh persistence, both review flows, and no console errors. Controlled 10／15-minute elapsed-time UI was not manually waited for; automated timer and session tests cover those boundaries.
- **Last Implementation Commit:** `ec1e018` Complete Sprint 17 parent review time setting
- **Push Status:** Sprint 17 implementation and close documentation commits are pushed to `origin/main`; `main` is synchronized with `origin/main`.
- **Next Step:** 等待 Sprint 18 規劃。

## Sprint 16 Completion

- **Current Sprint:** Sprint 16
- **Sprint Status:** Completed
- **Last Implementation Commit:** `058a6aa` Complete Sprint 16 question bank expansion
- **Tests:** 87/87 passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** 姐姐國語頁、妹妹國語頁、`/jiejie/review` 與 `/meimei/review` 均正常，無 console error。為保護既有 localStorage，本次 Browser smoke 未實際作答；因此新題逐題 UI 與錯答後 hint 的 browser interaction 未手動驗證，相關行為已有 automated tests 覆蓋。
- **Next Step:** 等待 Sprint 17 規劃。

## Sprint 15 Completion

- **Current Sprint:** Sprint 15
- **Sprint Status:** Completed
- **Last Implementation Commit:** Sprint 15 implementation commit
- **Tests:** 71/71 Node tests passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** pending safe read-only observation; automated pure-data coverage is the primary evidence.
- **Next Step:** 等待 Sprint 16 規劃

## Sprint 14 Completion

- **Current Sprint:** Sprint 14
- **Sprint Status:** Completed
- **Last Implementation Commit:** pending Sprint 14 commit
- **Tests:** 67/67 passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** `/jiejie/review` and `/meimei/review` loaded without console errors. Manual timer/session smoke is blocked because the available browser tooling cannot create an isolated storage context and must not modify the existing browser profile.
- **Next Step:** 等待 Sprint 15 規劃


> **Single Source of Truth:** 此文件是目前專案進度、驗證結果與下一步的唯一真相來源。判斷最新狀態時，仍須先以正式 repository 的實際 Git 狀態核對；不得只依聊天紀錄或記憶判斷。

## Current Baseline

- **Repository:** `C:\Users\admin\Documents\2026AST-dev`
- **Current Sprint:** Sprint 21
- **Sprint Status:** Completed
- **Branch:** `main`
- **Last Implementation Commit:** `9630477` Complete Sprint 21 question bank quality and feedback v2
- **Push Status:** Sprint 21 implementation and close documentation are pushed; local `main` is synchronized with `origin/main`.
- **Tests:** 139/139 passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** 10/10 passed in disposable Chromium contexts with synthetic storage; Sprint 18／19 UI補驗、Sprint 20 Parent Summary smoke and Sprint 21 V1A review flow completed.
- **Git Status:** Working tree clean; no unrelated files included.
- **Next Step:** Sprint 22 數學規劃。

## Completed Sprint History

- **Sprint 12 — Spaced Review v1：** 由既有 Learning Records 純函式推導 Review State，不修改 storage schema、不另存 next review date。第一次無錯完成後隔 1 個本地曆日、第二次到期後無錯隔 3 日、第三次及後續隔 7 日；同日任一完成 record 有 `attempts > 1` 時重設為隔天。今日複習最多 5 題，依到期且較不穩定、其他到期、從未完成排序，不以未到期題補滿。

- **Sprint 11 — Daily Review E2E & Reliability：** Learning Record 讀寫加入 malformed／legacy data、防止無效日期與不合理 attempts、以及 localStorage 寫入失敗的安全防禦；Daily Review 忽略 invalid Learning Record 並完成姐姐／妹妹實際瀏覽器流程驗證。
- **Sprint 10 — 今日複習：** 依 Learning Record 選出最多 5 題國語複習題；當日已完成題目不重複選入，姐姐與妹妹資料隔離。
- **Sprint 9 — 孩子學習紀錄：** `/parent` 顯示姐姐與妹妹各自的 Learning Record 摘要與可讀紀錄。
- **Sprint 8 — 妹妹國語與共用學習流程：** 姐姐與妹妹共用國語答題流程，保留各自題庫、主題與 Learning Record。
- **Sprint 7 — Learning Record：** 姐姐國語答對完成時，將作答資料寫入瀏覽器 localStorage。
- **Sprint 1–6：** 完成網站基礎、姐姐國語學習流程、Question Bank、Question Engine 與共用題目 UI。

## Current Architecture

- UI 與頁面路由：`app/`
- 題目資料與選題邏輯：`lib/questions/`
- 共用答題流程與題目 UI：`components/question/`
- Learning Record：瀏覽器 localStorage（`project-seed:learning-records:v1`）
- 專案文件與 Sprint 紀錄：`docs/`
