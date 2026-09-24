# Sprint Log

## Sprint 28 — First mathematics question expansion

- **Status:** Completed.
- Added the seven Human-approved mathematics questions: 姐姐 `jiejie-mathematics-7`–`-9`; 妹妹 `meimei-mathematics-7`–`-10`.
- Final inventory: 56 questions and 51 learning units. Each addition is a singleton without `reviewGroupId`; no variation, schema, storage-key, selection, review, or learning-semantic changes were made.
- 姐姐第 3 單元 `6.3 ÷ 0.8` estimation remains deferred pending textbook confirmation. No other subject or unapproved question was added.
- Human actual tablet acceptance: 6/6 passed. Focused 5/5, Node 167/167, Browser 32/32, lint, TypeScript `--incremental false`, build, and `git diff --check` passed with disposable Chromium and synthetic storage.
- **Implementation commit:** `742cfc7` Complete Sprint 28 first mathematics question expansion.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Next Step:** 規劃題目隨機順序的最小安全方案；尚未設計或實作。

## Sprint 27 — Website home navigation

- **Status:** Completed.
- Added shared high-contrast 「返回網站首頁」 links to `/jiejie`、`/meimei`、and `/parent`, targeting the existing `/` site home.
- Existing site-home mode links, Sprint 26 student-home returns, four-subject routes, parent switching, and all learning/data semantics remain unchanged.
- Focused Browser tests passed 3/3 using disposable Chromium contexts and synthetic storage; full Node 165/165 and Browser 32/32 passed; lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed. 768×1024 portrait and 1024×768 landscape checks passed.
- Human actual tablet acceptance: 5/5 passed.
- **Implementation commit:** `9cf33de` Complete Sprint 27 site home navigation.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Next Step:** Sprint 28 規劃。

## Sprint 26 — LAN Learning Record fallback and return navigation

- **Status:** Completed.
- Root cause confirmed: HTTP LAN browsers may lack `crypto.randomUUID`, and the previous Learning Record creation path failed before saving. Added a shared cryptographic UUID v4 fallback through `crypto.getRandomValues`; if both APIs are unavailable, the UI reports that the record was not saved.
- Unified all return labels as 「返回姐姐首頁／返回妹妹首頁」 and placed start-page links near the title. Replaced the native confirmation with a shared high-contrast touch-friendly in-page dialog; Continue／Escape preserve the current state and Confirm returns to the current student's home. Review、practice、storage schema、storage keys and no-write semantics remain unchanged.
- Verification: focused Node ID tests 4/4, focused Browser smoke 5/5, full Node 165/165, full disposable Chromium Browser smoke 29/29, lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed using synthetic storage only. Browser coverage includes dialog focus／ARIA／Escape, incomplete-record protection, parent readback, and 768×1024／1024×768 viewports.
- Human completed all six post-fix tablet checks successfully. No question bank, real learning data, or OneDrive backup was changed.
- **Implementation commit:** `0a0646e` Complete Sprint 26 LAN record and tablet navigation fixes.
- **Push Status:** Pushed to `origin/main`; local `main` is synchronized.
- **Next Step:** Sprint 27 網站總首頁導覽改善規劃. Backlog: 姐姐學習、妹妹學習及家長模式頁面提供清楚的「返回網站首頁」入口；尚未實作。

## Sprint 25 — Return controls and parent center integration

- **Status:** Completed.
- Human tablet trial reported the four-subject flows and existing Parent Summary／review-time settings normal. Implemented the approved follow-ups: shared return-home controls for practice, Today Review, and 再練一次; unfinished-answer leave confirmation; and a compact `/parent` student／subject selector that displays one isolated summary/settings panel at a time.
- Completed records remain intact; unfinished answers do not create completion records; practice remains no-write. Learning Record／ReviewSession schemas, storage keys, 1/3/7, retry, confirmation, timer／`startedAt`, and Parent Summary metric semantics are unchanged.
- Focused verification passed 2/2 flow tests, Sprint 25 Browser smoke 4/4, and affected Sprint 20–23 Browser regression 13/13 using disposable contexts and synthetic storage. Full Node tests passed 161/161 and full disposable Chromium Browser smoke passed 28/28; lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed. Portrait 768×1024 and landscape 1024×768 checks passed.
- No question bank or OneDrive backup changes. Final Verification passed; implementation commit `8f8a7c0` 已推送至 `origin/main`，結案文件已同步，working tree 已確認 clean。
- **Next Step:** 安排新版返回與家長中心的實際平板複驗，再進入 Sprint 26 規劃。

