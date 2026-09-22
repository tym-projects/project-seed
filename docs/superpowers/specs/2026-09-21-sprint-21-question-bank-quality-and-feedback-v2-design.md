# Sprint 21 — 題庫品質與理解回饋 v2 Design

> Status: Completed
>
> 本文件只記錄正式題庫盤點、改善範圍與待審核內容；不修改正式題庫，不代表任何新題目或答案已獲核准。

## 1. Problem / Goals / Non-goals

### Problem

Sprint 13–20 已建立 variation、理解確認、提示、解析、Learning Record 與 parent summary 基礎，但正式題庫的品質規則目前主要驗證資料形狀，尚未系統化檢查「不同問法是否真的不同」、「提示是否足以引導思考」及「解析是否說明理由」。目前也有一批 legacy 題目沒有 hint，限制了答錯後的理解回饋。

### Goals

- 以正式 production Question Bank 為唯一盤點來源，改善有限數量、可驗證且對孩子有實際價值的 learning units。
- 優先補足具明確正解的 hint、explanation 與真正不同的 variation。
- 讓 Sprint 18 的 alternate variation 能測量同一觀念的另一種理解，而不是只替換句子表面文字。
- 保持既有 Question schema、questionId 身份、learning-unit 聚合、review、Learning Record、timer 與 parent summary 語意不變。
- 將所有尚未由現有證據確認的新題幹、選項、正解與重要語文用法集中交由 Human 一次審核。

### Non-goals

- 不在本階段修改正式題庫、production code、tests、schema 或 Git 歷史。
- 不自行改變任何既有正確答案，不把疑義題目標記為已修正。
- 不新增 AI 出題、AI 教學、mastery／理解度評分、難度演算法或跨裝置資料。
- 不為所有 legacy 題目強行建立 variation，不以增加題數作為品質目標。
- 不改變 1/3/7、retry、Sprint 18 confirmation、Sprint 19 no-write practice、Sprint 17 timer 或 Sprint 20 parent summary。

## 2. Repository and source baseline

- Canonical repository：`C:\Users\admin\Documents\2026AST-dev`
- Branch：`main`
- HEAD：`cfee045`
- `main = origin/main`，ahead / behind：`0 / 0`
- Working tree：僅有本 Sprint 21 Design 與 Implementation Plan 未追蹤文件；正式題庫、production code、tests 與既有治理文件無變更
- Sprint 20：Completed
- 正式題庫：`lib/questions/jiejie-chinese.ts`、`lib/questions/meimei-chinese.ts`
- 既有 validation：`lib/questions/question-bank-validation.ts`
- 既有題庫測試：`lib/questions/question-bank-validation.test.mjs`、各學生題庫測試與 Sprint 16 coverage tests

`PROJECT_STATUS.md` 頂部已記錄 Sprint 20 Completed；文件較下方保留一段舊的 Sprint 19 Current Baseline，屬後續治理文件清理項目，本 Design 不改寫 Sprint 20 歷史。

## 3. Formal question-bank inventory

### 3.1 Totals and distribution

| Student | Subject | Questions | Learning units | Topic distribution |
|---|---:|---:|---:|---|
| 姐姐 | 國語 | 9 | 7 | 注音辨識 2 題／1 unit、部首辨識 2／1、成語運用 2／2、錯別字辨識 3／3 |
| 妹妹 | 國語 | 11 | 9 | 詞語意思 4 題／3 units、動作詞辨識 3／3、量詞運用 3／3 |
| **合計** | 國語 | **20** | **16** | active topics 11 units；retained legacy units 5 units |

### 3.2 Learning-unit and question inventory

#### 姐姐

