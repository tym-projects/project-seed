# Sprint 21 題庫品質與理解回饋 v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. 每個 Task 依 test-first 順序執行：先寫 failing test、確認 RED 原因、做最小實作、執行 focused 與 regression verification，再更新 Task 狀態。

**Goal:** 在不改變既有 questionId、schema、learning-unit、排程與資料語意的前提下，改善妹妹兩個 learning units 的四題 Hint／Explanation，並加入一題已核准的「寫」動作詞 variation。

**Architecture:** 只更新正式妹妹 Question Bank 的內容資料，沿用現有 QuestionCardQuestion、reviewGroupId ?? question.id、deterministic variation selection 與 QuestionResult feedback。所有 review、Learning Record、ReviewSession、practice、parent summary 與 timer 行為以 regression tests 保護；不新增 persistence 或 schema。

**Tech Stack:** TypeScript question bank、Node node:test regression tests、Next.js／React、Playwright disposable Chromium smoke。

**Spec:** docs/superpowers/specs/2026-09-21-sprint-21-question-bank-quality-and-feedback-v2-design.md

## Global Constraints

- 只修改核准的妹妹四題內容與一題 V1A variation；不得加入 V1「收進」或其他題目。
- meimei-chinese-5 Explanation 必須使用核准文字：「跑」表示小狗正在做的動作；「小狗」是做動作的動物，「草地」是活動的地方。
- 高興 learning unit meimei-chinese-gaoxing-meaning 維持兩個 variations，不新增 variation。
- V1A 使用 questionId meimei-chinese-action-word-identification-3、reviewGroupId meimei-chinese-action-word-identification、type application，正解為 寫 index 2。
- 既有 questionId、既有正解、Question schema、Learning Record／ReviewSession schema 不變。
- learning unit 永遠以 reviewGroupId ?? question.id 聚合；V1A 不建立獨立 unit。
- 不改變 deterministic selection、recent-question avoidance、Sprint 18 confirmation、Sprint 19 no-write practice、Sprint 17 timer／startedAt、Sprint 20 Parent Summary v2、1/3/7、retry、每日最多 5 groups 或 student／subject isolation。
- 不新增 dependency，不執行 unrs-resolver install script，不修改 OneDrive 備份。
- Implementation 已依本 Plan 完成；Final Human Approval 已取得，Sprint 21 已完成 commit、push 與 close。

## Review Focus

- Content lock：四題新 Hint／Explanation 必須逐字符合 Design 核准文案；Task 1 exact-copy assertions 固定此契約。
- V1A identity：questionId 不得衝突，寫必須是 index 2，group/topic/type 必須與既有 action-word variations 一致；Task 1/2 固定。
- Learning-unit compatibility：新題加入 action group 後 unit 數不增加；高興 group 維持 2 variations；Task 2/3 固定。
- Confirmation and recent avoidance：三個 action variations 的 deterministic alternate 仍排除剛完成 questionId；Sprint 18 不得產生第三題 chain；Task 3 固定。
- Historical data isolation：既有 Learning Records、1/3/7、retry、parent summary、practice no-write、timer/session 與 student/subject isolation 不變；Task 4/5 固定。

## Execution Status

- [x] Task 1 — exact approved content and V1A contracts; focused validation passed.
- [x] Task 2 — minimal approved Question Bank implementation; focused validation passed.
- [x] Task 3 — deterministic variation／Sprint 18 compatibility; 54 focused tests passed.
- [x] Task 4 — Learning Record／1/3/7／practice／Parent Summary compatibility; 45 focused tests passed.
- [x] Task 5 — isolated Browser smoke; 10/10 tests passed, including the approved V1A confirmation rendering.
- [x] Task 6 — full regression and documentation synchronization; 139/139 Node tests, lint, TypeScript (`--incremental false` due cache-write EPERM), build, Browser 10/10, and diff-check passed.
- **Handoff:** Sprint 21 Completed. Implementation commit `9630477` 已 push 至 `origin/main`；未開始 Sprint 22 implementation。

## Files and responsibilities

