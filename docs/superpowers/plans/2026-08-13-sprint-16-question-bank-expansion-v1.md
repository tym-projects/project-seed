# Sprint 16 — 題庫擴充 v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在人工核准 11 題完整內容後，將成語運用擴充至 2 個、其餘四個 active Chinese topics 各擴充至至少 3 個 independent learning units，同時保留姐姐注音辨識與部首辨識為可用的 legacy / retained topics。

**Architecture:** 題庫仍是既有兩個 TypeScript arrays；Learning Record、review identity 與 Sprint 10–15 邏輯不改。`question-bank-validation.ts` 以 `reviewGroupId ?? question.id` 計算 unit，並以外部 coverage configuration 表達 active topics 與門檻，不把 active／legacy 狀態加到 Question schema。

**Tech Stack:** Next.js 16、React 19、TypeScript、Node built-in test runner、ESLint。

## Global Constraints

- 只在 `C:\Users\yenmi\Documents\2026AST-dev` 的 `main` 工作；不得 push。
- Sprint 16 新增 11 個獨立 units：姐姐 5、妹妹 6；新增 basic 5、application 6。
- 姐姐既有注音辨識與部首辨識題目、ID、topic、Learning Records 與 review state 必須完全保留；不新增這兩個 topics 的 units，也不將它們納入 active-topic coverage gate。
- 新題採 Option A：每 unit 一題，全部省略 `reviewGroupId`。
- 不得建立 TODO 題目、placeholder、假選項、假答案或未經人工核准的 production content。
- `question`、`options`、`answer`、`hint`、`explanation`、`title`、`instruction`、`encouragement` 都必須隨完整核准物件提供；實作者不得補寫。
- 不新增 dependency、storage、database、analytics UI、題型或每題 active／legacy metadata。

## Fixed Sprint 16 allocation

| ID | student | topic | type | `reviewGroupId` |
| --- | --- | --- | --- | --- |
| `jiejie-chinese-5` | jiejie | 成語運用 | basic | omitted |
| `jiejie-chinese-6` | jiejie | 成語運用 | application | omitted |
| `jiejie-chinese-7` | jiejie | 錯別字辨識 | basic | omitted |
| `jiejie-chinese-8` | jiejie | 錯別字辨識 | basic | omitted |
| `jiejie-chinese-9` | jiejie | 錯別字辨識 | application | omitted |
| `meimei-chinese-6` | meimei | 詞語意思 | basic | omitted |
| `meimei-chinese-7` | meimei | 詞語意思 | application | omitted |
| `meimei-chinese-8` | meimei | 動作詞辨識 | application | omitted |
| `meimei-chinese-9` | meimei | 動作詞辨識 | application | omitted |
| `meimei-chinese-10` | meimei | 量詞運用 | application | omitted |
| `meimei-chinese-11` | meimei | 量詞運用 | application | omitted |

## Coverage configuration

```ts
{
  activeTopics: ['成語運用', '錯別字辨識', '詞語意思', '動作詞辨識', '量詞運用'],
  minimumUnitsPerActiveTopic: 3,
  minimumUnitsByActiveTopic: { 成語運用: 2 },
  minimumTotalUnits: 16,
}
```

注音辨識與部首辨識是 legacy / retained topics：它們的 units 必須仍能被 aggregation 計數與安全處理，但各一個 unit 不觸發 coverage failure。Coverage fixture 與 future acceptance test 都必須分別驗證 student isolation、variation dedupe 與 legacy 計數。

## Phase 1 — current working-tree scope

**Files:**

- Modify: `components/question/QuestionCard.tsx`, `components/question/QuestionResult.tsx`
- Create: `lib/questions/question-bank-validation.ts`, `lib/questions/question-bank-validation.test.mjs`
- Modify: this design and plan only

**Implemented behavior:** `hint?: string` 保持向後相容；只有送出錯誤答案後才顯示非空 hint。validation 驗證 ID、metadata、options、answer、explanation、required hint、reviewGroup consistency 與 unit identity。coverage validation 使用外部 configuration 驗證 active-topic 與總 unit 門檻；fixture 完全 test-only。

**Required Phase 1 verification:**

```powershell
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

## Human Approval Gate — mandatory stop

在 Phase 2 前，人工必須提供以上 11 個 ID 各一份完整、明確核准的物件。每份必須含 `id`、`topic`、`type`、`title`、`instruction`、`question`、`options`、`answer`、`hint`、`explanation`、`encouragement`，且省略 `reviewGroupId`。

若任一題缺少核准內容，停止在 Gate；不得建立 Phase 2 content tests、不得改動任一 production question bank、不得宣稱 Sprint 16 完成。

## Phase 2 — only after Gate

### Task 1: content locks and approved bank insertion

**Files:** `lib/questions/jiejie-chinese.ts`、`lib/questions/meimei-chinese.ts`、其既有 tests。

- [ ] 寫入 11 個完整核准物件的 failing explicit assertions；既有 legacy 題目必須不變。
- [ ] 執行 bank tests，確認新增 ID 尚不存在而失敗。
- [ ] 僅逐字加入核准物件；姐姐新增五題、妹妹新增六題，全部省略 `reviewGroupId`。
- [ ] 重跑 tests，確認既有內容、11 個新物件與 ID allocation 都符合核准內容。

### Task 2: Sprint 16 acceptance coverage

**Files:** Create `lib/questions/sprint-16-question-bank.test.mjs`.

- [ ] 載入兩個 production banks，使用 `validateQuestionBank`、`validateQuestionBankCoverage` 與上述 configuration。
- [ ] 斷言姐姐題庫長度 9、妹妹題庫長度 11、總 independent units 為 16。
- [ ] 斷言成語運用為 2、其餘四個 active topics 各為 3；注音辨識與部首辨識各仍為 1 且不產生 coverage error。
- [ ] 斷言 11 個 allocation IDs 的 topic/type、required hints、無 `reviewGroupId`、學生 ID prefix 與 isolation。
- [ ] 使用 synthetic shared-group fixture 證明 variation pair 只算一個 unit。

### Task 3: final verification and evidence-backed documentation

**Files:** 僅在完整驗證成功後才可修改 `PROJECT_STATUS.md`、`docs/roadmap.md`、`docs/sprint-log.md`。

- [ ] 依序執行 `npm test`、`npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check`。
- [ ] 僅在安全、非破壞 browser context 可用時驗證 hint、retry、completion、review 與 parent aggregation；否則如實標示未驗證。
- [ ] 文件只記錄實際通過證據；不得宣稱完整弱點診斷已準備完成。
- [ ] 只有使用者要求時才 commit；不得 push。

## Plan self-review checklist

- allocation 恰好 11 IDs：姐姐 5、妹妹 6；basic 5、application 6。
- 成語運用的 coverage 是 2、其餘四個 active topics 是 3；注音辨識與部首辨識是 retained legacy units 而非缺陷。
- Phase 1 fixtures 不含 production question content，也未被 production import。
- Human Approval Gate 需要 11 份完整核准物件，且阻止所有 Phase 2 題庫修改。
- 未引入 schema metadata、dependency、storage 或未核准內容。