| Learning unit / reviewGroupId | Topic | Questions | Variations | Hint | 初步盤點 |
|---|---|---|---:|---|---|
| `jiejie-chinese-jiao-pronunciation` | 注音辨識 | `jiejie-chinese-1`, `jiejie-chinese-3` | 2 | 0/2 | 正解明確；兩題都測「蕉」讀音，需檢查是否足夠不同問法 |
| `jiejie-chinese-tian-radical` | 部首辨識 | `jiejie-chinese-2`, `jiejie-chinese-4` | 2 | 0/2 | 正解明確；題幹由直接辨識改成查字典情境，仍可增加提示與概念說明 |
| `jiejie-chinese-5` | 成語運用 | `jiejie-chinese-5` | 1 | 1/1 | 成語情境、hint、解析完整；legacy 單題 |
| `jiejie-chinese-6` | 成語運用 | `jiejie-chinese-6` | 1 | 1/1 | 情境與解析完整；legacy 單題 |
| `jiejie-chinese-7` | 錯別字辨識 | `jiejie-chinese-7` | 1 | 1/1 | 「共視／共識」正解清楚；legacy 單題 |
| `jiejie-chinese-8` | 錯別字辨識 | `jiejie-chinese-8` | 1 | 1/1 | 「分晰／分析」正解清楚；hint 可更直接引導字義但不可洩漏答案 |
| `jiejie-chinese-9` | 錯別字辨識 | `jiejie-chinese-9` | 1 | 1/1 | 長句情境完整；「繁鎖／繁瑣」用法需以教材或字典依據確認 |

#### 妹妹

| Learning unit / reviewGroupId | Topic | Questions | Variations | Hint | 初步盤點 |
|---|---|---|---:|---|---|
| `meimei-chinese-gaoxing-meaning` | 詞語意思 | `meimei-chinese-1`, `meimei-chinese-4` | 2 | 0/2 | 都是「高興」近義／情境判斷；可增加真正不同的上下文線索 |
| `meimei-chinese-action-word-identification` | 動作詞辨識 | `meimei-chinese-2`, `meimei-chinese-5` | 2 | 0/2 | 「放」與「跑」都是清楚的動作辨識；可補 hint 並增加句中角色／動作對比 |
| `meimei-chinese-3` | 量詞運用 | `meimei-chinese-3` | 1 | 0/1 | 「一枝鉛筆」符合目前用法，但應保留教材／地區用詞依據 |
| `meimei-chinese-6` | 詞語意思 | `meimei-chinese-6` | 1 | 1/1 | 「專心」解析完整；legacy 單題 |
| `meimei-chinese-7` | 詞語意思 | `meimei-chinese-7` | 1 | 1/1 | 「緊張」情境線索完整；legacy 單題 |
| `meimei-chinese-8` | 動作詞辨識 | `meimei-chinese-8` | 1 | 1/1 | 「擦」與板擦情境一致；legacy 單題 |
| `meimei-chinese-9` | 動作詞辨識 | `meimei-chinese-9` | 1 | 1/1 | 「揉」與黏土情境一致；legacy 單題 |
| `meimei-chinese-10` | 量詞運用 | `meimei-chinese-10` | 1 | 1/1 | 「一道彩虹」清楚；legacy 單題 |
| `meimei-chinese-11` | 量詞運用 | `meimei-chinese-11` | 1 | 1/1 | 多量詞辨識題；干擾選項與教材用法需集中覆核 |

### 3.3 Shape and validation findings

- 20 題均有唯一 `id`、topic、type、options、answer 與 explanation；目前沒有 validation 已報出的缺少選項、答案越界、重複 option 或 review group topic/type mismatch。
- 既有 validation 以 `reviewGroupId ?? question.id` 產生 learning unit，並保護同 group 的 topic/type 一致性；目前 16 units 與 Sprint 16 的最低 coverage（總數 16、五個 active topic）一致。
- 所有 20 題都有 explanation；9 題沒有 hint：姐姐 `jiejie-chinese-1` 至 `-4`，妹妹 `meimei-chinese-1` 至 `-5`。
- 現有 validation 只要求指定題目的 hint 非空，不判斷 hint 是否過於空泛、直接給出答案，亦不判斷 explanation 是否只重述正解；這些需用內容 review 與針對性測試補強。
- 12 個 unit 是單題 legacy unit，4 個 unit 有兩個 variation；目前沒有三題以上 variation group。

## 4. Quality findings and risk classification

### 可由現有題庫與明確語意直接確認的 A 類