## Sprint 24 — Four-subject home navigation

- **Status:** Completed.
- Corrected the home P1 navigation gap: 姐姐 and 妹妹 each have explicit 練習、今日複習、再練一次 entries for 國語、數學、自然、社會, for 24 total links. Each target carries the intended student and subject through the existing routes.
- Added a shared navigation configuration and focused Node/Browser coverage only; no question bank expansion or changes to Learning Record／ReviewSession, storage keys, 1/3/7, retry, confirmation, practice no-write, timer, or Parent Summary semantics.
- Verification: focused navigation tests 2/2, npm tests 159/159, lint, TypeScript with `--incremental false`, production build, `git diff --check`, and full disposable Chromium Browser smoke 24/24 passed. Basic mobile viewport smoke passed; real mobile and child usability remain to be confirmed.
- Implementation commit: `05284fa` Complete Sprint 24 four-subject home navigation; pushed to `origin/main`.
- Final Build initially encountered `.next\\trace` EPERM and Browser smoke encountered a Playwright `.last-run.json` artifact EPERM; only those confirmed generated artifacts were removed before successful reruns. **Next Step:** Sprint 25 規劃，以真實使用回饋及已知限制為依據。

## Sprint 23 — Natural and Social Implementation

- **Status:** Completed.
- Added four approved banks and routes: 姐姐自然／社會、妹妹自然／社會；16 original questions and 16 independent learning units covering only the approved first two units in each scope. No variation or `reviewGroupId` was added.
- Reused the Sprint 22 multi-subject architecture for first practice, Hint／Explanation／retry, Learning Record, Today Review, 1/3/7, singleton confirmation protection, reinforcement no-write, ReviewSession, review settings, timer／`startedAt`, and Parent Summary.
- Verified student／subject isolation, legacy Chinese／Mathematics compatibility, unchanged Learning Record／ReviewSession schemas and storage keys, and no real user storage access.
- Verification: 159/159 Node tests; 21/21 disposable Chromium Browser smoke tests; lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed.
- Known limitation: content is original practice content based on Human-provided unit titles, not an official textbook question bank or complete textbook audit; units 3–6 remain out of scope.
- Implementation commit: `1264d1b` Complete Sprint 23 natural and social studies foundation; pushed to `origin/main`.
- **Next Step:** Sprint 24 規劃。

## Sprint 21 — Question Bank Quality and Understanding Feedback v2

- **Status:** Completed.
- Updated the four approved 妹妹 questions `meimei-chinese-1`, `-4`, `-2`, and `-5` with the approved Hint／Explanation copy; added only V1A `meimei-chinese-action-word-identification-3`「寫」to the existing action-word group.
- No other Chinese content was added. The rejected V1「收進」was not used, and the highxing learning unit remains unchanged.
- Regression protection confirms question identity, review-group aggregation, deterministic variation/confirmation, recent-question avoidance, Learning Record／ReviewSession compatibility, 1/3/7, retry, Sprint 19 no-write practice, Sprint 20 Parent Summary v2, timer, and student/subject isolation.
- Verification: 139/139 Node tests; lint, TypeScript, production build, and `git diff --check` passed. Isolated Browser smoke passed 10/10 with disposable Chromium contexts and synthetic storage only. TypeScript used `--incremental false` because the exact command could not update the ignored cache under the workspace permission boundary.
- Implementation commit: `9630477` Complete Sprint 21 question bank quality and feedback v2. Pushed to `origin/main`.
- **Next Step:** Sprint 22 數學規劃；國語擴充暫停，社會、自然保留後續。

## Sprint 20 — Parent Learning Summary v2 and Dependency Security Close

