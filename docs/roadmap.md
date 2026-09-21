# Project Seed Roadmap

## Sprint 20 — Parent Learning Summary v2 and Isolated Browser Smoke

- **Status:** Implementation complete / Awaiting Final Human Review.
- Added a reusable `@playwright/test` + Chromium harness using disposable contexts, synthetic whitelisted storage, ignored artifacts, and a separate `npm run test:browser` command.
- Completed isolated Browser smoke for Sprint 18 primary → confirmation/reopen/timer behavior, Sprint 19 practice/no-write/isolation, and Sprint 20 parent summary UI.
- Extended the read-only parent summary with completed answer-record counts, distinct learning-group counts, first-try rate, retry-bearing record counts, recurring cross-date retry groups capped at three, all-group due overview, and pending confirmation separated from normal due items.
- Preserved Learning Record／ReviewSession schemas, Sprint 17 timer／`startedAt`, Sprint 18 confirmation, Sprint 19 no-write practice, and Today Review’s five-group selection limit.
- Verification: 136/136 Node tests and 9/9 Browser smoke tests passed; lint, TypeScript, production build, and `git diff --check` passed.
- Dependency security follow-up: upgraded Next.js and compatible lint/tooling transitive chains; final `npm audit` reports 0 vulnerabilities across production and dev dependencies. No product/data semantics changed.
- **Next Step:** Final Human Review；核准後再進行 commit／push／Sprint Close。

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
