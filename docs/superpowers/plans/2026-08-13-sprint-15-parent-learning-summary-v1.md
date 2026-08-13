# Sprint 15：家長模式學習摘要 v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** 在 /parent 以現有 Learning Records 即時計算姐姐與妹妹各自的 Today、最近 7 天與需要留意摘要。

**Architecture:** 新增 lib/parent-learning-summary.ts 純 domain helper，接收 unknown records、學生、科目、目前題庫、now 與 timezone，輸出 UI-ready model。ParentLearningRecords 保持 Client Component，只在 mount 後透過現有 readLearningRecords() 讀取，之後在 useMemo 呼叫 helper；JSX 不重新計算學習規則。

**Tech Stack:** Next.js App Router、React client components、TypeScript、Node node:test + TypeScript transpile harness、既有 Intl 與 localStorage helper。

## Global Constraints

- 不修改 LearningRecord schema、storage key；不建立 analytics persistence 或 database。
- 不修改 today-review.ts、spaced-review.ts、reviewGroup/variation selection、Question flow、Sprint 14 session/timer。
- 所有運算維持 student + subject isolation。
- learning unit 是 current question 的 reviewGroupId ?? question.id；legacy 題目自然以 question.id fallback。
- Today 使用 getLocalDateKey(now, timeZone)。Last 7 Days 是 today 與前六個 local calendar days，絕不使用固定 168 小時。
- UI 用語固定為「完成作答」，不是「完成題數」。
- repeated-retry attention 需要同一 unit 在最近 7 天內至少兩筆不同 completed records 且每筆 attempts > 1；一筆 attempts 5 仍不符合。
- 不顯示 NaN、0/0 或無意義百分比；不增加 chart、姐妹比較、AI 或 dependency。

---

## File Structure

- Create: lib/parent-learning-summary.ts — period metrics、unit map、due count、attention 的唯一 domain 邊界。
- Create: lib/parent-learning-summary.test.mjs — 固定 now/timezone 的 pure aggregation tests，不讀 DOM/storage。
- Modify: components/parent/ParentLearningRecords.tsx — mount 後讀 records、useMemo 產生兩位學生 summaries、渲染 cards/attention。
- Do not modify: lib/learning-records.ts、lib/spaced-review.ts、lib/today-review.ts、lib/review-sessions.ts、lib/review-session-time.ts、題庫與 Question flow。

## Public Summary Model

在 lib/parent-learning-summary.ts 定義並 export：

    type ParentSummaryQuestion = {
      id: string;
      question: string;
      reviewGroupId?: string;
    };

    type ParentSummaryPeriod = {
      completedRecordCount: number;
      firstTryCorrectCount: number;
      firstTryCorrectRate: number | null;
      retryRecordCount: number;
    };

    type ParentSummaryAttentionItem =
      | { kind: 'repeated-retry'; unitId: string; label: string; retryRecordCount: number }
      | { kind: 'due-review'; unitId: string; label: string };

    type ParentLearningSummary = {
      today: ParentSummaryPeriod;
      last7Days: ParentSummaryPeriod;
      latestLearningLocalDate: string | null;
      dueLearningUnitCount: number;
      attentionItems: ParentSummaryAttentionItem[];
    };

    function createParentLearningSummary(options: {
      records: unknown[];
      student: StudentId;
      subject: SubjectId;
      questions: ParentSummaryQuestion[];
      now: Date;
      timeZone: string;
    }): ParentLearningSummary;

Helper 必須忽略 student/subject/questionId 無效、attempts 非整數或小於 1、日期無效、或不是 completed === true 且 correct === true 的資料。這是 pure helper 的防線；parent UI 仍復用 readLearningRecords() 作 storage schema 的第一層防線。completedRecordCount 為 0 時 firstTryCorrectRate 回傳 null，UI 不能顯示百分比。

### Task 1: 建立 pure summary helper 與 period 統計

**Files:**

- Create: lib/parent-learning-summary.ts
- Test: lib/parent-learning-summary.test.mjs

**Interfaces:**

- Consumes: getLocalDateKey、addLocalDays、deriveReviewState from @/lib/spaced-review；StudentId、SubjectId from @/lib/learning-records。
- Produces: 上列 public types 與 createParentLearningSummary，供 Tasks 2、3 消費。

- [ ] **Step 1: 先寫失敗的 empty、invalid、isolation、boundary、period test**

依 lib/spaced-review.test.mjs 建立 VM/transpile harness：先 transpile spaced-review.ts，summary helper 的 require('@/lib/spaced-review') 對應該 module。固定 NOW = 2026-08-13T04:00:00.000Z、TIME_ZONE = Asia/Taipei；使用題庫 [A(group-a), B(group-a), legacy(no group)]。

新增一個 completed(id, questionId, overrides) factory，預設 jiejie/chinese、attempts 1、correct true、completed true、有效 ISO createdAt。驗證：

