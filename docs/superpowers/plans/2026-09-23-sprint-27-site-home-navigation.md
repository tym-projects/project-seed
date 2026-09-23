# Sprint 27 網站總首頁導覽改善 Implementation Plan

**Status:** Implementation complete / Awaiting Final Human Review.

## Task 1 — 導覽 RED 測試

- 新增 Browser tests，先驗證 `/jiejie`、`/meimei`、`/parent` 都有「返回網站首頁」、href 為 `/`、按鈕可點擊且平板 viewport 無水平溢出。
- RED 原因：三個模式頁目前沒有網站總首頁返回入口。

## Task 2 — 共用總首頁入口

- 新增 `components/navigation/SiteHomeLink.tsx`。
- 接入 `app/jiejie/page.tsx`、`app/meimei/page.tsx`、`app/parent/page.tsx`。
- 保持總首頁既有模式入口及 Sprint 26 學生首頁返回功能不變。
- Focused verification：Sprint 27 Browser 3/3。

## Task 3 — 完整驗證與文件

- 執行 `npm test`、lint、`npx tsc --noEmit --incremental false`、build、`npm run test:browser`、`git diff --check`。
- 同步 PROJECT_STATUS、roadmap、sprint-log。
- 狀態維持 `Implementation complete / Awaiting Final Human Review`，Final Human Approval 前不 commit／push。
