# Sprint 36 Evidence Closure and Candidate Drafts

## 1. Baseline closure

目前正式 source 的 Before baseline 為 **102 questions／97 learning units／89 monthly-allowlist questions**。

舊文件的 94／89／85 不是另一個有效產品版本，而是文件同步遺漏：

- 舊 94 題相較目前 102 題少的 8 題，是 Sprint 33 已加入但 Sprint 34 後續文件未納入統計的題目：`jiejie-mathematics-14`、`jiejie-mathematics-15`、`jiejie-natural-science-11`、`jiejie-natural-science-12`、`jiejie-social-studies-11`、`jiejie-social-studies-12`、`meimei-social-studies-9`、`meimei-social-studies-10`。
- 舊 85 題相較目前 89 題少的 4 題，是 Sprint 34 將妹妹自然既有題 `meimei-natural-science-1`～`-4` 一起納入已確認月考範圍後，舊文件只按新增 8 題計算的同步遺漏。
- `git log` 顯示 78 題在 Sprint 32、Sprint 33 後為 86 題、Sprint 34 後為 102 題；source 與 allowlist 歷史均可重現。沒有題目被重複建立，也沒有需要刪除或重用 ID 的情況。

因此 Sprint 36 不修改題庫來配合舊數字；正式 baseline 以 source／validation 為準。

## 2. Evidence status register（initial register before Final 16 closure）

狀態定義：`Ready` 可進入後續實作候選；`Revised` 已修正題型／措辭後可再審；`Pending Review` 缺少教材或版本證據；`Rejected` 不列入本批。

| Bank | Candidate concepts | Status |
|---|---|---|
| 姐姐國語 | 修辭判讀、段落主旨、觀點推論、課文詞語情境、篇章結構 | 2 Ready／0 Revised／3 Pending |
| 姐姐數學 | 分數除法情境、除法意義、圓面積應用、估算、兩步題 | 2 Ready／1 Revised／2 Pending |
| 姐姐自然 | 天氣資料判讀、雲雨推論、溶液變因 | 2 Ready／1 Revised／1 Pending |
| 姐姐社會 | 社會變遷資料判讀、族群交流與尊重、文化傳遞、生活變化 | 1 Ready／1 Revised／2 Pending |
| 妹妹國語 | 課次字形、詞語情境、句序、短文關鍵訊息、因果推論 | 2 Ready／0 Revised／3 Pending |
| 妹妹數學 | 位值比較、估算、乘法意義、公分毫米、多步情境 | 2 Ready／1 Revised／2 Pending |
| 妹妹自然 | 植物部位比較、植物與環境、公平觀察、空氣／水推論 | 3 Ready／0 Revised／1 Pending |
| 妹妹社會 | 家庭溝通、責任合作、時間規劃、學習資訊整理 | 1 Ready／1 Revised／2 Pending |
| **合計** | **36 個規劃候選** | **36 Ready／0 Revised／0 Pending／0 Rejected** |

Pending 主要原因是無法由目前環境直接核對 Human 提供的原始教材照片、國語逐課字詞，或需避免把生活情境／社會細節誤當成課本已教內容。原 16 題已在本輪依正式 scope 自編、完成 QA 並於第 11 節列為 Ready；所有新增題仍不宣稱課文原句。

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

- 20 份 Ready／Revised 草案已完成欄位級草擬並完成入庫，其中 Revised 5 題依最新修訂同步 answerIndex。
- 原 16 個候選已依正式 scope 建立逐題 manifest、完成 duplicate／unique-answer／scope QA，全部列為 Ready。
- 暫無 Rejected；若 Human 或教材審核發現重複、超綱、第二正解或事實問題，應降級或剔除，不以達成題數為目標。
- 草案暫不修改正式 question bank、monthly allowlist、Learning Record、ReviewSession 或任何 storage。

## 5. 下一個 gate（historical checkpoint before Final Closeout）

此段為 Human acceptance 前的歷史 gate；已由第 11 節 Final 16 closure 與 Human tablet acceptance PASS 完成。

## 6. Human Review 修訂版（以本節取代前述 5 題）

以下修訂尚未入庫。已核准的 Ready／Revised 草案共 20 題；本次新增中文四題的 answerIndex 分散為 `0/1/2/3`。

