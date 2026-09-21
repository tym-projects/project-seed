# Sprint 19 — 錯題與需加強內容複習 v1 Design

> Status: Design Human Review Gate
>
> 本文件將已核准的產品方向具體化，但其中的細部選題、作答紀錄與 UX 決策仍待本階段 Human Review 通過後，才能進入 implementation plan。

## 1. 已核准產品方向

Sprint 19 的已核准產品方向是「錯題與需加強內容複習 v1」：讓孩子可以針對近期曾答錯或需要多次嘗試的 learning unit，啟動少量、額外的「再練一次」練習。

本 Sprint 的邊界已核准為：沿用既有題庫、每次最多 3 個 learning units、沿用既有題目 UI／提示／解析、保持學生與科目隔離，不新增 AI、雲端、題庫、永久錯題清單、Learning Record schema、ReviewSession schema，也不改變 1/3/7 或 Sprint 18 confirmation 語意。

## 2. Problem / Goals / Non-goals

### Problem

目前 Learning Record 能辨識孩子曾經需要重試，但孩子端只有正常練習與 Today Review，沒有一個受控的入口，可以在不干擾正式排程的情況下，針對近期需要加強的觀念再練一次。

### Goals

- 從既有 Learning Records deterministic 推導最多 3 個需加強 learning units。
- 讓孩子使用與既有流程相同的題目、提示、解析與答題互動。
- 保護正常 due review、Sprint 18 pending confirmation、1/3/7 progression、parent summary 與既有資料隔離。
- 在不新增永久 persistence state 的前提下，提供清楚且有限的單次練習。

### Non-goals

- 不建立永久錯題清單或 mastery score。
- 不把再練一次當作正式 review，不加入 Today Review 的 5 groups 上限。
- 不保存再練一次的作答結果。
- 不新增 AI 解釋、個人化難度、跨裝置同步、家長圖表或新的題庫。

## 3. Existing architecture

- `LearningRecord` 目前包含 `student`、`subject`、實際 `questionId`、`firstAnswer`、`finalAnswer`、`attempts`、`correct`、`completed`、`createdAt`，保存於 `project-seed:learning-records:v1`。
- `attempts > 1` 表示該題在完成前曾重試；正常完成 record 的 `correct` 與 `completed` 為 `true`。
- learning unit 由 `reviewGroupId ?? question.id` 聚合。variation 題共用 group，legacy 題各自形成單題 unit。
- `deriveReviewState` 以學生、科目、group 的 question IDs 與 local date 聚合，同日多筆 variation record 只產生一次 1/3/7 progression；任何同日 retry 使該 review day `hadWrong`。
- `selectTodayReviewItems` 保持最多 5 個 groups，並處理 due review、今日 record、Sprint 18 primary／confirmation 與 pending reconstruction。
- `ChineseQuestionFlow` 與 `QuestionCard` 已提供題目、答錯後重試、hint、explanation、完成與下一題流程。Sprint 18 flow 另有 primary／confirmation phase，但再練一次不使用 confirmation phase。
- `ReviewSession` 與 `startedAt` 僅屬正式 Today Review。再練一次不建立或清除 ReviewSession，也不使用 Sprint 17 timer。
- parent summary 直接消費有效 Learning Records；不寫入再練 record 可避免改變完成次數、retry 統計、due 數量與 attention items。
- `student`、`subject` 與 localStorage key 是既有隔離邊界；本設計只在讀取時套用相同隔離。

## 4. Eligibility / candidate ranking

### 4.1 Candidate source

新增一個純函式選題邊界，例如 `selectReinforcementPracticeItems`，只讀取：

1. 題庫 questions。
2. 現有 Learning Records。
3. student、subject、now、timeZone。

只接受既有 `isCompletedRecord` 語意的有效 records，並先過濾相同 student、subject。無效、未完成、其他學生、其他科目與不存在於目前題庫的 questionId 不參與候選判斷。

### 4.2 Learning unit aggregation

將每題以 `reviewGroupId ?? question.id` 聚合。候選排序與上限都以 group 為單位；同 group 的多個 variation 不會佔用兩個名額，也不會被視為兩個錯題。

