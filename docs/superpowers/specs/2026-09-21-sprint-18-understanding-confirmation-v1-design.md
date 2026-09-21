# Sprint 18 — Understanding Confirmation v1 Design

## 1. Problem

目前 Project Seed 已有 1/3/7 spaced review、variation questions、retry hint 與 parent summary，但一次答對只證明孩子完成了當下呈現的題目。若孩子記住原題與選項，仍可能沒有真正理解同一個 learning unit。

Sprint 18 要用同一 learning unit 的另一個 variation 做一次有限的理解確認，讓「答對」更接近「能在不同問法中再次理解」，同時維持每天短時間、簡單、不強迫的學習流程。

## 2. Goals

- 在既有 review flow 中，對少量符合條件的 variation group 增加一次不同問法的確認。
- 不修改 Learning Record schema、review session schema 或既有 1/3/7 核心規則。
- 同一 group 在同一 local date 的兩筆 variation record 只形成一次 spaced-review progression。
- 使用 deterministic selection，不使用 random，也不建立永久 selection state。
- 保持 daily review 最多 5 個 learning groups，並限制每個 review session 最多 1 題 confirmation。
- 讓 refresh / reopen 能利用既有 Learning Records 推導未完成的 confirmation。
- 保持姐姐／妹妹、subject、legacy 無 group 題目的隔離與既有行為。

## 3. Non-goals

- 不建立完整 mastery score、能力等級或 AI 教學。
- 不修改 `LearningRecord` 或 `ReviewSession` schema。
- 不改變 1/3/7 的間隔規則、retry reset 規則或同日一次 progression 語意。
- 不讓每個 review group 無條件變成兩倍題量。
- 不建立第三題以上的 confirmation chain。
- 不新增永久的 selected question、confirmation pending 或 record role storage state。
- 不進行大規模題庫擴充、跨科目、家長設定或圖表改版。

## 4. Existing architecture

### Learning unit identity

`lib/today-review.ts` 將題目依 `reviewGroupId ?? question.id` 分組。相同 `reviewGroupId` 的題目是同一 learning unit；沒有 `reviewGroupId` 的 legacy 題目以自己的 `question.id` 作為 group。

目前題庫中，姐姐有兩個各含兩個 variation 的 group，妹妹也有兩個各含兩個 variation 的 group；其他 Sprint 16 新增題目沒有 `reviewGroupId`，維持單題 legacy unit。

### Deterministic variation selection

現有 `selectVariation` 以 `student:subject:group.id:localReviewDate` hash 產生固定 index；若結果正好等於該 group 最近完成的 `questionId`，且 group 有多題，就順序選下一個 variation。這保證同一學生、科目、group、local date 下結果可重現，並避免連續顯示最近完成的 variation。

Sprint 18 保留此 primary selection。confirmation 使用另一個 deterministic key，且排除 primary `questionId`；3 個以上 variations 時，在可行範圍內也排除最近一次歷史 variation。

### Learning Records

現有 `project-seed:learning-records:v1` 每筆保存：

- `id`
- `student`
- `subject`
- `questionId`
- `firstAnswer`
- `finalAnswer`
- `attempts`
- `correct`
- `completed`
- `createdAt`

每一題完成時由 `ChineseQuestionFlow` 寫入一筆 record。答錯不會直接完成；孩子重新答對後，以同一題的一筆 record 保存首次答案、最終答案與 attempts。

### 1/3/7 and retry

`deriveReviewState` 先把同一 student、subject、group 的 records 依 local date 合併成 review day。當天任一 record 的 `attempts > 1`，該 review day 的 `hadWrong` 就是 true。

- clean review day 第一次成功後，下一次為 +1 local day。
- 第二次到期 clean review 後，下一次為 +3 days。
- 第三次及以後為 +7 days。
- 任一 retry 會把 streak 歸零並安排隔天。

因此原題與 confirmation variation 即使各寫一筆 record，只要同一天、同一 group，`deriveReviewState` 仍只產生一個 review day，不會推進兩次。

### Same-day guard and daily limit

