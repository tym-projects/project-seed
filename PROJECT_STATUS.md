# Project Status

Version: v0.10

## Sprint 10 — 今日複習

- 姐姐與妹妹首頁皆可進入今日複習；每次自動準備最多 5 題國語題目。
- 依既有 Learning Record 推導最近重試題、掌握不穩定題與久未複習題，不新增永久學習狀態。
- 當天任何已完成的題目均不重複選入，使用孩子瀏覽器本地日期判斷。
- 今日複習完成後仍沿用既有流程寫入 Learning Record，並分別以 `student` 隔離姐姐與妹妹資料。
## Sprint 9 — 孩子學習紀錄
- `/parent` 改為單一的孩子學習紀錄入口，提供姐姐與妹妹各自的摘要與紀錄區塊。
- 家長頁只在 Client Component 掛載後，以既有 `project-seed:learning-records:v1` 安全讀取 Learning Record。
- 顯示資料會依學生、科目與題目 ID 使用對應題庫，避免跨學生題庫錯配。
- 題目已不在題庫時，保留紀錄並顯示「這題已不在目前題庫」與次要題目 ID。
- 摘要只顯示紀錄總數與最近一次完成時間；不加入分數、能力評級或 AI 判斷。

## Sprint 8 — 妹妹國語與共用學習流程

- 新增妹妹國語 3 題測試題庫，並使用固定 questionId。
- 姐姐與妹妹國語共用 `ChineseQuestionFlow`，保留各自的主題、題庫與返回首頁路徑。
- 妹妹國語在每題答對完成時，會以 `student: 'meimei'` 寫入既有 Learning Record。
- 妹妹首頁已提供國語複習入口。
- 本 Sprint 不包含家長 Learning Record UI、統計、AI 分析、錯題分析、資料庫或其他科目。

## Sprint 7 — Learning Record

- 姐姐國語在每題答對完成時，將 Learning Record 寫入瀏覽器 localStorage。
- 紀錄保留固定 questionId、第一次答案、最終答案與作答次數。
- 本 Sprint 不包含 Learning Record UI、統計、AI 分析、資料庫或妹妹國語。

## 完成項目

- Sprint 1：網站基礎架構
- Sprint 2：第一版學習流程
- Sprint 3：答題、判斷、提示、完成流程
- Sprint 4：完整學習流程（完成畫面）
- Sprint 5：Question Bank Modularization
- Sprint 6：Question Engine 與共用題目架構

## 目前架構

- UI
- Question Engine
- 共用題目 UI
- Documentation

## 下一步

Sprint 8：妹妹國語與共用學習流程

## 待辦

- 妹妹國語共用 Question Engine：尚未建立題目頁面與題庫，保留為待辦。
