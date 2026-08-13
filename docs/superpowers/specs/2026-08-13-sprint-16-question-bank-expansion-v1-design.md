# Sprint 16 — 題庫擴充 v1 設計

## 目標與邊界

Sprint 16 的目標是把現有五個 Chinese topic 各自從一個獨立 learning unit 擴充到至少三個，以建立日後重新評估 topic-level learning analytics 的較好資料基礎。

本 Sprint 只擴充既有的選擇題題庫與必要的 metadata／品質防護；不做弱點分析 UI、analytics threshold、AI 選題、資料庫、外部題庫、教材匯入、新題型、學習時間統計或大量自動產題。任何正式題幹、選項、正解、hint、解析都必須由人工逐題核准後才可進 production question bank。

## 現況與完成目標

| Student | Topic | 現有 units | Sprint 16 新增 units | 完成後 units |
| --- | --- | ---: | ---: | ---: |
| 姐姐 | 注音辨識 | 1 | 2 | 3 |
| 姐姐 | 部首辨識 | 1 | 2 | 3 |
| 妹妹 | 詞語意思 | 1 | 2 | 3 |
| 妹妹 | 動作詞辨識 | 1 | 2 | 3 |
| 妹妹 | 量詞運用 | 1 | 2 | 3 |
| **Total** | **5 topics** | **5** | **10** | **15** |

一個 learning unit 是一個獨立的知識或能力檢核點。它不能只是把既有題目的字詞、選項順序或語句表面改寫。A/B variation 則是同一 unit 的不同呈現，不能增加上述 unit 數，也不能增加 analytics 的 unit coverage。

## 題目內容規格（非正式題目）

下列是人工出題與審核時使用的能力規格，不是可直接上線的題幹、選項或答案。每一列仍須由人工選定適齡素材、逐一驗證唯一正解，並撰寫不洩漏答案的 hint 與解釋。

| Student / topic | 新 unit A | 新 unit B | 新增 type |
| --- | --- | --- | --- |
| 姐姐／注音辨識 | 不同聲母的辨識 | 韻母或聲調等另一個注音構成要素的辨識 | basic、basic |
| 姐姐／部首辨識 | 不同字例的部首辨識 | 在查字情境選擇應查的部首 | basic、application |
| 妹妹／詞語意思 | 直接理解另一個常用詞語 | 依句子語境判斷常用詞語意思 | basic、application |
| 妹妹／動作詞辨識 | 區分動作詞與名詞 | 區分動作詞與描述狀態／特徵的詞 | application、application |
| 妹妹／量詞運用 | 人物類常用量詞運用 | 動物或物品類常用量詞運用 | application、application |

素材必須符合目前學生年級與日常語言經驗；不得以冷僻字詞、模糊語意、雙關或陷阱製造錯誤。每題須有唯一正解、合理且明確錯誤的 distractors、不可直接揭露正解的 hint，以及能解釋正確理由的 explanation。若人工審核無法確認唯一正解，該題不得進入題庫。

## Option 比較與推薦

### Option A — 每個新增 unit 先建立一題（推薦）

- 產出 10 題、10 個獨立 learning units。
- 最快達成每 topic 三個真正的資料點；人工可將時間集中在能力獨立性、題意與答案品質。
- 既有 Sprint 13 仍可正常運作：沒有 `reviewGroupId` 的新題以 `question.id` 作為單題 learning unit，照既有 1/3/7 review 流程運作。
- 日後若某個 unit 需要 variation，為原題與新 variation 補上同一個 `reviewGroupId` 即可；既有 Learning Records 保留實際 `questionId`，不需 migration。

### Option B — 每個新增 unit 同時建立 A/B variations

- 產出約 20 題，但仍只有 10 個獨立 learning units。
- 一開始就可提高同一 unit 的複習呈現變化，但人工審核量約加倍，且每組都要驗證「同一能力、不同表面呈現」。
- analytics coverage 不會比 Option A 更高；若品質審核時間固定，反而會壓縮新增獨立能力點的品質。

**決定：採 Option A。** Sprint 16 的核心衡量是獨立 unit coverage，不是題目總數。Variation 留給後續依實際複習需要與人工內容審核新增。

## ID 與 reviewGroup 策略

維持既有、已顯示給使用者的連續 ID，不改寫歷史 ID。

