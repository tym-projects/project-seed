# Project Seed Bible

本文件保存長期產品規格、開發原則、架構決策與使用者要求；不記錄每日或各 Sprint 的即時進度。最新進度、驗證結果與下一步一律以 [`PROJECT_STATUS.md`](PROJECT_STATUS.md) 為準。

## 1. Project Overview

Project Seed 是以孩子為中心的學習網站原型，從清楚、友善、可完成的每日練習開始，逐步建立可持續擴充的學習平台。

### 產品目標

- 每天 10～15 分鐘，讓孩子真正理解，而不是死背。
- 讓孩子以簡單、正向的流程完成學習。
- 將題目、學習流程與學習紀錄分離管理。
- 為家長、教材與 AI 教學能力建立可延伸的基礎。

### 產品定位

Project Seed 是陪伴孩子學習的 AI 家教平台，而不是單純提供題目或答案的工具。

## 2. Core Philosophy

- 真正理解，而不是死背：題目與回饋應幫助孩子理解知識。
- AI 是老師，不是答案機：未來 AI 應引導思考、提供提示與教學，而非直接代答。
- 學習流程優先於完成速度：好的流程比快速答完更重要。
- 答錯時提供提示，不能直接跳過；不建立排行榜或連續登入獎勵，也避免讓孩子長時間使用。

## 3. Development Principles

- 正確、穩定、簡單、有助於學習、容易維護，依此順序取捨。
- 每個 Sprint 具備明確、可驗證且範圍小的目標；先維持既有流程可用，再逐步加入新能力。
- 優先沿用現有架構與共用元件；不擅自增加 dependency 或大幅改變架構。
- 每個完成 Sprint 建立可讀、具體的 Git commit；commit 前核對差異範圍、驗證結果與文件同步狀態。
- 不將開發日誌、暫存輸出或無關檔案納入 commit。

## 4. Repository and Progress Governance

### 正式開發與備份策略

- 唯一正式開發 repository 為 `C:\Users\yenmi\Documents\2026AST-dev`。
- GitHub `origin` 是正式遠端同步與版本歷史來源。
- `G:\我的雲端硬碟\2026AST` 與 `C:\Users\yenmi\OneDrive\Documents\project-seed` 僅為舊副本／備份，不得作為正式開發基準。

### Progress Source Rule

判斷專案最新進度的優先順序：

1. 正式 repository 的實際 Git 狀態
2. `PROJECT_STATUS.md`
3. `docs/roadmap.md`
4. `PROJECT_SEED_BIBLE.md`
5. 聊天紀錄／記憶

不得只依聊天紀錄或記憶判斷最新專案進度。

### 文件更新規範

- `PROJECT_STATUS.md` 是目前專案進度、驗證結果與下一步的唯一真相來源。
- `docs/roadmap.md` 保存已決定但延後的功能與 backlog，不得刪除因 Sprint 範圍或複雜度而暫緩的項目。
- `docs/sprint-log.md` 保存各 Sprint 的完成紀錄。
- `docs/decisions.md` 保存架構選擇與原則。
- 本文件只維護跨 Sprint 的核心脈絡、規格與長期方向。

## 5. Architecture Decisions

```text
project-seed/
├── app/                  # UI 與頁面路由
├── components/question/  # 共用答題流程與題目 UI
├── lib/questions/        # 題庫與選題邏輯
├── docs/                 # roadmap、Sprint 紀錄與決策
└── PROJECT_STATUS.md     # 目前進度唯一真相來源
```

- 每個 Question 保留 `id`、`title`、`instruction`、`question`、`options`、`answer`、`explanation` 與 `encouragement`。
- 頁面負責組合學習流程；共用元件負責題目呈現與回饋；題目內容集中於 Question Bank。
- Learning Record 使用瀏覽器 localStorage，資料以學生與科目隔離；未來能力應建立在可靠的題庫、學習紀錄與既有學習流程上。

## 6. Long-term Roadmap Principles

發展順序維持為：

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

已決定但延後的功能細節以 [`docs/roadmap.md`](docs/roadmap.md) 為準。