- Modify: lib/questions/meimei-chinese.ts — 只加入核准 V1A，並更新四題核准 Hint／Explanation。
- Test: lib/questions/question-bank-validation.test.mjs — 題庫 shape、exact content、group metadata、unit count 與 V1 未採用保護。
- Test: lib/questions/meimei-chinese.test.mjs — 妹妹題庫內容、題型、答案、hint、explanation 與既有題目 identity。
- Test: lib/understanding-confirmation.test.mjs — 三 variation deterministic selection、recent avoidance、confirmation eligibility 與 no-third-question。
- Test: lib/today-review.test.mjs — review selection、每日 group cap、student／subject isolation。
- Test: lib/spaced-review.test.mjs — existing records、same-day aggregation、1/3/7 與 retry regression。
- Test: lib/reinforcement-practice.test.mjs、lib/reinforcement-practice-flow.test.mjs — Sprint 19 candidate／flow／no-write regression。
- Test: lib/parent-learning-summary.test.mjs、lib/learning-records.test.mjs — Sprint 20 summary 與既有 record compatibility。
- Test: tests/browser/sprint-18.spec.ts、tests/browser/sprint-19.spec.ts、tests/browser/sprint-20-parent-summary.spec.ts — existing isolated browser behavior after question-bank expansion。
- Modify after implementation verification: PROJECT_STATUS.md、docs/roadmap.md、docs/sprint-log.md — record actual Sprint 21 status and the Sprint 22 mathematics direction.

### Task 1: Lock approved content with failing tests

Files:
- Modify: lib/questions/question-bank-validation.test.mjs
- Modify: lib/questions/meimei-chinese.test.mjs

Interfaces:
- Consumes current questions export and validateQuestionBank / getLearningUnitId.
- Produces exact content assertions for later implementation.

Steps:
- [ ] Write failing tests that locate each question by id and assert the exact approved Hint and Explanation strings, including the corrected meimei-chinese-5 Explanation.
- [ ] Add a V1A contract test asserting the exact question text, options, answer index 2, hint, explanation, type application, reviewGroupId, and questionId.
- [ ] Add assertions that highxing group remains exactly two questions and no question contains the rejected V1 text 收進.
- [ ] Run node --test lib/meimei-chinese.test.mjs lib/questions/question-bank-validation.test.mjs.
- [ ] Expected RED: current production bank lacks the four approved hints, has the old meimei-chinese-5 Explanation, and has no V1A question. Existing tests must remain green.
- [ ] Confirm failures are content absence only; do not loosen expected strings or alter expected answers.

Completion:
- RED output identifies only missing approved content and V1A identity; no production file has been modified.

### Task 2: Apply the minimal approved Question Bank change

Files:
- Modify: lib/questions/meimei-chinese.ts
- Test: lib/questions/meimei-chinese.test.mjs
- Test: lib/questions/question-bank-validation.test.mjs

Interfaces:
- Consumes Task 1 exact-content contracts.
- Produces a 12-question妹妹 bank with 9 learning units, a three-question action group, and an unchanged two-question highxing group.

Steps:
- [ ] Add the four exact approved Hint／Explanation strings. Do not change their question text, options, answer, or id.
- [ ] Change only meimei-chinese-5 Explanation to the approved animal wording.
- [ ] Add meimei-chinese-action-word-identification-3 with reviewGroupId meimei-chinese-action-word-identification, topic 動作詞辨識, type application, the approved V1A question, options 小安／鉛筆／寫／名字, answer 2, approved hint, and approved explanation.
- [ ] Use existing action-question title/instruction/encouragement patterns; do not add V1 收進 or any highxing variation.
- [ ] Run node --test lib/meimei-chinese.test.mjs lib/questions/question-bank-validation.test.mjs.
- [ ] Expected PASS: validation has no errors;妹妹 has 12 questions and 9 units; action group has three questions; highxing group has two.
- [ ] Inspect git diff -- lib/questions/meimei-chinese.ts and confirm only the approved four feedback changes plus one V1A object are present.

Completion:
- All Task 1 exact-content tests pass and the production diff contains no unapproved question, answer, id, option, or group change.

### Task 3: Verify deterministic variation and Sprint 18 review compatibility