- **Status:** Completed.
- Added the isolated Playwright/Chromium Browser smoke harness and completed Sprint 18／19 UI補驗 plus Sprint 20 Parent Summary v2 smoke using disposable contexts and synthetic storage only.
- Final verification: `npm audit` 0 vulnerabilities; Node tests 136/136; Browser smoke 9/9; lint, TypeScript, production build, and `git diff --check` passed.
- Dependency security updates: `next`／`eslint-config-next` 16.3.5, `@eslint/eslintrc` 3.3.7, `typescript-eslint` 8.70.0, `nanoid` 3.3.18, `brace-expansion` 1.1.18; no force override or audit fix force was used.
- Learning Record／ReviewSession schemas, Parent Summary v2 semantics, Sprint 18／19 behavior, 1/3/7, retry, confirmation, and timer semantics remain unchanged. Browser smoke remains a separate `npm run test:browser` command and is not a CI mandatory gate.
- `unrs-resolver` install script remains pending independent allowScripts review and was not auto-approved or executed.
- Implementation commit: `5382aed` Complete Sprint 20 parent summary v2 and isolated browser smoke. Pushed to `origin/main`; Next Step: 等待 Sprint 21 規劃。

## Sprint 19 — Wrong Question Practice v1

- Added deterministic reinforcement selection for the prior seven local calendar days. Learning units use `reviewGroupId ?? question.id`; recent retry signals are grouped, ranked deterministically, and capped at three groups. Today records, due groups, and Sprint 18 pending confirmation groups are excluded.
- Added independent `/jiejie/reinforce` and `/meimei/reinforce` entries and routes. The shared QuestionCard flow now has an explicit reinforcement mode that preserves hints, explanations, retry, next-question, and completion feedback without saving Learning Records.
- Reinforcement practice does not create or clear ReviewSessions, add storage keys, alter 1/3/7, trigger Sprint 18 confirmation, change parent summary, or affect Sprint 17 timer／`startedAt`. Refresh and interruption reset the unsaved UI state; same-day re-entry may recompute the same deterministic candidates.
- Verification: 131/131 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser smoke was not manually executed because available tooling could not create a disposable isolated localStorage profile/context; existing user localStorage was not touched. Automated tests cover no-write behavior, isolation, candidate boundaries, formal review protection, refresh semantics, timestamp tie-break determinism, and Sprint 13–18 regression.
- Implementation commit: `6b0b637` Complete Sprint 19 wrong question practice v1.
- Push status: pushed to `origin/main`; local `main` is synchronized with `origin/main`.
- Status: Completed. Next Step: 等待 Sprint 20 規劃。

## Sprint 18 — Understanding Confirmation v1

- Added due-review-only understanding confirmation for eligible variation groups. A group needs at least two variations, one distinct historical completed variation, due state, and no record today; the first eligible group in existing order receives at most one deterministic confirmation.
- Pending confirmation is derived from today’s primary-only record and the same group’s question IDs. Once primary plus confirmation both exist today, same-day group protection excludes the group. No third question chain, permanent pending state, Learning Record schema change, or ReviewSession schema change was added.
- Primary and confirmation each preserve the actual answered `questionId`; `reviewGroupId ?? question.id` remains the scheduling identity. Same-day primary plus confirmation advances 1/3/7 once; confirmation retry resets the group to next-day review.
- Added pure eligibility, deterministic alternate selection, review-plan, flow-transition, record-ID, scheduling, refresh, daily-cap, student/subject isolation, and Sprint 17 timer/session regression coverage.
- Verification: 115/115 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser smoke covered姐姐 primary review interaction, 妹妹 review, sister isolation, refresh/session timestamp reuse, timer display, and no observed console error in exercised flows. Seeded primary → confirmation and confirmation refresh were not manually run because safe isolated localStorage seeding was unavailable; automated tests cover those paths.
- Implementation commit: `5a672cb` Complete Sprint 18 understanding confirmation v1.
- Push status: pushed to `origin/main`; local `main` equals `origin/main`.
- Status: Completed. Next Step: 等待 Sprint 19 規劃。

