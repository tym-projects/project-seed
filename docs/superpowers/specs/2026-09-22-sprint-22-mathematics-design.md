# Sprint 22：數學題目草案與最小接線 Design

## 文件狀態

- **狀態：** Design 與題目文字已 Human Approved；等待 Implementation Plan Review。
- **Sprint：** Sprint 22。
- **正式 repository：** `C:\Users\admin\Documents\2026AST-dev`。
- **基準 HEAD：** `f02379d`。
- **本文件不代表南一官方教材或題庫核准。** 12 題文字已取得 Human 核准，作為 Sprint 22 implementation input；尚未加入 production 題庫。
- 本階段不建立 Implementation Plan，不修改 production code、production question bank 或 tests。

## 1. 已核准範圍

### 姐姐

- 年級：國小六年級上學期
- 版本：南一版
- 範圍：第 1–6 單元
- subject：`mathematics`

1. 質因數分解和短除法
2. 分數的除法
3. 小數的除法
4. 圓周長和圓面積
5. 比和比值
6. 扇形的弧長和面積

### 妹妹

- 年級：國小三年級上學期
- 版本：南一版
- 範圍：第 1–6 單元
- subject：`mathematics`

1. 數到 10000
2. 四位數的加減
3. 乘法
4. 幾毫米
5. 角、正方形和長方形
6. 除法

