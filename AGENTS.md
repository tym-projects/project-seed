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

## Baseline Correctness Rule

- Git synchronization != Product baseline correctness。
- 即使 `main = origin/main` 且 `origin/main...HEAD = 0/0`，也不得直接假設產品 baseline 正確。
- 建立新 Sprint branch 前，必須另外核對 expected completed baseline、重要資料數量、schema 與關鍵功能狀態。

## Math Visual Aid Rule

- 未來新增姐姐／妹妹數學題時，若簡單視覺能實質提升題意理解，應與題目在同一工作階段同步設計；若沒有實際教學價值，維持 text-only，不強制每題有圖。
- 適合視覺化的題型包括分數部分／全量、小數量測、圓半徑／直徑、長方形長寬、分組／陣列、位值、量測關係、bar model 與簡單幾何關係。
- 視覺只能呈現題目已知條件與未知標記；禁止洩漏答案、顯示計算結果、補題目未提供的公式或單位，或從 answer／options／explanation 推導圖形。
- 延續 `question.id → mathVisualSpecs → typed visual data → MathVisual → QuestionCard optional rendering` 架構。Question schema 不因視覺需求污染；renderer 不得知道 question ID；不得加入 per-question special case；無 mapping 維持 text-only fallback。
- 新增數學題的 Content／QA Gate 必須檢查是否適合視覺化。適合時同步新增 mapping、manifest、runtime parity validation 與 renderer validation；不適合時明確維持 text-only。
- 新增或修改 visual 必須檢查 answer leakage、renderer-valid、manifest/runtime parity、mobile／tablet layout、不裁切、不遮擋，以及不產生 NaN／null／undefined。

## Production Deployment Prevention Rule

- 首次建立、重建或重新設定 `2026ast-production` 時，deploy 前必須確認 project identity、Framework Preset = `Next.js`／`nextjs`、Root Directory、Build／Output settings、Build／Install／Node 設定。
- Deploy 後必須確認 Next.js routes 與 middleware／output 非空；不得只以 Build PASS 或 Deployment READY 判定成功。
- Deploy 前必須確認 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 與 `CLERK_SECRET_KEY` 的名稱存在且 scope 正確，不得記錄 secret value；env 變更後必須重新 deployment。
- Runtime 500 時先查 Runtime Logs，不先改 source、DNS、alias 或反覆 redeploy。
- Production smoke 使用 `https://2026ast-production.vercel.app/`，至少檢查 `/`、`/jiejie`、`/meimei`、`/parent`、static asset 與 Clerk authentication boundary。Generated deployment URL 的 Vercel SSO 302 不得單獨視為 failure。
- 正式 release evidence 必須使用實際通過 Production Human Review 的 deployment ID；failed、superseded 或僅 READY 但 smoke failure 的 deployment 不得標為正式 release。

## Git / Codex Write Prevention Rule

- 遇到 `.git/index.lock`、`.git/ORIG_HEAD.lock` permission denied 或 Codex checkpoint ref filename too long 時，禁止刪 lock、修改 ACL、ownership、safe.directory 或 force repair。
- 若 Owner 一般 PowerShell 可完成正式 Git 操作，允許 Owner 執行最小指令。
- 正式 main synchronization evidence 以正確 HEAD、working tree clean 與 `origin/main...HEAD = 0/0` 為準。
- Codex checkpoint ref 建立失敗，不得直接等同正式 commit／push failure；兩者必須分開判斷。

## 正式開發與備份位置

- 唯一正式開發 repository：`C:\Users\admin\Documents\2026AST-dev`。
- Codex 程式修改、`npm install`／`npm ci`、`node_modules`、lint、build、test、Git commit 與 Git push 一律只在正式 repository 執行。
- GitHub `origin` 是正式 Git 遠端同步與版本歷史來源。
- `C:\Users\admin\OneDrive\Documents\2026AST-dev` 暫時保留為遷移安全備份，不是正式開發工作目錄；不得在該目錄進行後續開發、測試、build、commit 或 push。
- `G:\我的雲端硬碟\2026AST` 僅作備份，不作為實際開發工作目錄；不得在該目錄執行 npm、建立或更新 `node_modules`，或執行 build。

### Repository Safety Rule

所有 Codex 工作開始前必須先執行：

```powershell
git rev-parse --show-toplevel
```

結果必須是 `C:\Users\admin\Documents\2026AST-dev`。若不是此路徑，不得修改、commit、push 或開始 Sprint。

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

## Question Bank Auto-Deploy Rule

若變更僅涉及題庫新增、題目修正、難度調整、explanation／hint 修正或 Active Practice 題庫擴增，且不涉及 Learning Record schema、ReviewSession、Backup/Restore、retry／1/3/7、Auth／Clerk／role authorization、storage migration、重大 UI 架構或 Production hosting，則在以下驗證全部 PASS、commit 與 feature branch push 完成後，Codex 可直接部署至既有 Vercel Preview project `2026ast-hosting-preview`，不需再次要求 Owner 核准是否部署：

1. focused question tests
2. scope、duplicate、unique-answer、option 與 answerIndex validation
3. `npm test`
4. `npm run lint`
5. `npx tsc --noEmit --incremental false`
6. `npm run build`
7. Browser regression
8. `git diff --check`
9. working tree、commit 與 push 狀態正常
10. Auth Deployment Preflight PASS（見下方永久規則）

部署後必須確認 Preview deployment READY、HTTP／route smoke PASS，並回報 deployment URL、source commit、題庫 counts、Monthly allowlist 與任何未驗證項目。不得使用 `--prod`、不得部署 `2026ast-production`、不得建立新 project、不得修改或清除既有環境變數。Learning Record、ReviewSession、Backup/Restore、Auth／Clerk、role authorization、schema migration、Production hosting、重大 UI 或資料風險變更仍必須停在 Human Review Gate。

## Auth Deployment Preflight Rule

任何部署到 `2026ast-hosting-preview` 前，即使變更只涉及題庫，也必須先完成並記錄以下 preflight。題庫 QA 與 build 成功不能取代此檢查。

1. `@clerk/nextjs` dependency 仍存在。
2. 根目錄 `proxy.ts`／Clerk middleware 保護入口仍存在。
3. Preview target 已有 `CLERK_SECRET_KEY` 與 `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`；只確認存在，不讀取、輸出或記錄其值。
4. 匿名 `/`、姐姐 direct route、妹妹 direct route、爸爸 direct route 均導向 Clerk。
5. parent／jiejie／meimei role guard tests，以及 route authorization regression tests 均通過。

任一項失敗即禁止 Preview deployment。Vercel Authentication 必須維持 OFF，家庭使用流程的安全邊界是 `Internet → Vercel Preview → Clerk Authentication → role authorization`；不得以 Vercel Authentication 掩蓋 Clerk regression。

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
