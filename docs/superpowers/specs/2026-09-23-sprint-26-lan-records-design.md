# Sprint 26 LAN 紀錄儲存與返回導覽修正 Design

## 核准問題

HTTP LAN 位址不是 localhost 時，部分瀏覽器沒有 `crypto.randomUUID`；目前首次練習建立 Learning Record ID 會拋錯，導致紀錄未保存。另三種流程的返回文字與開始頁位置不一致，增加平板辨識成本。

## 最小方案

- 新增單一 `createLearningRecordId`：優先使用 `crypto.randomUUID`；不可用時以 `crypto.getRandomValues` 產生 UUID v4，設定 version／variant bits。
- 兩種安全隨機 API 均不可用時，不建立紀錄，顯示「學習紀錄未保存」的可理解錯誤，不宣稱保存成功。
- 不改 Learning Record／ReviewSession schema、storage keys、student／subject isolation 或學習規則。
- 所有四科、兩位學生的練習、今日複習、再練一次統一顯示「返回姐姐首頁／返回妹妹首頁」，開始頁與作答頁均置於標題附近。
- 將未完成作答離開確認改為共用畫面內 dialog，提供「繼續作答／確認返回首頁」；Escape 等同繼續作答，取消保留狀態，practice no-write 與已完成紀錄保存語意不變。
- 將共用返回入口改為高對比、觸控友善按鈕；不改 student／subject 路由。

## 驗證與限制

以 Node pure tests、disposable Chromium、synthetic storage、HTTP LAN 等效的 `randomUUID` 不可用情境驗證；Browser 額外驗證 dialog focus、ARIA、Escape、取消與確認返回，以及 768×1024／1024×768 viewport。不得使用真實 localStorage，不進行題庫或資料 schema 變更。實際平板複驗由 Human 後續確認。
