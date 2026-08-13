# Project Status

## Sprint 13 Completion

- **Current Sprint:** Sprint 13
- **Sprint Status:** Completed
- **Last Implementation Commit:** `73e47fb` `Complete Sprint 13 variation questions v1`
- **Tests:** 58/58 passed
- **Lint / TypeScript / Build / diff check:** passed
- **Browser smoke:** `/jiejie/review` and `/meimei/review` loaded without console errors.
- **Next Step:** 等待 Sprint 14 規劃


> **Single Source of Truth:** 此文件是目前專案進度、驗證結果與下一步的唯一真相來源。判斷最新狀態時，仍須先以正式 repository 的實際 Git 狀態核對；不得只依聊天紀錄或記憶判斷。

## Current Baseline

- **Repository:** `C:\Users\yenmi\Documents\2026AST-dev`
- **Current Sprint:** Sprint 12
- **Sprint Status:** Completed
- **Branch:** `main`
- **Last Implementation Commit:** `cd6a5f8` — `Complete Sprint 12 spaced review v1`
- **Push Status:** 已同步 / ahead 0 / behind 0
- **Tests:** 45/45 passed
- **Lint:** passed
- **Build:** passed
- **TypeScript:** passed
- **Browser / E2E Verification:** 姐姐與妹妹今日複習頁均可正常載入；既有今日完成資料會顯示無題狀態，未因 Review State 邏輯 crash。1/3/7 跨日期規則以純資料測試驗證，未修改系統時間。
- **Git Status:** clean after commit and push verification
- **Next Step:** 等待 Sprint 13 規劃。

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
