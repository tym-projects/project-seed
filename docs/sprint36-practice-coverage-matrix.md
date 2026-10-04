# Sprint 36 平時練習題庫覆蓋矩陣

> 狀態：Final Closeout；Sprint 36 Completed，36 題已加入正式題庫，Deferred Human Exception 為 0，Human tablet acceptance PASS。

## 基準與證據界線

- 盤點基準：正式 repository `C:\Users\admin\Documents\2026AST-dev`，HEAD `27d5c46`，`main` 與 `origin/main` 同步。
- 實作前 baseline 為 102 題、97 個 learning units；本輪已加入 20 題 singleton，現在為 122 題、117 個 learning units。相較舊文件 94 題，遺漏的是 Sprint 33 的 8 題，不回退既有 source。
- 目前程式中的第一次月考 allowlist 合計 87 題；本輪新增平時題未自動加入月考，正式 baseline 以 source／validation 為準。
- 人提供的課程範圍可作規劃依據；本環境無法直接讀取對話中的原始教材照片，因此 lesson-level 對應標為「待圖片核對」時，不視為已完成逐頁教材驗證。
- 公開資料只作單元／概念輔助，不把其他出版社、學年度或網路題目當作實際教材原文。

## 現有覆蓋與缺口

| 學生／科目 | 已有題目／units | 目前 questionId 範圍 | 已覆蓋概念（依題幹與解析） | 主要缺口與優先候選 | 證據狀態 |
|---|---:|---|---|---|---|
| 姐姐國語 | 21／19 | `jiejie-chinese-1`–`-21`；`-2`、`-4` 及 uncertain legacy IDs 不進目前 practice | 注音、成語、錯別字、詞語／語句／短文理解、段落主旨、人物原因推論 | 已補齊自編短文理解與情境推論 | 月考單元已確認；新增題為自編情境，不宣稱課文原句 |
| 姐姐數學 | 20／20 | `jiejie-mathematics-1`–`-20` | 原有概念加上分數除法兩步驟、圓面積兩步驟、估算 | 已補齊兩步驟理解與應用 | 南一六上 1–4 單元範圍已確認 |
| 姐姐自然 | 17／17 | `jiejie-natural-science-1`–`-17` | 原有概念加上溶解比較、連續天氣資料判讀 | 已補齊實驗觀察與資料整合 | 康軒六上 1–2 單元已確認 |
| 姐姐社會 | 16／16 | `jiejie-social-studies-1`–`-16` | 原有概念加上生活方式變化、族群交流影響 | 已補齊社會情境與比較推論 | 康軒六上 1–2 單元已確認 |
| 妹妹國語 | 16／13 | `meimei-chinese-1`–`-16` 及既有動作詞題 | 原有詞語、動作詞、量詞，加上句序、關鍵訊息與因果理解 | 已補齊自編短文理解 | 三上第 1–6 課範圍已確認；新增題為自編情境 |
| 妹妹數學 | 17／17 | `meimei-mathematics-1`–`-17` | 原有概念加上位值比較、乘法意義、公分毫米換算、兩步驟應用 | 已補齊四位數加減與分組乘法應用 | 南一三上 1–4 單元範圍已確認 |
| 妹妹自然 | 17／17 | `meimei-natural-science-1`–`-17` | 原有概念加上植物向光觀察、公平比較水分變化、空氣／水比較 | 已補齊植物與環境、觀察設計 | 三上「認識植物」「空氣和水」已確認 |
| 妹妹社會 | 14／14 | `meimei-social-studies-1`–`-14` | 原有概念加上家庭責任調整、檢查與修正學習 | 已補齊家庭合作與學習策略情境 | 三上 1–2 單元已確認 |

## First-phase capacity planning baseline

此為候選容量，不是湊題配額，也不是正式入庫核准：

| 學生 | 國語 | 數學 | 自然 | 社會 | 小計 |
|---|---:|---:|---:|---:|---:|
| 姐姐 | 5 | 5 | 4 | 4 | 18 |
| 妹妹 | 5 | 5 | 4 | 4 | 18 |
| 合計 | 10 | 10 | 8 | 8 | 36 |

建議先以 36 個新 learning-unit 候選為中心，再依教材證據與逐題品質檢查縮減；32–40 個是合理規劃區間，不是 KPI。Priority A 為妹妹國語／妹妹社會，Priority B 為姐姐自然／姐姐社會，Priority C 為姐姐國語／姐姐數學／妹妹數學／妹妹自然；若矩陣顯示重大缺口可調整。完整 Evidence Closure 與草案見 `docs/sprint36-evidence-closure-and-candidate-drafts.md`。

## 既有品質基線

實作前八科 answerIndex（index 0/1/2/3）合計為 `30/36/25/11`；實作後為 `39/45/34/20`。這是固定選項順序的統計，不使用 runtime shuffle；Sprint 36 新題為 `9/9/9/9`。

## 來源

- 國家教育研究院課程綱要入口：<https://www.naer.edu.tw/PageSyllabus?fid=22>
- 臺北市公開三年級自然課程資料（植物、空氣和水等單元概念，僅作公開課程輔助）：<https://tten.tp.edu.tw/Login/Downment?grade=3&spid=89f15c5c-ef7d-4527-b877-89722f46a0d2&subject=Nature>
- 臺北市公開三年級自然課程資料（另一公開版本，僅作交叉參考）：<https://tten.tp.edu.tw/Login/Downment?grade=3&spid=70c04c65-904a-43ae-bd4e-b9bd7f7d167f&subject=Nature>
- 新北市公開南一六上分數除法教學計畫：<https://lgt.ntpc.edu.tw/TeachPlan_Detail_Upload.aspx?id=1497>

以上來源不取代 Human 指定教材，也不直接授權任何正式題目。