1. empty records 兩期間皆為 count 0、rate null、latest null、attention []；
2. malformed object、invalid date、attempts 0、incomplete、incorrect record 均忽略；
3. meimei record 與 math record 不影響 jiejie/chinese；
4. 2026-08-12T15:59:59.000Z 在台灣是 Aug 12，2026-08-12T16:00:00.000Z 是 Aug 13；
5. Last 7 Days 包含 local 2026-08-07，排除 2026-08-06；
6. 兩筆有效 records（attempts 1、attempts 2）產生 completedRecordCount 2、firstTryCorrectCount 1、rate 0.5、retryRecordCount 1；
7. latest local date 對全部 valid completed records 取最大值，非僅 Last 7 Days。

- [ ] **Step 2: 執行新測試並確認失敗**

Run: node --test lib/parent-learning-summary.test.mjs

Expected: FAIL，因 helper 尚不存在。

- [ ] **Step 3: 實作 minimal valid-record 與 period helpers**

寫 private isCompletedRecord(value: unknown)；符合 public model contract 後，先依 options.student/subject 過濾。用 todayKey = getLocalDateKey(now, timeZone) 與 last7StartKey = addLocalDays(todayKey, -6)。

    function toPeriod(records, startDate, endDate, timeZone) {
      const inRange = records.filter((record) => {
        const key = getLocalDateKey(new Date(record.createdAt), timeZone);
        return key >= startDate && key <= endDate;
      });
      const completedRecordCount = inRange.length;
      const firstTryCorrectCount = inRange.filter((record) => record.attempts === 1).length;
      return {
        completedRecordCount,
        firstTryCorrectCount,
        firstTryCorrectRate: completedRecordCount === 0 ? null : firstTryCorrectCount / completedRecordCount,
        retryRecordCount: inRange.filter((record) => record.attempts > 1).length,
      };
    }

回傳 latest 最大 local date 或 null；本 task 暫回傳 dueLearningUnitCount 0 與 attentionItems []。

- [ ] **Step 4: 執行並確認 period tests 通過**

Run: node --test lib/parent-learning-summary.test.mjs

Expected: PASS：empty、invalid、student/subject isolation、local boundary、7-day boundary、完成作答、首次答對、retry、latest。

- [ ] **Step 5: Commit helper foundation**

    git add lib/parent-learning-summary.ts lib/parent-learning-summary.test.mjs
    git commit -m "feat: add parent learning summary aggregation"

### Task 2: 加入 unit-level due 和 deterministic attention

**Files:**

- Modify: lib/parent-learning-summary.ts
- Modify: lib/parent-learning-summary.test.mjs

**Interfaces:**

- Consumes: Task 1 model/function，以及未修改的 deriveReviewState。
- Produces: final dueLearningUnitCount 和 ordered attentionItems，供 Task 3 只讀渲染。

- [ ] **Step 1: 寫失敗 tests，完整覆蓋 group 與 attention 規則**

使用 A/B 同屬 group-a 與 legacy 題，測試：

1. reviewGroupId ?? question.id；A/B due count 只算一個；legacy unit ID 是 legacy；
2. group 以所有 variation IDs 呼叫 review state，確實沿用 1/3/7、retry reset；
3. due unit 若今日已有有效完成 record，不出現 due-review attention；
4. 單一 attempts 2 record 不出現 repeated-retry；單一 attempts 5 也不出現；
5. 兩筆不同 id、各 attempts > 1 才有一項；A 與 B 各一筆 retry 合併為 group-a、retryRecordCount 2；
6. 第八天 retry 不納入；unknown questionId repeated retry 使用該 ID 為 label/unit，但不加入 current due iteration；
7. repeated-retry 全部排在 due-review 前；每種依 unitId 升冪。

至少含此 exact assertion：

    assert.deepEqual(summary.attentionItems, [
      { kind: 'repeated-retry', unitId: 'group-a', label: '題目 A', retryRecordCount: 2 },
      { kind: 'due-review', unitId: 'legacy', label: '舊題目' },
    ]);

- [ ] **Step 2: 執行並確認 tests 失敗**

Run: node --test lib/parent-learning-summary.test.mjs

Expected: FAIL，因 Task 1 回傳 zero due 和 empty attention。

- [ ] **Step 3: 實作 current-unit grouping、due 及 attention**

由 current questions 建 Map<unitId, questions[]>，key 為 reviewGroupId ?? id；第一題 question 是 label，另建 questionId-to-unitId map。每個 current unit 呼叫既有 helper，不能複製 Sprint 12 state algorithm：

    const state = deriveReviewState({
      records: validRecords, student, subject,
      questionId: unitQuestions[0].id,
      questionIds: unitQuestions.map((question) => question.id),
      now, timeZone,
    });

dueLearningUnitCount 為 state.isDue 的 current unit 數。以 today local key 建 current-unit completed set；只有 state.isDue 且不在 set 的 unit 產生 due-review item。

對 Last 7 Days valid retry records，若 question ID 在 map 中就 group 到 unit，否則 group 到 record.questionId。以 distinct record.id 取計數，count 小於 2 不建 repeated-retry。current unit 用題庫 label，未知則用 questionId；分別按 unitId sort，再以 repeated-retry 在前、due-review 在後串接。

- [ ] **Step 4: 執行並確認 domain tests 通過**

