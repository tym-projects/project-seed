# Sprint 27 網站總首頁導覽改善 Design

## 核准範圍

- 既有網站總首頁路由：`/`。
- 姐姐學習首頁：`/jiejie`。
- 妹妹學習首頁：`/meimei`。
- 家長模式／家長中心主要入口：`/parent`。
- 三個模式頁各新增一個明確的「返回網站首頁」入口，固定連到 `/`。

## 最小 UI 方案

- 使用共用 `SiteHomeLink` 元件，避免三頁重複導覽樣式。
- 使用高對比、至少 48px 高的觸控友善按鈕，置於各頁主要標題附近。
- Sprint 26 的「返回姐姐首頁／返回妹妹首頁」仍只負責學習流程返回學生首頁，不與本入口混用。

## 保護範圍

- 不改 Learning Record、ReviewSession、storage key、題庫、選題、複習、practice、timer 或 Parent Summary 語意。
- 不新增導覽系統；網站總首頁既有三個模式入口維持不變。
- Browser smoke 使用 disposable Chromium context、synthetic storage；768×1024 與 1024×768 只作技術 viewport 驗證，實際平板驗收待 Human。
