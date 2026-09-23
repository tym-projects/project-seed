# Sprint 26 LAN 紀錄儲存與返回導覽 Implementation Plan

**Status:** Implementation complete / Awaiting Final Human Review.

## Task 1 — UUID fallback tests（RED first）

- 先測試 native `randomUUID`、`getRandomValues` UUID v4、不同 ID，以及兩者不可用時的明確錯誤。
- RED 原因：共用 ID module 尚不存在。
- 完成條件：不使用 `Math.random`、時間戳或固定 ID。

## Task 2 — Learning Record ID 與錯誤處理

- 新增 `lib/learning-record-id.ts`，只改 `ChineseQuestionFlow` 的 Learning Record ID 產生路徑。
- 保持既有 schema、storage key、作答／複習／practice 語意；ID 建立失敗時顯示未保存錯誤。
- Focused verification：UUID tests、HTTP LAN 等效 Browser 作答保存。

## Task 3 — 統一返回文字與位置

- 將兩位學生四科三種流程的 label 統一為「返回姐姐首頁／返回妹妹首頁」。
- 將開始頁返回操作移至標題附近；作答頁沿用共用 `FlowExitLink` 與既有離開確認。
- Focused verification：24 個入口的文字、href、可見位置，以及取消／完成紀錄行為。

## Task 4 — 畫面內離開確認與高對比返回按鈕

- 先以 Browser test 驗證未完成作答需要畫面內 `role="dialog"`、取消保留狀態、確認返回、不寫入未完成紀錄、Escape 關閉及焦點移入；RED 原因：既有 `FlowExitLink` 使用原生 `window.confirm`。
- 修改共用 `components/navigation/FlowExitLink.tsx`：加入可觸控高對比返回按鈕、畫面內 dialog、`aria-modal`、初始焦點、Escape 與確認後 router 導航；不新增暫存、schema、storage key 或恢復流程。
- Focused verification：5/5 Browser tests，涵蓋四科／兩位學生、dialog focus／ARIA／Escape、Learning Record 保護、UUID fallback 與平板 viewport。
- 完成條件：取消或 Escape 留在原頁並保留選項，確認返回正確學生首頁，已完成紀錄保留，未完成題目不寫入。

## Task 5 — Regression、文件與 Human Review

- 執行 Sprint 26 focused tests、`npm test`、lint、TypeScript `--incremental false`、build、Browser smoke、`git diff --check`。
- 同步 PROJECT_STATUS、roadmap、sprint-log；記錄實際 LAN／平板複驗仍由 Human 確認。
- Final Human Approval 前不 commit／push，不標記 Sprint 26 Completed。
