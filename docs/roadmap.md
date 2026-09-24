# Project Seed Roadmap

## Sprint 30 — First natural and social question expansion

- **Status:** Completed.
- Added six original singleton questions within the approved first-month-exam scope: two for 姐姐自然, two for 姐姐社會, and two for 妹妹社會.
- No existing question, review group, schema, storage key, learning rule, or other subject bank was changed. 姐姐小數除法估算、妹妹國語、妹妹自然及後續科目擴充 remain backlog or pending教材核對.
- Design／Plan: `docs/superpowers/specs/2026-09-24-sprint-30-first-batch-question-expansion-design.md`, `docs/superpowers/plans/2026-09-24-sprint-30-first-batch-question-expansion.md`.
- Verification: focused question 3/3, focused Browser 1/1, Node 173/173, Browser 36/36, lint, TypeScript `--incremental false`, build, existing tablet viewport coverage, and `git diff --check` passed. Human tablet acceptance and 妹妹社會親屬稱謂 supplementary check passed; the LAN test server was stopped before final build.
- Implementation commit: `fb49b4e` Complete Sprint 30 first exam question expansion; pushed to `origin/main`.
- Backlog: 姐姐自然第 2 單元教材細節、姐姐社會第 2 單元其他觀念、妹妹國語第 1–6 課、姐姐國語／妹妹自然月考範圍，以及姐姐小數除法估算題教材確認。

## Sprint 29 — First-practice random order

- **Status:** Completed.
- First-practice flows for both students and all four subjects now shuffle a copied question list once after hydration and keep that order stable during the flow.
- Chinese variation questions remain individual entries with their existing `reviewGroupId`. Today Review and 再練一次 were not shuffled and retain their existing selection semantics.
- No storage state, schema, question content, cross-session avoidance, or unfinished-progress resumption was added.
- Diagnosis: pre-fix Browser diagnostic reproduced React hydration error `#418` because SSR and client each shuffled in the state initializer. The fix uses a stable initial render plus one guarded post-hydration shuffle; review/reinforcement and data semantics are unchanged.
- Verification: focused unit 8/8, Sprint 29 Browser 3/3, Node 170/170, full Browser 35/35, lint, TypeScript `--incremental false`, build, and `git diff --check` passed. Existing tablet viewport checks at 768×1024 and 1024×768 passed.
- Human 修復後實際平板驗收 6/6 通過；768×1024／1024×768 自動化驗證亦通過。
- Implementation commit: `bf46eb4` Complete Sprint 29 practice question randomization; pushed to `origin/main`.
- **Next Step:** 規劃下一批第一次月考題庫擴充；跨次避重與進度接續尚未實作。

## Sprint 28 — First mathematics question expansion

- **Status:** Completed.
- Added the seven approved original mathematics questions: 姐姐 3 題（第 1、2、4 單元） and 妹妹 4 題（第 1–4 單元）. The actual inventory is 56 questions and 51 learning units.
- All seven additions are singleton units without `reviewGroupId`; existing questions, selection, review, schemas, storage keys, and learning semantics remain unchanged. 姐姐第 3 單元小數除法估算題 remains deferred pending教材 confirmation.
- Human actual tablet acceptance: 6/6 passed. Focused 5/5, Node 167/167, Browser 32/32, lint, TypeScript `--incremental false`, build, and `git diff --check` passed.
- Implementation commit: `742cfc7` Complete Sprint 28 first mathematics question expansion; pushed to `origin/main`.
- **Next Step:** 規劃題目隨機順序的最小安全方案；不在本 Sprint 實作。

## Sprint 27 — Website home navigation