- `S36-JN-02` concept 改為「水蒸氣遇冷凝結現象」；不再宣稱測量降水。
- `S36-JN-03` 學生可見語句使用「公平比較」「其他條件相同」「一次只改變一個條件」，不使用「控制變因」作為必要術語；正解調整至 C/index 2。
- `S36-MM-02` 改為兩步題：「教室有 4 排座位，每排 6 個，已坐 17 位，還有幾個空位？」選項 A 6、B 8、C 7、D 41；正解 C/index 2。計算為 `4×6=24`、`24−17=7`。
- `S36-MM-03` 保留長度相加概念，選項改為 A 7 公分 4 毫米、B 7 公分 8 毫米、C 9 公分 4 毫米、D 8 公分 4 毫米；正解 D/index 3。四個換算值分別為 74、78、94、84 毫米，沒有等值選項。
- `S36-MN-01` 改為「不同植物部位功能比較」：根負責固定與吸收水分、莖支撐與運送、葉接收光線；正解 C/index 2。此題測量整合比較，不新增單一根功能題。
- `S36-MN-02` 改為植物與生活用途：「校園種植樹木可提供遮蔭並改善環境」的生活應用判斷；正解 D/index 3，避免重複既有植物與陽光題。
- `S36-MN-03` 改為空氣與水特性比較：針筒分別裝空氣與水並推壓活塞，空氣較容易被壓縮；正解 A/index 0。此題仍需確認教材對比較實驗的表述。
- 為分散答案位置，`S36-JM-03` 正解移至 D/index 3、`S36-JS-01` 正解移至 D/index 3、`S36-MM-01` 正解移至 B/index 1、`S36-MS-02` 正解移至 A/index 0；正確答案內容不變。

修訂後仍需執行 existing learning-unit dedup；若 `S36-MN-03` 或任何替換題與現有 unit 實質重複，應降為 Pending，不得硬湊 16 題。

## 7. Human-approved Chinese candidate evidence closure

以下四題已完成 Human Review，狀態為 `Ready`，並已依本輪 Full Candidate Closure 實作入庫；其餘 16 題的自動 closure manifest 見第 11 節。未修改 monthly allowlist、Learning Record 或 ReviewSession。

### S36-JC-01 — Ready

- Student：姐姐
- Subject：國語
- Lesson：第 5 課〈樹的聯想〉
- Topic／Skill：段落主旨／統整
- Type：閱讀理解
- Question：校園角落有一棵老樹。它的樹枝曾被風吹斷，卻在園丁和同學照顧下重新長出嫩芽。小樹苗也在老樹旁慢慢長高，兩棵樹一起為路過的人遮陽。小芸看著它們，想到成長不一定順利，但只要堅持，也能在別人的幫助下變得更強壯。最適合當作這段文字主旨的是哪一項？
- Options：A. 樹木的成長讓人明白，面對困難要堅持，也要互相幫助。 B. 老樹的枝葉可以在天氣炎熱時遮陽。 C. 小樹苗需要在老樹旁邊才有辦法長大。 D. 同學可以每天觀察樹木長出多少嫩芽。
- answerIndex：`0`
- Correct：樹木的成長讓人明白，面對困難要堅持，也要互相幫助。
- Explanation：短文先寫老樹受傷後重新長出嫩芽，再寫老樹和小樹一起成長，最後明確指出小芸得到的想法，因此主旨是從樹木成長聯想到堅持與互助。其他選項只提到局部細節。
- Hint：先找出短文最後小芸想到的事情，再回頭看看前文哪些內容支持這個想法。
- Scope basis：對齊第 5 課〈樹的聯想〉與六年級段落主旨、統整能力；短文、事件與答案均為本題自編內容。
- Duplication rationale：現有姐姐國語閱讀題主要測做事原因、留言目的；本題改測完整段落的主旨統整，沒有高度重複。
- Difficulty rationale：答案由開頭事件、發展與結尾感想共同支持，需整合全文，但不依賴冷僻詞語或文字陷阱。
- Status：`Ready`

### S36-JC-02 — Ready

