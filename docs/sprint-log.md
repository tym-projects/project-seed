# Sprint Log

## Sprint 14 — 複習時間控制 v1

- Added isolated active review sessions in `project-seed:review-sessions:v1`; sessions restore only for the same student, subject, and local review date, and stale prior-date sessions are replaced using `getLocalDateKey`.
- Added minute-aligned elapsed-time UI and non-blocking 10/15-minute reminders. Completion clears only the current student/subject session.
- Learning Record, Sprint 12 1/3/7 review state, and Sprint 13 group/deterministic variation selection remain unchanged.
- Verification: 67/67 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Both review routes loaded without console errors. Manual timer/session smoke was not run because the available browser tooling cannot create an isolated storage context, and the existing browser profile must not be modified.

## Sprint 13 — Variation Questions v1

- Added four approved Chinese variations in two review groups per student; Learning Records retain the actual answered `questionId`.
- Review state now uses `reviewGroupId ?? question.id`: group 1/3/7 state, retry reset, same-day guard, five-group limit, topic spread, and legacy fallback.
- Daily display is deterministic per student, subject, group, and local date; it avoids the most recently completed variation without random or permanent selection state.
- Verification: 58/58 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser smoke for both review routes loaded without console errors.


## Sprint 12 — Spaced Review v1

- 新增純資料 Spaced Review 推導：以學生、科目、題目和本地曆日的 Learning Record 歷史產生最後完成日、最近流程是否曾答錯、穩定成功 streak、下次複習日與到期狀態。
- 不變更 Learning Record schema、不新增 storage key，也不永久保存 `nextReviewDate`；`attempts > 1` 僅表示該次成功完成前曾答錯。
- 規則為第一次無錯完成後隔 1 日、第二次到期後無錯隔 3 日、第三次以上隔 7 日；同日多筆至多推進一次，任一 retry 則重設 streak 並安排隔天。
- Today Review 改為「到期且較不穩定 → 其他到期 → 從未完成」；最多 5 題，不以未到期題補滿。
- 完成 45/45 Node tests、lint、TypeScript、production build，以及姐姐／妹妹今日複習頁最低必要瀏覽器驗證。

## Sprint 11 — Daily Review E2E & Reliability

- Learning Record 讀取僅保留可安全使用的 v1 record：忽略 malformed JSON、非陣列資料、無效日期、非有限或不合理 attempts 與缺少必要欄位的 legacy data。
- localStorage 寫入失敗時不再中斷孩子的作答完成流程。
- Daily Review 在收到 malformed／invalid Learning Record 時安全忽略，維持最多 5 題、學生／科目隔離、今日排除與既有優先順序。
- `npm test` 已納入 `lib/questions/meimei-chinese.test.mjs`，實際執行 33/33 tests；lint、TypeScript、production build 與姐姐／妹妹 Browser flows 均完成驗證。

## Sprint 10 — 今日複習

- 新增純資料選題模組，最多選 5 題，依最近重試題、掌握不穩定題、久未複習題補足。
- 同一學生、同一科目下，只要題目在孩子本地日期的今天已有 Learning Record，即不再選入。
- 姐姐與妹妹共用今日複習 UI 與 Question Engine，但題庫與 Learning Record 均以 `student` 嚴格過濾。
- 題庫補上 `topic`、`type`；完成後仍寫入既有 Learning Record。
## Sprint 9 — 孩子學習紀錄

- 將 `/parent` 改為姐姐與妹妹的學習紀錄入口，移除非實際 Learning Record 的靜態今日任務內容。
- 新增共用家長端元件，僅在掛載後安全讀取既有 localStorage Learning Record。
- 新增純顯示資料層：學生隔離題庫映射、答案文字轉換、完成時間格式化、最新優先排序與作答狀態分類。
- 姐姐與妹妹摘要只顯示紀錄總數、最近一次完成時間；各自列表提供空白狀態與人類可讀的完成紀錄。
- 題目遺失時顯示「這題已不在目前題庫」和次要題目 ID，不中斷整頁。
- 完成 Node tests、lint、TypeScript 與 production build 驗證。

## Sprint 8 — 妹妹國語與共用學習流程

- 新增妹妹國語 3 題測試題庫，題目 ID 固定為 `meimei-chinese-1` 至 `meimei-chinese-3`。
- 新增 `ChineseQuestionFlow`，集中處理題目切換、完成畫面與 Learning Record 儲存。
- 姐姐國語改用共用流程，保留粉色主題與 `student: 'jiejie'` 紀錄。
- 新增 `/meimei/chinese`，使用綠色主題、妹妹題庫與 `student: 'meimei'` 紀錄。
- 妹妹首頁的國語複習已連至 `/meimei/chinese`。
- 驗證 Learning Record、lint、TypeScript、production build 與姐姐／妹妹國語路由。

## Sprint 7 — Learning Record

- 新增共用 Learning Record 型別與 localStorage 讀寫功能。
- 姐姐國語會在每題答對完成時保存第一次答案、最終答案與作答次數。
- 保留原本答錯提示、下一題、完成畫面與回姐姐首頁流程。

---

## Sprint 6

完成內容：

- 建立姐姐國語 Question Engine。
- 題目改由 `lib/questions/jiejie-chinese.ts` 集中管理。
- 題目與畫面分離，頁面只負責學習流程與呈現。
- 保持原有答題、判斷、鼓勵、解釋與下一題流程。
- 抽離共用題目 UI 至 `components/question/`，供後續同類學習流程使用。
- 妹妹國語 Question Engine 尚未建立，保留為待辦。

---

## Sprint 5

完成內容：

- 將姐姐國語題目抽離為獨立題庫。
- 新增 data/chinese/grade6.ts。
- page.tsx 改由匯入 questions 題庫。
- UI 與學習流程保持不變。
- 完成題庫模組化。

---

## Sprint 4

完成內容：

- 完成第二題後的完成畫面。
- 建立返回姐姐首頁流程。

---

## Sprint 1：基礎產品骨架

已完成：

- 建立 Project Seed 首頁，說明「每天 10～15 分鐘，真正理解，而不是死背」。
- 建立 `/jiejie`、`/meimei`、`/parent` 路由。
- 建立姐姐粉紅、妹妹綠色、家長灰色的模式頁面。
- 在首頁加入三個模式入口。
- 修復姐姐頁 React 預設匯出與 UTF-8 中文顯示問題。

## Sprint 2：姐姐國語練習

已完成：

- 建立 `/jiejie/chinese` 國語練習頁。
- 在姐姐模式中，將「國語複習」連到國語練習頁。
- 建立「蕉」字注音選擇題與「我會／我不會」按鈕。
- 驗證新增路由回傳 HTTP 200，並通過 TypeScript 型別檢查。

## Sprint 3

完成基本答題流程：

- 選擇答案
- 判斷正確錯誤
- 正確鼓勵
- 錯誤提示
- 多題切換
- 答錯後需重新理解，不能直接進入下一題