- 姐姐新增題目依序使用 `jiejie-chinese-5` 至 `jiejie-chinese-8`。
- 妹妹新增題目依序使用 `meimei-chinese-6` 至 `meimei-chinese-11`。
- 每一個 ID 對應本表一個獨立 unit，且只能屬於自己的 student bank。
- Option A 的新增題目不設 `reviewGroupId`；其 unit ID 是 `question.id`。
- 未來新增 A/B variation 時，為同一 unit 的所有題目設定語意穩定的 group ID：`{student}-chinese-{topic-slug}-{unit-slug}`。例如 group ID 表示能力點，不可使用題號或日期。
- 同一 group 的每個題目必須有相同 `topic`、相同 `type`、同一個正確知識點；它們在 analytics 及 spaced review 中一律以 `reviewGroupId ?? question.id` 視為一個 unit。

## Metadata 與 schema

保留既有 `id`、`reviewGroupId?`、`topic`、`type`、`title`、`instruction`、`question`、`options`、`answer`、`explanation`、`encouragement`。不新增 analytics、難度、年級、來源或 AI 相關欄位。

`hint` 是本 Sprint 唯一有明確產品需求的新欄位。Question schema 應以 `hint?: string` 做向後相容擴充：既有題目不必回填；Sprint 16 新增題目在題庫驗證中必須有非空 hint。既有 QuestionCard／QuestionResult 的作答流程不改題型；實作時僅在答錯後顯示該題 hint，再讓孩子重試。hint 不得包含正確選項文字、位置或可唯一反推答案的資訊。

`type` 延續既有語意，不把所有 topic 人為平均：`basic` 是基本辨識／直接理解，`application` 是在語境中辨識或運用。新增分布為 basic 4、application 6；完成後全題庫為 basic 10、application 9，這是能力規格的結果，不是配額。

## 人工核准與 authoring workflow

1. 依「題目內容規格」為每個 unit 建立候選題，但不得直接合併 production bank。
2. 人工逐題確認：適齡、能力點確實不同、題意清楚、唯一正解、合理 distractors、hint 不洩漏、explanation 正確。
3. 取得每題明確核准後，才將完整題目物件加入對應 student bank；未核准項目不以 placeholder、暫定答案或 AI 推測內容進入 production。
4. 將核准題目的完整文字、選項與答案鎖入 explicit test assertions，防止日後非預期變更。

## 測試與品質防護

題庫資料測試要先於 production 題庫更新，並至少涵蓋：

- 每個 bank 內與跨 bank 的 question ID 唯一性；姐姐／妹妹資料不可混入。
- `topic`、`type`、新增題目的 `hint` 都為非空字串；`type` 僅為 `basic` 或 `application`。
- options 至少兩個且沒有重複；`answer` 是有效 index，並對核准題目使用 explicit assertions。
- 有 `reviewGroupId` 時，其格式有效；同 group 的 topic、type、知識點一致。
- unit count 一律以 `reviewGroupId ?? question.id` 計算；variation 不得使 unit count 增加。
- 各 student/topic 完成後都有至少三個 independent learning units；測試須能分辨「三個 variations」與「三個 units」。
- Sprint 10 Today Review、Sprint 12 spaced review、Sprint 13 variation selection、Sprint 14 session/time control、Sprint 15 parent summary 的既有 pure-data regression 全數通過。
- 完整驗證維持 `npm test`、`npm run lint`、`npx tsc --noEmit`、`npm run build` 與 `git diff --check`；瀏覽器驗證僅在不修改真實學習資料的安全條件下進行。

## Future analytics readiness

Sprint 16 完成後，topic-level aggregation 的最低前提是：每個 student/topic 至少有三個獨立 units、所有題目有完整 topic/type metadata、並能使用 `reviewGroupId ?? question.id` 將 record 正確映射為 unit，且 variation 不污染 coverage。

這只代表相較於目前每 topic 一個 unit，未來重新 audit 弱點分析時有較合理的資料基礎；三個 units 不是完整弱點診斷的充分樣本，也不在本 Sprint 定義 status threshold 或向家長顯示弱點結論。

## Acceptance criteria

- 正式題庫新增恰好 10 個、經人工核准的獨立 units，五個既有 topic 各新增兩個。
- 每個 topic 以 group fallback 計算至少有三個 independent learning units。
- Sprint 16 不以 variation 題數冒充 analytics coverage，也不新增未核准的 production 內容。
- 新增題目完整符合現有 Question schema 與 required hint 規則；不引入新 question engine 類型或不必要 schema。
- 所有題庫、review、parent summary regression 與靜態品質檢查通過。
