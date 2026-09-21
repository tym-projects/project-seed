# Project Status

## Sprint 19 — Wrong Question Practice v1 Implementation

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
- **Current Sprint:** Sprint 19
- **Sprint Status:** Completed
- **Branch:** `main`
- **Last Implementation Commit:** `6b0b637` Complete Sprint 19 wrong question practice v1
- **Push Status:** Sprint 19 implementation and close documentation are pushed; local `main` is synchronized with `origin/main`.
- **Tests:** 131/131 passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** Sprint 19 practice UI not manually verified because safe isolated localStorage setup is unavailable; existing Sprint 18 smoke evidence remains unchanged and Sprint 19 automated coverage is recorded above.
- **Git Status:** Working tree clean; no unrelated files included.
- **Next Step:** 等待 Sprint 20 規劃。

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
