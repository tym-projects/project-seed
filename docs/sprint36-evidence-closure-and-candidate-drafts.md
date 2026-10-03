# Sprint 36 Evidence Closure and Candidate Drafts

## 1. Baseline closure

目前正式 source 的 Before baseline 為 **102 questions／97 learning units／89 monthly-allowlist questions**。

舊文件的 94／89／85 不是另一個有效產品版本，而是文件同步遺漏：

- 舊 94 題相較目前 102 題少的 8 題，是 Sprint 33 已加入但 Sprint 34 後續文件未納入統計的題目：`jiejie-mathematics-14`、`jiejie-mathematics-15`、`jiejie-natural-science-11`、`jiejie-natural-science-12`、`jiejie-social-studies-11`、`jiejie-social-studies-12`、`meimei-social-studies-9`、`meimei-social-studies-10`。
- 舊 85 題相較目前 89 題少的 4 題，是 Sprint 34 將妹妹自然既有題 `meimei-natural-science-1`～`-4` 一起納入已確認月考範圍後，舊文件只按新增 8 題計算的同步遺漏。
- `git log` 顯示 78 題在 Sprint 32、Sprint 33 後為 86 題、Sprint 34 後為 102 題；source 與 allowlist 歷史均可重現。沒有題目被重複建立，也沒有需要刪除或重用 ID 的情況。

因此 Sprint 36 不修改題庫來配合舊數字；正式 baseline 以 source／validation 為準。

## 2. Evidence status register

狀態定義：`Ready` 可進入後續實作候選；`Revised` 已修正題型／措辭後可再審；`Pending Review` 缺少教材或版本證據；`Rejected` 不列入本批。

| Bank | Candidate concepts | Status |
|---|---|---|
| 姐姐國語 | 修辭判讀、段落主旨、觀點推論、課文詞語情境、篇章結構 | 0 Ready／0 Revised／5 Pending |
| 姐姐數學 | 分數除法情境、除法意義、圓面積應用、估算、兩步題 | 2 Ready／1 Revised／2 Pending |
| 姐姐自然 | 天氣資料判讀、雲雨推論、溶液變因 | 2 Ready／1 Revised／1 Pending |
| 姐姐社會 | 社會變遷資料判讀、族群交流與尊重、文化傳遞、生活變化 | 1 Ready／1 Revised／2 Pending |
| 妹妹國語 | 課次字形、詞語情境、句序、短文關鍵訊息、因果推論 | 0 Ready／0 Revised／5 Pending |
| 妹妹數學 | 位值比較、估算、乘法意義、公分毫米、多步情境 | 2 Ready／1 Revised／2 Pending |
| 妹妹自然 | 植物部位比較、植物與環境、公平觀察、空氣／水推論 | 3 Ready／0 Revised／1 Pending |
| 妹妹社會 | 家庭溝通、責任合作、時間規劃、學習資訊整理 | 1 Ready／1 Revised／2 Pending |
| **合計** | **36 個規劃候選** | **11 Ready／5 Revised／20 Pending／0 Rejected** |

Pending 主要原因是無法由目前環境直接核對 Human 提供的原始教材照片、國語逐課字詞，或需避免把生活情境／社會細節誤當成課本已教內容。Ready／Revised 仍需 Human 內容審核後才可入庫。

## 3. Ready／Revised candidate drafts

以下均為原創草案，不是正式題庫；`monthly-eligible` 只是標記，Sprint 36 不修改 allowlist。除特別標示外，建議新 singleton learning unit。

### 姐姐數學

#### S36-JM-01 — Ready

- Unit／concept：南一六上分數的除法；分數除法生活情境；difficulty `application`。
- Question：一壺果汁有 `3/4` 公升，每杯倒 `1/8` 公升，最多可以倒滿幾杯？
- Options：A. 4 杯；B. 6 杯；C. 8 杯；D. 12 杯。
- Correct：B，index `1`。
- Hint：把 `3/4` 除以 `1/8`，想想四分之三裡有幾個八分之一。
- Explanation：`3/4 = 6/8`，所以 `6/8 ÷ 1/8 = 6`。
- Evidence：Human-confirmed Unit 2；公開南一六上分數除法教學計畫作題型方向參考。<https://lgt.ntpc.edu.tw/TeachPlan_Detail_Upload.aspx?id=1497>
- Difference：現有題目若為直接計算，本題測量單位量與生活語境轉換；singleton。monthly-eligible：no。

