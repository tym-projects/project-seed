# Sprint 13 — Variation Questions v1 Design

## Goal

讓同一學習概念的多個題目共用複習進度，同時每次仍只向孩子顯示一題清楚、可完成的題目。

## Scope

- 在題目 schema 新增可選欄位 `reviewGroupId?: string`。
- 姐姐中文題庫建立兩個兩題的 review groups：
  - `jiejie-chinese-jiao-pronunciation`：`jiejie-chinese-1`、`jiejie-chinese-3`
  - `jiejie-chinese-tian-radical`：`jiejie-chinese-2`、`jiejie-chinese-4`
- 妹妹中文題庫建立兩個兩題的 review groups：
  - `meimei-chinese-gaoxing-meaning`：`meimei-chinese-1`、`meimei-chinese-4`
  - `meimei-chinese-action-word-identification`：`meimei-chinese-2`、`meimei-chinese-5`
- 將 spaced review 與今日複習的判斷單位改為 review group，並保留既有非群組題目的行為。

不包含 AI 題目生成、Knowledge Graph、額外儲存狀態、Learning Record migration、`recordSource`、新路由、UI 重設計、E2E framework 或新 dependency。

## Data Model and Compatibility

`Question` 與 `ReviewQuestion` 均支援 `reviewGroupId?: string`。每一題的 learning unit 為 `reviewGroupId ?? question.id`：有群組時由同群組題目共用狀態；舊題或未標示群組的題目仍以自身 `id` 進行 Sprint 12 的單題複習。

Learning Record 的 schema、storage key 與寫入方式不變。它永遠保存畫面上實際作答的 `questionId`，而不是 group ID，因此家長紀錄、答案顯示與舊資料均保持可讀。群組關係只在讀取目前題庫並推導 review state 時使用；未知或已移除的 `questionId` 不會被錯誤歸入任何群組。

## Group-based Spaced Review

`deriveReviewState` 將接受 learning-unit ID。呼叫端會先把題目 ID 對應至 `reviewGroupId ?? question.id`，再只彙整屬於該 unit 的有效完成紀錄。

同一學生與科目下，同一天同一 group 的多筆完成紀錄合併為一個 review day；只要任一筆 `attempts > 1`，該 day 即為答錯重試。規則沿用 Sprint 12：第一次穩定答對後 +1 天、第二次 +3 天、之後 +7 天；答錯重試會將 streak 歸零並安排 +1 天。不同學生及不同科目絕不共享 state。

## Today Review Group Selection

今日複習先從題庫建立每個 learning unit 的群組，而非逐題建立候選清單。每個 group 只推導一次 state，並沿用既有優先序：不穩定的到期 group、其他到期 group、從未完成的 group；同類候選仍優先維持 topic spread。結果上限為 5 個 groups。

同一天只可從一個 group 選出一題：若群組已有任一有效完成紀錄，即整個 group 不再列入今日候選。這避免同概念 A/B 在同一天重複出現。

## Deterministic Variation Selection

每個已選 group 再挑出一題顯示。選擇鍵固定為 `student + subject + reviewGroupId + localReviewDate`，使用可重現的字串雜湊與取模；不使用 `Math.random()`，也不新增或保存 selection state。因此同一位學生於相同科目、同一 group、同一天重開時會看到同一題；在另一個 local review date 會得到可自然變換的候選結果。

選取前先找出該 student、subject、group 最近一次有效完成紀錄所對應的實際 `questionId`。若固定選擇正好指向這一題且 group 另有可用 variation，就順序選取下一個 variation，優先避免連續出現相同題目。若只有一題、最近題不在目前 group，或紀錄無效，則安全地使用固定選擇結果。

首次尚無 group 紀錄時，今日複習仍以固定選擇決定顯示題。學習流程中的一般題目不改變：其原始 `questionId` 持續寫入 Learning Record；群組效果只影響日後的 review selection 與 state。

## Error Handling

重複 question ID 仍採現有的首次題目為準。缺少、空白或未知的 `reviewGroupId` 不建立跨題關聯，並以題目自身 ID fallback。格式不正確、跨學生、跨科目、無效答案、未完成或無法解析日期的 records 均不參與 group state、最近題判斷或當日完成判斷。

## Test Strategy

先擴充純資料測試，再修改 production code。測試覆蓋：

- A 完成後 B 能代表同一 group 的到期狀態，並驗證 +1/+3/+7。
- A/B 任一題 retry 都會讓 group streak 歸零並安排 +1 天。
- 已完成 A 的下一次 group review 優先顯示 B；當日重開的結果固定。
- group 當日最多一題、總數最多五個 groups，且保持 topic spread。
- deterministic key 不使用 random；換 local review date 可合法切換 variation。
- 姐姐／妹妹與 subject 隔離、malformed records、unknown IDs、已移除 variation。
- legacy 無 `reviewGroupId` 題目保有 Sprint 12 的 question-level 行為。

完成實作後執行 `npm test`、`npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check`，並在瀏覽器驗證姐姐與妹妹的 `/review` 路徑能開啟且 variation 不會造成 crash。

## Acceptance Criteria

- `reviewGroupId?: string` 是唯一新增的題目關聯資料。
- Learning Record 永遠保留實際 `questionId`；沒有 migration 或新 storage key。
- group 共用 1/3/7 Review State，答錯依既有規則重設。
- variation 的選擇可重現、優先避開最近完成題、無 random、無永久 selection state。
- legacy 題 fallback 至自身 `question.id`。
- 每日每 group 至多一題，總計至多五個 groups；姐姐、妹妹與 subject 完全隔離。
