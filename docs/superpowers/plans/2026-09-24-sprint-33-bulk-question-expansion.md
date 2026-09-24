# Sprint 33 — Bulk Question Expansion Implementation Plan

## Task 1 — 題庫與內容 RED

- 先新增 `lib/questions/sprint-33-bulk-expansion.test.mjs`，鎖定 8 個核准 questionId、完整題幹／選項／答案／Hint／Explanation、唯一選項及 singleton metadata。
- 以題目尚未存在造成 RED；不得用放寬驗證取代入庫。
- 完成條件：8 題 exact-match 與內容品質測試 GREEN。

## Task 2 — 四組題庫最小入庫

- 修改 `lib/questions/jiejie-mathematics.ts`、`jiejie-natural-science.ts`、`jiejie-social-studies.ts`、`meimei-social-studies.ts`，只加入 8 題。
- 不修改既有 questionId、答案、schema、reviewGroup 或 variation。
- 完成條件：每題為獨立 singleton，學生／科目／單元 metadata 正確。

## Task 3 — 月考 allowlist 接線

- 修改 `lib/first-exam-practice.ts` 與其 focused expectations，將 8 題加入四組明確 allowlist。
- 姐姐國語與妹妹自然仍顯示準備中，不 fallback 一般題庫。
- 完成條件：月考題數為 13／12／12／12／10／10，且不混用學生或科目。

## Task 4 — 回歸與 Browser smoke

- 更新既有自然／社會 inventory regression，新增 `tests/browser/sprint-33-bulk-expansion.spec.ts`。
- 使用 disposable Chromium、synthetic storage，驗證四組新增月考入口、兩組未確認科目仍隔離、無 console error。
- 完成條件：首次練習、Learning Record、Today Review、再練一次及既有導覽回歸通過。

## Task 5 — 完整驗證與文件

- 執行 focused tests、`npm test`、lint、`npx tsc --noEmit --incremental false`、build、Browser smoke 與 `git diff --check`。
- 更新 `PROJECT_STATUS.md`、`docs/roadmap.md`、`docs/sprint-log.md`，記錄實際數量、證據界線、未確認範圍與 LAN 服務保護。
- 完成後停在 Human Review Gate；不得 commit、push、部署或宣告 Sprint 33 Completed。

## 實際執行結果

- Task 1：8 題 exact-match、唯一正解、選項、feedback 與 singleton metadata 測試先 RED 後 GREEN。
- Task 2：完成四組題庫最小入庫；正式盤點為 86 題／81 learning units。
- Task 3：完成四組 explicit monthly allowlist；六組已開放月考題數為 13／12／12／12／10／10，合計 69 題；姐姐國語與妹妹自然仍準備中。
- Task 4：更新受新增題目影響的既有 Browser fixtures，新增 Sprint 33 Browser smoke；隔離 Browser 41/41 通過，使用 disposable Chromium 與 synthetic storage。
- Task 5：focused Node 6/6、完整 Node 185/185、lint、TypeScript `--incremental false`、隔離 production build、Browser 41/41 與 `git diff --check` 通過。正式家庭 LAN 服務 192.168.22.208:3100 未被中斷；隔離驗證使用 127.0.0.1:3101，驗證後已停止。
- Sprint 33 Final Close：Human 平板驗收 6/6 通過；implementation commit `be1e1f1` 已 push。正式 LAN 服務已切換至 Sprint 33 build，3100 維持原 origin；3101 隔離驗收服務暫留至正式環境確認完成。