Files:
- Modify: lib/understanding-confirmation.test.mjs
- Modify: lib/today-review.test.mjs
- Test: lib/understanding-confirmation.ts
- Test: lib/today-review.ts

Interfaces:
- Consumes actual meimeiChineseQuestions after Task 2 and existing confirmation/review helpers.
- Produces proof that V1A is an alternate variation in the existing group, not a new learning unit.

Steps:
- [ ] Write failing tests using the actual action group and assert its ids are meimei-chinese-2, meimei-chinese-5, and meimei-chinese-action-word-identification-3.
- [ ] Assert all three share one getLearningUnitId result and the highxing group remains separate with two variations.
- [ ] With fixed student, subject, local date, and historical records, call deterministic primary/confirmation planning twice and assert identical output.
- [ ] Assert confirmation never equals primary questionId, avoids the most recently completed variation when another exists, and returns at most one confirmation.
- [ ] Assert a due group with the new variation remains eligible for one confirmation only and never creates a third-question chain.
- [ ] Run node --test lib/understanding-confirmation.test.mjs lib/today-review.test.mjs.
- [ ] Expected RED before Task 2: actual action group has only two questions and lacks V1A. Existing generic confirmation tests must remain green.
- [ ] Implement no production selector change unless a focused test exposes a hard-coded two-variation assumption. If required, change only the narrowest selector boundary while preserving deterministic selection, recent avoidance, one confirmation maximum, group cap, and no persistence.
- [ ] Run node --test lib/understanding-confirmation.test.mjs lib/today-review.test.mjs lib/spaced-review.test.mjs.

Completion:
- Actual V1A variation is selected deterministically when eligible; recent avoidance, Sprint 18 eligibility, same-day behavior, daily cap, and isolation remain unchanged.

### Task 4: Protect Learning Records, 1/3/7, practice, and parent summary

Files:
- Modify: lib/spaced-review.test.mjs
- Modify: lib/learning-records.test.mjs
- Modify: lib/reinforcement-practice.test.mjs
- Modify: lib/reinforcement-practice-flow.test.mjs
- Modify: lib/parent-learning-summary.test.mjs

Interfaces:
- Consumes existing record factories, review helpers, practice selector/flow, parent summary helper, and V1A question id.
- Produces explicit compatibility tests for persisted data and derived semantics.

Steps:
- [ ] Write fixtures with existing records for meimei-chinese-2 and meimei-chinese-5 plus a V1A record.
- [ ] Assert deriveReviewState receives all three action question ids as one group and advances 1/3/7 once per local day.
- [ ] Assert original questionId values remain unchanged and no recordSource, confirmation field, or schema field is added.
- [ ] Assert practice groups all three action variations into one candidate, does not treat V1A as a new unit, and completion writes no Learning Record and no ReviewSession.
- [ ] Assert Parent Summary v2 completed counts, retry counts, distinct groups, pending confirmation, and due grouping remain unchanged except for records explicitly supplied by the fixture.
- [ ] Assert records for 姐姐, 妹妹, or non-Chinese subjects do not cross into妹妹 action selection.
- [ ] Run node --test lib/spaced-review.test.mjs lib/learning-records.test.mjs lib/reinforcement-practice.test.mjs lib/reinforcement-practice-flow.test.mjs lib/parent-learning-summary.test.mjs.
- [ ] Expected RED before Task 2 for V1A fixtures; no existing schema regression may be hidden by changing assertions.
- [ ] Make no production adjustment unless a hard-coded question list fails; any adjustment must preserve no-write practice, summary definitions, schedules, and isolation.
- [ ] Re-run the same focused regression command and confirm PASS.

Completion:
- New content is compatible with Learning Records, ReviewSession, 1/3/7, retry, Sprint 19 practice, Sprint 20 summary, and all isolation boundaries.

### Task 5: Browser smoke for approved content and existing flows

Files:
- Modify: tests/browser/sprint-18.spec.ts
- Modify: tests/browser/sprint-19.spec.ts
- Modify: tests/browser/sprint-20-parent-summary.spec.ts
- Test support only if required: tests/browser/fixtures/storage.ts, tests/browser/helpers/context.ts