### 4.3 Bounded lookback and improvement rule

「近期」定義為今日以前的前 7 個 local calendar days。候選必須在此時間窗內至少有一個 record 的 `attempts > 1`。這個時間窗讓 `attempts > 1` 成為短期加強訊號，而不是永久錯題標籤。

曾答錯後又在正常 review 以 `attempts === 1` 完成的 group，仍可在 7 日窗口內列為低風險加強候選，因為孩子可能已答對但仍值得用不同題目再確認；它不會因此被視為正式 due 或改變排程。窗口過期後自然消失。

若 group 今日已有任何有效完成 record，直接排除。若 group 的 review state 目前 `isDue`，也直接排除，讓孩子先完成正常 Today Review。這包括 retry 後隔日到期的 group，以及尚未完成 Sprint 18 confirmation 的 group。

### 4.4 Deterministic ranking and truncation

每個候選計算：

- lookback 內最近一次 retry local date；
- lookback 內 retry record 數量；
- group 最近完成 local date；
- group id。

排序依序為：最近 retry 日期新者優先、retry 次數多者優先、最近完成日期新者優先、group id 字典序。最後截斷為最多 3 個 groups。完全相同的輸入必須產生完全相同的 group 順序，不使用 random。

每個 group 只選一題。variation 選擇沿用既有 deterministic 選題原則，使用 practice-specific deterministic key，並在有其他 variation 時避開該 group 最近完成的 `questionId`；只有一個 variation 時使用該 legacy 題目。

### 4.5 Empty and legacy behavior

- 沒有候選：顯示「目前沒有需要再練的題目」，不建立任何 record。
- 少於 3 個候選：只顯示實際候選數量。
- 超過 3 個候選：只顯示 deterministic 排序後的前 3 個 groups。
- legacy 單題：可成為一個 learning unit，但不需要 variation 選擇。
- 沒有歷史 record 的題目：不會因為尚未做過而進入再練一次；它仍由一般練習或 Today Review 處理。

## 5. Today Review 與 confirmation 衝突處理

再練一次是獨立的 optional practice，不計入 Today Review 的每日 5 groups 上限；但它主動讓位給正式 review：

| 狀態 | 再練一次行為 |
|---|---|
| group 今日沒有 record、目前不 due | 可以成為候選 |
| group 今日沒有 record、目前 due | 排除，先由 Today Review 處理 |
| group 今日已完成正常 primary | 排除，避免同日觀念重複出題 |
| group 今日已完成 primary + confirmation | 排除，維持 Sprint 18 same-day protection |
| group 今日只有 primary，confirmation pending | 排除，不讀取或補出 confirmation |
| 正常 Today Review 因 5-group cap 尚未選到 due group | 仍排除；不能讓再練一次搶先消耗它 |

再練一次不會呼叫 `selectTodayReviewItems`、不會加入其結果、不會改寫 Today Review 的 5-group limit，也不會設定或清除 `ReviewSession`。它不觸發新的 Sprint 18 confirmation。

## 6. Learning Record / scheduling semantics

### 6.1 Compared options

**A. 沿用現有 Learning Record 寫入**：可留下練習痕跡，但現有 schema 沒有 `recordSource` 或 practice role。任何寫入都可能被 `deriveReviewState` 聚合，推進或重設 1/3/7，改變 Today Review、parent summary 與 Sprint 18 eligibility；不安全。

**B. 再練一次不寫入 Learning Record**：不污染正式學習資料，不改變 schedule、retry、same-day guard、parent summary 或 confirmation。代價是 refresh／離開後無法恢復練習進度，也沒有永久再練完成歷史；這是 v1 選用方案。

**C. 以現有架構偷偷加入其他永久辨識方式**：例如新增 source 欄位、另一個 durable storage key 或把暫存結果混入 records。這仍是新增資料語意，且會擴大 schema／migration／隔離風險，不採用。

### 6.2 Selected v1 decision

再練一次只保存當次 React/UI state，不呼叫 `saveLearningRecord`，不呼叫 `getOrCreateReviewSession`，不呼叫 `endReviewSession`。孩子的每次作答仍由既有 `QuestionCard` 管理 attempts、答錯提示、解析與完成狀態，但 completion callback 只用於畫面流程與當次回饋。

