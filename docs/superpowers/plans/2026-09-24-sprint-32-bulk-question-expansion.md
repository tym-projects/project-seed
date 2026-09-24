# Sprint 32 第一次月考題庫集中擴充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task after Human scope and content approval.

**Goal:** 在第一次月考已核准範圍內，分批加入經 Human 內容審核的原創題目，逐步把六組題庫擴充到約每組 20 題，並保持既有學習資料與複習語意相容。

**Architecture:** 沿用各學生／科目既有 TypeScript Question Bank、Question schema、Question Bank validation 與共用練習／複習流程。新增題目以 singleton 為預設；variation 只有在同一細部觀念已確認且 Human 另外核准時才加入既有 reviewGroup。

**Tech Stack:** Next.js、React、TypeScript、Node test runner、Playwright disposable Chromium。

**Spec:** `docs/superpowers/specs/2026-09-24-sprint-32-first-exam-bulk-expansion-design.md`

## Global Constraints

- 只處理姐姐數學／自然／社會與妹妹國語／數學／社會的第一次月考範圍。
- 姐姐國語、妹妹自然的教材範圍未確認，不得新增正式題目。
- 不修改 Learning Record／ReviewSession persisted schema、storage keys、既有 questionId 或既有正解。
- 不改變首次練習隨機排序、Today Review 1/3/7／每日最多 5 groups、retry、confirmation、practice no-write 或 timer 語意。
- 任何教材、答案、文字或唯一正解有疑義的題目標為 `pending-review`，不進 production。
- 題目須為原創，逐題驗證唯一正解、Hint、Explanation、年級適切性與教材對應。
- 只有 Human Scope Review 及 Content Review 通過後，才可進入 implementation。

## Review Focus

- 版本／單元次序差異：以 Human 教材為準，測試固定 bank metadata 與範圍。
- 國語詞語歸屬：每題測試課次／生字證據欄位，不以課名猜測。
- 數學等值答案：測試數值等價、單位換算與唯一 answer index。
- variation 相容性：測試既有 reviewGroup 與歷史紀錄不被改寫。
- 批量題庫隔離：測試 student／subject bank、Learning Record questionId 與 Browser route 不混用。

### Task 1: Evidence lock and candidate review

**Files:**
- Read: `docs/superpowers/specs/2026-09-24-sprint-32-first-exam-bulk-expansion-design.md`
- Review: six existing `lib/questions/*.ts` banks and the source evidence listed in the Design
- Create only after approval: a batch-specific candidate manifest under `docs/superpowers/specs/`

- [ ] Confirm each candidate’s student, subject, unit／lesson, evidence grade, type and intended singleton／variation.
- [ ] Remove any candidate whose source, answer or lesson mapping remains uncertain from production scope; keep it `pending-review`.
- [ ] Verify the approved first batch has no duplicate concept with existing questions.
- [ ] Focused verification: a review script or test reports candidate IDs, evidence state, duplicate concept keys and expected answer index without importing production changes.
- [ ] Completion condition: Human approves the candidate manifest and exact content batch.

### Task 2: Question-bank exact-match tests

**Files:**
- Modify: the appropriate `lib/questions/<student>-<subject>.test.mjs`
- Create: one batch test per approved bank only when the batch crosses an existing test boundary

- [ ] Write failing exact-match tests for each approved question’s ID, metadata, stem, four options, answer index, hint and explanation.
- [ ] Add uniqueness checks: one ID, four distinct options, one answer index, no numeric/unit-equivalent second answer.
- [ ] Run focused tests and confirm RED is caused by absent approved IDs, not a malformed existing bank.
- [ ] Completion condition: tests describe only Human-approved questions and do not require changing existing questions.

### Task 3: Minimal production bank insertion

**Files:**
- Modify only approved student／subject bank files under `lib/questions/`
- Do not modify schema, selectors, review logic or storage code

- [ ] Add approved original questions with unique IDs and exact approved text.
- [ ] Default every new concept to singleton with no `reviewGroupId`; add a variation only if separately approved with an existing group ID.
- [ ] Run focused bank tests and validation.
- [ ] Completion condition: only approved IDs are present, all existing IDs and content remain unchanged, and inventory delta matches the approved batch.

### Task 4: Learning and review compatibility regression

**Files:**
- Test only: existing `lib/today-review.test.mjs`, `lib/reinforcement-practice.test.mjs`, `lib/spaced-review.test.mjs`, `lib/learning-records.test.mjs`, and relevant Browser specs

- [ ] Verify singleton units produce independent review groups and variations share only their existing approved group.
- [ ] Verify Today Review retains 1/3/7, topic spread and five-group limit.
- [ ] Verify reinforcement retains its existing group limit and no-write behavior.
- [ ] Verify saved records keep the actual new questionId and student／subject boundaries.
- [ ] Completion condition: no persisted schema, storage key or learning semantic diff.

### Task 5: Browser and tablet sample acceptance

**Files:**
- Modify or create only Sprint 32 Browser specs under `tests/browser/`

