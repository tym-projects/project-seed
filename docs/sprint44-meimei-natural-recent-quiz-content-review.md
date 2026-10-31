# Sprint 44 — Question Content Review Gate — Correct Baseline

日期：2026-10-31。Owner / ChatGPT 尚待逐題審閱，Sprint 尚未關閉。

## Correct baseline and migration

- Repository: C:\Users\admin\Documents\2026AST-dev
- Branch: codex/sprint44-meimei-natural-recent-quiz-v2
- Baseline / current HEAD: c4632889b87d4f11a8016a72253532b62ef3ca19
- Baseline eight banks: 150 each; 妹妹自然 Active 150 → 186; all-bank Active 1200 → 1236.
- Existing numeric max 150; new numeric min/max 151/186; contiguous 36, unique, no reuse 1–150.
- Canonical exported original 150: all 11 semantic fields deep-equal 150/150 PASS against Git baseline and composed Sprint 38–42 modules.
- Canonical semantic SHA-256: a47ade82661d8912f11cbf6edda99437cd6a358b16aa50a5387bf589d927e00e.
- Monthly: 28 → 28, exact membership and complete allowlist source unchanged; new IDs membership 0/36.
- Plant/Air-Water 18/18; basic/application 12/24; answer indices 0/1/2/3 = 9/9/9/9.
- Original 150 and other seven banks unchanged; no Sprint 38–42 production additions modules modified.

## Content QA

逐題檢查 36/36：題意、正確選項、三年級範圍、單一答案、四個不同選項、提示不直接列答案、迷思說明及適齡鼓勵。根、葉片、葉柄、節、葉序、木本／草本、軸根／鬚根、植物用途與空氣／水特性均在既定範圍。

Source 為已核准 salvage 的概念變化題，並未將學校考卷文字匯入。本輪無原始考卷可供逐字比對，故不宣稱已完成原卷相似度驗證。文件不保存學生姓名、班級、座號或分數。

Migration QA corrections（維持答案分布）：
- 166 鬚根：原選項正解在 index 0、answer 3；交換選項至 index 3。
- 169 空氣存在：原正解在 index 0、answer 2；交換選項至 index 2。
- 182 空氣壓縮：原正解在 index 0、answer 3；交換選項至 index 3。
- 155 提示改為引導觀察澆水接觸部位。

## All 36 questions for Owner review