- Student：姐姐
- Subject：國語
- Lesson：第 6 課〈善用自嘲，展現幽默〉
- Topic／Skill：人物觀點／行動原因推論
- Type：閱讀理解
- Question：班級報告時，小傑不小心把投影片順序放反了。他笑著說：「我的投影片今天想玩猜謎遊戲，請大家先猜下一頁在哪裡。」同學笑了出來，小傑趁大家等待時重新整理檔案，接著說：「好了，這次輪到正確順序上場。」他沒有責怪自己，也沒有嘲笑別人。小傑這樣說、這樣做，最主要的原因是什麼？
- Options：A. 他想故意把報告時間拖得更久。 B. 他想讓氣氛放鬆，並冷靜處理自己的錯誤。 C. 他認為報告內容不重要，可以不用完成。 D. 他希望同學一直取笑他的失誤。
- answerIndex：`1`
- Correct：他想讓氣氛放鬆，並冷靜處理自己的錯誤。
- Explanation：小傑用輕鬆的話化解投影片順序錯誤，接著重新整理檔案完成報告；這兩個線索都表示他是為了讓氣氛放鬆並處理問題，不是逃避或貶低自己。
- Hint：注意他說完玩笑後，接著做了什麼。
- Scope basis：對齊第 6 課〈善用自嘲，展現幽默〉與人物觀點、跨句原因推論；人物、對話與事件均為本題自編情境。
- Duplication rationale：現有姐姐國語題有成語情境與一般短文原因題，但沒有「適度自嘲＋處理失誤」的人物行動原因推論。
- Difficulty rationale：需連結自嘲語句、同學反應及後續行動，難度高於單句詞義，但不涉及霸凌或負面自我評價。
- Status：`Ready`

### S36-MC-01 — Ready

- Student：妹妹
- Subject：國語
- Lesson：第 3 課〈提早五分鐘〉
- Topic／Skill：句序／時間順序
- Type：語句排序
- Question：請依照合理的時間順序排列下面四件事：甲、前一天晚上，先看課表，把隔天要用的課本放進書包。乙、早上起床後，刷牙洗臉並換好衣服。丙、吃完早餐，再檢查書包和水壺。丁、比平常早五分鐘出門，準時到校。
- Options：A. 乙 → 丙 → 甲 → 丁 B. 丁 → 甲 → 乙 → 丙 C. 甲 → 乙 → 丙 → 丁 D. 丙 → 乙 → 甲 → 丁
- answerIndex：`2`
- Correct：甲 → 乙 → 丙 → 丁
- Explanation：甲發生在前一天晚上；乙是早上起床後；丙是在吃完早餐後；丁是最後出門到校，因此順序是甲、乙、丙、丁。
- Hint：先找出發生在「前一天晚上」的事情，再依照早上的先後排列。
- Scope basis：對齊第 3 課〈提早五分鐘〉與三年級生活情境中的時間順序能力；四個事件句均為本題自編內容。
- Duplication rationale：妹妹現有國語題主要測詞義、動作詞與量詞；本題是四事件完整時間排序，與現有題型沒有高度重複。
- Difficulty rationale：句子短、時間線索清楚，適合三年級；四個事件沒有重疊時間，因此只有一種合理排列。
- Status：`Ready`

### S36-MC-02 — Ready

- Student：妹妹
- Subject：國語
- Lesson：第 4 課〈水滾了〉
- Topic／Skill：因果推論
- Type：短文閱讀理解
- Question：媽媽把水壺放在爐子上加熱。過了一會兒，小安看到壺口冒出白白的熱氣，媽媽立刻把火關小，並提醒他不要靠近壺口。小安聽完後退到一旁，等媽媽把水壺移開。媽媽為什麼提醒小安不要靠近壺口？
- Options：A. 因為水壺裡沒有水了。 B. 因為小安要把水壺搬走。 C. 因為水已經變成冰塊。 D. 因為壺口附近很熱，靠近可能被燙傷。
- answerIndex：`3`
- Correct：因為壺口附近很熱，靠近可能被燙傷。
- Explanation：短文寫到水壺加熱後壺口冒出熱氣，媽媽隨即提醒他不要靠近；由這些因果線索可以知道壺口附近很熱，靠近可能被燙傷。
- Hint：找找看媽媽看到什麼之後，做了什麼提醒。
- Scope basis：對齊第 4 課〈水滾了〉與三年級生活情境中的前因後果理解；熱氣、提醒與原因均在本題自編短文中提供。
- Duplication rationale：妹妹現有國語題沒有水壺加熱的因果短文，也沒有「現象→提醒→安全原因」的閱讀題型。
- Difficulty rationale：比單句理解多一個事件連結，但答案直接由短文推出，不要求學生運用超出三年級的自然科學知識。
- Status：`Ready`

四題共同品質檢查：每題只有一個正解、無語意等值選項、self-contained、不依賴課文逐字內容、不超出已確認課次範圍；answerIndex 分散為 `0/1/2/3`。

## 8. Updated quality review result