- `jiejie-chinese-1`／`-3` 的核心事實都是「蕉」讀作 ㄐㄧㄠ；現有正解一致，可在不改答案的前提下改善 hint／explanation，並評估新問法。
- `jiejie-chinese-2`／`-4` 的核心概念都是「天」的部首為大；現有正解一致，可補充查字典的思考線索。
- `jiejie-chinese-5`、`-6` 的成語情境與目前選項有明確語意；可改善 feedback 文字，不需要改答案。
- `meimei-chinese-1`／`-4` 都以「高興」的正向情緒為核心；可設計不同線索，但新文案仍須 Human 審核。
- `meimei-chinese-2`／`-5` 的動作詞答案分別為「放／跑」且句法清楚；可補 hint，不需改答案。
- `meimei-chinese-6` 至 `-10` 的既有 explanation 與情境大致一致；可作為回饋文字品質對照樣本。

### 必須列為 B 類 Human Review Items

- 新增或替換任何 question、options、answer 的完整文案。
- 為 existing legacy unit 建立新的 `reviewGroupId` 或把既有單題併入 group。
- 任何涉及「枝／支」、「道／條／顆」等量詞地域或教材規範的判定。
- `jiejie-chinese-9` 的「繁瑣」用字、`jiejie-chinese-7` 的「共識」、`jiejie-chinese-8` 的「分析」若要改寫選項或正解，必須提供字典／教材依據。
- `meimei-chinese-11` 中所有干擾選項的量詞合理性，尤其「西瓜、香蕉、魚、荷花、外套、雨傘」的可接受量詞範圍。
- 任何新的 explanation 若超出現有題目直接可推導的語文規則。

目前沒有足夠證據宣稱既有答案錯誤；所有上述項目保留原始內容，暫列為需審核而非錯題。

## 5. Improvement candidates and priority

### Candidate 1 — 妹妹「詞語意思／動作詞」理解回饋優先批次（建議優先）

- 範圍：`meimei-chinese-gaoxing-meaning`（2 題）、`meimei-chinese-action-word-identification`（2 題），共 2 learning units／4 existing questions。
- 缺口：兩個 group 都只有兩個 variation 且沒有 hint；高興題的差異偏向同義詞與簡單情境，動作詞題的辨識線索也較直接。
- 建議：保留既有 questionId 與 answer；為 4 題補不直接洩漏答案的 hint；改善 explanation 使其說明情境線索；提出每個 group 1 個真正不同的候選問法，讓 Sprint 18 confirmation 有不同認知線索可測。
- 影響：妹妹在理解確認時不只看到表面換句話，答錯後能依線索重新思考詞義或動作角色。
- 依據需求：既有題目語意可確認，但新增候選文案、選項與正解仍須 Human 審核。
- 工作量：中；主要風險是新 variation 仍可能只改寫表面文字，或把 hint 寫成答案提示。

### Candidate 2 — 姐姐注音／部首 legacy variation 與 feedback 補強

- 範圍：`jiejie-chinese-jiao-pronunciation`、`jiejie-chinese-tian-radical`，共 2 learning units／4 existing questions。
- 缺口：已有 variation，但兩組題目都沒有 hint；「香蕉／芭蕉」及「直接部首／查字典」雖有差異，仍需確認是否足以支援真正的理解確認。
- 建議：不改既有正解與 questionId；補具體但不洩漏答案的 hint，改善 explanation 的「如何判斷」說明；若要新增第三種 variation，先以 Human 審核文案與教材依據為前提。
- 影響：可提升既有 Sprint 18 confirmation 的有效性，並改善 legacy 題在答錯後的學習回饋。
- 依據需求：現有注音與部首答案可由題目內容確認；新增 variation 仍屬 B 類，需審核。
- 工作量：中；主要風險是改變既有 group 的 review 行為或讓新 variation 與舊題測量不同概念。

### Candidate 3 — 量詞與錯別字 feedback 品質審核批次

- 範圍：妹妹 `meimei-chinese-3`、`-10`、`-11`，以及姐姐 `jiejie-chinese-7`、`-8`、`-9`，共 6 learning units／6 existing questions。
- 缺口：這些題目目前多為單題 legacy unit，沒有 variation；量詞與正字用法需要教材／地區依據，部分干擾選項的可接受性需覆核。
- 建議：先做內容審核清單；只有確認所有選項與解析後，才改善 hint／explanation。除非另行核准，不建立新 group、不改既有答案。
- 影響：降低孩子因題目措辭或干擾選項不自然而產生的非學習性錯誤。
- 依據需求：需引用明確教材、字典或課程規範；目前不能自行宣稱所有量詞與用字爭議已解決。
- 工作量：中至高；主要風險是內容審核延遲、地域用法差異及無意改變既有歷史語意。