## Sprint 17 — Parent Review Time Setting v1

- Added isolated `project-seed:review-settings:v1` storage for independent 姐姐／妹妹中文 10／15-minute advisory review targets.
- Unset settings preserve the Sprint 14 10-minute gentle and 15-minute completion reminders. A 10-minute target remains complete at and beyond 10 minutes; a 15-minute target remains gentle from 10–14 minutes and complete from 15 minutes.
- Setting changes do not modify Learning Records or active review-session `startedAt`; restored sessions use their original clock with the current target threshold.
- Verification: 95/95 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Isolated in-app browser smoke verified parent settings, sister isolation, refresh persistence, both review flows, and no console errors. Controlled elapsed-time UI was not manually waited for; automated timer/session tests cover those boundaries.
- Sprint Close completed after Final Human Review. Implementation commit: `ec1e018` Complete Sprint 17 parent review time setting. Close documentation is synchronized with `origin/main`.
- Canonical repository: `C:\Users\admin\Documents\2026AST-dev`; the OneDrive copy remains a migration safety backup only.

## Sprint 16 — Question Bank Expansion v1

- Completed 11 new independent learning units, for 16 independent learning units in total: 姐姐新增成語運用 2 題、錯別字辨識 3 題；妹妹新增詞語意思 2 題、動作詞辨識 2 題、量詞運用 2 題。
- Active coverage is 成語運用 2、錯別字辨識 3、詞語意思 3、動作詞辨識 3、量詞運用 3。注音辨識 1 與部首辨識 1 保留為 legacy / retained。
- Added and completed hint behavior. Active / legacy coverage uses external configuration with topic-specific overrides; the Question schema remains unchanged for this scope. Learning-unit identity remains `reviewGroupId ?? question.id`.
- Sprint 13–15 behavior and data semantics remain unchanged.
- Verification: 87/87 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser read-only smoke confirmed 姐姐國語、妹妹國語、`/jiejie/review`、`/meimei/review` load normally without console errors. To protect existing localStorage, no answers were submitted; per-question new-question UI and incorrect-answer hint interaction were not manually browser-verified, and are covered by automated tests.

## Sprint 15 — Parent Learning Summary v1

- Added pure local-calendar summaries for each student/subject: completed attempts, first-try correct count/rate, retry-bearing attempts, latest learning date, and due learning units.
- Learning units use reviewGroupId fallback to question.id; A/B variations dedupe while legacy questions retain question-ID fallback.
- Attention is deterministic: repeated retry requires two distinct recent retry-bearing records in one unit; due units completed today are not flagged.
- No Learning Record schema, review selection, spaced-review, variation, session/timer, or analytics storage changes.
- Verification: 71/71 Node tests, ESLint, TypeScript, production build, and diff check passed. Browser data-state smoke remains limited to safe read-only observation.

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
## Sprint 20 — Parent Learning Summary v2 and Isolated Browser Smoke (Implementation Record)

- **Status:** Completed.
- Workstream A added Playwright/Chromium configuration, separate `npm run test:browser`, explicit synthetic storage fixtures, disposable browser contexts, teardown, and ignored diagnostics. It does not use an existing Chrome/Edge profile or real localStorage.
- Sprint 18 smoke passed: primary → deterministic confirmation, actual question IDs, refresh/reopen pending confirmation, unchanged `startedAt`, and same-day progression protection.
- Sprint 19 smoke passed: 姐姐 practice entry, hint/explanation/retry/completion, no Learning Record／ReviewSession writes, and student/subject isolation.
- Workstream B extended the pure parent summary: valid local-day record windows, record versus learning-group counts, first-try rate, retry-bearing record count, recurring retry groups on at least two distinct local dates capped at three, all-group due overview beyond the five-group review cap, and pending confirmation separated from normal due items.
- Parent UI smoke passed for populated and empty synthetic data, both student sections, neutral no-data wording, recurring retry wording, due/pending separation, and console-error checks.
- **Verification:** 136/136 Node tests passed; Browser smoke 9/9 passed; lint, TypeScript, production build, and `git diff --check` passed.
- **Data safety:** No Learning Record／ReviewSession schema or storage-key changes; no permanent analytics/mastery/practice state; no 1/3/7, retry, Sprint 18 confirmation, or Sprint 17 timer changes; no real user data touched.
- **Known limitation:** Browser smoke is intentionally separate from `npm test` and CI enforcement. Dependency installation reported audit warnings; no automatic audit remediation was performed.
- **Next Step:** Sprint 21 規劃；Sprint 20 implementation、security follow-up、commit、push 與 close 均已完成。