`selectTodayReviewQuestions` 目前只要看到 group 在今天有完成 record，就排除整個 group；選取最多 5 個 groups，並先處理 due unstable、due stable、never completed，再做 topic spread。

Sprint 18 只對「已有一筆今日 primary clean record、confirmation 尚未完成」的 group 開放 pending confirmation。confirmation 完成後，group 回到原本的 same-day exclusion。daily limit 仍以 group 計算，不以展開後的題目數計算。

### Session and timer

`ReviewSession` 只保存 `student`、`subject`、`localReviewDate`、`startedAt`，以同日 session 恢復 timer。Sprint 17 的 target setting 讀取與 10／15 分鐘 advisory notice 只依 session 的原始 `startedAt` 計算。

Sprint 18 不修改 session schema、startedAt、target setting、timer 或 reminder 文案。confirmation 是同一 review session 內的額外 flow step。

## 5. User flow

1. Today Review 依現有規則選出最多 5 個 groups 與每組 primary variation。
2. 若本次 session 有符合條件的 group，依 selected group 順序只標記第一個 eligible group 為可 confirmation；其餘 groups 不增加題目。
3. 孩子照既有 QuestionCard 流程回答 primary。
4. primary 首次答對後，畫面以簡短文字提示「換一種問法試試看」，接著顯示同一 group 的 confirmation variation。
5. primary 答錯時維持現有 hint／retry 流程，不進 confirmation。
6. confirmation 完成後沿用既有 success／next／完成流程；不顯示技術詞彙。
7. 若本 session 沒有 eligible group，流程完全維持既有一題一 group 的行為。

## 6. Trigger rule

採用「下一次 spaced review 才確認」而非「首題答對立即確認」。

一個 group 在本次 local date 成為 eligible，必須同時符合：

1. group 至少有 2 個 variations。
2. 在今天以前，該 student／subject／group 已有完成 record。
3. 在今天以前，該 group 只完成過 1 個 distinct variation `questionId`。
4. 依既有 `deriveReviewState`，該 group 在今天是 due。
5. 今天尚未有該 group 的 record。

這代表首次接觸 group 只做 primary，不增加題量；等到下一次 spaced review 到期，才可能做一次理解確認。曾經完成過至少 2 個不同 variations 的 group 不再重複觸發 v1 confirmation。

每個 review session 最多選一個 eligible group。若多個 group 同時 eligible，使用既有 selected group 的穩定順序，第一個 eligible group 優先；不新增 group，也不改變原本最多 5 groups 的排序。

primary 必須在本次 flow 中以 `attempts === 1` 完成且答對，才進 confirmation。primary retry、未完成或離開頁面都不觸發 confirmation。

## 7. Variation selection rule

### Primary

primary 完全沿用現有 `selectVariation`：同一 student、subject、group、local date 使用同一 hash，並避開該 group 最近完成的 variation。

### Confirmation

confirmation 由同一 group 的 question list 產生：

- 必須與 primary 的 `questionId` 不同。
- 2 variations：直接選另一題，即使它是較早的歷史 variation；這是唯一可行的不同問法。
- 3 個以上 variations：先排除 primary 與最近歷史 variation；若仍有候選，使用 `${student}:${subject}:${group.id}:${localReviewDate}:confirmation:${primaryQuestionId}` 的 deterministic hash 選取。
- 若排除最近歷史 variation 後沒有候選，退回所有非 primary variations，再以同一 deterministic key 選取。
- 不使用 `Math.random()`、日期以外的永久 selection state 或新增 storage key。

### Refresh stability

primary 完成後，今天的單筆 primary record 成為 pending marker。重新整理時，selector 以該今日 primary `questionId` 作為 primary，重新計算同一 deterministic confirmation，因此會恢復相同的 confirmation question。

若 group 只有 1 個 variation，沒有 confirmation，維持既有行為。沒有 `reviewGroupId` 的 legacy 題目永遠不進 confirmation。

## 8. Learning Record semantics