## 6. Proposed first-batch scope

本 Design 建議優先討論 Candidate 1：

- 2 learning units。
- 4 existing questions 保留原 questionId 與正解。
- 4 個 hint／explanation 改善候選。
- 動作詞 group 提出 1 個新增 variation 候選；高興 group 暫不新增，因目前沒有足夠不同且唯一正解的問法。
- 新文案必須集中通過一次 Human Review，包含題幹、選項、answer、hint、explanation、topic/type 與 reviewGroupId。

若 Human 不批准動作詞 variation，仍可將範圍縮為只改善既有 4 題的 hint／explanation；不得為了維持題數而自行替換內容。

## 6A. 首批四題回饋改善草案

以下只是在 Design 階段提出的文案草案，不會修改正式題庫。既有題幹、選項、answer index 與 questionId 全部保留。

### `meimei-chinese-1`

- Learning unit：`meimei-chinese-gaoxing-meaning`；variation 1/2。
- 原題：`「高興」和下面哪一個詞語意思最接近？`
- 原選項：`快樂`、`難過`、`安靜`；原正解：`快樂`（index 0）。
- 現有 hint：無。
- 現有 explanation：`高興和快樂都表示心情很好。`
- 品質問題：題目正解清楚，但沒有引導孩子比較詞語意思；解析只指出相近，沒有說明其他選項為何不合適。
- 建議 hint：`想想哪個詞也可以表示心情愉快。`
- 建議 explanation：`「高興」和「快樂」都表示心情愉快，所以意思最接近；「難過」表示心情不好，「安靜」則是描述聲音或行為的狀態。`
- 理解價值：把 synonym 判斷連到「心情愉快」這個共同語意，並區分情緒詞與狀態詞；hint 沒有直接顯示選項答案。
- 正確性依據／疑義：依現有題目本身的詞義對比可確認方向；repository 沒有指定教材或字典版本，因此正式採用前仍需 Human 確認年級用語與「高興／快樂」的教學表述。

### `meimei-chinese-4`

- Learning unit：`meimei-chinese-gaoxing-meaning`；variation 2/2。
- 原題：`妹妹收到生日禮物，心裡很開心。下面哪一個詞語最適合形容妹妹的心情？`
- 原選項：`高興`、`難過`、`生氣`；原正解：`高興`（index 0）。
- 現有 hint：無。
- 現有 explanation：`收到喜歡的生日禮物時，心情很開心，也可以說「很高興」。`
- 品質問題：情境線索明確，但 hint 缺席；解析可進一步說明「開心」是判斷線索，以及其他情緒詞為何不符合。
- 建議 hint：`先找出句子描述的心情，再比較哪個選項和這種心情相同。`
- 建議 explanation：`句子用「很開心」描述妹妹收到禮物時的心情；「高興」也表示心情愉快，所以最適合。 「難過」和「生氣」表示不同的情緒。`
- 理解價值：教孩子從情境中的情緒線索轉換成近義詞，而不是只靠看到「生日禮物」猜答案；hint 指向判斷步驟，不直接給出「高興」。
- 正確性依據／疑義：依題幹明示的「開心」與既有選項語意可確認；沒有外部教材版本，正式採用前需 Human 確認詞義層級適合妹妹年級。

### `meimei-chinese-2`

- Learning unit：`meimei-chinese-action-word-identification`；variation 1/2。
- 原題：`「小明把書放在書包裡。」哪一個詞語表示動作？`
- 原選項：`小明`、`放`、`書包`；原正解：`放`（index 1）。
- 現有 hint：無。
- 現有 explanation：`「放」表示把東西放到一個地方的動作。`
- 品質問題：正解清楚，但沒有引導孩子分辨人物、物品／地方與動作；解析可明確指出句中角色。
- 建議 hint：`找出小明正在做的事情，不是做事的人或放東西的地方。`
- 建議 explanation：`「放」表示把書放到書包裡的動作；「小明」是做動作的人，「書包」是放書的地方。`
- 理解價值：把動作詞判斷連到「誰在做什麼、東西到哪裡」的句子結構，協助孩子理解詞語角色；hint 沒有直接說出「放」。
- 正確性依據／疑義：由現有句子的基本語法角色即可確認；正式採用前仍需 Human 確認「放東西的地方」對妹妹而言是否足夠清楚。