#### S36-JM-02 — Ready

- Unit／concept：南一六上圓周長和圓面積；圓面積情境；difficulty `application`。
- Question：圓形花圃半徑 5 公尺，圓周率取 3.14，花圃面積約是多少平方公尺？
- Options：A. 15.7；B. 31.4；C. 78.5；D. 157。
- Correct：C，index `2`。
- Hint：圓面積用「半徑 × 半徑 × 圓周率」。
- Explanation：`5 × 5 × 3.14 = 78.5`，所以面積是 78.5 平方公尺。
- Evidence：Human-confirmed Unit 4；依既有題庫圓周長／面積概念設計，教材細節仍待圖片核對。monthly-eligible：no。
- Difference：由公式辨認轉為生活情境應用；singleton。

#### S36-JM-03 — Revised

- Unit／concept：南一六上小數的除法；估算與合理性判斷；difficulty `understanding`。
- Question：`6.3 ÷ 0.8` 的結果最接近哪一個數？
- Options：A. 0.8；B. 4；C. 8；D. 80。
- Correct：C，index `2`。
- Hint：先把 6.3 想成約 6.4，0.8 × 8 等於多少？
- Explanation：`6.3 ÷ 0.8 = 7.875`，最接近 8。此題不宣稱特定教材的四捨五入表述，需教材確認後才可入庫。
- Evidence：Human-confirmed Unit 3；此前已標記估算表述待確認。monthly-eligible：no。
- Difference：與直接小數除法不同，測量估算與合理性；singleton，教材核准前維持 Revised／Pending。

### 姐姐自然

#### S36-JN-01 — Ready

- Unit／concept：康軒六上探索天氣的變化；表格多條件判讀；difficulty `understanding`。
- Question：某日早上氣溫 18°C、下午 25°C，且下午降雨量增加。下列哪項敘述最合理？
- Options：A. 下午比早上溫暖，且天氣變化需要持續觀察；B. 下午一定沒有雲；C. 降雨量增加表示氣溫一定下降；D. 只量一次就能知道整週天氣。
- Correct：A，index `0`。
- Hint：分別讀氣溫和降雨量，不要把一項資料當成全部原因。
- Explanation：資料顯示下午氣溫較高、降雨量增加；天氣判斷要綜合並持續觀察，不能由單一資料推出其他選項。
- Evidence：Human-confirmed Unit 1；概念符合公開課程的天氣觀察方向。monthly-eligible：no。
- Difference：由單一天氣概念進一步做多條件資料判讀；singleton。

#### S36-JN-02 — Ready

- Unit／concept：康軒六上探索天氣的變化；雲、凝結與降水推論；difficulty `application`。
- Question：裝冰水的杯子外壁出現小水珠，這些水最可能從哪裡來？
- Options：A. 杯內的水穿過杯壁；B. 空氣中的水蒸氣遇冷凝結；C. 冰塊變成砂糖；D. 杯子自己產生水。
- Correct：B，index `1`。
- Hint：想想看不見的水蒸氣遇到較冷表面會怎樣。
- Explanation：空氣中的水蒸氣遇到冷杯壁會凝結成小水滴，水珠不是杯內的水穿出來。
- Evidence：Human-confirmed Unit 1；與既有水循環概念相容但測量生活觀察推論。monthly-eligible：no。
- Difference：不是背誦蒸發順序，而是從現象推論凝結；singleton。

#### S36-JN-03 — Revised

- Unit／concept：康軒六上水溶液；實驗變因控制；difficulty `application`。
- Question：想比較攪拌是否會影響砂糖溶解速度，哪一種做法最公平？
- Options：A. 一杯用熱水且攪拌，另一杯用冷水且不攪拌；B. 兩杯水量、溫度、砂糖量相同，只改變是否攪拌；C. 一杯砂糖較多，另一杯水較少；D. 兩杯同時改變溫度和攪拌。
- Correct：B，index `1`。
- Hint：公平比較時一次只改變一個條件。
- Explanation：要判斷攪拌的影響，其他條件應相同，只改變是否攪拌。這是 Revised，需核對教材是否已教控制變因。
- Evidence：Human-confirmed Unit 2；現有題庫有溶解／攪拌概念，但教材細部表述待核對。monthly-eligible：no。
- Difference：測量實驗設計而非溶解定義；singleton。