## Sprint 20 Dependency Security Follow-up

- Updated `next`／`eslint-config-next` to `16.3.5`, `@eslint/eslintrc` to `3.3.7`, `typescript-eslint` to `8.70.0`, `nanoid` to `3.3.18`, and `brace-expansion` to `1.1.18` using compatible patch/non-major upgrades; no force override or `npm audit fix --force` was used.
- The original `next` Critical and `sharp`／`postcss`／`nanoid`／`brace-expansion`／`js-yaml` High findings are resolved. Final `npm audit`: 0 vulnerabilities.
- Compatibility verification: 136/136 Node tests, lint, TypeScript, production build, 9/9 isolated Browser smoke tests, and `git diff --check` passed.
- Learning Record／ReviewSession schemas, Parent Summary v2 semantics, Sprint 18/19 behavior, 1/3/7, retry, confirmation, and timer semantics remain unchanged.
- Status: Completed. Dependency security follow-up、Sprint 20 commit、push 與 Sprint Close 均已完成；Next Step: Sprint 21 規劃。
## Sprint 22 — Mathematics Implementation

- **Status:** Completed.
- **Content:** Added the approved original Mathematics banks `jiejie-mathematics-1`–`-6` and `meimei-mathematics-1`–`-6`, with exact metadata/content tests, independent answer checks, one learning unit per question, and no variation/review group.
- **Product:** Added Mathematics first practice, Today Review, 1/3/7 scheduling, retry, reinforcement no-write practice, review-time isolation, and Parent Summary isolation through shared existing engines.
- **Compatibility:** Existing Chinese routes and Sprint 18 confirmation, Sprint 19 practice, Sprint 20 summary, timer／`startedAt`, schemas, storage keys, and student／subject boundaries remain protected.
- **Verification:** Node 147/147, lint passed, TypeScript `--incremental false` passed, build passed, full browser smoke 16/16 passed in disposable Chromium with synthetic whitelisted storage, and `git diff --check` passed.
- **Content note:** The 12 questions are original practice content based on the Human-approved scope; they are not claimed to be official Nan-I textbook material.
- **Implementation commit:** `28af403` Complete Sprint 22 mathematics foundation; pushed to `origin/main`.
- **Next Step:** Sprint 23 規劃。
# Sprint 28 — Candidate question planning

- Human-provided first-month-exam ranges were recorded for 姐姐數學／自然／社會、妹妹國語／數學／社會. 姐姐國語與妹妹自然 remain unconfirmed.
- Existing banks were compared by question content and learning-unit identity. Existing mathematics questions are singleton units without `reviewGroupId`.
- Eight original mathematics candidates were drafted for Human review; they are not in production and no implementation plan has been started.
- Public curriculum references support unit-level planning only. Original textbook screenshots and detailed content review remain pending.

## Sprint 28 — First mathematics batch implementation

- Added seven Human-approved original mathematics questions: 姐姐 Units 1, 2, 4 (3 questions) and 妹妹 Units 1–4 (4 questions). All are singleton learning units without `reviewGroupId` or variation.
- 姐姐 Unit 3 decimal-division estimation remains excluded pending textbook confirmation. No Chinese, Natural Science, Social Studies, or additional Mathematics questions were added.
- Actual bank inventory: 56 questions and 51 learning units.
- Verification: Node 167/167, Browser 32/32, lint, TypeScript `--incremental false`, build, and `git diff --check` passed. Browser used disposable Chromium with synthetic storage.
- Sprint 28 status: Implementation complete / Awaiting Final Human Review. No commit or push in this phase.
