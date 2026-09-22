# Sprint 24 四科首頁導覽 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正姐姐／妹妹首頁，使四科各自提供練習、今日複習、再練一次三個明確入口。

**Architecture:** 建立共用首頁導覽設定，兩個學生首頁以自身 student prefix 與主題色渲染。所有 targets 都指向現有路由，不改學習資料或流程引擎。

**Tech Stack:** Next.js App Router、React、TypeScript、Node `node:test`、Playwright disposable Chromium。

**Spec:** `docs/superpowers/specs/2026-09-22-sprint-24-navigation-design.md`

## Implementation Status — Completed

- Task 1 — completed: shared typed navigation configuration and focused RED→GREEN tests.
- Task 2 — completed: 姐姐／妹妹首頁各四科三入口，共 24 個明確 student／subject targets.
- Task 3 — completed: focused Browser smoke 3/3 passed; full Browser smoke 24/24 passed; basic 390px mobile viewport checks passed.
- Task 4 — completed: npm tests 159/159, lint, TypeScript with `--incremental false`, build, and `git diff --check` passed; project documents synchronized.
- No production question bank, persisted schema, storage key, or core learning semantics changed. Implementation commit: `05284fa`; pushed to `origin/main`.
- Final verification: focused navigation tests 2/2, npm tests 159/159, lint, TypeScript with `--incremental false`, production build, `git diff --check`, and Browser smoke 24/24 passed. Basic 390px viewport checks passed.
- Close note: initial Build `.next\\trace` and Browser `.last-run.json` EPERM errors were resolved by removing only the confirmed generated artifacts and rerunning the affected verification. Real-device and child usability trials remain pending.

## Global Constraints

- 僅修改首頁導覽、必要設定、focused tests、Browser smoke 與 Sprint 24 文件。
- 保留既有 24 個有效路由與 student／subject isolation。
- 不修改題庫、Learning Record／ReviewSession schema、storage keys 或核心學習語意。
- Browser 使用 disposable context、synthetic storage 與既有 whitelist；不接觸真實使用者資料。
- Final Human Approval 前不 commit、push、merge、rebase、tag 或 release。

## Review Focus

- 國語既有相對路徑仍維持 `/review` 與 `/reinforce`。
- 數學、自然、社會不得誤連到國語 review／reinforce。
- 姐姐與妹妹首頁的 link targets 必須完全相同，只差 student prefix。
- 手機尺寸下長名稱與操作連結不得造成水平溢出或不可見。

### Task 1: 建立導覽設定與 failing tests

**Files:**
- Create: `lib/navigation/subject-navigation.ts`
- Create: `lib/navigation/subject-navigation.test.mjs`

- [x] 寫 failing test：載入設定並要求四科各有 `practice`、`review`、`reinforce`，且 route suffix 與核准 Design 完全一致。
- [x] 執行 `node --test lib/navigation/subject-navigation.test.mjs`，確認 RED 後建立設定並通過。
- [x] 建立最小 typed 設定，僅保存 subject、label、practice／review／reinforce suffix。
- [x] 重跑 focused test，確認 GREEN。
- [x] 完成條件：設定是唯一首頁入口來源，無未核准路由。

### Task 2: 接線姐姐／妹妹首頁

**Files:**
- Modify: `app/jiejie/page.tsx`
- Modify: `app/meimei/page.tsx`
- Modify: `lib/navigation/subject-navigation.test.mjs`（必要的 student prefix rendering assertions）

- [x] 先擴充 failing test：對 `jiejie`、`meimei` 產生 12 個明確 targets，確認每一科三個 action 都指向正確 student prefix。
- [x] 執行 focused test，確認現有固定國語 review／reinforce 導覽不符合四科 targets。
- [x] 以共用設定渲染四個科目分組，每組顯示科目名稱與三個 link；保留既有首頁主題與回首頁行為。
- [x] 執行 focused Node test 與 TypeScript check。
- [x] 完成條件：兩個首頁各有 12 個明確入口，國語首次練習與既有 routes 不失效。

### Task 3: Browser smoke 與 mobile viewport 基本檢查

**Files:**
- Create: `tests/browser/sprint-24-navigation.spec.ts`

- [x] 先新增 Browser tests：桌面檢查兩個首頁各 12 個 href、四科首次練習 route、國語既有 route 與無 console error。
- [x] 執行 focused Browser test，在首頁固定國語 review／reinforce 版本上確認 RED。
- [x] 加入 mobile viewport cases，確認四科入口可見、可點擊、無水平 overflow、可垂直捲動；僅作基本版面驗證。
- [x] 修正後執行 `npm run test:browser -- tests/browser/sprint-24-navigation.spec.ts`，確認 GREEN。
- [x] 完成條件：24 個入口在 disposable desktop/mobile contexts 可定位且 route targets 正確。

### Task 4: Regression、文件同步與 Human Review handoff

**Files:**
- Modify: `PROJECT_STATUS.md`
- Modify: `docs/roadmap.md`
- Modify: `docs/sprint-log.md`
- Modify: this Plan

- [x] 執行 `npm test`、`npm run lint`、`npx tsc --noEmit --incremental false`、`npm run build`、`npm run test:browser`、`git diff --check`。
- [x] 記錄 Node／Browser／mobile viewport 實際結果、schema／storage 未變更與真實手機／孩子試用限制。
- [x] 將 Sprint 24 標為 `Completed` only after Final Human Approval, implementation commit, push, and clean-tree verification.
- [x] 完成條件：Final Human Approval、commit、push 與 close 文件同步完成，Git working tree 已確認乾淨。

## Final Verification Commands

```text
node --test lib/navigation/subject-navigation.test.mjs
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm run test:browser
git diff --check
```