### 姐姐社會

#### S36-JS-01 — Ready

- Unit／concept：康軒六上社會變遷下的個人發展；資料判讀；difficulty `understanding`。
- Question：以前許多家庭由一位家人專心工作，現在家庭中可能有不同成員工作，也分擔家務。這最能說明什麼？
- Options：A. 社會變遷可能影響家庭分工與個人角色；B. 所有家庭都必須採用同一分工；C. 家務只應由某一種性別負責；D. 家庭角色永遠不會改變。
- Correct：A，index `0`。
- Hint：比較「以前」和「現在」的生活安排。
- Explanation：社會變化可能帶來家庭分工與個人角色的改變，但不同家庭仍可能有不同安排。
- Evidence：Human-confirmed Unit 1；公開六年級社會課程資料支持社會變遷與個人發展的連結。<https://tten.tp.edu.tw/Login/Downment?grade=6&spid=3ffe4ded-18a0-4bd7-860b-78bc6259a81f&subject=Society>
- Difference：以生活資料判斷社會變遷影響，非重述定義；singleton。

#### S36-JS-02 — Revised

- Unit／concept：康軒六上族群交流；文化交流與尊重；difficulty `application`。
- Question：班上同學分享不同家庭的節慶食物與故事時，哪種做法最能展現尊重？
- Options：A. 先聆聽並詢問分享者的說法；B. 直接說自己的習慣一定比較好；C. 未了解就替對方下結論；D. 因為不同就要求對方不要分享。
- Correct：A，index `0`。
- Hint：尊重不同文化時，先理解再表達意見。
- Explanation：先聆聽並詢問能避免刻板印象，也讓交流建立在理解上。此題需 Human 核對是否符合教材案例語氣。
- Evidence：Human-confirmed Unit 2；公開社會課程資料支持族群交流與文化理解方向。monthly-eligible：no。
- Difference：測量交流情境判斷，不重複既有文化名詞題；singleton。

### 妹妹數學

#### S36-MM-01 — Ready

- Unit／concept：南一三上數到 10000；位值與比較；difficulty `understanding`。
- Question：下列哪個數最接近 5000，且比 5000 小？
- Options：A. 4990；B. 5010；C. 5900；D. 490。
- Correct：A，index `0`。
- Hint：先找比 5000 小的數，再比較差多少。
- Explanation：4990 比 5000 少 10，是選項中最接近且小於 5000 的數。
- Evidence：Human-confirmed Unit 1；既有四位數比較題延伸；singleton。monthly-eligible：no。

#### S36-MM-02 — Ready

- Unit／concept：南一三上乘法；乘法意義與情境；difficulty `application`。
- Question：每盒有 6 枝彩色筆，買 4 盒共有幾枝？
- Options：A. 10；B. 18；C. 24；D. 46。
- Correct：C，index `2`。
- Hint：把 6 個重複 4 次，可以用哪個乘法？
- Explanation：`6 × 4 = 24`，表示 4 盒、每盒 6 枝。
- Evidence：Human-confirmed Unit 3；年級適切且為乘法意義情境；singleton。monthly-eligible：no。

#### S36-MM-03 — Revised

- Unit／concept：南一三上幾毫米；公分與毫米轉換；difficulty `application`。
- Question：一條緞帶長 5 公分 6 毫米，又接上 2 公分 8 毫米，合起來是多少？
- Options：A. 7 公分 14 毫米；B. 8 公分 4 毫米；C. 8 公分 14 毫米；D. 7 公分 4 毫米。
- Correct：B，index `1`。
- Hint：10 毫米等於 1 公分，先把毫米合起來再進位。
- Explanation：`6+8=14` 毫米 = 1 公分 4 毫米，再加 `5+2+1=8` 公分，所以是 8 公分 4 毫米。需再次檢查選項單位等值風險後才可入庫。
- Evidence：Human-confirmed Unit 4；與既有長度相加題相比增加進位判斷；singleton。

### 妹妹自然

#### S36-MN-01 — Ready