因此：

- 不推進或重設 1/3/7。
- 不改變 retry 與隔日重試。
- 不使再練題變成正式 due review。
- 不建立或完成 Sprint 18 confirmation。
- 不增加 parent summary 的 completed record、retry count 或 due unit。
- 不改變 Learning Record 與 ReviewSession schema。

若產品未來必須查看再練結果，需另開 Human Decision，定義新的 record source／資料模型與 migration；本 Sprint 不預先保留欄位。

## 7. Student UX / state transitions

### Entry

姐姐與妹妹的學習首頁各提供固定的「再練一次」入口，連到各自學生隔離的 practice page。入口本身不在 server render 時讀 localStorage；practice page 載入後再計算候選，避免把兄妹資料混在一起。入口不取代「今日複習」。

### Start state

practice page 顯示「今天準備了 N 個需要再練的觀念」，N 為 1–3。開始後使用既有 `QuestionCard`／`QuestionOptions`／`QuestionResult`，每個 learning unit 一題，標示為「再練一次」，不顯示 Sprint 18 的「換一種問法」confirmation 文案。

### Answer state

- 答錯：沿用既有 hint、解析與再次作答；不自動跳題。
- 答對：顯示既有 encouragement／explanation，按「下一題」進入下一個 unit。
- 不增加第三題、無限 retry chain 或自動交卷。
- 題目順序固定，最多 3 題；完成後顯示簡短鼓勵與「回到學習首頁」。

### Exit and interruption

頁面提供回到學生首頁的明確入口；孩子可自行離開，不強制完成。中斷不寫入任何資料，不會修改既有 records 或 session。

### Same-day re-entry

因 v1 不保存 practice completion，完成後同一天重新進入可能再次看到相同候選；每次啟動仍最多 3 題，且不影響正式排程。這是刻意接受的 v1 限制。若未來要阻止同日重複，必須另行核准暫存或永久狀態，不在本 Sprint 偷加。

## 8. Refresh / reopen behavior

| 時機 | 行為 |
|---|---|
| 開始前 refresh | 重新從未變動的 Learning Records 推導相同 deterministic 候選與題目 |
| 作答中 refresh | 當次 UI state 消失，回到 practice page 起始狀態；不宣稱可恢復進度 |
| 一題答完後 refresh | 該題 completion 不保存，重新進入時依 records 重新計算 |
| 完成整組後 refresh | 不保存完成標記；日後重新進入仍依同一窗口與正式 records 判定 |
| 同日再次進入 | 可能再次顯示相同最多 3 groups；不影響正式 review 或 summary |
| 跨日重新進入 | lookback 與正式 review state 以新 local date 重新推導，候選可能改變 |

不得修改或清除 `project-seed:learning-records:v1`、`project-seed:review-sessions:v1` 或 Sprint 17 review settings。

## 9. Edge cases

- 同 group 多 variation 的 retry 只計為該 group 的 retry 訊號，候選數仍為一個。
- 今日任何 variation 的正式 record 都使整個 group 排除，避免 primary／confirmation 或不同問法同日重複。
- confirmation pending 的 group 以今日 primary record 識別並排除，不會被再練流程消耗。
- invalid、malformed、未完成或跨學生／科目的 record 不會成為候選。
- 題庫已移除但仍存在的 questionId 不會造成候選，也不會刪除原 record。
- localStorage 讀取失敗時視為無候選；不得因再練頁面清除或覆寫資料。
- practice 選題不使用 random；相同輸入、日期、學生、科目與題庫順序應保持結果一致。
- 正常 due group 即使未被當天 5-group selection 選中，也維持排除，保護後續正式 review。

## 10. Data isolation

所有 selector 與 page-level computation 必須同時以 `student`、`subject` 過濾。姐姐只能看到姐姐的候選，妹妹只能看到妹妹的候選；目前 `subject` 僅為 `chinese`，仍須保留 subject 參數以防未來交叉污染。再練流程不得改變共用 Learning Record storage 中任何資料。

## 11. Testing strategy

### Pure selector tests

