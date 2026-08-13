# Project Status

> **Single Source of Truth:** 此文件是目前專案進度、驗證結果與下一步的唯一真相來源。判斷最新狀態時，仍須先以正式 repository 的實際 Git 狀態核對；不得只依聊天紀錄或記憶判斷。

## Current Baseline

- **Repository:** `C:\Users\yenmi\Documents\2026AST-dev`
- **Current Sprint:** Sprint 11
- **Sprint Status:** Completed
- **Branch:** `main`
- **Last Implementation Commit:** `a9be32b` — `Complete Sprint 11 daily review reliability`
- **Push Status:** 已同步 / ahead 0 / behind 0
- **Tests:** 33/33 passed
- **Lint:** passed
- **Build:** passed
- **TypeScript:** passed
- **Browser / E2E Verification:** 姐姐與妹妹一般國語作答、Learning Record 建立、今日複習當日排除、refresh persistence 與資料隔離皆已實測；malformed／legacy localStorage 以純資料測試驗證可安全忽略。
- **Git Status:** clean after commit and push verification
- **Next Step:** 等待 Sprint 12 規劃。

## Completed Sprint History

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
