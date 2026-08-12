# Sprint Log

## Sprint 6

完成內容：

- 建立姐姐國語 Question Engine。
- 題目改由 `lib/questions/jiejie-chinese.ts` 集中管理。
- 題目與畫面分離，頁面只負責學習流程與呈現。
- 保持原有答題、判斷、鼓勵、解釋與下一題流程。
- 抽離共用題目 UI 至 `components/question/`，供後續同類學習流程使用。
- 妹妹國語 Question Engine 尚未建立，保留為待辦。

---

## Sprint 5

完成內容：

- 將姐姐國語題目抽離為獨立題庫。
- 新增 data/chinese/grade6.ts。
- page.tsx 改由匯入 questions 題庫。
- UI 與學習流程保持不變。
- 完成題庫模組化。

---

## Sprint 4

完成內容：

- 完成第二題後的完成畫面。
- 建立返回姐姐首頁流程。

---

## Sprint 1：基礎產品骨架

已完成：

- 建立 Project Seed 首頁，說明「每天 10～15 分鐘，真正理解，而不是死背」。
- 建立 `/jiejie`、`/meimei`、`/parent` 路由。
- 建立姐姐粉紅、妹妹綠色、家長灰色的模式頁面。
- 在首頁加入三個模式入口。
- 修復姐姐頁 React 預設匯出與 UTF-8 中文顯示問題。

## Sprint 2：姐姐國語練習

已完成：

- 建立 `/jiejie/chinese` 國語練習頁。
- 在姐姐模式中，將「國語複習」連到國語練習頁。
- 建立「蕉」字注音選擇題與「我會／我不會」按鈕。
- 驗證新增路由回傳 HTTP 200，並通過 TypeScript 型別檢查。

## Sprint 3

完成基本答題流程：

- 選擇答案
- 判斷正確錯誤
- 正確鼓勵
- 錯誤提示
- 多題切換
- 答錯後需重新理解，不能直接進入下一題