### `meimei-chinese-5`

- Learning unit：`meimei-chinese-action-word-identification`；variation 2/2。
- 原題：`「小狗在草地上跑。」哪一個詞語表示動作？`
- 原選項：`小狗`、`草地`、`跑`；原正解：`跑`（index 2）。
- 現有 hint：無。
- 現有 explanation：`「跑」表示小狗正在做的動作。`
- 品質問題：題意單純且正解清楚，但缺少 hint；解析可補上人物與地點不是動作的對比。
- 建議 hint：`找出小狗正在做的事情，不是小狗或牠活動的地方。`
- 建議 explanation：`「跑」表示小狗正在做的動作；「小狗」是做動作的人物，「草地」是活動的地方。`
- 理解價值：讓孩子用句中角色判斷動作詞，而不只是記住某個答案；hint 提示分類方向，不揭露「跑」。
- 正確性依據／疑義：由現有句子的基本語法角色即可確認；正式採用前需 Human 確認「活動的地方」的說法適合妹妹年級。

## 6B. 新 variation 候選（尚未核准、不得寫入正式題庫）

### 候選 V1：動作詞辨識

- 對應 learning unit／reviewGroupId：`meimei-chinese-action-word-identification`
- questionId 候選：`meimei-chinese-action-word-identification-3`
- 題型：`application`；適合低年級以句中角色辨識動作詞。
- 題幹：`放學前，老師請小安把課本收進書包。哪一個詞語表示小安做的動作？`
- 選項：`老師`、`課本`、`收進`、`書包`
- 唯一正解：`收進`（index 2）。
- Hint：`找表示把課本放入書包的動作，不是人物、物品或容器。`
- Explanation：`「收進」表示把課本放入書包的動作；「老師」是人物，「課本」是物品，「書包」是放東西的容器。`
- 內容正確性依據：正解由句子的基本語法角色與動詞語意可確認；repository 沒有指定教材版本或字典來源，需 Human 確認「收進」作為妹妹程度的動作詞是否合適。
- 與既有 variation 的實質差異：不再使用「小明／小狗」及「放／跑」的主語與場景；改為校園收拾情境、複合動詞「收進」，並要求孩子從人物／物品／容器中辨認動作詞。
- 其他合理答案風險：就句法角色而言低；但目前正式題庫已採用的動作詞答案都是單字（放、跑、擦、揉），validation 也沒有定義複合動詞的年級規則。因此「收進」不被程式 validation 排除，但內容規則仍不足以直接核准，Human 應確認是否接受，或採用下方單字動詞替代草案。

### 高興 learning unit：暫不提出新 variation

`meimei-chinese-gaoxing-meaning` 已有「直接找近義詞」（`-1`）與「從情境選近義詞」（`-4`）兩種問法。再新增一個單純的開心情境或同義詞選擇，預期只會重複現有測量；目前沒有足夠可靠、又能保持唯一正解的第三種問法。因此本批只改善兩題 feedback，不為達到題數而新增題目。

## 6C. 集中 Human Review 清單

### A. 已核准改善範圍

- 2 learning units：`meimei-chinese-gaoxing-meaning`、`meimei-chinese-action-word-identification`。
- 4 existing questionIds：`meimei-chinese-1`、`meimei-chinese-4`、`meimei-chinese-2`、`meimei-chinese-5`。
- 保留既有題幹、選項、正解與 questionId；僅提出 hint／explanation 改善草案。

### B. 需要 Human 核准的具體內容

- 四題建議 hint／explanation 的文字與年級適切性。
- V1／V1A 擇一的 questionId 候選、題幹、四個選項、正解、hint、explanation 與 `application` type。
- V1 或 V1A 是否真的測量同一個「動作詞辨識」learning unit，而不是擴大成一般動詞教學。
- V1 的「收進」或 V1A 的「寫」是否為唯一且適合妹妹程度的正解；兩者不得同時加入。
- 「高興／快樂」、「開心／高興」的詞義教學表述。

### C. 本批暫緩

