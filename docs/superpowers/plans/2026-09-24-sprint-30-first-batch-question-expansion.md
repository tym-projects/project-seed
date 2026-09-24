# Sprint 30 第一批原創評量題 Implementation Plan

## Goal

以現有 Question schema 與題庫載入方式，加入 Human 核准的 6 題自然／社會原創題；不改變既有學習資料或複習語意，完成後停在 Final Human Review Gate。

## Architecture

沿用三個既有 bank：`jiejie-natural-science`、`jiejie-social-studies`、`meimei-social-studies`。每題為獨立 singleton learning unit，不設定 `reviewGroupId`，不新增 variation；共用現有 Question Flow、Learning Record、Today Review、再練一次與 Parent Summary。

## Tech Stack

TypeScript question banks、Node test runner、Playwright disposable Chromium、synthetic localStorage、Next.js 現有建置與 lint/typecheck 流程。

## Spec

- 新增 IDs：`jiejie-natural-science-5`、`jiejie-natural-science-6`、`jiejie-social-studies-5`、`jiejie-social-studies-6`、`meimei-social-studies-5`、`meimei-social-studies-6`。
- 保留核准題幹、四選項、正解 index、Hint、Explanation；不加入姐姐小數除法估算題或其他科目題目。
- 6 題均須四個唯一選項、唯一合理正解、完整 metadata 與非空 Hint／Explanation。

## Global Constraints

- 不修改既有題目、答案、reviewGroup、schema、storage key、Learning Record／ReviewSession 或 1/3/7、retry、confirmation、practice、timer、Parent Summary 語意。
- 不清除、遷移或覆寫真實學習資料。
- 不 commit、push、merge、rebase、tag、release；不宣告 Completed。

## Review Focus

- 題目內容及教材適切性仍待 Human Final Review，Codex 不宣稱已直接核對先前對話原始截圖。
- 特別審核姐姐自然「衛星雲圖判讀限制」的教材深度與用語。

## Tasks

### Task 1 — 題庫 exact-match tests（RED → GREEN，完成）

- 修改／新增：`lib/questions/sprint-30-first-batch.test.mjs`。
- 先寫：6 題完整欄位、ID、answer index、唯一選項、非空 Hint／Explanation、singleton 與三個 bank 隔離測試。
- RED：在 production bank 尚未加入 6 題時執行 focused test，應因題目缺失而失敗。
- 完成條件：RED 原因限於核准題目尚未存在，沒有既有題目異常。

### Task 2 — 最小加入 6 題並 focused GREEN（完成）

- 修改：`lib/questions/jiejie-natural-science.ts`、`lib/questions/jiejie-social-studies.ts`、`lib/questions/meimei-social-studies.ts`。
- 實作：只附加核准的 6 題；每題新 singleton，不改既有題目。
- 驗證：`node --test lib/questions/sprint-30-first-batch.test.mjs`。
- 完成條件：exact-match、答案唯一性、metadata 與 student／subject isolation 通過。

### Task 3 — Browser smoke（完成）

- 新增：`tests/browser/sprint-30-first-batch.spec.ts`。
- 先驗證：三個實際首次練習入口可載入新增題目、選答與送出回饋，並無 console error；使用 synthetic storage、可控 RNG 與 disposable context。
- 完成條件：不觸碰真實 profile／localStorage，且不影響今日複習與再練一次。

### Task 4 — 完整回歸與文件同步（完成，Final Approval approved）

- 更新：本 Design／Plan、候選題規劃文件、`PROJECT_STATUS.md`、`docs/roadmap.md`、`docs/sprint-log.md`。
- 驗證：focused tests、`npm test`、lint、`npx tsc --noEmit --incremental false`、build、`npm run test:browser`、`git diff --check`。
- 實際結果：focused question 3/3、focused Browser 1/1、Node 173/173、Browser 36/36、lint、TypeScript `--incremental false`、build、既有 768×1024／1024×768 viewport coverage、`git diff --check` 通過。Build 僅清理已確認 `.next` 產物；Browser 因預設 3100 launcher stale conflict，使用 repo 外臨時設定於 3101 執行同一 harness。
- 完成條件：文件已記錄實際結果與 Human 平板驗收；等待 implementation commit、push 與 close 文件同步。