Run: node --test lib/parent-learning-summary.test.mjs

Expected: PASS：group dedupe、legacy fallback、due count、today suppression、兩筆 retry threshold、A/B merge、unknown fallback、ordering。

- [ ] **Step 5: 執行 Sprint 10–14 focused regressions**

Run: node --test lib/learning-records.test.mjs lib/spaced-review.test.mjs lib/today-review.test.mjs lib/review-sessions.test.mjs lib/review-session-time.test.mjs lib/questions/jiejie-chinese.test.mjs lib/questions/meimei-chinese.test.mjs

Expected: PASS，且不改 existing review/variation/session/question files。

- [ ] **Step 6: Commit unit and attention behavior**

    git add lib/parent-learning-summary.ts lib/parent-learning-summary.test.mjs
    git commit -m "feat: add parent summary attention items"

### Task 3: 將 summary model 接到 parent UI

**Files:**

- Modify: components/parent/ParentLearningRecords.tsx
- Test: lib/parent-learning-summary.test.mjs

**Interfaces:**

- Consumes: Task 2 createParentLearningSummary、ParentLearningSummary、兩位學生的 current Chinese question banks、readLearningRecords。
- Produces: hydrated /parent cards；LearningRecordList 保持原有歷史 records 顯示。

- [ ] **Step 1: 補上 UI-safe model test**

在 helper tests 斷言 empty rate 為 null、populated rate 為 finite number、empty attention 為 []：

    assert.equal(empty.today.firstTryCorrectRate, null);
    assert.equal(Number.isFinite(populated.last7Days.firstTryCorrectRate), true);
    assert.deepEqual(empty.attentionItems, []);

- [ ] **Step 2: 執行 helper test**

Run: node --test lib/parent-learning-summary.test.mjs

Expected: PASS；JSX 不需要自行修補 NaN/0/0。

- [ ] **Step 3: 接線 ParentLearningRecords，只渲染 summary model**

Import questions as jiejieChineseQuestions、questions as meimeiChineseQuestions 與 summary helper。保留 LearningRecord[] | null state、delayed useEffect、readLearningRecords()；不得在 render 讀 window/localStorage，亦不得建立新 storage key。

擴充 StudentSection 加 summary: ParentLearningSummary。既有 useMemo 對 jiejie 呼叫：

    createParentLearningSummary({
      records: records ?? [], student: 'jiejie', subject: 'chinese',
      questions: jiejieChineseQuestions, now: new Date(), timeZone: 'Asia/Taipei',
    })

meimei 使用相同 contract 與自己的題庫。records 為 null 時維持 loading return，以避免 SSR/client hydration mismatch。

每位學生分區依序渲染：需要留意（空時正常訊息）、Today、Last 7 Days（各顯示完成作答、首次答對；rate 非 null 才顯示百分比；有 retry 的作答）、最近一次學習（null 的友善無資料文字）、待複習 learning units、既有歷史列表。使用現有 Tailwind card/text，禁止 chart/filter/comparison；retry 文案不可改為錯答次數。

- [ ] **Step 4: 執行 summary 與 focused regressions**

Run: node --test lib/parent-learning-summary.test.mjs lib/learning-records.test.mjs lib/spaced-review.test.mjs lib/today-review.test.mjs lib/review-sessions.test.mjs lib/review-session-time.test.mjs lib/questions/jiejie-chinese.test.mjs lib/questions/meimei-chinese.test.mjs

Expected: PASS。

- [ ] **Step 5: 完整驗證與 browser smoke**

Run:

    npm test
    npm run lint
    npx tsc --noEmit
    npm run build
    git diff --check

Expected: 全部 exit 0。開啟 /parent，且不修改既有 browser profile；確認無 hydration/console errors、姐妹區塊分離、empty state 無 NaN/0/0。若無隔離 storage context，回報 populated-data browser smoke 未驗證，不可改寫使用者 profile。

- [ ] **Step 6: 檢查 scope 並 commit UI wiring**

Run: git status --short，然後 git diff -- components/parent/ParentLearningRecords.tsx lib/parent-learning-summary.ts lib/parent-learning-summary.test.mjs

Expected: 僅這三個產品檔改動。然後：

    git add components/parent/ParentLearningRecords.tsx lib/parent-learning-summary.ts lib/parent-learning-summary.test.mjs
    git commit -m "feat: add parent learning summaries"

## Execution Acceptance Checklist

- [ ] 兩個期間都以 completed record events 計算，UI 名稱為「完成作答」。
- [ ] zero denominator 一律回傳 null；無 NaN/0/0。
- [ ] local calendar 第七天包含、第八天排除。
- [ ] direct pure tests 覆蓋 malformed input、隔離、日期、活動統計、unit fallback/dedupe、due、today suppression、retry threshold 與 ordering。
- [ ] parent 只在 mount 後讀既有 storage helper，不會 SSR/hydration mismatch，也沒有競爭 storage schema。
- [ ] Sprint 10–14 既有 helpers 不變，focused/full regression 在 push 前皆通過。
- [ ] 不新增 charts、比較、AI、database、duration analytics 或 push。