- [ ] Use disposable Chromium context and synthetic storage only.
- [ ] Sample each approved student／subject batch in first practice, answer submission, hint／explanation, record readback and return navigation.
- [ ] Check 768×1024 and 1024×768 for long stems/options and no horizontal overflow.
- [ ] Completion condition: sampled flows pass with no console errors; Human performs physical tablet sampling before close.

### Task 6: Full verification and documentation close

**Files:**
- Update: `PROJECT_STATUS.md`, `docs/roadmap.md`, `docs/sprint-log.md`, the Sprint 32 plan

- [x] Run focused tests, `npm test`, `npm run lint`, `npx tsc --noEmit --incremental false`, `npm run build`, `npm run test:browser`, and `git diff --check`.
- [x] Record actual question／learning-unit counts, pending-review exclusions, tablet samples, and evidence limits.
- [x] Stop at Human Final Review before commit/push; do not mark Sprint 32 Completed early.

## 本次執行結果

- Task 1：完成候選審核；Ready 14、Revised 0、Pending-review 10。Pending 題目未入庫。
- Task 2：完成 14 題 exact-match、唯一選項及 singleton metadata focused tests；先 RED（缺少核准 questionId）後 GREEN 2/2。
- Task 3：完成 14 題最小入庫，未修改 schema、selectors、review logic 或 storage。
- Task 4：完成 Learning／Review compatibility regression；既有 1/3/7、五 groups、practice no-write、student／subject isolation 均通過。
- Task 5：完成 disposable Chromium Browser smoke 37/37，含四科既有流程、範圍隔離測試、紀錄隔離與 768×1024／1024×768 既有 viewport coverage。
- Task 6：完成完整驗證與文件同步；Node 179/179、lint、TypeScript、build、Browser 37/37、`git diff --check` 通過。
- 額外範圍稽核：78 題分類為 A 49、B 4、C 23、D 2；D 類姐姐國語部首早期題以非破壞方式從三種正式流程隔離，歷史題目與 questionId 保留。範圍 focused Node 2/2、focused Browser 1/1。
- 本批不包含姐姐自然重複觀念、妹妹數學重複觀念、妹妹社會重複觀念及妹妹國語證據不足的候選題。

## Batch sizing

The first implementation batch is selected after Human content review, not by a fixed number. A practical split is three or four subject-oriented batches, each independently validated. The capacity target is approximately 20 questions per six approved combinations (about 120 total), but evidence quality overrides the target; no low-confidence question is counted as production-ready.

## Out of scope

No question-management UI, AI generation, bulk importer, schema migration, cloud sync, public deployment, new subjects, new exam units, or changes to review／practice semantics.

## 追加 Task：第一次月考練習模式

**修改範圍：** `lib/first-exam-practice.ts`、學生首頁導覽、共用 `FirstExamPracticePage`、八個學生／科目月考路由、focused Node／Browser tests，以及本計畫與治理文件。

- 先以 failing tests 鎖定六組 A 類 questionId allowlist、B/C/D 排除、無資格題庫不 fallback、陣列順序獨立、student／subject isolation 與首頁入口。
- RED 原因須是月考 eligibility helper／入口尚未存在，而不是既有題庫格式錯誤。
- 以純函式 explicit questionId allowlist 篩選複製後的題目陣列；合格題目交給既有 `ChineseQuestionFlow`，無合格題目只顯示「第一次月考題庫準備中」。
- 不修改一般練習、Today Review、再練一次、shuffle helper、Question／Learning Record／ReviewSession schema 或 storage key。
- focused verification 須覆蓋 49 題 A 類的學生／科目邊界、B/C/D 排除、metadata／questionId 對應、作答紀錄與返回；Browser 須覆蓋六組入口、無 fallback、既有流程及兩種 tablet viewport。
- 完成條件：allowlist 只接受明確 questionId；月考流程不漏題、不混科、不回退；一般與複習流程保持原語意；完整 Node／Browser／lint／TypeScript／build／diff-check 通過後，停在 Human Final Review，不 commit 或 push。

### 追加執行結果

- eligibility focused Node tests：6/6 GREEN；allowlist 已改為逐一列舉 questionId，不以編號或陣列位置推導。
- production build：已通過並產生八個月考路由；月考 Browser focused 2/2、完整 disposable Browser 39/39 通過。測試使用 synthetic storage，包含既有首頁導覽回歸更新與 768×1024、1024×768 viewport；Playwright teardown 曾留下已確認的本次測試 server，已安全停止。

## Final Close 實際結果

- Human 已完成六科平板驗收並核准結案；姐姐國語與妹妹自然仍保留「題庫準備中」。
- 六科月考 allowlist 實際為 61 題；正式題庫為 78 題、73 learning units。
- Node 183/183、Browser 39/39、lint、TypeScript `--incremental false`、build 與 diff-check 通過；Browser 使用 disposable Chromium 與 synthetic storage。
- 未修改 schema、storage key、Learning Record／ReviewSession 或既有學習規則。家庭 LAN 使用需由當次驗證的 canonical build 啟動，不等同公開部署。
