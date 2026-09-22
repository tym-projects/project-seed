# Sprint 24 四科首頁導覽 Design

## 目標

讓姐姐、妹妹首頁都能清楚找到四個科目的「練習／今日複習／再練一次」入口；每個入口以既有 student 與 subject 路由明確對應，不再由共用國語路由承擔跨科功能。

## 核准範圍

每位學生各 12 個入口，合計 24 個：

| 科目 | 練習 | 今日複習 | 再練一次 |
|---|---|---|---|
| 國語 | `/[student]/chinese` | `/[student]/review` | `/[student]/reinforce` |
| 數學 | `/[student]/mathematics` | `/[student]/mathematics/review` | `/[student]/mathematics/reinforce` |
| 自然 | `/[student]/natural-science` | `/[student]/natural-science/review` | `/[student]/natural-science/reinforce` |
| 社會 | `/[student]/social-studies` | `/[student]/social-studies/review` | `/[student]/social-studies/reinforce` |

`[student]` 僅為 `jiejie` 或 `meimei`。既有四科題庫、路由與共用 Question Flow 維持不變。

## 最小設計

- 建立一份共用、唯讀的首頁導覽設定，保存科目顯示名稱與三個相對路徑。
- 姐姐／妹妹首頁只負責以不同主題色渲染同一份設定，並補上科目分組與三個操作連結。
- 不依賴目前使用中的科目，不修改 Learning Record／ReviewSession schema、storage keys、1/3/7、retry、confirmation、practice no-write、timer 或 Parent Summary。
- 既有科目路由直接作為 student／subject 的明確邊界；不建立新的導覽或學習引擎。

## 驗證

- Node focused test 鎖定 4 科 × 3 action 的 12 個相對路徑、唯一操作與完整科目集合。
- Browser smoke 以既有 disposable Chromium／synthetic storage 驗證姐姐與妹妹首頁各 12 個 links、四科首次練習與既有國語路由，並檢查無 console error。
- Mobile viewport smoke 使用 Playwright 的手機尺寸，只驗證入口可見、可點擊、長名稱不水平溢出、頁面可垂直捲動；不宣稱真實手機或兒童試用。

## Out of Scope

- 不新增題目、variation 或教材內容。
- 不修改 persisted schema、storage key 或核心複習語意。
- 不重構 Question Flow、Review、Practice、Parent Summary。
- 不開始 Sprint 25。
