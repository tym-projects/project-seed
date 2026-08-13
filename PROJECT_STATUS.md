# Project Status

> **Single Source of Truth:** 此文件是目前專案進度、驗證結果與下一步的唯一真相來源。判斷最新狀態時，仍須先以正式 repository 的實際 Git 狀態核對；不得只依聊天紀錄或記憶判斷。

## Current Baseline

- **Repository:** `C:\Users\yenmi\Documents\2026AST-dev`
- **Current Sprint:** Sprint 10
- **Sprint Status:** Completed
- **Branch:** `main`
- **Last Commit:** `7ebd45f` — `feat: add daily review selection`（Sprint 10 實作 commit）
- **Push Status:** ahead 2 / behind 0，尚未 push（包含本次進度治理文件 commit）
- **Tests:** 26/26 passed
- **Lint:** passed
- **Build:** passed
- **TypeScript:** passed
- **Browser / E2E Verification:** 瀏覽器逐題互動及 localStorage 端對端流程尚未完整驗證
- **Git Status:** clean
- **Next Step:** push `7ebd45f` 到 GitHub，確認同步後再開始 Sprint 11

## Completed Sprint History

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
