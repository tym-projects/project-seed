# Sprint 36 平時練習題庫擴充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Human 核准候選內容後，批量補足八科平時練習的教材概念覆蓋。

**Architecture:** 沿用現有八個題庫模組與 Question schema；先由純資料驗證測試鎖定候選題品質，再分科加入 singleton 或經審核的 variation。選題、複習、紀錄及 allowlist 不改動。

**Tech Stack:** TypeScript 題庫、Node focused tests、Next.js、disposable Playwright／Chromium、synthetic storage。

**Spec:** `docs/superpowers/specs/2026-09-29-sprint-36-practice-expansion-design.md`

## Scope Decision Implementation Addendum

- Current source baseline before this change: 102 questions, 97 learning units, and 89 monthly-allowlist entries.
- 姐姐 active practice is now explicitly 8 Chinese, 13 Mathematics, 12 Natural Science, and 10 Social Studies questions (43 total). The full question arrays remain available for historical Learning Record display.
- Excluded from new 姐姐 practice/review/reinforcement selection: `jiejie-chinese-2`, `jiejie-chinese-4`, `jiejie-mathematics-5`, `jiejie-mathematics-6`, `jiejie-social-studies-1`, and `jiejie-social-studies-2`. 姐姐 Chinese uncertain IDs `-1`, `-3`, `-5`–`-9` are also inactive.
- Only `jiejie-social-studies-1` and `-2` were removed from the monthly allowlist; the total is now 87 and no other allowlist was changed.
- This remains Sprint 36 Implementation complete / Awaiting Human Review; no commit or push is authorized in this stage.
- Verification evidence: scope focused 3/3, full Node 206/206, isolated production build passed, Browser regression 45/45, lint, TypeScript `--incremental false`, and `git diff --check` passed. Isolated LAN review server is `http://192.168.22.208:3101`; formal 3100 was kept running.

## Global Constraints

- 僅在 `C:\Users\admin\Documents\2026AST-dev` 工作。
- 本階段不得擴充第一次月考範圍，也不得未審核即加入正式題庫。
- 不修改 Learning Record／ReviewSession schema、storage keys、backup／restore 或既有學習規則。
- 不使用 runtime option shuffle；answerIndex 固定。
- 不把教材待核對題目計入可入庫數。

## Review Focus

- lesson-level 證據不足：每題需標示來源與 pending-review 狀態，測試禁止未核對題目入庫。
- 題目實質重複：逐題比對 topic、細部 concept、選項與解析，避免以換數字冒充新 unit。
- 學生／科目混用：題庫及 Browser 流程需驗證八個組合的隔離。
- 答案位置偏斜：固定選項後以合理門檻檢查，不要求機械平均。
- 題量增加後的流程穩定性：確認 shuffle、Today Review、再練一次、Learning Record 與平板版面不變。

## 預定任務（Ready／Revised Candidate Review 通過後）

### Task 1: 教材證據與候選題審核

**Files:**
- Read: `docs/sprint36-practice-coverage-matrix.md`
- Create/Modify: Sprint 36 candidate-question review document

- [ ] 逐科確認 32–48 題候選容量與優先順序。
- [ ] 為每題寫出原創題幹、四選項、唯一正解、Hint、Explanation、來源與風險。
- [ ] 將教材或答案疑義標為 `pending-review`，不進正式題庫。

### Task 2: 題庫 validation RED → GREEN

**Files:**
- Test: existing question-bank validation test location
- Modify: only approved focused validation expectations

- [ ] 先加入 questionId、metadata、唯一正解、答案索引、Hint／Explanation 與 answer-position 的 failing cases。
- [ ] 執行 focused tests，確認失敗原因只對應核准候選題。
- [ ] 實作後確認所有核准候選題通過，未核准／pending 題不被載入。

### Task 3: 分科批量入庫

**Files:**
- Modify: only the eight approved `lib/questions/*.ts` files
- Modify: only approved monthly/practice metadata if explicitly authorized

- [ ] 以現有命名慣例建立唯一 questionId。
- [ ] 新觀念使用 singleton；variation 只有在相同 learning unit 且相容性已核准時使用。
- [ ] 不修改既有題目、既有 ID、既有 reviewGroupId 或正式學習資料。

### Task 4: Regression and tablet verification

**Files:**
- Test: existing Node and Browser harnesses

- [ ] 執行 focused tests、`npm test`、`npm run lint`、`npx tsc --noEmit --incremental false`、`npm run build`、`npm run test:browser`、`git diff --check`。
- [ ] 用 synthetic storage 驗證八科練習、Learning Record questionId、Today Review、再練一次、Parent Summary 及資料隔離。
- [ ] 覆蓋 768×1024 與 1024×768，確認無水平溢出與操作遮擋。
- [ ] 以隔離 build／port 啟動測試服務，取得當次 LAN URL 後才交 Human 平板抽樣驗收。

### Task 5: 文件與收尾

**Files:**
- Modify: `PROJECT_STATUS.md`, `docs/roadmap.md`, `docs/sprint-log.md`, Sprint 36 design/plan

- [ ] 記錄實際新增題數、learning units、pending-review、測試結果與平板抽樣結果。
- [ ] Human Final Approval 前不得 commit／push；通過後才依核准範圍收尾。