- **Status:** Completed.
- Added one shared high-contrast 「返回網站首頁」入口 to 姐姐學習、妹妹學習及家長模式 pages; all target the existing `/` route.
- Preserved Sprint 26 student-home return controls and all learning/data semantics. No schema, storage-key, question-bank, or review-rule changes.
- Focused Browser verification: 3/3 passed; full Node 165/165 and Browser 32/32 passed; lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed. Tablet viewport checks passed at 768×1024 and 1024×768.
- Human actual tablet acceptance: 5/5 passed.
- **Implementation commit:** `9cf33de` Complete Sprint 27 site home navigation; pushed to `origin/main`.
- **Next Step:** Sprint 28 規劃；Sprint 28 implementation has not started.

## Sprint 26 — LAN Learning Record fallback and return navigation

- **Status:** Completed.
- Fixed HTTP LAN Learning Record ID creation by preferring native `crypto.randomUUID` and falling back to UUID v4 from `crypto.getRandomValues`; no unreliable fallback is used when secure random APIs are unavailable.
- Unified two-student／four-subject return labels and moved start-page return links near the title. Replaced the browser-native leave confirmation with a shared high-contrast touch-friendly in-page dialog; Continue／Escape preserve state and Confirm returns to the current student's home. Learning semantics remain unchanged.
- Verification: focused Node 4/4, focused Browser 5/5, full Node 165/165, full Browser 29/29, lint, TypeScript with `--incremental false`, build, and diff-check passed.
- Verification: focused Browser 5/5 additionally covers dialog focus／ARIA／Escape, cancellation, confirmation, incomplete-record protection, and 768×1024／1024×768 viewports.
- Human completed all six post-fix tablet checks successfully. No schema/storage-key changes, question-bank expansion, or new learning features were added.
- **Implementation commit:** `0a0646e` Complete Sprint 26 LAN record and tablet navigation fixes; pushed to `origin/main`.
- **Next Step:** Sprint 27 網站總首頁導覽改善規劃. Backlog: 姐姐學習、妹妹學習及家長模式頁面均提供清楚的「返回網站首頁」入口；尚未實作。

## Sprint 25 — Return controls and parent center integration

- **Status:** Completed.
- Added shared return-home controls across both students' four-subject first practice, Today Review, and 再練一次 flows. Unfinished selected answers require a short leave confirmation; cancel preserves the current state, and no unfinished answer becomes a completed record.
- `/parent` remains the single parent entry and now switches one student and one subject at a time, preserving existing summary calculations and student+subject-isolated review-time settings.
- No question bank expansion, persisted schema change, storage-key change, or core learning-semantic change.
- Verification recorded: focused flow 2/2, Sprint 25 Browser 4/4, affected Sprint 20–23 Browser regression 13/13, full Node 161/161, and full disposable Chromium Browser 28/28; lint, TypeScript with `--incremental false`, production build, and `git diff --check` passed. Tablet simulations cover 768×1024 portrait and 1024×768 landscape; the Human's actual tablet trial was normal.
- Final Human Review 已核准；implementation commit `8f8a7c0` 已推送至 `origin/main`，結案文件已同步。新版返回與家長中心仍待實際平板複驗，之後進入 Sprint 26 規劃。

## Sprint 24 — Four-subject home navigation

- **Status:** Completed.
- Fixed the P1 home-navigation gap by giving 姐姐 and 妹妹 each 12 explicit links: four subjects × 練習、今日複習、再練一次; 24 links total.
- Reused existing student／subject-specific routes through one shared typed navigation configuration. No question bank, schema, storage key, or core learning-semantic changes were made.
- Verification: Sprint 24 focused navigation tests 2/2; npm tests 159/159; lint; TypeScript with `--incremental false`; production build; `git diff --check`; and 24/24 disposable Chromium Browser tests passed. Basic 390px mobile viewport checks passed; real-device and child trials remain pending.
- **Implementation commit:** `05284fa` Complete Sprint 24 four-subject home navigation; pushed to `origin/main`.
- **Known limitation:** 390px viewport is basic layout verification only; real-device and child usability trials remain pending. The final Build and Browser smoke required cleanup of only confirmed generated artifacts after EPERM errors, then passed.
- **Next Step:** Sprint 25 規劃，以真實使用回饋及已知限制為依據。