Interfaces:
- Consumes existing disposable Chromium context and synthetic whitelisted storage.
- Produces isolated browser evidence for V1A and Sprint 18–20 protections.

Steps:
- [ ] Write failing isolated browser assertions that the actual action group can render V1A deterministically and displays its options, approved hint, and explanation in the existing result states.
- [ ] Assert refresh/reopen does not create a third question and does not reset formal review session semantics.
- [ ] Assert Sprint 19 practice leaves Learning Record and ReviewSession storage byte-for-byte unchanged.
- [ ] Assert Sprint 20 parent summary remains student/subject isolated.
- [ ] Run npx playwright test tests/browser/sprint-18.spec.ts tests/browser/sprint-19.spec.ts tests/browser/sprint-20-parent-summary.spec.ts.
- [ ] Expected RED before Task 2 for the V1A UI assertion; existing smoke behavior must not be weakened.
- [ ] Run npm run test:browser in disposable contexts with synthetic storage only.
- [ ] Record actual Browser test count and console-error result; never use an existing Chrome/Edge profile.

Completion:
- V1A and the existing Sprint 18/19/20 browser protections pass without touching real user data.

### Task 6: Full regression, documentation synchronization, and review handoff

Files:
- Modify after implementation: PROJECT_STATUS.md
- Modify after implementation: docs/roadmap.md
- Modify after implementation: docs/sprint-log.md
- Modify after implementation: docs/superpowers/plans/2026-09-21-sprint-21-question-bank-quality-and-feedback-v2.md

Interfaces:
- Consumes actual Task 1–5 output.
- Produces truthful Sprint 21 Completed documentation after Final Human Approval, implementation commit, push, and close verification.

Steps:
- [x] Run npm test.
- [x] Run npm run lint.
- [x] Run npx tsc --noEmit --incremental false.
- [x] Run npm run build.
- [x] Run npm run test:browser.
- [x] Run git diff --check.
- [x] Inspect git status --short, git diff --stat, and the question-bank diff. Confirm no artifacts, localStorage data, schema changes, unrelated files, or Sprint 20 history changes.
- [x] Update governance documents with actual counts, the four feedback changes, V1A, rejected V1, highxing unchanged, Browser scope, and any limitations. Do not claim external教材／字典 approval.
- [x] Update plan checkboxes only after each Task actually passes; do not mark unexecuted work complete.
- [x] Final Human Approval received; implementation and close commits completed without merge, rebase, release, or Sprint 22 implementation.

Completion:
- All verification outputs are recorded truthfully and the repository is closed with synchronized history and a clean working tree.

## Final Verification Plan

- Sprint 21 focused content and validation tests.
- Sprint 18 confirmation/review tests for deterministic selection, recent avoidance, eligibility, group cap, and isolation.
- Sprint 19 practice no-write and candidate grouping tests.
- Sprint 20 Parent Summary v2 and existing Learning Record tests.
- npm test.
- npm run lint.
- npx tsc --noEmit.
- npm run build.
- npm run test:browser.
- git diff --check.

## Completion Criteria

- [x] Four approved existing feedback strings match exactly, including corrected meimei-chinese-5 Explanation.
- [x] V1A is the only new question with approved id, group, type, content, and answer; V1 收進 is absent.
- [x] Action group has three variations while highxing group remains unchanged; learning-unit count and group identity are preserved.
- [x] Deterministic selection, recent avoidance, Sprint 18 confirmation, daily cap, and no-third-question tests pass.
- [x] Learning Record／ReviewSession schemas and persisted records remain unchanged in meaning.
- [x] Sprint 19 practice, Sprint 20 Parent Summary v2, 1/3/7, retry, timer, student and subject isolation regressions pass.
- [x] Full Node, lint, TypeScript, build, isolated Browser smoke, and diff-check results are recorded.
- [x] Governance documents are synchronized to Sprint 21 Completed and Sprint 22 mathematics planning.
- [x] Final Human Approval received; Sprint 21 implementation and close commits are pushed without rewriting history, and Sprint 22 implementation has not started.
