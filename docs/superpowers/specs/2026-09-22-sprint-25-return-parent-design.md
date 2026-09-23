# Sprint 25 返回操作與家長中心整合 Design

## 核准目標

依實際平板試用回饋，改善兩項操作體驗：

1. 姐姐／妹妹四科的首次練習、今日複習、再練一次流程提供清楚返回首頁操作。
2. 保留 `/parent` 單一家長入口，加入學生與科目切換，一次只顯示目前選定的摘要與複習時間設定。

## 最小設計

- `ChineseQuestionFlow` 在進行中的題目頁提供明確返回首頁連結；尚未開始或已完成畫面不顯示不必要的離開確認。
- 進行中已有作答狀態時，返回連結先顯示簡短 `window.confirm`。取消保留畫面與選項；確認只離開目前流程，不新增暫存或恢復系統。已完成的 Learning Record 已經保存，未完成題目不會寫入完成紀錄。
- `TodayReviewPage` 與 `ChineseReinforcementPracticePage` 的開始頁沿用既有首頁連結；開始後交由共用 flow 顯示返回操作。Practice 維持 no-write。
- `ParentLearningRecords` 保留既有八組 student／subject summary 計算與 review-time storage key，僅新增學生切換與四科切換狀態，渲染一組目前選擇的 section。切換不合併資料、不改指標定義、不新增 storage key。
- `/parent` 路由及既有資料模型維持相容；所有返回 target 明確使用目前學生首頁。

## 保護範圍

Learning Record／ReviewSession persisted schema、storage keys、1/3/7、retry、confirmation、practice no-write、timer／`startedAt` 與 Parent Summary 指標語意不變；不新增題目或公開部署。

## 驗證

Focused Node tests 驗證離開確認純邏輯、返回 target 與 parent selection；disposable Chromium／synthetic storage Browser smoke 驗證兩位學生四科返回、取消離開、完成紀錄、practice no-write、家長切換、設定保存，以及 768×1024／1024×768 版面。

## Out of Scope

不建立上一題、複雜中斷恢復、跨學生／跨科統計、資料遷移、題庫擴充、schema 變更或 Sprint 26 實作。
