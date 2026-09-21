# Sprint 17 — Parent Review Time Setting v1 Design

## Goal

讓家長在既有 `/parent` 頁面，分別為姐姐與妹妹的中文「今日複習」設定建議時長：10 分鐘或 15 分鐘。孩子端只依該設定改變計時提醒的門檻與文字；提醒永遠是非強制、可繼續作答的建議。

本 Sprint 只處理「建議複習時長」，不處理每天幾點提醒、推播、密碼、使用限制、強制結束、自訂分鐘、星期／時段設定、每日總額度、歷史時間統計或雲端同步。

## Baseline and Scope Boundary

- Baseline: `main`, `HEAD = 01095ae`, working tree clean, `main = origin/main`, ahead / behind = `0 / 0`。
- Sprint 16 已完成；Sprint 14 的 review session、Sprint 15 的 parent summary 與 Sprint 16 hint 皆為既有行為。
- 不修改 `LearningRecord` schema、讀寫語意或 storage key。
- 不修改 `ReviewSession` schema、`project-seed:review-sessions:v1` 或其 stale-session reset 規則。
- 不將設定接到 review selection、mastery、retry priority、1/3/7 due-date、variation selection 或 parent summary。

## Chosen Design

採用獨立、client-only 的 localStorage collection：`project-seed:review-settings:v1`。它只保存明確設定；沒有對應 record 即代表「未設定」，由 timer 保留 Sprint 14 的 10 分鐘溫和提醒、15 分鐘完成提醒。

選擇 array collection，而不是以 student 名稱分散 key，原因是它沿用 review sessions 的單一 collection 模式、可自然保留未來不同 subject 的隔離，且一個 upsert helper 就能保證同一 `(student, subject)` 只有一筆有效設定。

```ts
type ReviewTargetMinutes = 10 | 15;

type ReviewTimeSetting = {
  student: StudentId;       // 'jiejie' | 'meimei'
  subject: SubjectId;       // Sprint 17 為 'chinese'
  targetMinutes: ReviewTargetMinutes;
};

// localStorage: project-seed:review-settings:v1
ReviewTimeSetting[]
```

不另加 record-level version 欄位。storage key 的 `:v1` 已是 schema guard；未來不相容資料才建立新 key 或明確 migration。本 Sprint 不 migration 既有資料，因為此 key 是全新且與兩個既有 storage key 完全分離。

## Settings Storage Contract

新增純 storage helper `lib/review-time-settings.ts`，可重用既有 `StudentId`、`SubjectId`，但不得依賴 Learning Record 的資料內容或寫入 helper。

建議公開 API：

```ts
export const REVIEW_TIME_SETTINGS_STORAGE_KEY = 'project-seed:review-settings:v1';

export type ReviewTargetMinutes = 10 | 15;
export type ReviewTimeSetting = {
  student: StudentId;
  subject: SubjectId;
  targetMinutes: ReviewTargetMinutes;
};

export function readReviewTimeSettings(): ReviewTimeSetting[];
export function getReviewTargetMinutes(student: StudentId, subject: SubjectId): ReviewTargetMinutes | null;
export function saveReviewTargetMinutes(
  student: StudentId,
  subject: SubjectId,
  targetMinutes: ReviewTargetMinutes,
): void;
```

讀取規則：

- SSR、localStorage 不可用、JSON 損壞、根值不是 array，或沒有匹配有效 record 時，回傳空 array / `null`；UI 將 `null` 視為 Sprint 14 default。
- 有效 record 必須有合法 `student`、已知 `SubjectId`、且 `targetMinutes` 僅為 `10` 或 `15`。無效項目一律忽略。
- 同一 `(student, subject)` 有重複有效 record 時，採「最後一筆有效 record 勝出」；讀取 helper 對該 pair 只回傳該筆。這使舊的／手動損壞的 array 仍有可預期結果。
- 寫入使用 upsert：先移除同一 `(student, subject)` 的所有 record，再 append 一筆新 record；其他 student/subject 完整保留。成功寫入後 refresh 仍可讀回；寫入例外只吞掉，不得中斷家長頁或孩子答題流程。

## Timer Notice Contract

timer 的輸入仍只有既有 session 的 `startedAt` 加上目前時間；設定只提供 target threshold。

```ts
getReviewTimeNotice(
  elapsedMinutes: number,
  targetMinutes: ReviewTargetMinutes | null,
): ReviewTimeNotice
```