- 高興 learning unit 的新 variation：因無足夠不同問法，暫不新增。
- 其他量詞／錯別字疑義：保留於既有內容審核 backlog，不擴大 Sprint 21 首批範圍。
- 任何教材、字典或年級版本的宣稱：repository 未提供來源，不虛構引用。

### D. Human Content Approval 已確認

- 首批範圍鎖定為妹妹 2 個 learning units、4 道既有題目。
- `meimei-chinese-1`、`meimei-chinese-4`、`meimei-chinese-2`、`meimei-chinese-5` 採用本文件 6D 的四組 Hint／Explanation；其中 `meimei-chinese-5` Explanation 採核准文字：`「跑」表示小狗正在做的動作；「小狗」是做動作的動物，「草地」是活動的地方。`
- `meimei-chinese-gaoxing-meaning` 本批不新增 variation。
- 新 variation 採 V1A「寫」：`meimei-chinese-action-word-identification-3`，加入既有 `meimei-chinese-action-word-identification` group，type 為 `application`；完整題目內容以 6D 為準。
- 原候選 V1「收進」不採用，不得加入正式題庫。
- 以上是內容核准，不等同於已修改正式題庫；Implementation Plan 與 implementation 仍是後續獨立階段。

## 6D. Content Review 對照表（供 Human 逐項核准）

本節是四題既有內容與候選 variation 的完整對照；「新」欄位均為草案，尚未寫入正式題庫。

### 既有題目 1：`meimei-chinese-1`

- Review group：`meimei-chinese-gaoxing-meaning`
- 原題幹：`「高興」和下面哪一個詞語意思最接近？`
- 原選項：`快樂`、`難過`、`安靜`
- 原正解：`快樂`（index 0）
- 原 Hint：無。
- 原 Explanation：`高興和快樂都表示心情很好。`
- 新 Hint 草案：`想想哪個詞也可以表示心情愉快。`
- 新 Explanation 草案：`「高興」和「快樂」都表示心情愉快，所以意思最接近；「難過」表示心情不好，「安靜」則是描述聲音或行為的狀態。`
- 修改原因：把「找近義詞」轉成可理解的情緒語意比較，並解釋兩個干擾選項的概念差異。
- 正解洩漏檢查：Hint 沒有出現「快樂」或任何選項文字；Explanation 只在作答後顯示，會明確說明正解，符合既有 QuestionResult 行為。

### 既有題目 2：`meimei-chinese-4`

- Review group：`meimei-chinese-gaoxing-meaning`
- 原題幹：`妹妹收到生日禮物，心裡很開心。下面哪一個詞語最適合形容妹妹的心情？`
- 原選項：`高興`、`難過`、`生氣`
- 原正解：`高興`（index 0）
- 原 Hint：無。
- 原 Explanation：`收到喜歡的生日禮物時，心情很開心，也可以說「很高興」。`
- 新 Hint 草案：`先找出句子描述的心情，再比較哪個選項和這種心情相同。`
- 新 Explanation 草案：`句子用「很開心」描述妹妹收到禮物時的心情；「高興」也表示心情愉快，所以最適合。「難過」和「生氣」表示不同的情緒。`
- 修改原因：教孩子先擷取情境線索，再將線索連到詞義；補足其他情緒選項的區別。
- 正解洩漏檢查：Hint 沒有出現「高興」或選項文字，只提示判斷步驟；Explanation 於答錯後顯示，符合既有流程。

### 既有題目 3：`meimei-chinese-2`

- Review group：`meimei-chinese-action-word-identification`
- 原題幹：`「小明把書放在書包裡。」哪一個詞語表示動作？`
- 原選項：`小明`、`放`、`書包`
- 原正解：`放`（index 1）
- 原 Hint：無。
- 原 Explanation：`「放」表示把東西放到一個地方的動作。`
- 新 Hint 草案：`找出小明正在做的事情，不是做事的人或放東西的地方。`
- 新 Explanation 草案：`「放」表示把書放到書包裡的動作；「小明」是做動作的人，「書包」是放書的地方。`
- 修改原因：讓孩子使用「誰／做什麼／在哪裡」的句子角色判斷動作詞，而非只記住答案。
- 正解洩漏檢查：Hint 沒有出現「放」；「把東西放到地方」只描述判斷方向，不直接呈現選項文字。Explanation 只在作答後顯示。