- primary 完成時照常寫一筆既有格式的 Learning Record。
- confirmation 完成時也照常寫一筆既有格式的 Learning Record。
- 每筆 record 的 `questionId` 保存實際顯示的 variation；不新增 `role`、`isConfirmation` 或 `reviewSessionId` 欄位。
- 同一 group 的聚合仍使用 `reviewGroupId ?? question.id`。
- Parent Summary 的 due、attention 與 learning-unit 聚合仍以 group 去重；其現有 completed record count 仍表示實際完成的 records，因此一次含 confirmation 的 review 可能顯示兩筆 completed records，這是既有 record-count 語意的自然結果，不另造一個虛假的單筆 record。
- Sprint 17 的 review target、session timer 與 Learning Record 寫入時機不變。

## 9. Scheduling semantics

一次實際 learning-unit review 的原題與 confirmation 同屬同一 local date、同一 `reviewGroupId`。`deriveReviewState` 對該 group 的 questionIds 合併成一個 review day，因此：

- primary clean + confirmation clean：當天只推進一次 clean review day；不會增加兩次 streak。
- primary clean + confirmation retry：當天只推進一次，但 `hadWrong = true`，下一次安排隔天並重設 streak。
- primary retry：不進 confirmation；既有 retry 行為與隔天安排完全不變。
- confirmation 答錯但尚未完成：尚未新增 confirmation record；既有 primary record 仍標記該 group 為 pending，重新進入時回到 confirmation。
- confirmation 完成後不再追加第三題，也不再次觸發同日 confirmation。

同一 group 在同一天不論有一筆或兩筆 records，都只允許一次 spaced-review progression；既有 same-day group protection 是核心安全條件。

## 10. Correct / incorrect state transitions

| 狀態 | 行為 | Learning Record | Scheduling |
|---|---|---|---|
| primary 首次答對 | 進入最多一題 confirmation | 寫 primary，`attempts = 1` | 尚未單獨推進；等待同日 group 結果 |
| primary 答錯後答對 | 不進 confirmation，沿用 retry hint | 寫 primary，`attempts > 1` | group `hadWrong = true`，隔天重試 |
| primary 離開／未完成 | 不進 confirmation | 不新增完成 record | 不改 group state |
| confirmation 首次答對 | 完成該 group 的確認 | 寫 confirmation，`attempts = 1` | 同日 clean，只推進一次 |
| confirmation 答錯後答對 | 沿用既有 retry／hint，不出第三題 | 寫 confirmation，`attempts > 1` | 同日 `hadWrong = true`，隔天重試 |
| confirmation 離開／未完成 | 下次回到 pending confirmation | 不新增完成 record | 不改既有 primary review day |

## 11. Refresh / persistence behavior

不新增 persistence schema，使用既有 Learning Record 與 ReviewSession：

- primary 尚未完成：沒有今日 record；reopen 依既有 selection 顯示 primary。
- primary 已完成、confirmation 尚未完成：今天恰有一筆 primary clean record；reopen 將該 group 視為 pending，先顯示相同 deterministic confirmation。
- confirmation 已答錯但尚未完成：仍只有 primary completed record；reopen 回到 confirmation，既有 QuestionCard 的未完成答題狀態不另外保存。
- confirmation 已完成：同日已有兩筆 group records；group 依 same-day guard 排除，session completion callback 清除 active session。
- refresh 不重設 `startedAt`，Sprint 17 timer／target notice 依原 session 繼續。

既有架構本來就不保存目前題目 index 或未完成選項；Sprint 18 不為這個 v1 新增 session schema。若未來要求精確恢復半題作答狀態，另列 Human Review Item。

## 12. UX

- confirmation 只使用現有 QuestionCard、選項、hint、解析與鼓勵文字。
- primary 答對後顯示簡短 inline 過渡：「換一種問法試試看，看看你是不是真的懂了。」
- 不顯示 `reviewGroupId`、variation、mastery、confirmation state 等技術詞。
- confirmation 答對後沿用既有答對與下一題／完成流程。
- confirmation 不使用 modal、倒數、強制提交或額外設定頁。
- 既有 10／15 分鐘 advisory reminder 保持原位置與文案，不因 confirmation 改變。
- 最多增加一題，且每 session 最多一題，維持孩子短時間學習負擔。

## 13. Edge cases / fallback

