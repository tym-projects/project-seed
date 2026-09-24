# Sprint 31 第一批自然題庫 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 以現有 Question schema 新增兩題姐姐自然 singleton 題目，不改變既有學習資料或複習語意。

**Status:** Completed after Human Final Review and tablet acceptance 6/6.

**Architecture:** 直接延伸 `lib/questions/jiejie-natural-science.ts`，沿用既有 Question Flow、validation、Learning Record 與複習系統。題目內容由 exact-match test 鎖定，沒有 review group migration。

**Tech Stack:** TypeScript 題庫、Node test runner、既有 Playwright disposable Browser harness、Next.js lint/build/typecheck。

**Spec:** `docs/superpowers/specs/2026-09-24-sprint-31-first-natural-batch-design.md`

## Global Constraints

- 只新增 `jiejie-natural-science-7` 與 `jiejie-natural-science-8`。
- 兩題均為 singleton，不設定 `reviewGroupId`，不建立 variation。
- 不修改既有題目、schema、storage keys、Learning Record／ReviewSession 或複習語意。
- 不宣稱已完成原始教材截圖逐頁核對。
- Final Human Approval 前不得 commit、push 或宣告 Completed。

## Tasks

### Task 1：題庫 exact-match RED → GREEN

**Files:**
- Create: `lib/questions/sprint-31-first-natural-batch.test.mjs`
- Modify: `lib/questions/jiejie-natural-science.ts`

- [x] 先寫兩題完整欄位、ID、answer index、唯一選項、非空 Hint／Explanation、singleton 與既有 6 題保留測試。
- [x] 執行 `node --test lib/questions/sprint-31-first-natural-batch.test.mjs`；預期因兩個新 questionId 尚未存在而失敗。
- [x] 只在題庫尾端加入兩題核准內容。
- [x] 重新執行 focused test，確認由 RED 轉 GREEN；focused 3/3。

### Task 2：完整回歸與文件同步

**Files:**
- Modify: `PROJECT_STATUS.md`, `docs/roadmap.md`, `docs/sprint-log.md`
- Verify: `lib/questions/question-bank-validation.test.mjs`, existing Browser tests

- [x] 執行 `npm test`、`npm run lint`、`npx tsc --noEmit --incremental false`、`npm run build`、`npm run test:browser` 與 `git diff --check`。
- [x] 核對兩題顯示、作答、Learning Record questionId、首次練習隨機排序、今日複習、再練一次、返回導覽及既有 768×1024／1024×768 viewport。
- [x] 文件記錄實際題數、learning units、測試結果、教材證據界線與後續妹妹國語／其他科目 backlog。
- [x] 狀態更新為 `Completed`；Human Final Review 與平板驗收已通過。

## 實際結果

- 正式題庫：64 題、59 learning units；本批新增 2 題、2 個 singleton units。
- Focused：3/3；Node：176/176；Browser：36/36。
- Lint、TypeScript `--incremental false`、build、`git diff --check` 通過。
- Build／Browser 曾遇已確認的 `.next\trace` 與 Playwright `.last-run.json` EPERM；僅清理相應建置／測試產物後重新驗證通過。
- Implementation commit：`22fd4dd` `Complete Sprint 31 natural science question expansion`。
- Close document commit：`1e44688`；push status 已同步至 `origin/main`。
