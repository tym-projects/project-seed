# Project Seed Bible

Project Seed 的核心資訊與發展準則集中於本文件，作為專案的 Single Source of Truth。任何架構、流程或產品方向的重要調整，都應同步更新本文件與相關專案文件。

## 1. Project Overview

### 專案介紹

Project Seed 是以孩子為中心的學習網站原型，從清楚、友善、可完成的每日練習開始，逐步建立可持續擴充的學習平台。

### 專案目標

- 讓孩子能用簡單、正向的流程完成學習。
- 將題目、學習流程與未來的學習紀錄分離管理。
- 為家長、教材與 AI 教學能力建立可延伸的基礎。

### 產品定位

Project Seed 是一個陪伴孩子學習的 AI 家教平台，而不是單純提供題目或答案的工具。

## 2. Core Philosophy

- 真正理解，而不是死背：題目與回饋應幫助孩子理解知識。
- AI 是老師，不是答案機：未來 AI 應引導思考、提供提示與教學，而非直接代答。
- 學習流程優先於完成速度：好的流程比快速答完更多一層價值。

## 3. Development Principles

### Sprint 開發規則

- 每個 Sprint 有明確、可驗證且範圍小的目標。
- 以小步快跑方式交付，避免一次擴張過多功能。
- 先維持既有流程可用，再逐步加入新能力。

### Git 規範

- 每個完成的 Sprint 建立一個可讀、具體的 Git commit。
- Commit 前確認差異範圍、測試結果與文件同步狀態。
- 不將開發日誌、暫存輸出或無關檔案納入 commit。

### 正式開發與備份策略

- 唯一正式開發 repository 為 `C:\Users\yenmi\Documents\2026AST-dev`；所有 Codex 程式修改、npm、`node_modules`、lint、build、test、Git commit 與 Git push 均只在此處進行。
- GitHub `origin` 是正式 Git 遠端同步與版本歷史來源。
- Google Drive `G:\我的雲端硬碟\2026AST` 僅作備份，不作為開發工作目錄；不得在其中執行 npm、建立或更新 `node_modules`，或執行 build。

### 文件更新規範

- 產品進度更新至 `PROJECT_STATUS.md`。
- Sprint 成果記錄於 `docs/sprint-log.md`。
- 架構選擇與原則記錄於 `docs/decisions.md`。
- 本文件維護跨 Sprint 的核心脈絡與長期方向。

### 每個 Sprint 的完成條件

- 程式
- 測試
- 文件
- Git Commit

## 4. Current Architecture

```text
project-seed/
├── app/
├── data/
├── docs/
└── PROJECT_STATUS.md
```

- `app`：UI、頁面路由與學習流程。
- `data`：Question Bank，集中管理題目資料。
- `docs`：專案文件、Sprint 紀錄與架構決策。

## 5. Current Progress

**Version：v0.7**

| Sprint | 成果 |
| --- | --- |
| Sprint 1 | 建立網站基礎架構、主要學習入口與專案文件。 |
| Sprint 2 | 建立姐姐國語第一版學習頁面與基本題目體驗。 |
| Sprint 3 | 完成選答、判斷、鼓勵、提示與下一題流程。 |
| Sprint 4 | 完成第二題後的完成畫面與返回姐姐首頁流程。 |
| Sprint 5 | 將姐姐國語題目抽離為獨立 Question Bank，並完成架構文件化。 |
| Sprint 6 | 完成姐姐國語 Question Engine 與共用題目架構，維持既有學習流程。 |
| Sprint 7 | 完成 Learning Record，儲存學習紀錄並提供紀錄介面。 |

## 6. Question Bank Design

目前姐姐國語 Question Engine 位於：

```text
lib/questions/jiejie-chinese.ts
```

共用題目 UI 位於：

```text
components/question/
```

每個 Question 包含：

- `id`
- `title`
- `instruction`
- `question`
- `options`
- `answer`
- `explanation`
- `encouragement`

頁面負責組合學習流程；共用元件負責題目呈現與回饋；題目內容集中於 Question Engine 管理。新增或修改姐姐國語題目時，優先調整題庫資料，避免更動 UI 流程。

妹妹國語尚未建立 Question Engine 或題目頁面，仍列為待辦。

## 7. Future Architecture

```text
Question Bank
      ↓
Learning Record
      ↓
Wrong Question Review
      ↓
Parent Dashboard
      ↓
教材管理
      ↓
AI Teaching
      ↓
Learning Analytics
```

這個順序讓每一層能力建立在前一層的可靠資料與使用流程之上。

## 8. Development Workflow

```text
ChatGPT
   ↓
Architecture
   ↓
Codex
   ↓
Testing
   ↓
Git
   ↓
Documentation
```

需求先被整理為可執行的架構，再由 Codex 實作與驗證；完成後以 Git 保存里程碑，並同步文件。

## 9. Codex Prompt Rules

所有 Prompt 應包含：

- 任務
- 需求
- 限制
- 驗證

並遵守：

- 只修改指定檔案。
- Prompt 盡量精簡。
- 節省 Token。
- 不修改未指定檔案。

## 10. Git Milestones

| Commit | 說明 |
| --- | --- |
| `1a45b58` | Version 0.1 - Initial Project Seed |
| `316197a` | Complete Project Seed foundation and documentation |
| `9e9fe5a` | Complete Sprint 3 learning flow |
| `fa0a678` | Complete Sprint 5 question bank modularization |
| `a30641a` | Build Sprint 6 Question Engine for Chinese questions |
| `22eac70` | Extract shared question UI |
| `174b65b` | Add Sprint 7 learning records |

## 11. Roadmap

### Sprint 7 — Learning Record

記錄孩子的作答、完成狀態與學習歷程，為後續複習與家長檢視建立資料基礎。

### Sprint 8 — Parent Dashboard

讓家長能查看孩子的學習進度、完成情形與需要關注的內容。

### Sprint 9 — AI Teaching

加入以引導、提問與提示為核心的 AI 教學能力。

### Sprint 10+ — Learning Analytics

以累積的學習資料分析理解狀況、弱點與個人化學習建議。

## 12. Long-term Vision

Project Seed 最終希望成為真正陪伴孩子學習的 AI 家教平台。它會理解孩子的學習歷程、以合適的節奏引導思考、協助家長掌握進度，並讓教材、題庫、學習紀錄與 AI 教學能力共同服務於「真正理解」這個目標。