| questionId | unit | type | 一句題意 | correct concept |
|---|---|---|---|---|
| meimei-natural-science-151 | 認識植物 | basic | 小安在校園看到不認識的植物，哪一種做法最安全？ | 先用眼睛觀察外形，不任意觸摸或品嚐 |
| meimei-natural-science-152 | 認識植物 | application | 小芸想知道路旁小花的味道，哪一項建議最適合？ | 不要品嚐，改用眼睛觀察並請教大人 |
| meimei-natural-science-153 | 認識植物 | basic | 觀察一株生長在花圃中的植物時，為什麼通常看不到完整的根？ | 根大多在土壤中，不能直接看到全部 |
| meimei-natural-science-154 | 認識植物 | application | 大風吹過後，土裡的植物仍能站立，哪一項最能說明根的作用？ | 根抓住土壤，幫助固定植物 |
| meimei-natural-science-155 | 認識植物 | basic | 澆水後，植物能利用土壤中的水分，主要和哪個構造有關？ | 根 |
| meimei-natural-science-156 | 認識植物 | application | 小組要比較兩種植物的葉片，哪一項資料最適合記錄？ | 葉片的形狀和大小 |
| meimei-natural-science-157 | 認識植物 | application | 觀察葉子時，發現葉片和莖之間有一小段連接的部分，這部分最可能是什麼？ | 葉柄 |
| meimei-natural-science-158 | 認識植物 | application | 觀察一段有葉子的莖，可以看到葉子常從莖上的特定位置長出。這個位置稱為什麼？ | 節 |
| meimei-natural-science-159 | 認識植物 | basic | 一株植物的莖上，每個節只有一片葉子，葉子左右交錯長出，這是哪一種葉序？ | 互生 |
| meimei-natural-science-160 | 認識植物 | application | 小組觀察到每個莖節的兩側各長一片葉子，兩片葉子面對面，這是哪種葉序？ | 對生 |
| meimei-natural-science-161 | 認識植物 | application | 某植物的莖上，每個節都有四片葉子，從四個方向伸出，這種排列最可能是什麼？ | 輪生 |
| meimei-natural-science-162 | 認識植物 | application | 許多葉片分散排列在莖上，可能帶來什麼好處？ | 減少葉片彼此遮住，較能接受陽光 |
| meimei-natural-science-163 | 認識植物 | basic | 校園大樹的莖粗而硬，外面有木質的表面，這種莖最可能是什麼？ | 木本莖 |
| meimei-natural-science-164 | 認識植物 | application | 小花的莖柔軟，容易彎曲，通常不會長得像樹幹一樣粗硬，這種莖最可能是什麼？ | 草本莖 |
| meimei-natural-science-165 | 認識植物 | application | 小杰觀察到一條較粗的主根，旁邊長出許多較細的側根，這種根最可能是哪一類？ | 軸根 |
| meimei-natural-science-166 | 認識植物 | application | 觀察一叢草的根，發現許多粗細相近的細根從莖的基部向外伸展，這種根最可能是什麼？ | 鬚根 |
| meimei-natural-science-167 | 認識植物 | application | 下列哪一項是植物提供給人類的生活用途？ | 稻米可作為食物，木材可製作物品 |
| meimei-natural-science-168 | 認識植物 | application | 學校在走廊擺放合適的盆栽，除了照顧植物外，還可能有什麼作用？ | 美化環境，讓空間更舒適 |
| meimei-natural-science-169 | 空氣和水 | basic | 把空杯子倒扣在水盆中，水沒有立刻充滿杯子。這個現象可以表示什麼？ | 杯子裡原本有空氣 |
| meimei-natural-science-170 | 空氣和水 | application | 把氣球吹大後放在桌上，哪一項說法最合理？ | 氣球裡的空氣占有空間，使氣球鼓起來 |
| meimei-natural-science-171 | 空氣和水 | basic | 把水倒進原本空的瓶子，瓶子裡原本的空氣被擠到外面。這表示水有什麼特性？ | 水佔有空間 |
| meimei-natural-science-172 | 空氣和水 | application | 把空氣分別吹進圓氣球和長氣球，氣球形狀不同，這可以說明什麼？ | 空氣沒有固定形狀，會隨容器改變 |
| meimei-natural-science-173 | 空氣和水 | basic | 同一杯水倒入碗中後，水面形狀改變了。這表示水通常怎麼樣？ | 水沒有固定形狀，會隨容器改變 |
| meimei-natural-science-174 | 空氣和水 | application | 兩個相同氣球中，一個充滿空氣、一個沒有充氣，掛在簡易天平兩端，充氣的氣球較低。這表示什麼？ | 空氣具有重量，會讓充氣氣球較重 |
| meimei-natural-science-175 | 空氣和水 | basic | 空瓶和裝滿水的瓶子放在手上比較，裝水的瓶子比較沉。這表示水怎麼樣？ | 水有重量 |
| meimei-natural-science-176 | 空氣和水 | application | 窗戶打開後，桌上的小紙片被吹動。這個現象最能說明什麼？ | 空氣流動形成風 |
| meimei-natural-science-177 | 空氣和水 | basic | 風把操場上的風車吹得轉動，這表示風可以怎麼樣？ | 使物體移動或轉動 |
| meimei-natural-science-178 | 空氣和水 | application | 氣象預報提醒可能有強風，外出前哪一種做法較安全？ | 避開招牌、大樹和容易被風吹落的物品 |
| meimei-natural-science-179 | 空氣和水 | basic | 把開口的塑膠袋快速向前揮，再把袋口捏緊，袋子鼓起來的原因是什麼？ | 袋子裡捕捉到空氣 |
| meimei-natural-science-180 | 空氣和水 | application | 想把空氣帶回教室觀察，為什麼有洞的網子不適合用來捕捉空氣？ | 空氣會從網孔流出去 |
| meimei-natural-science-181 | 空氣和水 | application | 把空氣吹入游泳圈後，游泳圈變得圓鼓鼓的。這個現象表示什麼？ | 空氣進入後占有空間並向外推 |
| meimei-natural-science-182 | 空氣和水 | basic | 封住針筒前端後推動活塞，活塞可以往前移一小段，這表示空氣怎麼樣？ | 空氣較容易被壓縮 |
| meimei-natural-science-183 | 空氣和水 | application | 把裝滿水的針筒前端封住，再推活塞時比推有空氣的針筒困難，這表示什麼？ | 水較不容易被壓縮 |
| meimei-natural-science-184 | 空氣和水 | application | 按下裝滿水的軟管一端，另一端的水也向外流，這個現象說明什麼？ | 水可以傳遞受到的力量 |
| meimei-natural-science-185 | 空氣和水 | application | 氣球慢慢漏氣，想找出破洞的位置，哪一種方法最適合？ | 把充氣的氣球放入水中，看哪裡冒出氣泡 |
| meimei-natural-science-186 | 空氣和水 | application | 乾紙巾固定在杯底，杯口朝下壓入水中，紙巾仍乾燥。若把杯子傾斜後紙巾變濕，最合理的原因是什麼？ | 傾斜讓空氣離開，水才有空間進入杯內 |