- 只有 1 個 variation：永不觸發，保留 legacy 行為。
- 無 `reviewGroupId`：以自己的 `question.id` 作 unit，不觸發。
- group metadata 不一致或題庫 validation 失敗：不建立 confirmation，沿用安全的 primary／legacy selection；正式題庫 validation 仍應使問題在測試中被發現。
- 無效、未知或 malformed Learning Records：沿用既有 filtering，不能成為 confirmation trigger。
- 今日已存在兩筆同 group records：視為已完成，不再追加 confirmation。
- primary attempts 大於 1：視為 retry，不追加 confirmation。
- 多個 eligible groups：只取既有 selected order 的第一個，避免題量膨脹。
- 姐姐／妹妹或 subject 不同：所有 history、selection、pending marker 與 schedule 嚴格隔離。
- Sprint 17 timer storage、target setting 或 review session storage 損壞：沿用各自既有 fallback，不影響 confirmation 的純 selection；confirmation 不讀寫 timer domain。

## 14. Testing strategy

Implementation 至少需要涵蓋：

- 2 variations：due group 產生一題 primary 與一題不同 confirmation。
- 3+ variations：confirmation deterministic、排除 primary，並在可行時排除最近歷史 variation。
- legacy 單題／無 group：不觸發且維持原 selection。
- 同一 student／subject／local date 重跑：primary 與 confirmation 結果穩定。
- recent question avoidance：primary 避開最近完成題；confirmation 優先避開最近歷史題但 2-variation 必須安全 fallback。
- never-completed group：只出 primary，不增加 confirmation。
- due group 只有一個歷史 variation：符合 trigger；已有兩個歷史 variations：不再 trigger。
- primary 首次答對 → confirmation 答對。
- primary 首次答對 → confirmation retry，確認 group `hadWrong` 與隔日 schedule。
- primary retry：不進 confirmation。
- confirmation 不產生第三題或無限 chain。
- Learning Records 保存 primary／confirmation 的實際 `questionId`，schema 不變。
- 同日兩筆 records 只推進一次 1/3/7；retry 仍重設整個 group。
- primary 完成後 refresh／reopen 能推導 pending confirmation。
- confirmation 完成後 group same-day exclusion 恢復。
- review session `startedAt`、Sprint 17 target notice 與 reminder 不被改變。
- 姐姐／妹妹 isolation、subject isolation、每日最多 5 groups、topic spread。
- Parent Summary 的 due／attention group dedupe 與實際 record-count 語意。
- Sprint 13–17 full regression：variation、spaced review、retry、hint、parent summary、review session、review time setting。

## 15. Regression safeguards

- 只在 review plan 層加入最多一個 optional confirmation，不改 Learning Record 或 ReviewSession schema。
- 1/3/7 仍由既有 `deriveReviewState` 聚合同 group、同 local date 的 records；不得以 confirmation record 單獨呼叫 progression。
- daily cap 仍是最多 5 groups；confirmation 不增加 group 數。
- deterministic hash 不使用 random、不寫永久 selection state。
- existing `saveLearningRecord`、QuestionCard retry／hint、parent summary、timer／reminder domain 保持既有責任邊界。
- legacy 題目與無 variation group 維持原路徑。
- 所有 student／subject／local-date 查詢都必須沿用現有隔離條件。

## 16. Out of Scope

- AI 生成或 AI 解釋。
- mastery score、能力 threshold、學習診斷報告。
- 新增 Learning Record 欄位或 migration。
- 新增 ReviewSession 欄位、未完成答題保存或新的永久 confirmation state。
- 三題以上 confirmation chain、每日額外題量設定、家長控制。
- 新題庫大規模擴充或為所有 legacy 題目建立 variation。
- 重新設計 parent dashboard、charts、actual learning time analytics。
- 修改 Sprint 17 timer、10／15-minute settings 或 reminder 行為。

## 17. Open Human Decisions

None for this v1 design. The proposed trigger, one-confirmation-per-session cap, record semantics, scheduling semantics, and refresh fallback are deliberate decisions derived from the existing architecture and the approved Sprint 18 scope. Implementation may proceed only after Human reviews and approves this written design; an implementation plan is intentionally not created in this phase.