公開課程架構可作為單元名稱的外部交叉核對：三上第 1–6 單元為「數到 10000、四位數的加減、乘法、幾毫米、角、正方形和長方形、除法」；六上第 1–6 單元為「質因數分解和短除法、分數的除法、小數的除法、圓周長和圓面積、比和比值、扇形的弧長和面積」。這些資料只用於範圍核對，不代表本題目是教科書原題、官方題庫或已取得授權。[三年級單元架構](https://www.junyiacademy.org/topics/n-m3a)、[六年級南一版課程表](https://www.cp.ptc.edu.tw/storage/134656/134656_113_B-04_6A.pdf?1731439503=)

## 2. 題庫與 learning unit 原則

- 共 12 題：每位學生 6 題，每個核准單元 1 題。
- 每題都是獨立 learning unit。
- 題目不設定 `reviewGroupId`；learning unit ID 使用 `question.id` fallback。
- 目前不建立 variation，因為單題 unit 不符合 Sprint 18 confirmation eligibility。
- 所有題目使用現有選擇題欄位：`topic`、`type`、`title`、`instruction`、`question`、`options`、`answer`、`hint`、`explanation`、`encouragement`。
- 所有數學文字、數字、單位與公式必須能在現有文字 QuestionCard 中清楚呈現。
- 題目為原創練習題，不複製教材原文、頁碼或官方題庫內容；Human 核准不代表南一官方教材審核。

## 3. 12 題完整候選草案

### 姐姐題庫

#### J1：質因數分解和短除法

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-1` / `質因數分解和短除法`
- **questionId：** `jiejie-mathematics-1`
- **learning unit ID：** `jiejie-mathematics-1`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `84 的質因數分解是哪一個？`
- **選項：**
  1. `2 × 2 × 3 × 7`
  2. `2 × 3 × 14`
  3. `4 × 21`
  4. `6 × 14`
- **正解：** 選項 1，`answer: 0`
- **Hint：** `先把 84 依序除以最小的質因數，直到每個因數都是質數。`
- **Explanation：** `84 ÷ 2 = 42，42 ÷ 2 = 21，21 ÷ 3 = 7。最後得到的質因數是 2、2、3、7，所以 84 = 2 × 2 × 3 × 7。`
- **獨立驗證：** `2 × 2 × 3 × 7 = 84；其餘選項雖然乘積也可能等於 84，但含有 14、4、21 等合數，不是完整的質因數分解。`
- **範圍／年級檢查：** 符合六上第 1 單元；使用質因數分解，不超出核准範圍。
- **Human 核准文字：** 質因數固定採由小到大排列。

#### J2：分數的除法

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-2` / `分數的除法`
- **questionId：** `jiejie-mathematics-2`
- **learning unit ID：** `jiejie-mathematics-2`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `application`／基礎應用
- **題幹：** `計算：3/4 ÷ 1/2 = ？`
- **選項：**
  1. `3/8`
  2. `2/3`
  3. `3/2`
  4. `1/4`
- **正解：** 選項 3，`answer: 2`
- **Hint：** `除以一個分數，可以改成乘以它的倒數。`
- **Explanation：** `3/4 ÷ 1/2 = 3/4 × 2/1 = 6/4 = 3/2，也可以寫成 1 又 1/2。`
- **獨立驗證：** `3/2 × 1/2 = 3/4，因此 3/2 是正確的商；其他三個選項代回乘法均不會得到 3/4。`
- **範圍／年級檢查：** 符合六上第 2 單元；分母非零，條件完整。
- **Human 核准文字：** 正解維持假分數 `3/2`；解析保留 `1 又 1/2` 的補充說明。

#### J3：小數的除法

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-3` / `小數的除法`
- **questionId：** `jiejie-mathematics-3`
- **learning unit ID：** `jiejie-mathematics-3`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `計算：8.4 ÷ 0.7 = ？`
- **選項：**
  1. `1.2`
  2. `12`
  3. `120`
  4. `0.12`
- **正解：** 選項 2，`answer: 1`
- **Hint：** `把除數 0.7 變成整數時，被除數也要同時乘以 10。`
- **Explanation：** `8.4 ÷ 0.7 的除數有一位小數，所以被除數和除數同時乘以 10，變成 84 ÷ 7。84 ÷ 7 = 12，因此 8.4 ÷ 0.7 = 12。`
- **獨立驗證：** `12 × 0.7 = 8.4`，所以商為 12。
- **範圍／年級檢查：** 符合六上第 3 單元；計算結果為整數，避免四捨五入歧義。
- **疑義／Human 確認：** Human 需確認是否要在題幹明示「請計算到最簡結果」；本題結果無需近似。

#### J4：圓周長和圓面積

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-4` / `圓周長和圓面積`
- **questionId：** `jiejie-mathematics-4`
- **learning unit ID：** `jiejie-mathematics-4`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `application`／基礎應用
- **題幹：** `一個圓的半徑是 5 公分。若 π 取 3.14，這個圓的面積是多少平方公分？`
- **選項：**
  1. `31.4 平方公分`
  2. `62.8 平方公分`
  3. `78.5 平方公分`
  4. `157 平方公分`
- **正解：** 選項 3，`answer: 2`
- **Hint：** `圓面積公式是 π × 半徑 × 半徑；題目已給半徑和 π。`
- **Explanation：** `圓面積 = π × 半徑 × 半徑 = 3.14 × 5 × 5 = 3.14 × 25 = 78.5，所以面積是 78.5 平方公分。`
- **獨立驗證：** `3.14 × 25 = 78.50`；單位為平方公分。31.4 是圓周長 `2 × 3.14 × 5`，不是面積。
- **範圍／年級檢查：** 符合六上第 4 單元；不需要圖片，半徑、π 與面積單位均明示。
- **Human 核准文字：** 題幹明確指定 `π = 3.14`，不接受其他近似值。

#### J5：比和比值

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-5` / `比和比值`
- **questionId：** `jiejie-mathematics-5`
- **learning unit ID：** `jiejie-mathematics-5`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `application`／基礎應用
- **題幹：** `紅球和藍球的數量比是 2：3。若紅球有 8 顆，藍球有幾顆？`
- **選項：**
  1. `10 顆`
  2. `12 顆`
  3. `16 顆`
  4. `24 顆`
- **正解：** 選項 2，`answer: 1`
- **Hint：** `紅球的 2 份變成 8 顆，先找出 1 份是多少，再找 3 份。`
- **Explanation：** `2 份紅球是 8 顆，所以 1 份是 8 ÷ 2 = 4 顆。藍球是 3 份，所以 4 × 3 = 12 顆。`
- **獨立驗證：** `8：12` 約分後為 `2：3`，比例符合題目。
- **範圍／年級檢查：** 符合六上第 5 單元；只使用整數倍關係，文字條件完整。
- **疑義／Human 確認：** Human 需確認教材是否使用「數量比」的相同語詞；本題不要求額外比例符號操作。

#### J6：扇形的弧長和面積

- **student / subject：** `jiejie` / `mathematics`
- **unit / topic：** `jiejie-mathematics-unit-6` / `扇形的弧長和面積`
- **questionId：** `jiejie-mathematics-6`
- **learning unit ID：** `jiejie-mathematics-6`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `application`／基礎應用
- **題幹：** `一個圓心角 90° 的扇形，半徑為 6 公分。若 π = 3.14，這個扇形的弧長是多少公分？`
- **選項：**
  1. `6.28 公分`
  2. `9.42 公分`
  3. `18.84 公分`
  4. `37.68 公分`
- **正解：** 選項 2，`answer: 1`
- **Hint：** `四分之一圓的弧長是整個圓周長的四分之一。`
- **Explanation：** `整個圓周長 = 2 × 3.14 × 6 = 37.68 公分。圓心角 90° 的扇形弧長是整個圓周長的四分之一，所以 37.68 ÷ 4 = 9.42 公分。`
- **獨立驗證：** `9.42 × 4 = 37.68`，正好是半徑 6 公分、π = 3.14 的整圓周長。
- **範圍／年級檢查：** 符合六上第 6 單元；以「圓心角 90°」明確指定扇形比例，不需圖片。
- **Human 核准文字：** 使用「圓心角 90° 的扇形」；原選項、正解與計算結果不變。

### 妹妹題庫

#### M1：數到 10000

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-1` / `數到 10000`
- **questionId：** `meimei-mathematics-1`
- **learning unit ID：** `meimei-mathematics-1`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `3407 的位值分解是哪一個？`
- **選項：**
  1. `3000 + 400 + 7`
  2. `3000 + 40 + 7`
  3. `300 + 400 + 7`
  4. `3000 + 400 + 70`
- **正解：** 選項 1，`answer: 0`
- **Hint：** `看千位、百位、十位和個位；3407 的十位有幾個？`
- **Explanation：** `3407 有 3 個千、4 個百、0 個十和 7 個一，所以 3407 = 3000 + 400 + 7。`
- **獨立驗證：** `3000 + 400 + 7 = 3407`；其他選項分別得到 3047、707、3470。
- **範圍／年級檢查：** 符合三上第 1 單元；只使用 10000 以內位值概念。
- **Human 核准文字：** 保留「位值分解」；解析明示十位為 0。

#### M2：四位數的加減

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-2` / `四位數的加減`
- **questionId：** `meimei-mathematics-2`
- **learning unit ID：** `meimei-mathematics-2`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `計算：3482 + 2157 = ？`
- **選項：**
  1. `5539`
  2. `5639`
  3. `5739`
  4. `5839`
- **正解：** 選項 2，`answer: 1`
- **Hint：** `可以從個位開始直式相加，滿十要進位。`
- **Explanation：** `個位 2＋7＝9；十位 8＋5＝13，寫 3、向百位進 1；百位 4＋1＋1＝6；千位 3＋2＝5；所以答案為 5639。`
- **獨立驗證：** `3482 + 2000 = 5482`，再加 `157 = 5639`；答案唯一。
- **範圍／年級檢查：** 符合三上第 2 單元；使用四位數直式加法，無高年級方法。
- **疑義／Human 確認：** Human 需確認題目是否需要改成生活情境；本草案先保留純計算，以降低語文負擔。

#### M3：乘法

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-3` / `乘法`
- **questionId：** `meimei-mathematics-3`
- **learning unit ID：** `meimei-mathematics-3`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `計算：24 × 3 = ？`
- **選項：**
  1. `62`
  2. `72`
  3. `82`
  4. `92`
- **正解：** 選項 2，`answer: 1`
- **Hint：** `可以把 24 看成 20 和 4，再分別乘以 3。`
- **Explanation：** `24 × 3 = (20 × 3) + (4 × 3) = 60 + 12 = 72。`
- **獨立驗證：** `24 + 24 + 24 = 72`，與乘法結果相同。
- **範圍／年級檢查：** 符合三上第 3 單元；使用二位數乘一位數的基本概念。
- **疑義／Human 確認：** Human 需確認 24 × 3 是否符合目前實際教學週次；本題不使用超出三年級的直式技巧。

#### M4：幾毫米

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-4` / `幾毫米`
- **questionId：** `meimei-mathematics-4`
- **learning unit ID：** `meimei-mathematics-4`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `3 公分 7 毫米等於幾毫米？`
- **選項：**
  1. `10 毫米`
  2. `30 毫米`
  3. `37 毫米`
  4. `307 毫米`
- **正解：** 選項 3，`answer: 2`
- **Hint：** `1 公分等於 10 毫米；先把 3 公分換成毫米，再加上 7 毫米。`
- **Explanation：** `3 公分 = 3 × 10 = 30 毫米。再加上原本的 7 毫米，30 + 7 = 37 毫米。`
- **獨立驗證：** `37 毫米 = 30 毫米 + 7 毫米 = 3 公分 7 毫米`；答案唯一。
- **範圍／年級檢查：** 符合三上第 4 單元；明示公分與毫米換算關係。
- **疑義／Human 確認：** Human 需確認教材用語採「毫米」或「公厘」；本題使用目前範圍指定的「毫米」。

#### M5：角、正方形和長方形

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-5` / `角、正方形和長方形`
- **questionId：** `meimei-mathematics-5`
- **learning unit ID：** `meimei-mathematics-5`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `basic`／基礎
- **題幹：** `哪一個敘述正確？`
- **選項：**
  1. `正方形只有兩個直角。`
  2. `長方形的四條邊都一樣長。`
  3. `正方形的四條邊一樣長，而且四個角都是直角。`
  4. `長方形沒有直角。`
- **正解：** 選項 3，`answer: 2`
- **Hint：** `想一想正方形的邊和角各有什麼特徵。`
- **Explanation：** `正方形有四條一樣長的邊，也有四個直角，所以第 3 個敘述正確。長方形也有四個直角，但不一定四邊都一樣長。`
- **獨立驗證：** 選項 1、4 與直角數量矛盾；選項 2 把正方形的特徵誤套到所有長方形；只有選項 3 完整正確。
- **範圍／年級檢查：** 符合三上第 5 單元；只使用文字描述，不依賴圖片或互動圖形。
- **疑義／Human 確認：** Human 需確認是否希望加入實際圖形；本題依核准限制先採純文字選擇題。

#### M6：除法

- **student / subject：** `meimei` / `mathematics`
- **unit / topic：** `meimei-mathematics-unit-6` / `除法`
- **questionId：** `meimei-mathematics-6`
- **learning unit ID：** `meimei-mathematics-6`
- **reviewGroupId：** 不設定
- **題型／預計難度：** `application`／基礎應用
- **題幹：** `26 顆糖果平分給 4 個人，每人分得幾顆？剩下幾顆？`
- **選項：**
  1. `6 顆，剩 2 顆`
  2. `6 顆，剩 4 顆`
  3. `7 顆，剩 2 顆`
  4. `7 顆，剩 0 顆`
- **正解：** 選項 1，`answer: 0`
- **Hint：** `找出 4 的乘法中最接近 26 且不超過 26 的數。`
- **Explanation：** `4 × 6 = 24，26 - 24 = 2，所以每個人得到 6 顆，還剩 2 顆。4 × 7 = 28，超過 26，不能分成每人 7 顆。`
- **獨立驗證：** `26 = 4 × 6 + 2`，且餘數 2 小於除數 4；答案唯一。
- **範圍／年級檢查：** 符合三上第 6 單元；使用有餘數除法與生活情境，不使用高年級方法。
- **Human 核准文字：** 採用「每人分得幾顆？剩下幾顆？」；原選項與正解不變。

## 4. 題目品質自檢結果

- 12 題皆有唯一正解；目前沒有發現多重正解。
- 12 題皆可用現有文字選擇題 UI 呈現，不需要圖片、圖形操作或數字輸入。
- 姐姐 J4、J6 明示 π 取 `3.14`，並標示半徑、角度比例與單位，避免近似值或單位歧義。
- 姐姐 J2 使用假分數 `3/2`；是否改成帶分數是 Human 內容選擇，不是計算正確性問題。
- 妹妹 M5 不依賴圖形，直接測量正方形／長方形的文字特徵；是否需要圖像輔助留給 Human 決定。
- 題目沒有宣稱對應特定頁碼、官方題目、授權題庫或已核准教材內容。
- 所有題目均標記候選；尚未加入 production Question Bank。

## 5. 最小程式接線 Design

### 5.1 Subject 型別與 Learning Record

- 將 `SubjectId` 從僅 `'chinese'` 擴充為 `'chinese' | 'mathematics'`。
- `LearningRecord` 欄位與 storage key 不變；現有 JSON shape 不變，只允許 validator 接受新 subject。
- `saveLearningRecord`、讀取與顯示仍以 `student + subject + questionId` 為隔離邊界。
- 不新增 `recordSource`、mastery、教材版本或永久題庫狀態欄位。

### 5.2 共用 Question Flow

- 將目前 `ChineseQuestionFlow` 的 subject 改為必要 prop，或以最小命名調整抽成 `QuestionFlow`。
- `QuestionCard`、retry、hint、explanation、confirmation flow、timer 與 persistence policy 保持原語意。
- 完成題目時使用傳入的 `subject` 寫入 Learning Record，不再硬編碼 `'chinese'`。
- 現有國語路由必須明確傳入 `subject="chinese"`，數學路由傳入 `subject="mathematics"`。

### 5.3 數學入口與題庫

- 新增 `lib/questions/jiejie-mathematics.ts` 與 `lib/questions/meimei-mathematics.ts`，但只有在 Human 核准 12 題後才可實際加入 production 題庫。
- 新增 `/jiejie/mathematics` 與 `/meimei/mathematics` 路由，使用共用 Question Flow。
- 姐姐／妹妹首頁將「數學練習」佔位文字改為各自路由連結。
- 題庫 validation 應檢查 12 題 ID 唯一、每題 options／answer 合法、hint／explanation 存在，以及每位學生六個單元各一題。

### 5.4 Today Review、再練一次與 ReviewSession

- `TodayReviewPage` 接收 `subject`，將 subject 傳給 `selectTodayReviewItems`、ReviewSession 與共用 flow。
- `selectTodayReviewItems` 已以傳入 subject 進行過濾與 deterministic selection；不修改 1/3/7、五組上限、topic spread 或 confirmation eligibility。
- 單題 unit 沒有第二個 variation，因此 Sprint 18 confirmation 必須維持 `null`，不可產生假 variation。
- 再練一次頁面改為接收 `subject`，沿用 `selectReinforcementPracticeItems` 與 no-write practice policy；數學 practice 不得寫入 Learning Record。
- ReviewSession 現有 subject 欄位已是字串且以 `student + subject` 隔離；不改 schema，只確認數學 session 與國語 session 不互相讀取或結束。
- Review time settings 的 subject validator 從只接受 `chinese` 擴充為 `SubjectId`，storage shape 不變。

### 5.5 Parent Summary

- Parent Summary helper 已接受 `subject` 與題庫，保留同一個純函式與既有統計語意。
- Parent UI 將固定國語題庫／subject 改為最小 subject configuration，讓每位學生分別顯示國語與數學摘要。
- 數學摘要只讀取 `student='jiejie'/'meimei'` 且 `subject='mathematics'` 的 records；不與國語 counts、due、retry 或 attention 混合。
- 不新增 analytics storage、mastery score、跨科比較或新的家長資料模型。

### 5.6 未來科目延伸

本 Design 只新增 mathematics，不先建立通用教材管理或複雜 plugin registry。未來社會／自然可沿用同一條接線：

`SubjectId` → subject 題庫 → 共用 Question Flow → Today Review／practice／Parent Summary。

本次只把目前國語硬編碼改成必要的 subject 傳入，避免提前抽象出未被需求證明的多科目框架。

## 6. Test-first 策略

以下是測試策略，不是本階段的 Implementation Plan：

1. 先補 subject acceptance／isolation tests：Learning Record validator、ReviewSession、review time settings 能接受 mathematics，且 chinese／mathematics 不交叉。
2. 新增數學題庫 exact-content tests：12 個 question ID、6 個 unit per student、topic、options、answer、hint、explanation 與無 `reviewGroupId`。
3. 新增題庫計算與唯一答案 tests：逐題固定 `answer`，驗證 J1–J6、M1–M6 的結果與選項唯一性。
4. 補 flow persistence tests：數學完成題目寫入 `subject='mathematics'`；practice mode 不寫入。
5. 補 Today Review／1/3/7／confirmation tests：數學歷史只影響數學；單題 unit 不產生 confirmation；國語既有 variation 行為不變。
6. 補 Parent Summary tests：數學摘要只讀數學 records，且與國語 summary、student isolation 分離。
7. 保留現有 Sprint 1–21 regression suite，不改變既有國語期待值。

## 7. Regression／Browser smoke 範圍

### Node／純函式 regression

- 完整既有 Node tests。
- 題庫 validation 與 12 題 exact-content tests。
- 姐姐／妹妹及國語／數學四種 isolation 組合。
- 1/3/7、retry、Today Review 五題上限與 topic spread。
- 單題 unit 的 confirmation eligibility 永遠不成立。
- 數學再練一次的 no-write、refresh reset 與 practice／formal review 分離。
- Parent Summary 的數學 due、pending、retry 與國語資料分離。
- ReviewSession、timer、review settings 的 subject separation。

### Browser smoke

使用既有 disposable Chromium context 與 synthetic whitelisted storage，不碰真實使用者 localStorage：

- `/jiejie/mathematics` 與 `/meimei/mathematics` 可載入。
- 姐姐／妹妹各完成至少一題，確認 Learning Record subject 為 `mathematics`。
- 錯答後 hint、再次作答、Explanation 與完成頁正常。
- `/jiejie/review`／`/meimei/review` 的國語路徑仍正常。
- 數學 Today Review、再練一次、ReviewSession 與 timer 不讀取國語資料。
- Parent Summary 同時顯示兩位學生的數學摘要，且不混入國語紀錄。
- 無 console error；既有 Sprint 18／19／20／21 smoke 維持通過。

## 8. Out of Scope

- 不建立 Implementation Plan 或開始實作。
- 不修改 production question bank、production code 或 tests。
- 不新增數字輸入、圖片、圖形互動或第二套答題系統。
- 不建立 AI 出題、動態難度、mastery score、教材管理或雲端同步。
- 不新增 Learning Record／ReviewSession schema 或 storage key。
- 不改變 1/3/7、retry、confirmation、practice no-write、timer 語意。
- 不把候選題宣稱為南一原題、官方題庫或已核准教材內容。
- 不擴充國語題庫，不處理社會與自然。
- 不修改 OneDrive 備份。
- 不核准或執行 `unrs-resolver` install script。
- 不 commit、push、merge、rebase、tag、release，也不宣告 Sprint 22 Completed。

## 9. 集中的 Human Content Review 清單

請 Human 集中確認：

1. 12 題是否確實符合各自年級、南一版本與第 1–6 單元的目前教學進度。
2. J1 已核准質因數由小到大排列。
3. J2 已核准正解維持 `3/2`，解析保留 `1 又 1/2`。
4. J4 已核准題幹明示 `π = 3.14`，並保留純文字圓面積題。
5. J6 已核准使用「圓心角 90° 的扇形」。
6. M2 維持原純計算題，不改成生活情境。
7. M4 維持「毫米」用語。
8. M5 維持不附圖的正方形／長方形文字題。
9. M6 已核准使用「每人分得幾顆？剩下幾顆？」。
10. 所有 hint 是否只提供方向，未直接揭露答案。
11. 所有 explanation 是否符合孩子可理解的步驟與 Human 期望用語。
12. Human 核准前，12 題不得進入 production 題庫。

## 10. 本階段結論

- 題目內容：12 題已依 Human 核准文字同步，均通過初步算術／邏輯自檢。
- Human Content Review Item：目前沒有必須刪除或無法以文字選擇題呈現的單元；12 題文字已依 Human 核准結果同步。
- 架構：可沿用既有共用流程；需要的是 subject 型別擴充、硬編碼國語接線參數化、數學題庫與四條數學入口／摘要接線。
- Schema：不需要改動既有 Learning Record 或 ReviewSession schema。
- Production 狀態：未加入任何候選題，未修改 production code 或 tests。
- 停止點：Sprint 22 Implementation Plan Human Review Gate 前的 Design input。