### 既有題目 4：`meimei-chinese-5`

- Review group：`meimei-chinese-action-word-identification`
- 原題幹：`「小狗在草地上跑。」哪一個詞語表示動作？`
- 原選項：`小狗`、`草地`、`跑`
- 原正解：`跑`（index 2）
- 原 Hint：無。
- 原 Explanation：`「跑」表示小狗正在做的動作。`
- 新 Hint 草案：`找出小狗正在做的事情，不是小狗或牠活動的地方。`
- 新 Explanation 草案：`「跑」表示小狗正在做的動作；「小狗」是做動作的人物，「草地」是活動的地方。`
- 修改原因：補上人物、地點與動作的分類理由，協助孩子把題目遷移到其他句子。
- 正解洩漏檢查：Hint 沒有出現「跑」；只提示找活動，不直接透露選項。Explanation 仍只在作答後顯示。

### 新 variation 原候選 V1：目前不直接核准

- 題型：`application`
- Review group：`meimei-chinese-action-word-identification`
- questionId 候選：`meimei-chinese-action-word-identification-3`
- 題幹：`放學前，老師請小安把課本收進書包。哪一個詞語表示小安做的動作？`
- 選項：`老師`、`課本`、`收進`、`書包`
- 正解草案：`收進`（index 2）
- Hint 草案：`找表示把課本放入書包的動作，不是人物、物品或容器。`
- Explanation 草案：`「收進」表示把課本放入書包的動作；「老師」是人物，「課本」是物品，「書包」是放東西的容器。`
- 概念一致性：同樣要求辨識句中的動作詞，與 `放`、`跑` 同一 learning unit；場景、主語、動詞與干擾詞不同。
- 用詞規則檢查：現有四個動作詞答案都是單字；repository 沒有規定動作詞不可為雙字詞，但也沒有教材依據支持「收進」適合目前年級。
- 其他合理答案：選項中沒有其他明確動作詞；「老師」是人物、「課本」是物品、「書包」是容器。疑義不是多重答案，而是年級用詞與「收進」是否作為教學詞。

### 新 variation 替代草案 V1A：較符合目前題庫用詞

- 題型：`application`
- Review group：`meimei-chinese-action-word-identification`
- questionId 候選：`meimei-chinese-action-word-identification-3`
- 題幹：`小安拿起鉛筆，在紙上＿＿＿＿自己的名字。哪一個詞語表示小安做的動作？`
- 選項：`小安`、`鉛筆`、`寫`、`名字`
- 唯一正解草案：`寫`（index 2）
- Hint 草案：`找出表示小安正在做什麼的詞，不是人物、工具或寫下的內容。`
- Explanation 草案：`「寫」表示小安用鉛筆在紙上記下名字的動作；「小安」是人物，「鉛筆」是工具，「名字」是寫下的內容。`
- 概念一致性：仍測量「從句子角色辨識動作詞」，但改用書寫情境與單字動詞，與既有 `放`、`跑`、`擦`、`揉` 的題庫形式一致。
- 其他合理答案：低。四個選項中只有「寫」表示動作；「拿起」雖是動作，但不在選項中，且題幹空格明確要求填入「在紙上＿＿＿＿自己的名字」的動作詞。
- 正確性依據／疑義：由句法角色與常用動詞語意可確認；repository 沒有指定教材來源，Human 仍需確認「寫」與情境符合妹妹年級。
- 審核建議：若沒有教材支持「收進」，優先審核 V1A；V1 與 V1A 不應同時加入，避免同一批次新增兩個等價 variation。

## 7. Compatibility and review behavior

- Question schema 維持 `id`、`title`、`instruction`、`topic`、`type`、`question`、`options`、`answer`、`hint`、`explanation`、`encouragement` 及 optional `reviewGroupId`。
- 既有 questionId 永不重用於不同題意；既有 Learning Records 仍指向原題。
- learning unit 仍是 `reviewGroupId ?? question.id`；新增 variation 必須加入既有 group，不能建立同觀念的第二個 group，也不能把 legacy history 靜默搬移。
- 新 variation 會使 Sprint 18 deterministic alternate selection 有更多候選；實作需維持 recent-question avoidance、student/subject isolation 與同 group same-day progression once-only。
- 新 variation 不應把已存在的 group 當成新 learning unit，不應重置既有 1/3/7 或改寫 parent summary 的歷史 record。
- hint 與 explanation 只由 QuestionCard 顯示；不得新增 Learning Record 欄位或永久 feedback state。

