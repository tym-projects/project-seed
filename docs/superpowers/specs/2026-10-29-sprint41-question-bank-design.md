# Sprint 41 題庫擴充設計

## 狀態

**Sprint 41 Design Review Gate**。本文件只定義設計與數量，不代表正式題目已實作；未經本文件審查通過，不開始題目內容、QA implementation、部署或題庫 commit。

## Intent

將姐姐與妹妹的四科 Active Practice 題數補到每科 100 題，維持第一次月考已確認範圍、原創優先、題型多樣與現有學習流程穩定，讓平時練習有足夠 coverage。

## Closed Count Audit

Audit 以 canonical repo 的八個 question-bank exports 及各科 `practiceQuestions`／`questions` 實際計算，未以聊天紀錄推估。

| 學生 | 科目 | Current Active Practice | Target | Gap / planned additions |
|---|---:|---:|---:|---:|
| 姐姐 | 國語 | 75 | 100 | 25 |
| 姐姐 | 數學 | 75 | 100 | 25 |
| 姐姐 | 自然 | 75 | 100 | 25 |
| 姐姐 | 社會 | 75 | 100 | 25 |
| 妹妹 | 國語 | 83 | 100 | 17 |
| 妹妹 | 數學 | 83 | 100 | 17 |
| 妹妹 | 自然 | 85 | 100 | 15 |
| 妹妹 | 社會 | 75 | 100 | 25 |
| **合計** | **8 科** | **626** | **800** | **174** |

Current total questions is 639 and current learning units is 634. The target is Active Practice total 800; therefore the arithmetic is `800 - 626 = 174`, not 99.

## Goals

- 八科 Active Practice final count exactly 100。
- 新增題全部位於已確認第一次月考範圍。
- 題目以 fully original 為預設；如參考公開教材或網路資料，只取概念並重新設計，不逐字重製未明確授權內容。
- 每題預設為 singleton learning unit；只有現有 schema 與內容明確需要時才使用 `reviewGroupId`。
- 每題完成 scope、unique answer、option equivalence、duplicate/near-duplicate、explanation consistency、hint leakage、grade level、answerIndex 與 learning-unit QA。
- 保留 Sprint 40 calibration evidence，不改寫其結果。

## Non-goals and hard exclusions

- 不修改 Question schema。
- 不修改 Learning Record、ReviewSession、Backup/Restore、retry、1/3/7、Auth、role authorization、storage migration 或 UI 架構。
- 不擴大第一次月考教材 scope。
- 不把所有新題自動加入 Monthly allowlist。
- 不部署、不改 Production、不建立新 Vercel project。

## Approach

沿用 Sprint 38–40 的 additions pattern：新增 `lib/questions/sprint41-question-additions.ts`，由八個既有 bank 檔案各自 merge 對應 student/subject array；新增 `sprint41-qa.test.mjs`、coverage audit、manifest 與 provenance 文件。這保持主題庫檔案的小變更面積、保留批次 provenance，並避免題庫資料重構。

## Coverage strategy

每科先建立 coverage matrix，再按缺口分配題型，避免只替換數字或人名。

- 國語：字詞、字音／字形、句型、句序、短文閱讀、文意與原因／推論；妹妹另維持既有月考校準題型邊界。
- 數學：概念、計算、生活應用、兩步驟、算式／錯誤辨識，並交替使用數量、時間、金錢、測量與圖形等已確認範圍情境。
- 自然：觀察、比較、實驗設計、因果、資料判讀；妹妹自然僅使用 Sprint 40 已確認的 `認識植物`／`空氣和水` 範圍，不加入動物或磁鐵。
- 社會：情境、原因影響、比較、時序、資料閱讀，限定於既有第一次月考確認單元。

新題應分散 topic 與 type（`basic`／`application`），並以不同認知操作、情境與 distractor rationale 形成真正新題；不得以同一題只改數字、姓名、地點或表面名詞作為批次主要來源。

## Planned batch structure

一個 Sprint 41 additions 檔案內保留八個明確 bank key，實作時按下列缺口填入：

| Batch | Planned additions | Intended unit policy |
|---|---:|---|
| jiejie/chinese | 25 | singleton first |
| jiejie/mathematics | 25 | singleton first |
| jiejie/natural_science | 25 | singleton first |
| jiejie/social_studies | 25 | singleton first |
| meimei/chinese | 17 | singleton first; preserve approved calibration scope |
| meimei/mathematics | 17 | singleton first |
| meimei/natural_science | 15 | singleton first; only approved plant/air/water scope |
| meimei/social_studies | 25 | singleton first |
| **Total** | **174** | **Active Practice 626 → 800** |

## Monthly strategy

Monthly allowlist current baseline is 170. Sprint 41 candidates are not monthly-eligible by default. Candidate manifest will contain an explicit monthly disposition per question (`defer`, `eligible-review`, or `approved`) and the implementation QA will assert that only explicitly approved IDs are added to `lib/first-exam-practice.ts`. The initial implementation may leave the allowlist at 170; any increase requires separate coverage evidence and must remain inside the confirmed first-exam range.

## Verification and release gate

Implementation is eligible for the existing Question Bank Auto-Deploy Rule only after focused QA, full `npm test`, lint, TypeScript, Webpack production build evidence where the known Turbopack panic remains unchanged, Browser regression, `git diff --check`, Git state checks, and Auth Deployment Preflight all pass. This design phase stops before those actions and before deployment.

## Review questions for this gate

1. Confirm the arithmetic and eight per-subject additions above.
2. Confirm that monthly allowlist changes remain explicit and may stay at 170.
3. Confirm that the implementation should use one `sprint41-question-additions.ts` with eight bank keys and singleton-first units.

