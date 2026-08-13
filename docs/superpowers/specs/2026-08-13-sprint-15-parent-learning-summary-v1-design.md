# Sprint 15：家長模式學習摘要 v1 設計

## 目標與範圍

在 `/parent` 讓家長分別快速理解姐姐與妹妹的「今天」及「最近 7 天」學習情況，優先呈現需要留意的地方，而非建立 Learning Analytics dashboard。

本 Sprint 只定義未來實作，不修改產品程式碼、Learning Record schema、今日複習選題、1/3/7 spaced review、variation 選擇或 Sprint 14 session/timer。

每位學生獨立顯示，不排名、不比較；目前唯一 subject 是 `chinese`，但 aggregation API 一律以 `student + subject` 為 key，不能混用資料。

## 已確認的資料能力與限制

`LearningRecord` 已保存 `student`、`subject`、`questionId`、`firstAnswer`、`finalAnswer`、`attempts`、`correct`、`completed`、`createdAt`。QuestionCard 只在答對並完成時寫入一筆 record，因此下列指標可可靠由有效的完成 record 即時計算：完成作答、首次答對、retry、最近學習日，以及以既有 review helper 導出的待複習 unit。

不保存每次錯答的事件；一筆 record 只保留第一答、最終答與總次數。因此 v1 不能計算錯答總次數、每一選項的錯誤型態、未完成嘗試，或更細的答題過程。Sprint 14 active session 在完成時會清除，亦沒有 completed duration history；絕不從 session 推估歷史學習時數。

## 名詞與時間規則

### 有效完成 record

Aggregation 僅使用已經 `readLearningRecords()` 驗證，且 `completed === true && correct === true` 的 record。這與 Sprint 12 `deriveReviewState` 的有效完成語意一致。未知／移除的 `questionId` 仍可用於活動與錯誤摘要，但不會被當作目前題庫可選的待複習題。

### Learning unit

對目前題庫中的題目，unit ID 為 `reviewGroupId ?? question.id`。同一 review group 的 A/B variation 是同一個 unit；所有 group 導向的計數和 attention 一個 unit 只算一次。沒有 `reviewGroupId` 的 legacy 題目自然回退為自己的 `question.id`，維持 Sprint 12 行為。

歷史 record 的 `questionId` 無法在目前 student/subject 題庫解析時，attention 顯示以該 `questionId` 作為 fallback unit ID 與安全標籤；它不加入「目前待複習」分母或數量，因為 Today Review 也不能再選出已移除題目。

### Local calendar

所有日期都呼叫既有 `getLocalDateKey(new Date(record.createdAt), timeZone)`，並由既有 app 設定傳入 `Asia/Taipei`，不得以 UTC 日期字串切片。

- **Today**：local date 等於 `getLocalDateKey(now, timeZone)` 的有效完成 record。
- **Last 7 days**：包含 today 及前六個 local calendar days；範圍為 `[addLocalDays(todayKey, -6), todayKey]`，兩端皆包含。以 local-date key 的字典比較判定，而非 `now - 7 * 24h`，避免 DST 與 calendar-day 語意錯誤。
- 「最近學習日期」：該學生所有有效完成 record 的最大 local-date key；無資料則為 `null` 並顯示正常空狀態。

## 指標定義

每位學生各有 Today 與 Last 7 days 兩份摘要，四個活動指標加上一個目前狀態指標。

| 指標 | 精確公式 | 顯示規則 |
| --- | --- | --- |
| 完成作答次數 | 期間內有效完成 record 的筆數 | 名稱不用「unique 題數」：每筆 record 代表一次完成的作答，重複練習對家長也有意義。 |
| 首次答對 | 期間內 `attempts === 1` 的有效完成 record 筆數；比例為此數／完成作答次數 | QuestionCard 僅在答對時記錄，且一答完成即為第一答答對。分母為 0 時顯示「尚無作答」，不顯示 `0/0` 或百分比。 |
| 有 retry 的作答 | 期間內 `attempts > 1` 的有效完成 record 筆數 | 表示該次完成前至少曾需要再次嘗試；不是錯答總數。 |
| 最近學習日期 | 全部有效完成 record 的最大 local date | 與 Today/7-day 篩選無關，讓家長知道最後活動日。 |
| 目前待複習 unit | 目前 student/subject 題庫每個 unit 各一次呼叫現有 `deriveReviewState`；`isDue === true` 的 unit 數 | 不受 Today/7-day 篩選限制，是 now 當下需要處理的 review 狀態；A/B 不重複。 |

上述「首次答對」資料足夠可靠；不需要額外 schema。`firstAnswer` 的文字內容只供既有記錄列表呈現，摘要不需重新比對目前題庫答案，避免題目日後修訂影響歷史指標。

## 需要留意（deterministic）

