# Sprint 14 — 複習時間控制 v1 Design

## Goal

在姐姐與妹妹的 `/review` 今日複習流程中，從按下「開始今日複習」起顯示已複習的整分鐘數，並在 10 分鐘與 15 分鐘給予溫和、非強制的休息提醒。此功能只保存 active session 的開始時間；不改變答題、Learning Record、複習狀態或選題結果。

## Scope and Non-goals

本 Sprint 僅涵蓋目前使用的 `TodayReviewPage` 與 `ChineseQuestionFlow`，姐姐和妹妹使用相同 session helper 與 UI 行為。

不做倒數計時、家長設定時間、強制每日使用上限、學習時長 dashboard，或家長模式時間統計。未來 backlog 保留家長設定時間、每日／每週實際學習時長分析與家長模式時間統計。

## Chosen Approach

採用單一、版本化 localStorage collection：`project-seed:review-sessions:v1`。其中只保存尚未完成的 sessions。這比每個 session 使用動態 key 更容易安全讀取、驗證與清除，也避免把 session 資料混入既有 `project-seed:learning-records:v1`。

不採用只存在 React state 的方案，因為重新整理會歸零；也不採用每秒更新 timer，因為 UI 只需顯示整分鐘且每秒 render 沒有學習價值。

## Session Identity and Storage Schema

每個 active session 的業務識別為 `(student, subject)`；同一學生與科目同時只能有一個 active session。`localReviewDate` 是建立當下依瀏覽器時區算出的本地日期，供隔離、診斷與未來分析使用；`startedAt` 是 ISO 時間戳，和前述欄位合併後可唯一辨識該次 session。未完成 session 跨過午夜或重新整理後，仍依 `(student, subject)` 恢復原本的 session，絕不因日期改變而重置。

```ts
type ReviewSession = {
  student: StudentId; // 'jiejie' | 'meimei'
  subject: SubjectId; // Sprint 14 為 'chinese'
  localReviewDate: string; // session 建立當日，YYYY-MM-DD
  startedAt: string; // 有效 ISO 8601 timestamp
};

// localStorage: project-seed:review-sessions:v1
ReviewSession[]
```

讀取時僅保留欄位、學生、科目、日期格式與 `startedAt` 都有效的資料。若 JSON 壞掉、根結構不是 array、storage 不可用，或沒有對應 active session，皆回傳「無 session」並可正常開始新的 session。重複的 `(student, subject)` 記錄視為壞資料衝突：保留 `startedAt` 較早的一筆，使重新整理不會偷偷縮短時間。

## Session Lifecycle

1. `/jiejie/review` 或 `/meimei/review` 在 client hydration 完成後，仍依現有邏輯以 Learning Records 選出今日題目；此流程不讀取 session storage。
2. 使用者按下「開始今日複習」時，session helper 先讀取 `(student, 'chinese')` 的 active session。有則回傳它；無則以當下 `new Date()`、當前時區的 local date 建立並保存一筆。只有此時才設定 `hasStarted`。
3. 進入答題 flow 後，從 `startedAt` 推導 elapsed minutes，顯示「已複習 N 分鐘」。重新整理並再次按開始時，會載入相同 `startedAt`，因此時間延續。
4. 最後一題正確完成、`ChineseQuestionFlow` 進入完成畫面時，呼叫 `endReviewSession(student, 'chinese')`，只移除該學生／科目的 active session。姐姐與妹妹的資料彼此不會被刪除。
5. 完成畫面後再次進入 `/review` 並按開始，因 active session 已刪除，建立新的 session。若使用者中途離開、重新整理或關閉頁面，不結束 session，下一次回到同一學生科目時繼續計時。

session 的讀寫與刪除都只處理新的 storage key；不得呼叫、改寫或遷移 Learning Record，亦不得傳入 `spaced-review.ts` 或 `today-review.ts`。

## Timer, Notices, and UI

elapsed minutes 的定義為 `Math.floor(Math.max(0, nowMs - startedAtMs) / 60_000)`。

- `< 10`：只顯示已複習時間，沒有提醒。
- `>= 10 && < 15`：顯示「已經複習 10 分鐘，可以完成目前題目後休息。」
- `>= 15`：只顯示較明確的提醒「已經複習 15 分鐘，完成目前題目後，現在就休息吧。」；不重複堆疊 10 分鐘文案。

提醒是 flow 內靠近標題的靜態提示，不能遮住題目、阻止選答、停用按鈕、鎖題或導頁。沒有 modal、alert 或自動離開行為。