## Sprint 23 — Natural and Social Implementation

- **Status:** Completed.
- Added 16 Human-approved original multiple-choice questions across four scopes: 姐姐康軒六上自然／社會第 1–2 單元、妹妹南一三上自然與康軒三上社會第 1–2 單元；each scope has four questions and four independent learning units.
- Added `natural_science` and `social_studies` through the existing shared QuestionCard／Question Flow, first practice, Today Review, 1/3/7, retry, reinforcement no-write, review settings, Learning Record display, and Parent Summary wiring.
- Preserved Learning Record／ReviewSession schemas and keys, student／subject isolation, singleton confirmation eligibility, practice no-write, timer／`startedAt`, and Parent Summary semantics.
- Verification: 159/159 Node tests, lint, TypeScript with `--incremental false`, production build, `git diff --check`, and 21/21 disposable Chromium Browser tests passed.
- Out of scope: units 3–6, additional Chinese／Mathematics questions, unapproved content, AI/difficulty scoring, schema changes, textbook management, and expansion beyond the approved units.
- **Implementation commit:** `1264d1b` Complete Sprint 23 natural and social studies foundation; pushed to `origin/main`.
- **Next Step:** Sprint 24 規劃。

## Sprint 22 — Mathematics Implementation

- **Status:** Completed.
- Added six Mathematics learning units and six original multiple-choice questions for each approved student scope: 姐姐國小六年級上學期南一版第 1–6 單元、妹妹國小三年級上學期南一上第 1–6 單元.
- Added Mathematics first-practice, Today Review, reinforcement-practice, review-time settings, and Parent Summary wiring through the existing shared flows.
- Preserved Learning Record／ReviewSession schemas and keys, student／subject isolation, 1/3/7, retry, singleton confirmation eligibility, practice no-write, timer／`startedAt`, and Parent Summary semantics.
- Verification: 147/147 Node tests, lint, TypeScript with `--incremental false`, production build, `git diff --check`, and 16/16 disposable Chromium browser tests passed.
- Out of scope: additional questions or variations, AI/difficulty scoring, numeric input, graphic interaction, textbook management, and Social Studies／Science implementation.

## Sprint 21 — Question Bank Quality and Understanding Feedback v2

- **Status:** Completed.
- Updated only 妹妹 `meimei-chinese-1`, `-4`, `-2`, and `-5` with the approved Hint／Explanation copy, including the corrected `-5` Explanation.
- Added only `meimei-chinese-action-word-identification-3` V1A「寫」to the existing action-word review group. The rejected V1「收進」and any highxing variation were not added.
- Preserved Question／Learning Record／ReviewSession schemas, `reviewGroupId ?? question.id`, deterministic selection, recent-question avoidance, 1/3/7, retry, Sprint 18 confirmation, Sprint 19 no-write practice, Sprint 20 Parent Summary v2, Sprint 17 timer／`startedAt`, daily five-group limit, and student/subject isolation.
- Verification: 139/139 Node tests, lint, TypeScript, production build, and `git diff --check` passed; isolated Browser smoke passed 10/10 using disposable Chromium contexts and synthetic storage only. The exact `npx tsc --noEmit` cache write was blocked by workspace EPERM, so the equivalent no-emission check used `--incremental false`.
- Implementation commit: `9630477` Complete Sprint 21 question bank quality and feedback v2; pushed to `origin/main`.
- **Next Step:** Sprint 22 mathematics planning. Chinese expansion pauses after this first quality batch; social studies and science remain later directions. No quantity, grade-version, or schema commitment is made yet.

## Sprint 20 — Parent Learning Summary v2 and Isolated Browser Smoke

