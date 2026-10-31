# Sprint 44 妹妹近期自然小考題庫：Correct Baseline Design

## Intent

以正確的 Sprint 42 完成基線為唯一 source of truth，保留既有妹妹自然 150 題，新增 36 題近期小考概念變化題，讓 Active Practice 擴充至 186 題；本 Sprint 完成後停在 Question Content Review Gate，不 deploy、不 merge、不 release。

## Baseline

- Correct baseline commit：`c4632889b87d4f11a8016a72253532b62ef3ca19`
- 妹妹自然 Active Practice：150 題
- 妹妹自然 max ID：`meimei-natural-science-150`
- 妹妹自然 Monthly allowlist：28 題
- Sprint 42 正式基線：8 subjects × 150 Active Practice

## Scope

- 新增 36 題 Active Practice。
- 「認識植物」Plant：18 題。
- 「空氣和水」Air/Water：18 題。
- 題型配置：basic 12 題、application 24 題。
- 正確答案位置分布：index `0/1/2/3 = 9/9/9/9`。

不包含新的學習流程、Learning Record、Review、Auth、MathVisual 或其他科目變更。

## Approaches

1. **獨立 additions module＋最小 integration（採用）**：把 36 題放在獨立 Sprint 44 additions module，由 `meimei-natural-science.ts` 沿用既有 additions 模式 append。變更面小，且容易驗證原 150 題未被改寫。
2. **直接追加主題庫主檔**：結構直觀，但會放大主檔 diff，降低 Sprint 內容與既有基線的隔離性。
3. **重建整個題庫模組**：不採用，因為會增加既有 150 題 semantic regression 風險，與本 Sprint 的保守移植目標不符。

## Architecture and ID allocation

- 新增獨立 `lib/questions/sprint44-question-additions.ts`。
- `lib/questions/meimei-natural-science.ts` 只新增最小 import／append integration，不重寫原有 150 題。
- 36 題重新配置為：
  - `meimei-natural-science-151`
  - …
  - `meimei-natural-science-186`
- 新題全部維持 Active Practice，不加入 Monthly allowlist。

## Content source and authoring boundary

內容來源為 Owner 於 2026-10-31 提供的近期三上自然小考。實作時只取概念與考法，重新設計為理解導向的原創變化題，不逐字複製學校考卷，也不保留學生個人資訊。

## Regression guarantees

完成實作後必須證明：

- 原 150 題的 question IDs、題目文字、options、answer、hint、explanation 均不變。
- 新 36 題 ID 唯一且不與 baseline 衝突。
- 其他 7 科題庫不變。
- Learning Record、Review、Auth、MathVisual 與既有學習規則不變。
- Monthly allowlist 維持原本 28 題，新增 36 題全部排除於 Monthly。

## Validation plan

實作階段將驗證：

- 36 題 ID unique，且 final Active Practice = `150 + 36 = 186`。
- Plant 18、Air/Water 18。
- basic/application = 12/24。
- answer index `0/1/2/3 = 9/9/9/9`。
- 每題 options 恰為 4 個且無重複。
- 每題 hint、explanation、encouragement 非空。
- 36 題 question text 無重複，並完成內容正確性與非逐字複製檢查。
- baseline 150 題完整保留且內容不變。
- Monthly allowlist before/after 均為 28 題且內容不變。
- focused tests、完整 tests、lint、TypeScript、Webpack build 與 `git diff --check`。

## Prevention rule

建立新 Sprint branch 時，除了驗證 `main` 與 `origin/main` 的 Git synchronization（例如 ahead/behind `0/0`），還必須驗證產品／資料 baseline 是否符合最近正式 Completed milestone。

本次教訓是：舊 `main` 即使與 `origin/main` 同步，妹妹自然仍只有 12 題，並不符合 Sprint 42 正式的 150 題產品資料基線。因此：

> Git synchronization ≠ Product baseline correctness。

## Review gate

本文件完成後停在：

**Sprint 44 — Design Review / Human Review Gate**

不得在設計核准前開始 36 題實作、integration、測試實作、commit 題庫或 deploy。