## Validation evidence

- Design / plan restored from approved correct-baseline salvage, original paths and file hashes preserved.
- TDD RED before production module existed: 7 tests, 3 PASS / 4 expected FAIL; failures were missing additions/coverage/content, no import/syntax errors. Original150 / Monthly / other7 baseline checks passed.
- Focused GREEN: 7/7 PASS.
- npm test: 274/274 PASS after fixing four historical test assumptions. Sprint41/42 tests now expect Active1236 and Sprint42 assertions select only its own exact 50-ID range; production old modules unchanged.
- lint PASS; TypeScript PASS; Webpack retry PASS (40/40 pages); diff-check PASS. Initial Webpack attempt had fonts.googleapis.com ENOTFOUND and output-directory EPERM; retry with required access passed without config/font/dependency changes.
- Independent final content/code review: no Important findings; focused 7/7 independently confirmed.
- Canonical regression tests are combined into the focused file to share the Git/VM loader. Prior approved Tasks1–2 are not repeated; Task7 remains prohibited until a later approval.
- Browser / E2E: NOT RUN. Reason: No UI / interaction architecture change; content-bank focused validation used. Node tests and build are not Browser acceptance.

## Prevented incident and next step

舊分支使用過時產品基線（歷史 Active12 / Monthly12）；在 commit 前發現並隔離至外部 salvage，未污染 Git history。本輪由 correct baseline PROJECT_STATUS 更新，未帶回舊 current state。

Prevention rule: **Git synchronization ≠ Product baseline correctness**. 建立 Sprint 分支必須核對最近正式 milestone 的 exported bank、numeric max ID、Monthly allowlist 及 semantic snapshot。

## Final remediation and approval — 2026-10-31

- Question `meimei-natural-science-173`: wording changed from「水面形狀改變」to「水的外形改變」; correct concept and answer index `2` unchanged.
- Question `meimei-natural-science-174`: revised to compare two similarly inflated balloons balanced on a simple scale, then release air from one balloon and observe the air-filled side lower; the correct concept remains that air has weight, with answer index `3` unchanged.
- Distractors were remediated for IDs `153`, `154`, `156`, `162`, `168`, `169`, `176`, `177`, `179`, `180`, `185`, and `186`. Correct answer text, answer index, topic, type, and ID were unchanged.
- Final Content Review: **APPROVED**. High `0`, Medium `0`, Minor `0`.
- Final validation: focused `7/7 PASS`; full `274/274 PASS`; lint PASS; TypeScript PASS; Webpack PASS; `git diff --check` PASS.
- Browser / E2E: **NOT RUN**. Reason: no UI / interaction architecture change in this Sprint.

Current gate: **Sprint 44 — Content Review Approved / Awaiting Commit & Push**.
Next Step: commit and push the approved Sprint 44 files. Deployment / Integration Decision remains the next gate. Commit and push were not performed at the time of this review record; merge/deploy/tag/release/rebase/force push remain prohibited.