- **Status:** Completed.
- Added a reusable `@playwright/test` + Chromium harness using disposable contexts, synthetic whitelisted storage, ignored artifacts, and a separate `npm run test:browser` command.
- Completed isolated Browser smoke for Sprint 18 primary → confirmation/reopen/timer behavior, Sprint 19 practice/no-write/isolation, and Sprint 20 parent summary UI.
- Extended the read-only parent summary with completed answer-record counts, distinct learning-group counts, first-try rate, retry-bearing record counts, recurring cross-date retry groups capped at three, all-group due overview, and pending confirmation separated from normal due items.
- Preserved Learning Record／ReviewSession schemas, Sprint 17 timer／`startedAt`, Sprint 18 confirmation, Sprint 19 no-write practice, and Today Review’s five-group selection limit.
- Verification: 136/136 Node tests and 9/9 Browser smoke tests passed; lint, TypeScript, production build, and `git diff --check` passed.
- Dependency security follow-up: upgraded Next.js and compatible lint/tooling transitive chains; final `npm audit` reports 0 vulnerabilities across production and dev dependencies. No product/data semantics changed.
- Implementation commit: `5382aed` Complete Sprint 20 parent summary v2 and isolated browser smoke; pushed to `origin/main`.
- Browser smoke remains a separate `npm run test:browser` command and is not a mandatory `npm test`/CI gate. Next Step: 等待 Sprint 21 規劃。

## Sprint 19 — Wrong Question Practice v1 Completed

- Added deterministic reinforcement candidate selection using `reviewGroupId ?? question.id`, prior seven local calendar days, recent retry signals, due/today/pending-confirmation exclusions, and a three-group cap.
- Added independent 姐姐／妹妹「再練一次」entries and routes, reusing the existing QuestionCard flow, hints, explanations, retry behavior, and primary-only progression.
- Practice mode does not write Learning Records, create ReviewSessions, add permanent storage, affect 1/3/7, change Sprint 18 confirmation, alter parent summary, or affect Sprint 17 timer／`startedAt`.
- Verification: 131/131 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser smoke was not manually run because safe isolated localStorage setup was unavailable; automated no-write, isolation, refresh-reset, scheduling, summary, flow, and timestamp tie-break tests cover the behavior.
- Implementation commit: `6b0b637` Complete Sprint 19 wrong question practice v1.
- Push status: pushed to `origin/main`; `main` synchronized with `origin/main`.
- Status: Completed. Next Step: 等待 Sprint 20 規劃。

## Sprint 18 — Understanding Confirmation v1 Completed

- Implemented due-review-only confirmation using a deterministic alternate variation within the same learning group.
- Eligibility requires at least two variations, one distinct historical completed variation, due state, and no record today. Legacy and single-variation questions keep the existing path.
- Primary and confirmation preserve their actual `questionId`; same-group same-day records still produce one 1/3/7 progression, and retry schedules the group for the next day.
- Refresh/reopen reconstructs pending confirmation from today’s primary-only record without adding Learning Record, ReviewSession, or permanent persistence state.
- Daily selection remains capped at five groups; Sprint 17 timer and `startedAt` semantics are unchanged.
- Verification: 115/115 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Browser smoke covered safe primary review, 妹妹 review, sister isolation, refresh/session timestamp reuse, and timer display; seeded primary → confirmation browser interaction remains pending safe isolated data setup and is covered by automated tests.
- Implementation commit: `5a672cb` Complete Sprint 18 understanding confirmation v1.
- Push status: pushed to `origin/main`; `main` synchronized with `origin/main`.
- Status: Completed. Next Step: 等待 Sprint 19 規劃。

## Sprint 17 Completed

- Parent Review Time Setting v1 provides independent 10／15-minute advisory Chinese review targets for 姐姐 and 妹妹, without changing Learning Records, review sessions, selection, scheduling, variation, parent summary, or hint semantics.
- Verification: 95/95 Node tests, ESLint, TypeScript, production build, and `git diff --check` passed. Isolated in-app browser smoke verified parent settings, sister isolation, refresh persistence, both review flows, and no console errors; controlled elapsed-time UI remains covered by automated timer/session tests.
- Canonical repository: `C:\Users\admin\Documents\2026AST-dev`. Implementation commit `ec1e018` and close documentation are synchronized with `origin/main`.

