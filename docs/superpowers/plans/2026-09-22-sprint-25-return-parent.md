# Sprint 25 返回操作與家長中心 Implementation Plan

**Status:** Completed.

**Result:** Added shared return-home controls with an unfinished-answer confirmation, and changed `/parent` to a single selected student／subject view with isolated review-time settings. No persisted schema, storage key, Learning Record, ReviewSession, scheduling, practice, timer, or Parent Summary metric semantics changed.

**Verification:** Focused flow tests 2/2; focused Sprint 25 Browser smoke 4/4; affected Sprint 20–23 Browser regression 13/13; full Node tests 161/161; full disposable Chromium Browser smoke 28/28; lint, `npx tsc --noEmit --incremental false`, production build, and `git diff --check` passed. Browser contexts use synthetic storage only, with 768×1024 portrait and 1024×768 landscape checks. Final Human Review、Final Verification、implementation commit、push 與 Sprint Close 均已完成。

## Task 1 — 返回與離開確認的 pure tests（RED first）

- 新增 flow navigation test，鎖定姐姐／妹妹首頁 target 與 `shouldConfirmExit` 規則：無作答／已完成不確認，已有未完成作答才確認。
- 先執行 focused test，確認缺少 helper／行為時 RED。
- 完成條件：規則不涉及 Learning Record 寫入或 schema。
- **Status:** Completed. RED was observed before the helper existed; the focused pure tests now pass 2/2.

## Task 2 — 共用 Question Flow 返回操作

- 修改 `components/question/ChineseQuestionFlow.tsx`，新增共用返回連結與最小離開確認；Today Review／Practice 透過既有 `homeHref`、`homeLabel` 接線。
- 新增／更新 tests，確認取消保留當前狀態、確認離開不產生未完成紀錄，既有完成紀錄與 practice no-write 不變。
- Focused verification：flow／persistence tests。
- **Status:** Completed. `ChineseQuestionFlow`, `TodayReviewPage`, and `ChineseReinforcementPracticePage` now use the shared return control; unfinished selected answers prompt before leaving, while completed or untouched states leave directly.

## Task 3 — Parent center student／subject selector（RED first）

- 新增 parent selection test，要求兩位學生、四科切換，且只顯示選定 section；設定讀寫仍以 student+subject 隔離。
- 修改 `components/parent/ParentLearningRecords.tsx`，以 local React state 控制學生與科目選擇，重用現有 summary 與 review-time functions。
- Focused verification：parent summary、review settings、storage isolation tests。
- **Status:** Completed. `/parent` keeps one summary/settings panel visible for the selected student and subject, with settings read/write keyed by the existing student+subject identity.

## Task 4 — Browser smoke 與平板 viewport

- 更新 `tests/browser`：兩位學生四科返回 targets、離開確認取消／確認、已完成與 practice persistence、parent selector／設定保存。
- 使用 disposable Chromium context、synthetic storage，新增 768×1024 直向與 1024×768 橫向版面檢查；不使用真實 profile/localStorage。
- **Status:** Completed. Focused Sprint 25 Browser smoke is 4/4; both tablet viewport checks passed.
- Focused Browser verification 必須無 console error、無水平溢出。

## Task 5 — Regression 與文件同步

- 執行 focused tests、`npm test`、lint、`npx tsc --noEmit --incremental false`、build、full Browser smoke、`git diff --check`。
- 更新 `PROJECT_STATUS.md`、`docs/roadmap.md`、`docs/sprint-log.md` 及本 Plan，記錄 Human 實際平板六項檢查正常、兩項改善、測試結果與待人工確認事項。
- Final Human Approval 前不 commit／push，Sprint 25 不標記 Completed。
- **Status:** Completed. Full verification passed; implementation commit `8f8a7c0` 已推送，結案文件已同步，Sprint 25 已 Completed。

## Post-close next steps

1. 安排新版返回操作與家長中心的實際平板複驗。
2. 依實際回饋進入 Sprint 26 規劃；不得直接開始 Sprint 26 Implementation。