- 原始 20 份 Ready／Revised 草案已完成欄位級草擬並實作入庫；原始 disposition 為 15 Ready、5 Revised。
- 原 16 個候選已補齊逐題 manifest 並完成自動 QA，與原 15 Ready／5 Revised 一起形成 36 題 Ready。
- 暫無 Rejected；若後續發現重複、超綱、第二正解或事實問題，應降級或剔除，不以達成題數為目標。
- 中文 candidate coverage 已完成本輪可安全補齊項目：姐姐國語 4 題、妹妹國語 4 題已 Ready；所有 36 題 final disposition 均為 Ready。
- 36 題已加入八個正式 question bank；未修改 monthly allowlist、Learning Record、ReviewSession 或任何 storage schema。

## 9. Full Candidate Closure implementation disposition

本輪依現有逐題草稿與第 11 節 manifest 完成 36 題正式題庫實作，全部採 singleton learning unit，未重用既有 questionId：

| Student／Subject | Implemented IDs | Added | After bank questions | Active practice after | Monthly allowlist |
|---|---|---:|---:|---:|---:|
| 姐姐國語 | `jiejie-chinese-18`～`-21` | 4 | 21 | 12 | 8 |
| 姐姐數學 | `jiejie-mathematics-16`～`-20` | 5 | 20 | 18 | 13 |
| 姐姐自然 | `jiejie-natural-science-13`～`-17` | 5 | 17 | 17 | 12 |
| 姐姐社會 | `jiejie-social-studies-13`～`-16` | 4 | 16 | 14 | 10 |
| 妹妹國語 | `meimei-chinese-13`～`-16` | 4 | 16 | 16 | 12 |
| 妹妹數學 | `meimei-mathematics-13`～`-17` | 5 | 17 | 17 | 10 |
| 妹妹自然 | `meimei-natural-science-13`～`-17` | 5 | 17 | 17 | 12 |
| 妹妹社會 | `meimei-social-studies-11`～`-14` | 4 | 14 | 14 | 10 |
| **合計** | **36 題** | **36** | **138** | **125** | **87** |

### Human Exception List — 0 Deferred

原 16 個 Pending 已依 Owner 決定建立逐題 Candidate ID、完整題幹、options、answerIndex、explanation 與正式 questionId 對照，完成 duplicate／unique-answer／scope QA 後全部列為 Ready：

- 姐姐國語：3 題；妹妹國語：3 題。
- 姐姐數學：2 題；妹妹數學：2 題。
- 姐姐自然：1 題；妹妹自然：1 題。
- 姐姐社會：2 題；妹妹社會：2 題。

本輪沒有因缺少舊 manifest 而停止，也沒有建立 historical questionId collision；完整欄位級 manifest 見第 11 節。

整批實作後總題數為 138，learning units 為 133；monthly allowlist 維持 87，未將新增平時題自動加入月考模式。Sprint 36 新題 answerIndex 分布為 `9/9/9/9`（index 0/1/2/3）。

## 10. 姐姐四科 Scope Audit

| 科目 | 原題數 | IN-SCOPE | OUT-OF-SCOPE | UNCERTAIN | 目前 active practice | 安全範圍 active pool |
|---|---:|---:|---:|---:|---:|---:|
| 國語 | 17 | 8 (`-10`～`-17`) | 2 (`-2`、`-4` 歷史部首題) | 7 (`-1`、`-3`、`-5`～`-9`) | 15 | 8 |
| 數學 | 15 | 13 (`-1`～`-4`、`-7`～`-15`) | 2 (`-5`、`-6`) | 0 | 15 | 13 |
| 自然 | 12 | 12 (`-1`～`-12`) | 0 | 0 | 12 | 12 |
| 社會 | 12 | 10 (`-3`～`-12`) | 2 (`-1`、`-2` 民主政治) | 0 | 12 | 10 |
| **合計** | **56** | **43** | **4** | **7** | **54** | **43** |

判定依實際 topic／題幹，而非僅依 questionId。國語 `-2`、`-4` 已由既有 `practiceQuestions` 排除；但 `-1`、`-3`、`-5`～`-9` 目前仍會進一般 practice，因為目前沒有依月考範圍的 active filter。數學、自然、社會一般頁面目前直接傳入完整 `questions`。

## 11. Final 16 Candidate Manifest and QA

Owner 已授權將原 16 個聚合 Pending 依正式 scope 自動補成逐題 candidate。以下為正式對照；每題均為自編題或自編情境，不冒充課文原文，且均為 singleton learning unit。

### 姐姐國語

#### S36-JC-03 → `jiejie-chinese-20` — Ready