## Sprint 16 Completed

- Question Bank Expansion v1: 11 new approved independent learning units brought the total to 16, with active-topic coverage set by external configuration and legacy topics retained outside the active coverage gate.
- Next step: 等待 Sprint 18 規劃。

## Sprint 15 Completed

- Parent Learning Summary v1: separate student summaries for Today and Last 7 Days, current due learning units, and deterministic attention items.
- Backlog: completed session history, daily/weekly actual learning time, parent time statistics, charts, and AI parent insights.
- Next step: 等待 Sprint 16 規劃。

## Sprint 14 Completed

- Review Time Control v1: local-date isolated review sessions, elapsed-minute display, and non-blocking 10/15-minute reminders without altering Learning Records or review selection.
- Next step: 等待 Sprint 15 規劃.


> 此文件保存已決定但延後的功能與 backlog。即時 Sprint 狀態以 [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) 為準；已完成項目不列為未來工作。

## Backlog — 已決定但延後

### 複習與學習設計

- 3 天後再次確認，以及一次答對不等於真正理解的進階確認。
- 進階間隔複習（SM-2、更多週期或遺忘曲線）。
- AI 選題與難度演算法。
- 家長設定複習時間。
- 每日／每週實際學習時長分析。
- 家長模式時間統計。
- 錯題原因整理；不建立永久錯題狀態，除非未來需求與資料模型明確支持。
- 不新增 `recordSource` 等永久選題狀態；複習選題持續由 Learning Record 推導，直到未來需求明確改變此架構決策。

### 家長、教材與資料能力

- 家長分析圖表與理解度評分。
- 學校進度、教材版本、課表與段考排程整合。
- 教材管理。
- 資料庫與跨裝置資料保存。

### AI 與分析能力

- AI 教學引導。
- Learning Analytics：依累積學習資料分析理解狀況、弱點與個人化學習建議。

## Completed History

- **Sprint 12：** 完成 Learning Records 純推導的 Spaced Review v1（1／3／7 本地曆日規則）。

- **Sprint 1–6：** 網站基礎、姐姐國語學習流程、Question Bank、Question Engine 與共用題目 UI。
- **Sprint 7：** Learning Record。
- **Sprint 8：** 妹妹國語與共用學習流程。
- **Sprint 9：** 孩子學習紀錄頁面。
- **Sprint 10：** 今日複習選題與流程。
# Sprint 28 close note

- Sprint 28 first mathematics batch is Completed and pushed to `origin/main`.
- The batch contains seven implemented original mathematics questions: 3 for 姐姐南一六上 Units 1, 2, and 4, and 4 for 妹妹南一三上 Units 1–4. 姐姐 Unit 3 estimation remains excluded pending textbook confirmation.
- Deferred subjects still require textbook evidence before expansion. Random question ordering is backlog only and was not implemented.
# Sprint 31 — First natural question batch

- Added two Human-approved original 姐姐自然 questions within the confirmed first-month-exam Units 1–2: water-cycle sequence and water-solution uniformity.
- Both are singleton learning units without `reviewGroupId`; no existing question, answer, schema, storage key, selection rule, or review semantic changed.
- Actual inventory is 64 questions and 59 learning units. Codex did not directly access the original textbook screenshots, so page-by-page textbook verification is not claimed.
- Verification: focused 3/3, Node 176/176, Browser 36/36, lint, TypeScript `--incremental false`, build, and `git diff --check` passed. Existing disposable Browser and tablet viewport coverage remained green.
- Status: Completed after Human tablet acceptance 6/6. Implementation and close commit status are recorded in the close entry.
