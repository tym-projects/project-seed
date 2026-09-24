# Sprint 30 第一批原創評量題 Design

## 狀態

Final Human Review approved / close pending

本文件記錄已核准、尚待 Final Human Review 的第一批 6 題；本階段不含 commit、push 或 Sprint 30 close。

## 範圍與證據界線

- 姐姐自然：康軒六上第 1 單元「探索天氣的變化」：2 題。
- 姐姐社會：康軒六上第 1–2 單元：2 題。
- 妹妹社會：三上第 1–2 單元：2 題。
- 姐姐第 3 單元小數除法估算、妹妹國語、妹妹自然及其他科目不在本批。
- 題目依 Human 核准的題幹、選項、答案、Hint、Explanation 與明確月考範圍實作。Codex 無法直接存取先前對話中的原始截圖，因此不宣稱已完成圖片逐頁核對；細部教材對應仍以 Human 內容審核為最後依據。

## 題目與 learning unit

| questionId | 學生／科目 | 單元／觀念 | 類型 | 正解 index | learning unit |
| --- | --- | --- | --- | ---: | --- |
| `jiejie-natural-science-5` | 姐姐／自然 | 探索天氣的變化／水蒸氣遇冷凝結 | basic | 1 | singleton |
| `jiejie-natural-science-6` | 姐姐／自然 | 探索天氣的變化／衛星雲圖用途與判讀限制 | application | 2 | singleton |
| `jiejie-social-studies-5` | 姐姐／社會 | 個人發展如何受到社會變遷的影響？／教育機會與個人發展 | application | 1 | singleton |
| `jiejie-social-studies-6` | 姐姐／社會 | 族群交流如何影響臺灣社會？／族群文化交流 | application | 3 | singleton |
| `meimei-social-studies-5` | 妹妹／社會 | 我和我的家人／依家庭關係辨認親屬稱謂 | basic | 1 | singleton |
| `meimei-social-studies-6` | 妹妹／社會 | 學習的方法／將學習任務分解並安排步驟 | application | 0 | singleton |

完整題幹、選項、Hint、Explanation 與 encouragement 以正式題庫檔案及 exact-match test 為準。每題均有四個不重複選項、唯一正解、非空 Hint／Explanation，且未設定 `reviewGroupId` 或 variation。

## 與既有題庫的差異

- 姐姐自然第 5 題測量凝結，與既有第 1–2 題的蒸發不同；第 6 題測量衛星雲圖判讀限制，亦非既有蒸發／溶解觀念。
- 姐姐社會第 5 題測量教育機會對個人發展的影響；第 6 題測量族群文化交流的具體影響，分別不同於既有社會變遷例子與文化尊重。
- 妹妹社會第 5 題測量親屬稱謂，與家庭分工／溝通不同；第 6 題測量安排學習步驟，與學習來源／面對困難不同。
- 因觀念不同，6 題均新增 singleton，不改動既有 reviewGroup、Learning Record、ReviewSession 或複習語意。

## 驗證與保護

- Node exact-match tests 固定 questionId、metadata、題幹、選項、answer、Hint、Explanation，並驗證唯一選項、有效答案、singleton 與學生／科目題庫隔離。
- Browser smoke 使用 disposable Chromium context 與 synthetic storage，驗證三個新增題庫入口載入、作答回饋與 console error 為零。
- 完整回歸包含 Node、lint、TypeScript `--incremental false`、build、Browser smoke、viewport 與 `git diff --check`。
- 不修改 schema、storage keys、既有題目、選題／複習規則或真實學習資料。

## Human Review Items

1. 確認 6 題的細部教材對應及年級適切性，尤其「衛星雲圖判讀限制」是否符合實際教材教學深度。
2. Human 已完成平板驗收及妹妹社會親屬稱謂補充複驗；Final Approval 已取得。