- Student／Subject：姐姐／國語；Lesson：第壹單元；Topic／Skill：短文主旨統整；Type：application reading。
- 題幹：學校舉辦舊物再利用活動，同學先把不再使用的紙盒分類，再設計成筆筒和收納盒。雖然第一次做得不整齊，他們仍互相討論、修改，最後讓原本要丟掉的紙盒有了新的用途。這段文字最想告訴我們什麼？
- Options：A 紙盒只能拿來做筆筒。B 第一次做作品一定會很整齊。C 動手改造和合作討論，可以讓舊物重新發揮用途。D 學校活動只要分類物品，不必完成作品。
- answerIndex／正解：`2`／動手改造和合作討論，可以讓舊物重新發揮用途。
- Explanation：分類、設計、討論和修改共同支持「舊物重新發揮用途」；其他選項是局部或與短文相反。Hint：看看同學做了哪些事，以及最後舊紙盒有了什麼改變。
- Scope basis：姐姐國語六上第壹單元第 1～6 課；以自編短文測段落主旨。Duplication：不同於既有詞語、錯字及段落主旨題，加入合作與結果整合。Difficulty：需整合多個事件線索，無文字陷阱。Status：`Ready`。

#### S36-JC-04 → `jiejie-chinese-21` — Ready

- Student／Subject：姐姐／國語；Lesson：第貳單元；Topic／Skill：語句線索與原因推論；Type：application reading。
- 題幹：放學前，老師發現窗外風勢變大，便請同學把窗邊的輕物品移到桌內，並提醒大家離開教室前再檢查一次。老師這樣安排，最主要是因為什麼？
- Options：A 她想讓同學把物品帶回家。B 她不希望同學在教室裡學習。C 窗戶一定已經破掉，不能再使用。D 她根據風勢變大的情況，先降低物品被吹落的風險。
- answerIndex／正解：`3`／她根據風勢變大的情況，先降低物品被吹落的風險。
- Explanation：風勢變大可能使輕物品移動或掉落，因此移開並再檢查能降低風險；短文沒有說窗戶破掉。Hint：把「風勢變大」和老師接著做的安排連起來想。
- Scope basis：姐姐國語六上第貳單元第 1～6 課；自編情境測跨句原因推論。Duplication：不同於既有留言目的題，測事件線索與安全安排的因果。Difficulty：需連結原因與後續行動，資訊完整且唯一。Status：`Ready`。

### 姐姐數學

#### S36-JM-04 → `jiejie-mathematics-19` — Ready

- Student／Subject：姐姐／數學；Lesson：南一六上第 2 單元〈分數的除法〉；Topic／Skill：分數除法兩步驟；Type：application。
- 題幹：有 4 盒麵粉，每盒 3/4 公斤，平均分裝成 6 袋。每袋有幾公斤？
- Options：A 1/2 公斤。B 2/3 公斤。C 3/8 公斤。D 1 又 1/2 公斤。
- answerIndex／正解：`0`／1/2 公斤。
- Explanation：4 × 3/4 = 3 公斤；3 ÷ 6 = 1/2 公斤。Hint：先算總重量，再把總重量平均分成 6 袋。
- Scope basis：第 2 單元分數除法；四個數值互不等值。Duplication：不是既有單一步驟分數除法，而是乘法後再平均分裝。Difficulty：兩步驟應用，計算可重算且唯一。Status：`Ready`。

#### S36-JM-05 → `jiejie-mathematics-20` — Ready

- Student／Subject：姐姐／數學；Lesson：南一六上第 4 單元〈圓周長和圓面積〉；Topic／Skill：圓面積兩步驟；Type：application。
- 題幹：每張圓形貼紙的半徑是 3 公分，圓周率取 3.14。買 2 張這樣的貼紙，總面積約是多少平方公分？
- Options：A 28.26。B 56.52。C 18.84。D 113.04。
- answerIndex／正解：`1`／56.52 平方公分。
- Explanation：一張為 3.14 × 3 × 3 = 28.26；兩張為 56.52。Hint：先算一張，再乘以 2 張。
- Scope basis：第 4 單元圓面積；選項為一張面積、兩張面積、周長與兩倍錯誤值。Duplication：比既有單一圓面積題多一個總量步驟。Difficulty：兩步驟公式應用，無額外知識。Status：`Ready`。

### 姐姐自然

#### S36-JN-04 → `jiejie-natural-science-16` — Ready