新增 `useReviewElapsedMinutes(startedAt)`（或等價專用 hook）。它在 mount、`startedAt` 改變與 visibility 回到前景時更新一次，然後只排程到下一個整分鐘邊界的 `setTimeout`；每次 timeout 後重新計算並再次排程。它不使用一秒 interval，且只在整分鐘數改變時 set state，避免不必要的 React render。unmount 時清除 timeout 與 visibility listener。

## Hydration and SSR Safety

`TodayReviewPage` 已是 client component。所有 storage 存取都保留在 event handler 或 `useEffect` 中，並以 `typeof window !== 'undefined'` 及可用 localStorage 檢查保護。初次 SSR/client render 不顯示 session 時間，直到使用者開始；因此不會有 hydration mismatch。timer hook 只在已取得有效 `startedAt` 的 client flow 中啟動。

## Existing Review Guarantees

Sprint 14 的 helper 與 UI 僅交換 session 資料。下列內容必須保持行為等價，並以既有測試防護：

- `project-seed:learning-records:v1`、`LearningRecord` schema 與寫入時機。
- Sprint 12 的 1/3/7 derived review state。
- Sprint 13 的 `reviewGroupId ?? question.id` group state、同日規則與最多五個 groups。
- `selectTodayReviewQuestions` 的 deterministic variation selection（`student + subject + reviewGroupId + localReviewDate`）及不使用 `Math.random()` 的保證。

session 啟動在既有題目選擇之後；session 時間或 storage 永遠不作為選題輸入。因此重整在同一日的題目選擇仍完全由既有 deterministic key 決定。

## Planned File Boundaries

- Create `lib/review-sessions.ts`: 純資料型別、驗證、讀取、取得或建立、結束 session；不含 React。
- Create `lib/review-sessions.test.mjs`: mock localStorage 的純資料測試。
- Create `components/review/useReviewElapsedMinutes.ts`: client-only minute scheduling hook。
- Create timer 的純資料時間／門檻測試，不引入新的 test dependency。
- Modify `components/review/TodayReviewPage.tsx`: 僅在開始按鈕處取得或建立 session，並把 `startedAt` 與完成 callback 傳入既有 flow。
- Modify `components/question/ChineseQuestionFlow.tsx`: 接收可選 review-session UI props，顯示時間／提醒並在 review completion 結束 session；非 review 的既有答題頁不顯示 timer。

實作時不修改 `lib/learning-records.ts`、`lib/spaced-review.ts`、`lib/today-review.ts` 或題庫資料。

## Test Strategy

先完成純資料測試，才接 UI 接線。至少包含：

- `startedAt` 剛好滿 10 分鐘時為 10-minute notice；14 分 59 秒仍是同一提醒。
- 剛好滿 15 分鐘時為 15-minute notice，且取代 10-minute notice。
- 未滿 10 分鐘僅顯示 elapsed minutes、沒有提醒。
- 相同姐姐／中文 session 在 refresh 後讀回相同 `startedAt`，elapsed 連續。
- 姐姐與妹妹（以及不同 subject 的防禦性案例）分別建立、讀取與結束，互不干擾。
- 完成姐姐 session 後只清除姐姐／中文；重新進入可建立新的較晚 `startedAt`。
- malformed JSON、非 array、無效欄位、無效時間與 storage 讀寫錯誤皆安全 fallback；不 throw、可開始新 session。
- duplicate active records 採最早有效 `startedAt`，維持不歸零原則。
- 重跑所有既有 `lib/spaced-review.test.mjs`、`lib/today-review.test.mjs` 與全量 `npm test`，確認 Sprint 12 / 13 不變。

完成實作時的完整驗證為 `npm test`、`npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check`，外加姐姐與妹妹 `/review` 的瀏覽器 smoke。Sprint 14 設計階段只進行文件與 diff 檢查。

## Acceptance Criteria

- `/review` 開始後顯示整分鐘 elapsed time，refresh 不歸零。
- 10 分鐘與 15 分鐘邊界分別顯示指定的溫和與明確提醒，且永不強制中斷。
- active session 以學生和科目隔離；session 開始日期保存並在跨日恢復時不造成重置。
- 完成今日複習後只結束該 session；後續重新進入可建立新 session。
- 壞的 session storage 安全 fallback，且不能破壞答題流程。
- Learning Record、Sprint 12 1/3/7、Sprint 13 group state 與 deterministic variation selection 完全不受影響。
