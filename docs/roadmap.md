# Project Seed Roadmap

## Sprint 1：多模式首頁與基礎路由（已完成）

- 建立 Project Seed 首頁與產品訊息。
- 建立姐姐、妹妹、家長三種模式路由。
- 建立一致的卡片式頁面與主題色。

## Sprint 2：姐姐國語練習（已完成）

- 新增姐姐模式的國語練習入口。
- 建立單題注音題目畫面與「我會／我不會」選項。
- 驗證路由與 TypeScript。

## Sprint 3：互動與回饋（已完成）

- 加入答案選擇、正確性回饋與下一題流程。
- 設計「我不會」時的提示與教學引導。
- 建立題目資料結構，支援更多科目與年級。

## Sprint 4：完整學習流程（已完成）

- 完成第二題後的完成畫面。
- 建立返回姐姐首頁流程。

## Sprint 5：Question Bank Modularization（已完成）

- 將姐姐國語題目抽離為獨立題庫。
- 維持既有 UI 與學習流程。

## Sprint 6：Question Engine 與共用題目架構（已完成）

- 建立姐姐國語 Question Engine。
- 將題目與畫面分離，題目集中於 `lib/questions/jiejie-chinese.ts`。
- 抽離共用題目 UI 至 `components/question/`。
- 妹妹國語 Question Engine 尚未建立，保留為待辦。

## Sprint 7：Learning Record

- 記錄孩子的作答、完成狀態與學習歷程。
- 為後續複習與家長檢視建立資料基礎。

## Sprint 8：Parent Dashboard

- 讓家長查看學習進度、完成情形與需要關注的內容。

## Sprint 9：AI Teaching

- 加入以引導、提問與提示為核心的 AI 教學能力。

## Sprint 10+：Learning Analytics

- 以累積的學習資料分析理解狀況、弱點與個人化學習建議。