為避免把「10 分鐘完成」誤標成既有的「15 分鐘完成」，實作應使用語意化 notice state，例如：

```ts
type ReviewTimeNotice =
  | { kind: 'gentle-ten-minute' }
  | { kind: 'target-complete'; targetMinutes: 10 | 15 }
  | null;
```

門檻與 UI 文案：

| 設定狀態 | < 10 分鐘 | 10 至 14 分鐘 | >= 15 分鐘 |
| --- | --- | --- | --- |
| 未設定 | 無提醒 | 10 分鐘溫和提醒 | 15 分鐘完成提醒 |
| 10 分鐘 | 無提醒 | 10 分鐘完成提醒 | 仍為 10 分鐘完成提醒 |
| 15 分鐘 | 無提醒 | 10 分鐘溫和提醒 | 15 分鐘完成提醒 |

- 10 分鐘溫和提醒沿用 Sprint 14 語意，例如「已經複習 10 分鐘，可以完成目前題目後休息。」
- 10 分鐘完成提醒使用明確文案：「今天已經複習 10 分鐘，可以休息囉！」
- 15 分鐘完成提醒沿用 Sprint 14 完成語意，例如「已經複習 15 分鐘，完成目前題目後，現在就休息吧。」
- 所有 notice 只顯示在 review flow 的資訊區；沒有 modal、alert、跳頁、自動提交、終止題目、清除 session、禁止作答或強制離開。
- 10 分鐘模式在超過 15 分鐘後仍顯示 10 分鐘完成提醒，不新增第二個 15 分鐘行為。

## Session Lifecycle and Existing-session Protection

`getOrCreateReviewSession({ student, subject: 'chinese', now, timeZone })` 維持 Sprint 14 原樣：同一 student／subject／local review date 的 active session 一律回傳原 record 與原 `startedAt`；只有沒有同日 session 時才建立新的 `startedAt`。完成整個 review 時才由既有 callback 清除該 pair 的 session。

設定變更流程必須是：

1. 妹妹已開始複習，session 的 `startedAt` 已存在，elapsed 為 8 分鐘。
2. 家長在 `/parent` 將妹妹中文由 15 分鐘改為 10 分鐘；設定 helper 只更新 `project-seed:review-settings:v1`。
3. 孩子 refresh 或重新進入 `/meimei/review` 後按「開始今日複習」；session helper 先恢復同日既有 session，並保留原 `startedAt`。
4. review flow 讀取當前 10 分鐘 setting，只改 notice threshold；到原 session 的第 10 分鐘即顯示 10 分鐘完成提醒。若重開時已超過 10 分鐘，立即顯示該完成提醒。

設定 helper 不得呼叫 `getOrCreateReviewSession`、`endReviewSession`，也不得讀寫 review-session storage。因此它不可能建立、清除或 reset `startedAt`。同時，`TodayReviewPage` 在使用者按開始時讀取 current target setting，並將它作為 review-only prop 傳給 `ChineseQuestionFlow`；它不改變題目選取流程。

## Parent UI

不新增 navigation 或獨立設定頁。在既有 `/parent` 的 `ParentLearningRecords` 中、每位孩子既有摘要卡的標題下方，加入一個小型「今日複習時間」設定區。

- 姐姐卡只編輯 `(jiejie, chinese)`；妹妹卡只編輯 `(meimei, chinese)`。
- 顯示兩個可存取的 radio buttons：`10 分鐘`、`15 分鐘`；每組有獨立 label 與 legend。
- mount 後讀取設定；未設定時 UI 明確標示「未設定（10 分鐘提醒、15 分鐘完成提醒）」而不假裝已選擇 15 分鐘。
- 家長點選 10 或 15 時立即呼叫 save helper、同步更新本地 React state；沒有 Save 按鈕。
- 若 storage 無法讀寫，畫面保持未設定／上次已讀狀態，且不顯示成功保存的虛假訊息；不得影響既有 parent summary 或 Learning Record 顯示。

此做法只擴充已經依 student 分開的 parent card，符合現有頁面結構，且讓家長一次看見並獨立設定兩位孩子，無需新頁面或額外導覽。

## Planned File Boundaries