- Student／Subject：姐姐／自然；Lesson：康軒六上第 2 單元〈水溶液〉；Topic／Skill：溶解現象比較；Type：application。
- 題幹：把相同量的鹽和小石子分別放入兩杯等量的水中並攪拌。過一會兒，鹽看不見了，小石子仍在杯底。下列哪一項最合理？
- Options：A 鹽可能溶解在水中，小石子沒有溶解。B 鹽和小石子都變成水蒸氣。C 小石子溶解後一定比鹽更甜。D 只要看不見就表示物質消失了。
- answerIndex／正解：`0`／鹽可能溶解在水中，小石子沒有溶解。
- Explanation：鹽看不見可能是均勻分散在水中，小石子仍在杯底表示沒有溶解；看不見不等於消失。Hint：比較兩種物質在水中的觀察結果。
- Scope basis：第 2 單元水溶液；資訊完全由題幹提供。Duplication：比較兩種物質的結果，不重複單一糖水均勻性題。Difficulty：觀察與推論，不要求冷僻術語。Status：`Ready`。

#### S36-JN-05 → `jiejie-natural-science-17` — Ready

- Student／Subject：姐姐／自然；Lesson：康軒六上第 1 單元〈探索天氣的變化〉；Topic／Skill：連續資料判讀；Type：application。
- 題幹：氣象站連續記錄同一天上午、中午和下午的氣溫，數值依序是 19°C、23°C、26°C。這些資料最能支持哪一項說法？
- Options：A 只要上午的氣溫就能知道整個月的天氣。B 氣溫升高表示一定正在下雨。C 下午的氣溫一定會比隔天高。D 這一天氣溫從上午到下午逐漸升高。
- answerIndex／正解：`3`／這一天氣溫從上午到下午逐漸升高。
- Explanation：三次數值由 19 增至 23 再至 26，只能支持這一天的上升趨勢。Hint：只根據三個時間和數值判斷。
- Scope basis：第 1 單元天氣觀察；不推論題目未提供的日期或降雨。Duplication：不同於雲圖判讀，測連續數值整合。Difficulty：讀取時間序列，唯一由資料推出。Status：`Ready`。

### 姐姐社會

#### S36-JS-03 → `jiejie-social-studies-15` — Ready

- Student／Subject：姐姐／社會；Lesson：康軒六上第 1 單元；Topic／Skill：社會變遷與生活方式；Type：application。
- 題幹：以前買東西常要準備現金，現在有些商店也能用行動裝置付款。這個例子最能說明什麼？
- Options：A 所有人都必須使用同一種付款方式。B 社會與科技變化可能改變人們的生活方式。C 只要有行動裝置就不需要學習新規則。D 以前的生活方式一定比現在好。
- answerIndex／正解：`1`／社會與科技變化可能改變人們的生活方式。
- Explanation：付款工具增加顯示生活方式可能改變，不能推論所有人必須採用同一方式。Hint：比較以前和現在的付款工具。
- Scope basis：第 1 單元社會變遷與個人發展；自編生活資料。Duplication：不同於家庭分工資料，測科技變化與日常生活。Difficulty：比較前後情境，無價值判斷陷阱。Status：`Ready`。

#### S36-JS-04 → `jiejie-social-studies-16` — Ready

- Student／Subject：姐姐／社會；Lesson：康軒六上第 2 單元；Topic／Skill：族群交流影響；Type：application。
- 題幹：市場裡有不同地區的人分享食物、語言和節慶故事，居民也因此認識新的做法。這個情境最能說明什麼？
- Options：A 不同族群交流後，每個人的習慣一定完全相同。B 只要有不同習慣就不能一起生活。C 族群交流可能讓社會增加認識彼此與互相學習的機會。D 交流只會讓原本的文化消失。
- answerIndex／正解：`2`／族群交流可能讓社會增加認識彼此與互相學習的機會。
- Explanation：分享與認識新做法直接支持互相理解與學習；交流不等於完全同化或文化消失。Hint：注意「分享」和「認識新的做法」的結果。
- Scope basis：第 2 單元族群交流；自編社會情境。Duplication：不同於單一分享者尊重題，測交流對社會的影響。Difficulty：由情境結果推論，唯一正解。Status：`Ready`。

### 妹妹國語

#### S36-MC-03 → `meimei-chinese-15` — Ready