## 8. Content correctness and Human Review rules

每一個候選題目必須附一份集中審核表：

1. questionId（既有或 proposed）與 reviewGroupId。
2. 題目要測量的單一觀念。
3. 完整題幹、選項與 answer index。
4. 為何只有一個最佳答案；其餘選項的錯誤理由。
5. hint 如何引導思考而不直接暴露答案。
6. explanation 如何說明規則與題幹線索，而非只重述答案。
7. 教材／字典／年級適切性的依據。
8. 與同 group 既有 variation 的實質差異。

Human Approval 規則：

- 未經核准的 proposed question 不得寫入 production Question Bank。
- 若發現現有答案疑似錯誤，保留原內容，標記 questionId、疑義與證據，不在本 Sprint 自行修正。
- 內容審核通過後，implementation 才能更新題庫；若審核只批准 hint／explanation，則不得順便新增 variation。

## 9. Validation and test-first strategy

Implementation plan 階段應先新增 failing tests，再做最小題庫變更：

- 題庫 shape、唯一 questionId、options／answer 邊界、explanation 完整性。
- 新增 variation 的 reviewGroupId、topic/type 一致性與 learning-unit count 不意外增加。
- 每個改善題的 hint 非空、提供線索但不包含 answer text 的直接洩漏檢查。
- explanation 必須包含可驗證的理由或題幹線索，不只複製正解文字。
- 既有 questionId 與歷史 Learning Records 的 compatibility fixtures。
- deterministic variation selection、recent-question avoidance、Sprint 18 confirmation 與 1/3/7 group aggregation regression。
- 姐姐／妹妹與 subject isolation、Sprint 19 no-write practice、Sprint 20 parent summary regression。
- 完整 `npm test`、lint、TypeScript、build、`git diff --check`；若修改題庫，再執行隔離 Browser smoke。

Validation 不取代 Human 內容審核；自動化只能驗證結構、契約與不變條件，不能自行判定語文教材正確性。

## 10. Regression safeguards

不得改變：

- Question schema 與既有 questionId 身份。
- `reviewGroupId ?? question.id` learning-unit 語意。
- 1/3/7、retry、same-day group progression、每日最多 5 groups。
- Sprint 18 primary → confirmation、deterministic alternate、pending reconstruction 與 no-third-question。
- Sprint 19 practice no-record 語意。
- Sprint 17 timer／`startedAt`。
- Sprint 20 Parent Summary v2、record count、retry count、pending confirmation 與 student/subject isolation。

題庫更新不得刪除或重用既有 questionId，不得用新的 variation 覆寫歷史題意，不得以通過測試為由放寬 validation 或降低內容審核標準。

## 11. Out of Scope

- 大規模新增題庫或跨科目題庫。
- AI 出題、AI 教學、個人化難度、mastery／理解度評分。
- Learning Record、ReviewSession、review settings 或任何永久 analytics schema 變更。
- 重新設計 Today Review、Sprint 18 confirmation、Sprint 19 practice 或 Parent Summary。
- 變更 local-day、1/3/7、retry、timer／`startedAt` 或 Browser smoke 基礎設施。
- 自行修正未經教材依據確認的既有答案。

## 12. Open Human Decisions

1. 四題既有 hint／explanation 草案的文字與妹妹年級適切性。
2. 動作詞 V1／V1A 擇一的 questionId 候選、題幹、選項、正解、hint、explanation、`application` type 與教材依據。
3. V1 或 V1A 是否確實屬於 `meimei-chinese-action-word-identification`，且所選答案是唯一且適合妹妹程度的正解；兩者不得同時加入。
4. 「高興／快樂」、「開心／高興」的詞義教學表述。
5. 是否維持高興 learning unit 不新增 variation；本 Design 建議維持，因目前沒有足夠不同且唯一正解的第三種問法。

除上述 Human Review Items 外，本 Design 不要求改變既有資料 schema、排程語意或產品架構。
