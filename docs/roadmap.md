# Project Seed Roadmap

## Sprint 10 — 今日複習

- 依姐姐或妹妹各自的 Learning Record，自動選出最多 5 題國語複習題。
- 今天已完成過的題目不再重複選入；日期以孩子瀏覽器本地日期判斷。
- 題庫以 `topic` 與 `type: basic | application` 支援題目分散與排序。
- 不建立永久錯題狀態、理解度分數或 `recordSource`；持續沿用 Learning Record 推導。

## 延後項目（保留 backlog）

- 3 天後再次確認，以及一次答對不等於真正理解的進階確認。
- 完整間隔複習、同觀念不同問法／變化題、AI 選題與難度演算法。
- 真正依作答時間控制 10～15 分鐘。
- 學校進度、教材版本、課表與段考排程整合。
- 家長分析圖表、理解度評分與資料庫。

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

## Sprint 9：孩子學習紀錄

- 在單一 `/parent` 頁面顯示姐姐與妹妹已完成的 Learning Record。
- 以現有 localStorage Learning Record 和對應學生題庫組裝可讀紀錄，不加入 AI 分析、評分或新儲存機制。
## Sprint 10+：Learning Analytics

- 以累積的學習資料分析理解狀況、弱點與個人化學習建議。