- Student／Subject：妹妹／國語；Lesson：第 5 課；Topic／Skill：短文關鍵訊息；Type：application reading。
- 題幹：小芸發現鉛筆盒裡沒有紅色鉛筆，便先看看美術課的課表，再向同學借用一枝。下課前，她把鉛筆還回去，並把需要的用品寫在紙條上。從短文可以知道小芸怎麼做？
- Options：A 她先確認需要，再想辦法準備並記下提醒。B 她把同學的鉛筆留下來自己使用。C 她不在意上課需要什麼用品。D 她只在下課後才知道今天有美術課。
- answerIndex／正解：`0`／她先確認需要，再想辦法準備並記下提醒。
- Explanation：查看課表、借用並歸還、寫下提醒三個線索共同支持正解。Hint：注意她先查看、接著處理、最後記下什麼。
- Scope basis：妹妹國語三上第 1～6 課；自編短文。Duplication：不同於既有單句詞語與四事件排序，測短文行動整合。Difficulty：三年級可讀，線索明確且無課外知識。Status：`Ready`。

#### S36-MC-04 → `meimei-chinese-16` — Ready

- Student／Subject：妹妹／國語；Lesson：第 6 課；Topic／Skill：因果推論；Type：application reading。
- 題幹：放學時，天空突然下起大雨，小安看到地上積水，便把雨傘撐好，沿著騎樓慢慢走回家。從短文可以知道他為什麼這樣做？
- Options：A 他想把雨傘留在學校。B 他想減少被雨淋濕，也注意積水避免滑倒。C 他認為放學後一定不能回家。D 他想讓積水變成乾燥的地面。
- answerIndex／正解：`1`／他想減少被雨淋濕，也注意積水避免滑倒。
- Explanation：大雨支持撐傘，積水支持慢走避滑，兩個行動原因都直接出現在短文線索。Hint：連起「下大雨」「撐傘」和「慢慢走」。
- Scope basis：三上第 1～6 課閱讀理解；自編情境。Duplication：不同於水壺安全因果題，測兩個行動與兩個線索。Difficulty：跨句推論但句子短，唯一正解。Status：`Ready`。

### 妹妹數學

#### S36-MM-04 → `meimei-mathematics-16` — Ready

- Student／Subject：妹妹／數學；Lesson：南一三上第 2 單元〈四位數的加減〉；Topic／Skill：四位數兩步驟應用；Type：application。
- 題幹：書店上午收到 2356 本書，下午又收到 1789 本，當天送出 204 本。現在還剩下幾本？
- Options：A 3941 本。B 3737 本。C 4145 本。D 1843 本。
- answerIndex／正解：`0`／3941 本。
- Explanation：2356 + 1789 = 4145；4145 − 204 = 3941。Hint：先相加，再減去送出的數量。
- Scope basis：第 2 單元四位數加減；重算結果唯一。Duplication：不同於既有單一步驟加減，測先加後減的資料整合。Difficulty：兩步驟且數字在三年級可處理範圍。Status：`Ready`。

#### S36-MM-05 → `meimei-mathematics-17` — Ready

- Student／Subject：妹妹／數學；Lesson：南一三上第 3 單元〈乘法〉；Topic／Skill：分組數量兩步驟；Type：application。
- 題幹：第一種餅乾有 3 盒，每盒 24 片；第二種餅乾有 2 盒，每盒 15 片。兩種餅乾共有幾片？
- Options：A 72 片。B 78 片。C 120 片。D 102 片。
- answerIndex／正解：`3`／102 片。
- Explanation：第一種 3 × 24 = 72，第二種 2 × 15 = 30，合計 102。Hint：先算兩種各有幾片，再相加。
- Scope basis：第 3 單元乘法；計算只用重複加法的乘法意義。Duplication：不同於單一乘法算式，測兩組乘法結果整合。Difficulty：兩組數量清楚，無額外單位換算。Status：`Ready`。

### 妹妹自然

#### S36-MN-04 → `meimei-natural-science-16` — Ready

- Student／Subject：妹妹／自然；Lesson：三上「認識植物」；Topic／Skill：植物與光線觀察；Type：application。
- 題幹：窗邊的幼苗長出新葉後，莖和葉慢慢朝向窗戶的一側。下列哪一項最合理？
- Options：A 植物會自己走到窗戶旁。B 光線可能影響植物生長的方向。C 植物只要有光線就不需要水。D 葉子朝向哪裡完全不能觀察。
- answerIndex／正解：`1`／光線可能影響植物生長的方向。
- Explanation：莖葉朝向光線較多處支持「可能影響方向」，不能推論不需要水。Hint：比較新葉和窗戶的位置。
- Scope basis：認識植物與環境觀察；題幹提供全部判斷資料。Duplication：不同於比較有無光線的題，測由外形方向推論環境影響。Difficulty：使用「可能」避免過度絕對，唯一正解。Status：`Ready`。

