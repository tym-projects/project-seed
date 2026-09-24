# Sprint 33 — 第一次月考八科題庫集中擴充 Design

## 狀態

Implementation complete / Awaiting Human Review。尚未 commit、push 或部署 Sprint 33 測試版本。

## 範圍與證據界線

本批依正式治理文件已確認的第一次月考範圍，先處理有充分依據的四組題庫：姐姐數學、姐姐自然、姐姐社會及妹妹社會。妹妹國語與妹妹數學本批未新增題目，因現有題庫已覆蓋可安全處理的觀念，避免以換數字或換句話重複建立 learning unit。

姐姐國語與妹妹自然的月考出版社、單元／課次仍缺少正式確認，因此維持「第一次月考題庫準備中」，不將一般題庫自動列入月考 allowlist。

本批題目依 Human 已確認範圍、既有正式題庫觀念及可驗證的學科基本概念設計；Codex 未直接存取對話中的原始教材截圖，不宣稱完成逐頁課本核對。後續學校考卷與更細的教材校準仍待 Human 提供。

## 本批新增題目

| questionId | 學生／科目 | 範圍 | 細部觀念 | 類型 |
| --- | --- | --- | --- | --- |
| `jiejie-mathematics-14` | 姐姐／數學 | 南一六上數學第 1 單元 | 12 與 18 的最小公倍數 | 新 singleton |
| `jiejie-mathematics-15` | 姐姐／數學 | 南一六上數學第 4 單元 | 直徑與半徑的關係 | 新 singleton |
| `jiejie-natural-science-11` | 姐姐／自然 | 康軒六上自然第 1 單元 | 雲滴／冰晶增長後形成降水 | 新 singleton |
| `jiejie-natural-science-12` | 姐姐／自然 | 康軒六上自然第 1 單元 | 蒸發後溶解物質仍留下 | 新 singleton |
| `jiejie-social-studies-11` | 姐姐／社會 | 康軒六上社會第 1 單元 | 數位工具擴大學習與資訊取得方式 | 新 singleton |
| `jiejie-social-studies-12` | 姐姐／社會 | 康軒六上社會第 2 單元 | 介紹節慶時尊重差異並使用可靠資料 | 新 singleton |
| `meimei-social-studies-9` | 妹妹／社會 | 三上社會第 1 單元 | 家人分隔兩地仍可聯絡與互相支持 | 新 singleton |
| `meimei-social-studies-10` | 妹妹／社會 | 三上社會第 2 單元 | 作業前安排用品、座位與時間 | 新 singleton |

八題均有完整四選項、唯一正解、Hint、Explanation、metadata 與 exact-match tests；未設定 `reviewGroupId`，未建立 variation，也未修改既有題目。

## 月考 allowlist

本批將四組新增 questionId 以 explicit allowlist 納入月考練習：姐姐數學 13 題、姐姐自然 12 題、姐姐社會 12 題、妹妹社會 10 題。妹妹國語維持 12 題、妹妹數學維持 10 題；姐姐國語與妹妹自然維持準備中。六組目前合計 69 題。

一般練習、首次練習 shuffle、Today Review、再練一次、1/3/7、confirmation、practice no-write、timer、Parent Summary 與學生／科目隔離不變。

## 驗證與後續

先以題庫 exact-match、唯一正解、singleton metadata 與 allowlist focused tests 驗證，再執行完整 Node、lint、TypeScript、build、disposable Chromium Browser smoke、tablet viewport 與 `git diff --check`。正式家庭 LAN 服務不在本批測試中斷或覆蓋；Sprint 33 不部署新版本。

後續 backlog：妹妹國語與妹妹數學的月考缺口、姐姐國語與妹妹自然的正式範圍資料、學校考卷題型校準，以及其他教材細節的 Human review。

## 本次驗證紀錄

- Focused Node 6/6、完整 Node 185/185、lint、TypeScript `--incremental false`、production build、disposable Browser 41/41 與 `git diff --check` 通過。
- Browser smoke 包含四組新增題庫入口、未確認的姐姐國語／妹妹自然隔離、既有六科流程、Learning Record／複習／家長與 768×1024、1024×768 版面；未使用真實瀏覽器 profile 或正式 localStorage。
- 正式家庭 LAN 服務維持原狀；Sprint 33 隔離驗證 server 使用 127.0.0.1:3101，完成後停止，未提供 Sprint 33 平板網址或覆蓋正式服務。