- Unit／concept：三上認識植物；部位比較與功能；difficulty `understanding`。
- Question：哪一組配對最合理？
- Options：A. 根—吸收水分；B. 葉—固定植物在土裡；C. 莖—把植物變成種子；D. 花—把空氣壓進土裡。
- Correct：A，index `0`。
- Hint：想想根通常在土裡，主要幫植物做什麼。
- Explanation：根能從土壤吸收水分，其他配對不是本題所述的主要功能。
- Evidence：Human-confirmed Unit 1；公開三年級自然課程資料支持植物部位與功能概念。<https://tten.tp.edu.tw/Login/Downment?grade=3&spid=89f15c5c-ef7d-4527-b877-89722f46a0d2&subject=Nature>
- Difference：比較多部位功能，非單一根部功能；singleton。monthly-eligible：no。

#### S36-MN-02 — Ready

- Unit／concept：三上認識植物；環境與生長推論；difficulty `application`。
- Question：兩盆同種植物，一盆放在有陽光處，一盆放在完全沒有陽光的櫃子裡。過幾天比較，最合理的觀察是什麼？
- Options：A. 兩盆一定完全一樣；B. 光線條件可能造成生長情形不同；C. 沒有陽光的植物一定立刻死亡；D. 只要澆水就不需要其他條件。
- Correct：B，index `1`。
- Hint：觀察推論要用「可能」描述，不把結果說得過度絕對。
- Explanation：光線是植物生長的條件之一，兩盆條件不同，生長情形可能不同；不能直接推論一定立刻死亡。
- Evidence：Human-confirmed Unit 1；公開課程資料支持植物與環境觀察方向；singleton。

#### S36-MN-03 — Ready

- Unit／concept：三上空氣和水；空氣占有空間；difficulty `understanding`。
- Question：把倒扣的空杯子壓入水中，水沒有立刻進入杯內，最可能的原因是什麼？
- Options：A. 杯內的空氣占有空間；B. 水怕進入杯子；C. 杯子沒有底；D. 空氣只能在室外存在。
- Correct：A，index `0`。
- Hint：杯子裡原本不是空無一物，想想裡面有什麼。
- Explanation：杯內的空氣占有空間，水要進入前必須先把空氣排出。
- Evidence：Human-confirmed Unit 2；公開三年級自然課程資料支持空氣占有空間概念；singleton。

### 妹妹社會

#### S36-MS-01 — Ready

- Unit／concept：三上我和我的家人；溝通與合作；difficulty `application`。
- Question：家人對週末活動有不同想法時，哪種做法最適合？
- Options：A. 大聲要求大家照自己的想法；B. 先聽聽每個人的理由，再一起討論；C. 不告訴家人就自己決定；D. 因為不同意就不再說話。
- Correct：B，index `1`。
- Hint：合作前要先了解彼此的想法。
- Explanation：傾聽理由再討論，能讓家人一起找適合的安排，也尊重不同意見。
- Evidence：Human-confirmed Unit 1；沿用現有家庭互動概念，避免假定單一家庭型態；singleton。monthly-eligible：no。

#### S36-MS-02 — Revised

- Unit／concept：三上學習的方法；時間安排與任務分解；difficulty `application`。
- Question：小安明天要交閱讀紀錄和美勞作品，哪種安排最有幫助？
- Options：A. 到明天早上才同時開始；B. 先列出兩件事，再分配今天和明天的時間；C. 只做自己喜歡的那一件；D. 等別人提醒才開始。
- Correct：B，index `1`。
- Hint：把工作列出來並分配時間，比全部留到最後更容易完成。
- Explanation：列出任務並分配時間，可以掌握先後與完成情形；此題需 Human 核對是否符合課文中的學習策略表述。
- Evidence：Human-confirmed Unit 2；現有學習方法題型延伸；singleton。

## 4. Quality review result

- 16 份 Ready／Revised 草案已完成欄位級草擬；其中 Revised 5 題需重新檢查教材措辭或等值選項。
- 20 個候選維持 Pending Review，主要集中於妹妹國語、姐姐國語及缺少逐課教材證據的細部概念。
- 暫無 Rejected；若 Human 或教材審核發現重複、超綱、第二正解或事實問題，應降級或剔除，不以達成題數為目標。
- 草案暫不修改正式 question bank、monthly allowlist、Learning Record、ReviewSession 或任何 storage。