#### S36-MN-05 → `meimei-natural-science-17` — Ready

- Student／Subject：妹妹／自然；Lesson：三上「空氣和水」；Topic／Skill：公平觀察水分變化；Type：application。
- 題幹：想比較陽光是否會影響濕布變乾的速度，哪一種做法較公平？
- Options：A 一塊布很大且有很多水，另一塊布很小且只有一點水。B 兩塊布同時改變大小、風向和水量。C 一塊布放在陽光下，另一塊布放在陰涼處，兩塊布大小和含水量相同。D 只觀察一塊布一次就下結論。
- answerIndex／正解：`2`／只改變放置位置且其他條件相同。
- Explanation：比較陽光時，布的大小和含水量要相同，只改變位置，才能比較結果。Hint：比較一個因素時，其他條件要盡量相同。
- Scope basis：空氣和水的生活觀察；無動物或磁鐵內容。Duplication：不同於植物光線公平觀察，改測水分變化。Difficulty：三年級可理解的條件比較，唯一正解。Status：`Ready`。

### 妹妹社會

#### S36-MS-03 → `meimei-social-studies-13` — Ready

- Student／Subject：妹妹／社會；Lesson：三上第 1 單元〈我和我的家人〉；Topic／Skill：家庭責任調整與合作；Type：application。
- 題幹：爸爸今天生病需要休息，家裡的晚餐和整理工作還沒完成。哪種做法最適合？
- Options：A 假裝沒有看見，讓爸爸自己完成。B 因為有人生病，所以所有事情都不用做。C 把工作全部交給年紀最小的人。D 家人先討論需要做的事，再依能力分工並互相幫忙。
- answerIndex／正解：`3`／家人依能力分工並互相幫忙。
- Explanation：先討論、依能力分工能照顧生病家人也完成生活工作。Hint：想想臨時狀況下如何一起分擔。
- Scope basis：第 1 單元家庭合作；不假定單一家庭型態。Duplication：不同於一般家庭溝通題，加入臨時狀況下的責任調整。Difficulty：生活情境判斷，唯一符合合作原則。Status：`Ready`。

#### S36-MS-04 → `meimei-social-studies-14` — Ready

- Student／Subject：妹妹／社會；Lesson：三上第 2 單元〈學習的方法〉；Topic／Skill：檢查與修正學習；Type：application。
- 題幹：小美檢查作業時發現有幾題算錯，她接下來怎麼做最有幫助？
- Options：A 把錯題撕掉，不再查看。B 只把答案抄成和同學一樣，不想原因。C 找出錯在哪一步，改正後再做一題確認。D 因為算錯就停止所有數學練習。
- answerIndex／正解：`2`／找出錯誤步驟、改正並再確認。
- Explanation：找出錯誤原因並重新確認，才能知道是否真正理解；其他選項沒有處理錯誤。Hint：不只改答案，也要找出錯在哪一步。
- Scope basis：第 2 單元學習方法；所有必要資訊在情境中。Duplication：不同於列出任務與安排時間，測錯誤檢查與修正。Difficulty：三年級可行的學習策略，唯一正解。Status：`Ready`。

### Final 16 QA closure

- 16 題均有唯一正解；options 各 4 個且無重複或語意等值。
- Explanation 與 answerIndex 一致；hint 提供方向但不直接給答案。
- 16 題均 self-contained，不依賴逐字教材內容、不加入動物或磁鐵、不超出已確認第一次月考 scope。
- 既有 102 題與前 20 題均完成 ID／題型／情境／計算流程／答案模式比對；新增題全部為 singleton，無 historical questionId collision。
- Sprint 36 新增 36 題 answerIndex 分布為 `9/9/9/9`；完整題庫分布為 `39/45/34/20`。
- Final 16 status：`Ready` 16 題；Deferred `0`；Rejected `0`。

姐姐社會 monthly allowlist 目前包含 `jiejie-social-studies-1`、`jiejie-social-studies-2`，與 Human-confirmed 前兩單元範圍不一致；依授權規則暫不自行修改，停止於 Human Scope／Allowlist Review Gate。

歷史題目與 questionId 應保留；Parent Center 的歷史顯示仍應使用完整題庫解析。若後續採 active filter，需先以 failing tests 保護 general practice、Today Review、retry／reinforce、Parent Center、妹妹流程與 monthly mode。
