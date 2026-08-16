# Sprint 16 — 題庫擴充 v1 設計

## 目標與邊界

Sprint 16 在人工逐題核准後，將五個 active／continuing Chinese topics 擴充至核准的 independent learning-unit target，為未來重新 audit topic-level analytics 建立較合理的題庫基礎。姐姐的 active topics 為成語運用（2 個 units）與錯別字辨識（3 個 units）；既有注音辨識與部首辨識保留為 legacy / retained。妹妹三個 active topics 各為 3 個 units。

本 Sprint 不做弱點分析 UI、analytics threshold、AI 選題、資料庫、外部題庫、教材匯入、新題型或大量自動產題。任何正式題幹、選項、正解、hint 與解析都必須由人工逐題核准後，才可進 production question bank。

## Topic 狀態與完成目標

| Student | Topic | 狀態 | 現有 units | Sprint 16 新增 units | 完成後 units |
| --- | --- | --- | ---: | ---: | ---: |
| 姐姐 | 成語運用 | active / continuing | 0 | 2 | 2 |
| 姐姐 | 錯別字辨識 | active / continuing | 0 | 3 | 3 |
| 姐姐 | 注音辨識 | legacy / retained | 1 | 0 | 1 |
| 姐姐 | 部首辨識 | legacy / retained | 1 | 0 | 1 |
| 妹妹 | 詞語意思 | active / continuing | 1 | 2 | 3 |
| 妹妹 | 動作詞辨識 | active / continuing | 1 | 2 | 3 |
| 妹妹 | 量詞運用 | active / continuing | 1 | 2 | 3 |
| **Total** | **5 active + 2 legacy topics** |  | **5** | **11** | **16** |

注音辨識與部首辨識的既有題目、ID、topic、Learning Records、review history、spaced-review state 與 Sprint 13 variation/group 相容性一律保留。它們仍可正常作答與複習，但不再新增 units，也不納入 active-topic coverage gate。

一個 learning unit 是獨立的知識或能力檢核點；不得只是更換字詞、選項順序或表面改寫。A/B variation 是同一 unit 的不同呈現，不能增加 unit 數或 analytics coverage。

## 題目內容規格（非正式題目）

下列只定義人工出題與審核的能力方向，不是可直接上線的題幹、選項或答案。

| Student / topic | 新 unit 方向 | type |
| --- | --- | --- |
| 姐姐／成語運用 | 依句意選擇適切成語；依情境判斷人物表現的成語 | basic、application |
| 姐姐／錯別字辨識 | 找出錯別字；選出正確寫法；在句子或語境中判斷並改正錯別字 | basic、basic、application |
| 妹妹／詞語意思 | 直接理解另一個常用詞語；依句子語境判斷常用詞語意思 | basic、application |
| 妹妹／動作詞辨識 | 區分動作詞與名詞；區分動作詞與描述狀態或特徵的詞 | application、application |
| 妹妹／量詞運用 | 人物類常用量詞運用；動物或物品類常用量詞運用 | application、application |

素材須符合學生年級與日常語言經驗。每題必須有唯一正解、合理 distractors、不直接揭露答案的 hint，以及正確 explanation。人工審核無法確認唯一正解時，不得進入題庫。

## 決定：Option A

每個新增 unit 先建立一題：Sprint 16 新增 11 題、11 個獨立 units。所有新題不設 `reviewGroupId`，所以 unit ID 是 `question.id`。日後若某 unit 需要 variation，可為原題與 variation 補上同一個語意穩定 group ID；Learning Records 保留實際顯示的 `questionId`，不需 migration。

## ID allocation

| ID | student | topic | type | `reviewGroupId` |
| --- | --- | --- | --- | --- |
| `jiejie-chinese-5` | jiejie | 成語運用 | basic | omitted |
| `jiejie-chinese-6` | jiejie | 成語運用 | application | omitted |
| `jiejie-chinese-7` | jiejie | 錯別字辨識 | basic | omitted |
| `jiejie-chinese-8` | jiejie | 錯別字辨識 | basic | omitted |
| `jiejie-chinese-9` | jiejie | 錯別字辨識 | application | omitted |
| `meimei-chinese-6` | meimei | 詞語意思 | basic | omitted |
| `meimei-chinese-7` | meimei | 詞語意思 | application | omitted |
| `meimei-chinese-8` | meimei | 動作詞辨識 | application | omitted |
| `meimei-chinese-9` | meimei | 動作詞辨識 | application | omitted |
| `meimei-chinese-10` | meimei | 量詞運用 | application | omitted |
| `meimei-chinese-11` | meimei | 量詞運用 | application | omitted |

新增分布為 basic 5、application 6，是能力規格結果，不是均分配額。既有部首辨識 ID 與 metadata 不得變更。

## Metadata、validation 與 coverage

Question schema 保留既有欄位，僅以 `hint?: string` 向後相容擴充；不為 active／legacy 狀態新增每題 metadata。既有題目不必回填 hint；Sprint 16 的 11 個新 ID 必須有非空 hint。hint 僅在答錯後顯示，且不得影響答案判定、retry、下一題、Learning Record 或 review scheduling。

`reviewGroupId ?? question.id` 是唯一 unit identity。同 group 題目必須有相同 topic、type 與知識點。純資料 validation 以明確 coverage configuration 接收 active topic 清單、每 topic 最低 unit 數與總 unit 門檻；legacy topics 仍被安全計數，但不套用 active-topic 最低門檻。

## 人工核准 Gate

正式內容共 11 題。每題都必須有人工明確核准的 `id`、`topic`、`type`、`title`、`instruction`、`question`、`options`、`answer`、`hint`、`explanation`、`encouragement`，並省略 `reviewGroupId`。

人工須確認每題適齡、能力點獨立、答案唯一、distractors 合理、hint 不洩漏答案、explanation 正確。Codex 不得依 topic 或能力方向自行補題、補答案或建立 placeholder。

## Analytics readiness

Sprint 16 完成後的 coverage gate 是成語運用至少 2 個、其餘四個 active topics 各至少 3 個 independent units，總數至少 16。此差異由人類核准的固定 allocation 決定，並以外部 `minimumUnitsByActiveTopic` configuration 表達。注音辨識與部首辨識是 legacy / retained topics：aggregation 必須能安全處理其各一個 unit，但不得因樣本不足產生誤導性的能力判斷。

這不是完整弱點診斷的充分樣本，也不在本 Sprint 定義 status threshold 或家長端弱點結論；未來仍須重新 audit。

## Acceptance criteria

- 正式題庫僅在 Gate 後新增恰好 11 個人工核准 units；姐姐 5、妹妹 6。
- 成語運用至少兩個、其餘四個 active topics 各至少三個 units；注音辨識與部首辨識各保留一個 legacy unit 且不納入 coverage gate。
- variation 不得增加 independent unit count；學生資料保持隔離。
- 既有 Sprint 10–15 pure-data regression 與 `npm test`、lint、TypeScript、build、diff check 全數通過。
- 未核准內容、production placeholder、schema 過度擴充、commit 與 push 都不在本 Gate 前進行。