- 無候選、1 個候選、超過 3 個候選且正確截斷。
- `attempts > 1` 在 7 日窗口內可成為候選，窗口外自然排除。
- retry 後已由正常 first-try review 改善的 group，在窗口內仍可作為 bounded reinforcement candidate，但不影響 due state。
- 同 group 多 variations 只產生一個候選，並使用 deterministic variation。
- 相同輸入重跑得到相同排序；tie-break 使用 group id。
- 今日已有任一 record 的 group 排除。
- 目前 due 的 group 排除，包含 retry 隔日 due。
- pending confirmation group 排除；primary + confirmation 完成後仍排除。
- legacy 單題可候選且不需 alternate variation。
- 姐姐／妹妹與 subject isolation。

### Flow tests

- practice 題目沿用既有 QuestionCard completion、hint、explanation 與 retry 行為。
- 答對後進入下一個 unit；最多 3 題後完成，不產生第三題或無限 phase。
- 答錯不自動跳題、不自動完成。
- 中斷與 refresh 只重置當次 UI state，不恢復未保存進度。
- practice completion 不呼叫 `saveLearningRecord`，不增加 records。
- practice completion 不建立／清除 ReviewSession。

### Scheduling and regression tests

- 再練前後 `deriveReviewState` 結果完全相同。
- 再練不改變 1/3/7、same-day group progression、retry 或隔日重試。
- 再練不觸發 Sprint 18 primary → confirmation，也不改變 deterministic pending reconstruction。
- parent summary 的 completed count、retry count、due units 與 attention items 不因再練改變。
- Sprint 13–18 全部既有 regression tests 維持通過。

### Browser smoke

使用隔離 browser profile／context 與合成 localStorage，禁止使用既有使用者資料。至少驗證：

1. 姐姐與妹妹各自只能看到自己的候選。
2. 有候選時最多顯示 3 個 units；無候選時顯示空狀態。
3. 再練答錯、hint、解析、重試與完成流程。
4. 再練前後正式 Today Review、confirmation、parent summary 與 timer 不變。
5. refresh／離開行為符合「不恢復未保存進度」限制。
6. browser console 無 error。

目前可用 Codex browser 工具沒有現成隔離 localStorage API；實作階段若無安全隔離 harness，應記錄手動 smoke 限制並以純函式／component tests 補強，不得污染既有 profile。

## 12. Regression safeguards

實作不得修改：

- `LearningRecord` 或 `ReviewSession` schema。
- Today Review 每日最多 5 groups。
- `reviewGroupId ?? question.id` 聚合。
- 1/3/7、same-day progression、retry 與隔日重試。
- Sprint 18 due-only confirmation、deterministic variation、pending reconstruction 與 no-third-question 語意。
- Sprint 16 hint／解析。
- Sprint 17 timer、`startedAt`、10／15-minute setting。
- parent summary、legacy 題目與 student／subject isolation。

Implementation 應將 practice selector、practice flow state 與既有正式 review selector 分開測試；不得把 practice record 混入正式 review records 以「簡化」實作。

## 13. Out of Scope

- Learning Record 新欄位、`recordSource`、永久錯題狀態或新的 durable practice storage。
- 任何 1/3/7 或 Sprint 18 confirmation 語意調整。
- AI 選題、AI 教學、mastery／理解度分數、遺忘曲線。
- 新增題庫、跨科目、跨裝置、雲端同步。
- Parent analytics、圖表、再練歷史與成效報告。
- 同日再練去重的永久記憶；若要此能力需另案決策。
- 新 browser framework dependency；只沿用既有測試能力或安全的隔離 smoke 方法。

## 14. Open Human Decisions

1. **本文件提出的 v1 核心取捨需 Human Review：** 再練一次不寫入 Learning Record，以換取不污染正式排程與家長摘要；代價是 refresh／重新進入不保留當次進度，且同日可能再次出現相同候選。
2. 若 Human 要求保存再練結果或禁止同日重新進入，則現有「不改 schema／不新增永久 state」邊界不足，必須停止並另行核准資料模型或暫存策略。

除上述取捨外，本文件未提出需要改變已核准 Sprint 18 語意的事項。