每位學生各自產生下列 attention items，順序固定為重複 retry 在前、逾期待複習在後；各類按 unit ID 升冪，故輸出可重現且容易測試。

1. **最近重複需要 retry**：在 Last 7 days 範圍內，同一 learning unit 有至少兩筆 `attempts > 1` 的有效完成 record，產生一項「這 7 天有 N 次需要再次嘗試」。N 是該 unit 的 retry-record 筆數；同日 A/B 仍是不同作答事件，可反映重複練習，但只產生一個 unit item。
2. **已到複習日尚未完成**：對目前題庫每一 unit 使用現有 `deriveReviewState`。`isDue === true` 且該 unit 今日沒有有效完成 record 時，產生一項「已到複習日」。今日完成的 group 不能被列出，與 Today Review 的 group-level same-day guard 一致。

v1 不推斷錯誤原因、不以姐妹互相比較、也不以「單次 retry」貼上需要留意標籤。若沒有 attention item，顯示「目前沒有需要特別留意的項目」。

## 未來程式邊界（設計，非本 Sprint 實作）

新增純資料 helper，建議為 `lib/parent-learning-summary.ts`，其輸入為 records、student、subject、目前 subject 題庫、`now`、`timeZone`，輸出一個完整的 `ParentLearningSummary`。helper 負責：

- 以現有 `getLocalDateKey` / `addLocalDays` 建立期間與篩選；
- 建立 current question ID 到 unit ID 的 map，並以 `reviewGroupId ?? question.id` group；
- 建立活動指標與 deterministic attention items；
- 對每個 current unit 呼叫不改動的 `deriveReviewState`，計算 due state；
- 為未知 record 提供 `questionId` fallback，不丟出例外。

`components/parent/ParentLearningRecords.tsx` 在既有 client mount 後，繼續只呼叫 `readLearningRecords()`；取得 records 後在 `useMemo` 呼叫 summary helper。SSR／初次 hydration 仍顯示載入中，不直接讀 `window` 或 `localStorage`。`readLearningRecords()` 已將不存在、損毀 JSON、非陣列與不合 schema 的項目回退為空陣列／濾除；summary helper 再以空 records 正常產生零活動、null 日期、零待複習與空 attention，不得輸出 NaN 或 0/0。

父頁 UI 建議維持姐姐與妹妹各自區塊，區塊內先顯示「需要留意」，再以 Today / 最近 7 天兩個清楚區段放四項活動數字，最後顯示最近學習日期與目前待複習 unit。保留既有歷史 Learning Record list，不新增圖表、比較、複雜篩選或新的 persistent analytics state。

預計會新增 `lib/parent-learning-summary.ts`、`lib/parent-learning-summary.test.mjs`；未來 UI 實作會修改 `components/parent/ParentLearningRecords.tsx`，視需要新增小型 presentation component。`lib/learning-records.ts`、`lib/spaced-review.ts`、`lib/today-review.ts`、Sprint 14 session/timer、question flow 與 schema 均不修改。

## 測試設計

以 `parent-learning-summary.test.mjs` 為主，直接餵入 records、題庫、固定 now/timezone，避免依賴 browser smoke。至少覆蓋：

- 姐姐／妹妹隔離，以及 subject isolation；
- Today 跨台灣午夜邊界、Last 7 days 包含 today 和前六個 local calendar days（含月／年邊界）；
- 完成作答、首次答對／比例、retry 與最近學習日期公式；
- 同一 unit variation A/B 的 due count 與 attention item 去重；legacy 無 `reviewGroupId` 題目以 question ID 作 unit；
- 目前待複習完全沿用 1/3/7、retry reset、same-day group 行為；
- repeated-retry 門檻剛好兩次、少於兩次、跨不同 unit、固定排序；
- due-but-not-completed 與今日已完成 group 不得同時出現；
- 無資料、未知／移除 question ID、malformed storage 讀取後的空結果；
- 既有 `learning-records`、`spaced-review`、`today-review`、question-bank variation 與 review-session tests 全數持續通過，保護 Sprint 10–14 行為。

未來實作完成時執行既有 Node tests、`npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check`；browser smoke 只驗證 `/parent` 正常 hydration 與 empty/data states，不取代 pure helper tests。

## 延後至 Sprint 16+

- completed review session history；
- 每日／每週實際學習時間與家長時間統計；
- charts、dashboard、export/report、database；
- AI 分析、建議、選題與教材匯入；
- 家長設定複習時間及姐妹成績比較。

## Sprint 10–14 不變性

本功能僅讀取現有 records 與現有題庫，再即時計算展示結果；不寫入任何 analytics storage，也不改變 Learning Record、selection、spaced-review、variation 或 review-session API。所有 due 計算委派既有 `deriveReviewState`，因此 Sprint 12/13 規則維持唯一來源。
