# Sprint 31 第一批自然題庫 Design

## 狀態

Completed

## 範圍

本批只新增姐姐自然兩題：

- `jiejie-natural-science-7`：第 1 單元，蒸發、凝結與降水的連續關係。
- `jiejie-natural-science-8`：第 2 單元，水溶液中已溶解物質的均勻分散。

姐姐自然第一次月考範圍已確認為第 1–2 單元。本批依已確認範圍及現有題庫設計，未針對兩題完成實際課本逐頁核對，不虛構頁碼或教學進度。

## 題目與 learning unit

兩題均為原創四選一題，使用現有 Question schema；每題為獨立 singleton learning unit，不設定 `reviewGroupId`，不建立 variation。

### `jiejie-natural-science-7`

- Topic：`探索天氣的變化`
- Type：`basic`
- 題幹：下列哪一個順序最能表示自然界中水循環的一段常見變化？
- 選項：A. 水蒸發 → 水蒸氣凝結 → 降水；B. 水蒸發 → 降水 → 水蒸氣凝結；C. 水蒸氣凝結 → 水蒸發 → 降水；D. 降水 → 水蒸氣凝結 → 水蒸發
- 正解：A，answer index `0`
- Hint：先想水如何進入空氣，再想雲和雨是如何形成的。
- Explanation：地表的水蒸發成水蒸氣，水蒸氣在適當條件下凝結成小水滴或小冰晶，雲中的水滴或冰晶增長後可能形成降水。本題考查蒸發、凝結與降水的關係。

### `jiejie-natural-science-8`

- Topic：`水溶液`
- Type：`basic`
- 題幹：將少量砂糖加入水中並充分攪拌，確認砂糖已完全溶解。下列哪一項描述最正確？
- 選項：A. 砂糖完全消失，因此糖水中已經沒有砂糖；B. 砂糖只分布在杯底，上層仍然是純水；C. 砂糖均勻分散在水中，糖水各部分都含有砂糖；D. 砂糖會變成細小顆粒，只集中在水面附近
- 正解：C，answer index `2`
- Hint：看不見砂糖顆粒，是否代表砂糖已經不存在？
- Explanation：砂糖完全溶解後，仍存在於糖水中，並均勻分散；看不見原本的顆粒，不代表砂糖消失。

## 相容性與驗證

- 既有蒸發、凝結、溶質／溶劑及攪拌題目不修改。
- 水循環題測量階段連續關係；水溶液題測量均勻分散，分別是新觀念。
- 不修改 Learning Record／ReviewSession schema、storage keys、選題或複習語意。
- Focused tests 固定完整內容、唯一答案、singleton、題庫隔離與既有題目保留。
- 完成後執行 Node、lint、TypeScript、build、Browser smoke、viewport 與 `git diff --check`。

## 證據界線與待人工事項

公開課程資料可支持水的蒸發、凝結、水循環及水溶液的單元級規劃；Codex 無法直接存取先前對話的原始教材截圖，因此不宣稱已完成逐頁教材核對。Human 已完成實際平板驗收 6/6，Final Human Review 已核准。
