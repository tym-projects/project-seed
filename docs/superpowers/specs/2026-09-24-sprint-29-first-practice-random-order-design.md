# Sprint 29 首次練習隨機排序 Design

## 目標

僅讓姐姐、妹妹四科的首次練習在流程初始化時產生一次隨機題目順序；同一次練習期間順序固定。

## 範圍與保護

- 適用首次練習；國語 variation 仍各自作為原始題目參與排序，`reviewGroupId` 不變。
- 不套用於 Today Review 或「再練一次」。
- 不修改題目內容、答案、Hint、Explanation、questionId、metadata 或題庫陣列。
- 不新增永久／暫存 storage key，不修改 Learning Record／ReviewSession schema。
- 不實作跨次避重或未完成進度接續；重新整理、離開後重進入可產生新順序。
- 同一次流程每道原始題目最多出現一次，不漏題、不複製。

## 最小設計

新增純 Fisher–Yates shuffle helper，接受可注入 RNG 供測試使用；production 使用適合一般題目排序的瀏覽器亂數來源。首次練習在 `ChineseQuestionFlow` 初始化 flow items 時複製並排序一次，以 React state 固定結果，避免重新 render、選答案或送出答案時重排。

Today Review 維持 `selectTodayReviewItems` 的到期、topic spread、deterministic variation 與最多 5 groups；再練一次維持 `selectReinforcementPracticeItems`、最多 3 groups 及 no-write 語意。

## 驗收失敗診斷與修正

首次平板驗收前的隔離 Browser diagnostic 在八個首次練習路由重現 React minified error `#418`。根因是 shuffle 在 `useState` initializer 執行，SSR 與瀏覽器 hydration 各自取得不同的隨機順序，造成 hydration mismatch，進而出現頁面載入失敗與無法作答。這不是題庫、Learning Record 或 ReviewSession schema 問題。

最小修正為：首次 render 使用未排序且 SSR／client 一致的複製陣列，hydration 後由一次性的 `useEffect` shuffle，並以 `useRef` 防止重新 render 或 Strict Mode 重排。Today Review 與再練一次仍不進入 shuffle。未新增 storage、schema 或學習語意。

## 驗證

focused tests 驗證原始陣列不變、可控 RNG 排列、空／單題／多題、不漏題不重複及 metadata 對應；Browser smoke 驗證首次練習、四科／兩位學生隔離、同次流程固定、Learning Record questionId、返回／離開確認、Today Review／再練一次與平板 viewport。

## 明確不做

- 不保證下一次練習第一題不同。
- 不新增跨次順序記錄。
- 不改變 1/3/7、retry、confirmation、practice、timer 或 Parent Summary。

目前狀態：Awaiting Human Tablet Re-test；桌面自動化通過不等同實際平板驗收。
