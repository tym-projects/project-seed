# Sprint 34 — 姐姐國語與妹妹自然第一次月考題庫

## Scope

- 姐姐國語：三上第一次月考第壹、貳單元。
- 妹妹自然：三上第一次月考第一單元「認識植物」、第二單元「空氣和水」。
- 既有姐姐國語 `jiejie-chinese-2`、`-4` 仍只供歷史 Learning Record 對應，不恢復到任何練習或月考入口。
- 本批不擴充其他科目、不納入第三、四自然單元，不改 Learning Record／ReviewSession schema 或 storage key。

## Bank decisions

- 姐姐國語新增 8 個 singleton learning units：第壹單元詞語理解、語詞運用、錯別字辨識、閱讀理解；第貳單元詞語辨識、語句理解、錯別字辨識、閱讀理解。既有 7 題因缺少可核實的月考課次標記，不直接加入 allowlist。
- 妹妹自然保留既有 4 題，新增 8 個 singleton learning units，補足植物的莖／葉功能、植物觀察分類、植物生長條件、空氣壓縮／流動、水的形狀與體積、生活用水判斷等概念。
- 新增 questionId 不設定 `reviewGroupId` 或 variation；題目內容、四選項、唯一正解、Hint、Explanation 逐題測試。
- 月考 allowlist：姐姐國語新增 8 題；妹妹自然既有 4 題加新增 8 題，共 12 題。兩個入口由「題庫準備中」改為可用。

## Evidence boundary

Human 已確認考試範圍並提供教材照片作為依據；本執行環境未直接讀取對話中的原始照片，因此本批只採用已確認範圍與可核實的年級基礎概念，不宣稱完成逐頁教材核對。若後續照片與題目細節衝突，該題標記 pending-review，不改寫既有紀錄。

## Protected behavior

沿用既有 `ChineseQuestionFlow`、首次練習 shuffle、Today Review、再練一次、1/3/7、confirmation、practice no-write、timer、Parent Summary 與學生／科目隔離。題目僅透過 allowlist 進入第一次月考入口；一般練習仍使用各科 `practiceQuestions`。
