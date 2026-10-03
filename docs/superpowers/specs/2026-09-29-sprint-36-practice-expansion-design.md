# Sprint 36 平時練習題庫擴充設計

## 狀態

Planning only / Scope Human Review pending。尚未新增正式題目、尚未修改 production code、tests 或學習資料。

## 目標

針對姐姐與妹妹八個學生／科目組合，依第一次月考已確認單元及可核實教材資料，補足平時練習的不同 learning concepts 與有教育價值的問法，讓每科都有實質覆蓋改善。第一階段以約 32–48 題候選容量評估，目前以 36 個新 learning-unit 候選作規劃基準。

## 不變條件

- 沿用既有 Question schema、題庫模組、singleton／reviewGroupId／variation 語意。
- 不修改 Learning Record／ReviewSession persisted schema、storage key、backup／restore 格式或既有資料。
- 不改變首次練習 shuffle、Today Review 的 1/3/7、每日 group 上限、再練一次 no-write、retry、confirmation、timer 或 Parent Summary。
- 月考 allowlist 維持明確 questionId 清單；平時題庫擴充不自動改變月考資格。
- 正式題目以原創文案為主；同一觀念才可使用 variation，不同觀念建立獨立 learning unit。
- 不使用 runtime 選項亂數；answerIndex 固定且需通過分布與唯一正解檢查。

## 批量方向

先處理覆盖矩陣列出的高優先缺口：姐姐／妹妹國語各 5、數學各 5、自然各 4、社會各 4 作為初始容量。每題必須有 student、subject、教材單元／課次、細部觀念、原創題幹、四選項、唯一正解、Hint、Explanation、來源層級與風險標記。

教材細節無法由目前環境直接核對的題目只能標為 pending-review，不計入可入庫數；不得以課名推測國語內容，也不得以公開版本替代 Human 實際教材。

## 驗收設計

1. 逐題確認 ID 唯一、學生／科目隔離、選項唯一、答案與解析一致。
2. 數學逐題重算；自然／社會核對事實；國語核對字形、詞義與語境。
3. 檢查新題與既有 learning unit 不重複；variation 需確認既有 review history 相容。
4. 固定選項後檢查每科 answerIndex 不出現可預測長串或單一位置壟斷。
5. 先做 focused validation，再做完整 Node、lint、TypeScript、build、Browser smoke。
6. Browser 使用 disposable Chromium 與 synthetic storage，並抽測 768×1024、1024×768。
7. Human 審核候選內容後，才建立 implementation scope；實作後再安排八科平時練習抽樣與正式 LAN 複驗。

## 上線與資料注意

正式 3100 維持運行；測試使用隔離 build／port。Learning Record 目前以瀏覽器 origin 儲存，正式使用須一般瀏覽模式、固定裝置／瀏覽器／origin，備份檔由 Human 妥善保存。Sprint 36 不處理跨裝置同步或資料架構變更。

## Evidence Closure 結果與目前決策閘門

Baseline 已閉合為 102／97／89；36 個候選目前為 11 Ready、5 Revised、20 Pending Review、0 Rejected。Ready／Revised 草案已記錄，但仍需 Human 審核題意、教材對應與是否進入正式 test-first 入庫。姐姐四科 Scope Audit 得出 43 題安全 active pool，但姐姐社會 monthly allowlist 有 2 題超出已確認範圍，需 Human 決定後才能建立 active filter。Pending 題不得入庫；本輪尚未修改題庫、allowlist、程式或測試。
