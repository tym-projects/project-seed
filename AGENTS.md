# Project Seed — AGENTS.md

## 核心原則

Project Seed 的目標：

> 每天 10～15 分鐘，讓孩子真正理解，而不是死背。

開發優先順序：

1. 正確
2. 穩定
3. 簡單
4. 有助於學習
5. 容易維護

第一版先求穩，再求多。

## 開發規則

- 優先沿用現有架構與共用元件。
- 保持程式輕量，不過度工程化。
- 不做目前 Sprint 範圍以外的功能或重構。
- 不擅自增加 dependency 或大幅改變架構。
- 發現更簡單、更有效率的方法要提出。
- 發現方向或設計有問題要直接指出。
- 重大變更先取得使用者確認。

## 學習功能原則

- 答案與解析必須正確。
- 目標是理解，不是快速完成題目。
- 答錯應提供提示，不能直接跳過。
- 題目與介面保持簡單清楚。
- 不建立排行榜或連續登入獎勵。
- 避免讓孩子長時間使用。

## 工作流程

## 正式開發與備份位置

- 唯一正式開發 repository：`C:\Users\yenmi\Documents\2026AST-dev`。
- Codex 程式修改、`npm install`／`npm ci`、`node_modules`、lint、build、test、Git commit 與 Git push 一律只在正式 repository 執行。
- GitHub `origin` 是正式 Git 遠端同步與版本歷史來源。
- `G:\我的雲端硬碟\2026AST` 僅作備份，不作為實際開發工作目錄；不得在該目錄執行 npm、建立或更新 `node_modules`，或執行 build。

### Repository Safety Rule

所有 Codex 工作開始前必須先執行：

```powershell
git rev-parse --show-toplevel
```

結果必須是 `C:\Users\yenmi\Documents\2026AST-dev`。若不是此路徑，不得修改、commit、push 或開始 Sprint。

### Progress Source Rule

回報或判斷目前進度前，先以正式 repository 的實際 Git 狀態與 `PROJECT_STATUS.md` 核對。資訊優先順序為：正式 repository Git 狀態、`PROJECT_STATUS.md`、`docs/roadmap.md`、`PROJECT_SEED_BIBLE.md`、聊天紀錄／記憶；不得只依聊天紀錄或記憶判斷。

### Sprint Close Rule

每個 Sprint 完成時固定執行：

1. 完整 tests
2. lint
3. build
4. TypeScript
5. 記錄 Browser / E2E 未驗證項目
6. 更新 `PROJECT_STATUS.md`
7. 更新必要的 roadmap / BIBLE / docs
8. commit
9. 確認 `git status`
10. 回報 push status
11. 記錄 Next Step

開始工作前先閱讀：

1. `AGENTS.md`
2. `PROJECT_SEED_BIBLE.md`
3. `PROJECT_STATUS.md`

開始新 Sprint 前，先讀取 `PROJECT_STATUS.md`，並依上述 Progress Source Rule 以正式 repository Git 狀態核對。

完成修改後：

1. 執行必要測試。
2. 測試失敗不得宣稱完成。
3. 視需要更新 `PROJECT_STATUS.md`。
4. 完成一個明確階段後再 Git commit。

## 與使用者合作

- 使用繁體中文。
- 回覆簡短、直接。
- 優先告訴使用者下一步要做什麼。
- 不重複解釋已確認事項。
- 小型技術決策自行依現有架構處理。
- 只有重要產品或架構決策才詢問使用者。
- 優先節省使用者時間、Token 與 Codex 額度。

## 最終判斷

遇到不同方案時，優先選擇：

> 更簡單、更穩定、更容易維護，而且真正有助於孩子學習的方案。
