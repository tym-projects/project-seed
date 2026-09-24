# Sprint 29 首次練習隨機排序 Implementation Plan

**Goal:** 只隨機化首次練習的題目順序，保留既有複習與再練一次選題語意。

## Status

Awaiting Human Tablet Re-test; not committed or pushed.

## Task 1 — focused shuffle tests

- 修改／新增：`lib/first-practice-order.test.mjs`。
- 先測：純 helper 的可控 RNG 排列、原始陣列不變、空／單題、多題不漏不重、題目 metadata 隨 object 保持。
- RED：尚無 helper 或尚無排序實作時，module load／expected export 測試失敗。
- 完成條件：測試明確固定合法排列，不要求連續隨機結果不同。

## Task 2 — 最小 production 接線

- 新增：`lib/first-practice-order.ts`。
- 修改：`components/question/ChineseQuestionFlow.tsx`。
- 先以 SSR／client 一致的未排序複製陣列初始化，再由 hydration 後一次性的 `useEffect` shuffle；`useRef` 防止 render、Strict Mode、作答及送出造成重排。
- 不在 `TodayReviewPage` 或 `ChineseReinforcementPracticePage` 接入 shuffle。
- focused verification：Task 1 及既有 flow tests。

## Task 3 — Browser 與 regression

- 修改／新增必要的 `tests/browser` 測試，使用 disposable Chromium 與 synthetic storage。
- 驗證兩位學生四科首次練習、同次順序固定、questionId 保存、variation 保留、返回／離開確認、Today Review、再練一次及 768×1024／1024×768。
- 執行 `npm test`、lint、TypeScript `--incremental false`、build、Browser smoke、`git diff --check`。

- [x] 修正前隔離診斷重現 React hydration error #418。
- [x] 修正後 focused unit 8/8; Sprint 29 Browser 3/3（含 hydration diagnostic）；Node 170/170；完整 Browser 35/35；lint、TypeScript、build、diff-check passed。
- [ ] Human tablet re-test pending; 768×1024／1024×768 自動化 viewport 已通過。

## Task 4 — 文件同步

- 更新 `PROJECT_STATUS.md`、`docs/roadmap.md`、`docs/sprint-log.md` 及本 Design／Plan。
- 狀態為 `Awaiting Human Tablet Re-test`；未取得 Final Approval 前不 commit／push。