- Create `lib/review-time-settings.ts`: setting type、嚴格 validation、dedupe read、lookup 與 safe upsert write；不含 React、不存 Learning Record、不操作 session。
- Create `lib/review-time-settings.test.mjs`: mocked localStorage 的 storage contract tests。
- Modify `lib/review-session-time.ts`: 將純函式擴充為依 target/default 回傳語意化 notice；elapsed-minute 算法不變。
- Modify `lib/review-session-time.test.mjs`: 保留 Sprint 14 default cases，增加 10/15 target notice cases。
- Modify `components/parent/ParentLearningRecords.tsx`: mount 後 hydration-safe 讀 setting、渲染最小的 student-specific radio control、立即 save；既有 summary 計算不變。
- Modify `components/review/TodayReviewPage.tsx`: 開始既有／新 session 時讀取 setting，將 target 以 review-only prop 傳入；session helper 呼叫不變。
- Modify `components/question/ChineseQuestionFlow.tsx`: 只在有 `reviewStartedAt` 的 review flow 顯示新的 advisory notice；一般中文練習與 Learning Record write 路徑不變。

不修改 `lib/learning-records.ts`、`lib/review-sessions.ts`、`lib/spaced-review.ts`、`lib/today-review.ts`、題庫或既有 parent-summary pure logic。

## Test Design

新增或調整自動化測試至少涵蓋：

1. 無設定時：9 分鐘無提醒、10–14 分鐘為 Sprint 14 溫和提醒、15 分鐘以上為完成提醒。
2. 姐姐中文設為 10：10 分鐘及其後都是 `target-complete(10)`，不出現 15 分鐘第二狀態。
3. 姐姐中文設為 15：10–14 分鐘溫和提醒、15 分鐘以上 `target-complete(15)`。
4. 妹妹中文設定不改變姐姐中文設定；反向亦然。
5. 同一 student 的不同 subject lookup / save 互不覆蓋，證明 subject isolation。
6. save 後建立新的 helper module instance（模擬 refresh）仍讀回相同 target。
7. 損壞 JSON、非 array、非法 student／subject／target、localStorage 不可用與寫入例外均安全 fallback，且不 throw。
8. duplicate valid records 對同一 pair 採最後有效 record，save 後正規化為一筆。
9. active session 已存在時改 setting，session helper 回傳完全相同的 `startedAt`；設定 storage 與 session storage 的內容互不污染。
10. 原 session elapsed 已超過新 10-minute target 時，重新開始／進入 review 立刻取得 10-minute complete notice，不建立 session。
11. 10-minute mode 不會在 15 分鐘產生額外強制行為；notice 仍是 advisory state。
12. component-level coverage（以既有測試型態可行時）確認 parent 每位孩子有獨立控制項、children review prop 只在 review flow 使用；任何設定改變都不呼叫 Learning Record 或 review selection functions。
13. 完整回歸：Sprint 14 session persistence／stale reset、Sprint 15 summary、Sprint 16 hint、`reviewGroupId ?? question.id`、每天最多 5 groups、1/3/7、retry、deterministic variation 與 same-day progression 的既有 tests 持續通過。

最終驗證命令（實作階段才執行）：`npm test`、`npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check`；並以不污染既有 browser localStorage 的方式確認兩個 `/review` route 與 `/parent` 載入。

## Acceptance Criteria

1. 家長可在既有 `/parent` 分別為姐姐、妹妹選 10 或 15 分鐘，選擇立即保存並可在 refresh 後保留。
2. 設定只使用 `project-seed:review-settings:v1`，並依 `(student, subject)` 隔離。
3. 不修改 Learning Record、其 schema 或寫入語意；不修改 review-session schema。
4. 未設定精確保留 Sprint 14 的 10 分鐘溫和提醒與 15 分鐘完成提醒。
5. 10 分鐘設定在 10 分鐘起顯示完成提醒；15 分鐘設定維持 10 分鐘溫和、15 分鐘完成。
6. 所有提醒都是 non-blocking / advisory only。
7. setting read/write 永不建立、清除或 reset active session `startedAt`；同日 session 恢復後依新 target 計算。
8. malformed setting storage 安全 fallback，且不妨礙 parent page 或 child review。
9. review selection、1/3/7、variation、retry、same-day group progression、parent summary 與 hint 語意完全不變。

## Human Approval Gate

本文件只定義 Sprint 17 v1 的設計。等待 Human Approval 後，才可建立 implementation plan 或修改 production code、tests、Sprint status、commit 與 push。