## 5. 下一個 gate

Human 需審核 Ready／Revised 草案的題意、年級感、教材對應及是否進入正式實作；Pending 題目需補教材證據或維持排除。確認後才建立正式 test-first 入庫批次。

## 6. Human Review 修訂版（以本節取代前述 5 題）

以下修訂尚未入庫。固定選項重排後，16 題候選的 answerIndex 目標為 `4/4/4/4`（0/1/2/3）。

- `S36-JN-02` concept 改為「水蒸氣遇冷凝結現象」；不再宣稱測量降水。
- `S36-JN-03` 學生可見語句使用「公平比較」「其他條件相同」「一次只改變一個條件」，不使用「控制變因」作為必要術語；正解調整至 C/index 2。
- `S36-MM-02` 改為兩步題：「教室有 4 排座位，每排 6 個，已坐 17 位，還有幾個空位？」選項 A 6、B 8、C 7、D 41；正解 C/index 2。計算為 `4×6=24`、`24−17=7`。
- `S36-MM-03` 保留長度相加概念，選項改為 A 7 公分 4 毫米、B 7 公分 8 毫米、C 9 公分 4 毫米、D 8 公分 4 毫米；正解 D/index 3。四個換算值分別為 74、78、94、84 毫米，沒有等值選項。
- `S36-MN-01` 改為「不同植物部位功能比較」：根負責固定與吸收水分、莖支撐與運送、葉接收光線；正解 C/index 2。此題測量整合比較，不新增單一根功能題。
- `S36-MN-02` 改為植物與生活用途：「校園種植樹木可提供遮蔭並改善環境」的生活應用判斷；正解 D/index 3，避免重複既有植物與陽光題。
- `S36-MN-03` 改為空氣與水特性比較：針筒分別裝空氣與水並推壓活塞，空氣較容易被壓縮；正解 A/index 0。此題仍需確認教材對比較實驗的表述。
- 為分散答案位置，`S36-JM-03` 正解移至 D/index 3、`S36-JS-01` 正解移至 D/index 3、`S36-MM-01` 正解移至 B/index 1、`S36-MS-02` 正解移至 A/index 0；正確答案內容不變。

修訂後仍需執行 existing learning-unit dedup；若 `S36-MN-03` 或任何替換題與現有 unit 實質重複，應降為 Pending，不得硬湊 16 題。

## 7. 姐姐四科 Scope Audit

| 科目 | 原題數 | IN-SCOPE | OUT-OF-SCOPE | UNCERTAIN | 目前 active practice | 安全範圍 active pool |
|---|---:|---:|---:|---:|---:|---:|
| 國語 | 17 | 8 (`-10`～`-17`) | 2 (`-2`、`-4` 歷史部首題) | 7 (`-1`、`-3`、`-5`～`-9`) | 15 | 8 |
| 數學 | 15 | 13 (`-1`～`-4`、`-7`～`-15`) | 2 (`-5`、`-6`) | 0 | 15 | 13 |
| 自然 | 12 | 12 (`-1`～`-12`) | 0 | 0 | 12 | 12 |
| 社會 | 12 | 10 (`-3`～`-12`) | 2 (`-1`、`-2` 民主政治) | 0 | 12 | 10 |
| **合計** | **56** | **43** | **4** | **7** | **54** | **43** |

判定依實際 topic／題幹，而非僅依 questionId。國語 `-2`、`-4` 已由既有 `practiceQuestions` 排除；但 `-1`、`-3`、`-5`～`-9` 目前仍會進一般 practice，因為目前沒有依月考範圍的 active filter。數學、自然、社會一般頁面目前直接傳入完整 `questions`。

姐姐社會 monthly allowlist 目前包含 `jiejie-social-studies-1`、`jiejie-social-studies-2`，與 Human-confirmed 前兩單元範圍不一致；依授權規則暫不自行修改，停止於 Human Scope／Allowlist Review Gate。

歷史題目與 questionId 應保留；Parent Center 的歷史顯示仍應使用完整題庫解析。若後續採 active filter，需先以 failing tests 保護 general practice、Today Review、retry／reinforce、Parent Center、妹妹流程與 monthly mode。
