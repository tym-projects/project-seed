# Sprint 23 Natural and Social Implementation Plan

## Implementation Status — Awaiting Final Human Review

- [x] Task 1 — four approved question banks and exact content tests.
- [x] Task 2 — answer uniqueness, balanced answer positions, and metadata invariants.
- [x] Task 3 — `natural_science`／`social_studies` SubjectId support and four first-practice entries.
- [x] Task 4 — Today Review, 1/3/7, retry, and singleton confirmation protection.
- [x] Task 5 — reinforcement practice with no-write protection.
- [x] Task 6 — Learning Record display, review settings, Parent Summary, and legacy compatibility.
- [x] Task 7 — disposable Chromium Browser smoke coverage.
- [x] Task 8 — full regression and documentation synchronization.

Implementation evidence: 159/159 Node tests, lint, TypeScript with `--incremental false`, production build, 21/21 disposable Chromium Browser tests, and `git diff --check` passed. Learning Record／ReviewSession persisted schemas and existing storage keys are unchanged. Sprint 23 remains **Implementation complete / Awaiting Final Human Review**; no commit or push was performed.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Each task is test-first and must be completed with focused verification before the next task.

**Goal:** Add the Human-approved Sprint 23 natural-science and social-studies foundation for 姐姐／妹妹 across four approved textbook scopes, while preserving the existing shared learning flow and persisted data semantics.

**Architecture:** Extend the existing `SubjectId` union and explicit student／subject question-bank mappings. Reuse the existing QuestionCard／Question Flow, Learning Record, ReviewSession, Today Review, reinforcement practice, review settings, and Parent Summary; add only the four question banks, routes, mappings, validation, and regression coverage required for the two new subjects.

**Tech Stack:** Next.js App Router, React, TypeScript, Node `node:test` tests, Playwright disposable Chromium browser tests, localStorage-backed Learning Records and ReviewSessions.

**Spec:** `docs/superpowers/specs/2026-09-22-sprint-23-natural-social-design.md`

## Global Constraints

- Scope is exactly four groups: 姐姐康軒六上自然／社會第 1–2 單元、妹妹南一三上自然第 1–2 單元、妹妹康軒三上社會第 1–2 單元。
- Deliver exactly 16 approved Design candidates: four questions per student／subject, two questions per unit, one basic concept and one scenario application per unit.
- Use only `natural_science` and `social_studies`; do not add units 3–6, Chinese questions, Mathematics questions, variations, or unapproved content.
- Every question is one independent learning unit: `questionId` is the learning unit ID; omit `reviewGroupId` and variation.
- Preserve Learning Record／ReviewSession persisted schemas and existing storage keys; do not migrate, clear, or overwrite historical records.
- Preserve 1/3/7 scheduling, retry, singleton confirmation eligibility, practice no-write, timer／`startedAt`, and Parent Summary indicator semantics.
- Browser tests use disposable Chromium contexts, synthetic storage, and the existing storage whitelist only; never use a real user profile or real localStorage.
- Do not install dependencies, run the unrs-resolver install script, or perform unrelated refactoring.

## Review Focus

- Exact approved copy and option／answer alignment — Task 1 and Task 2 exact-match tests.
- Student／subject cross-contamination in records, banks, review, and summaries — Tasks 3, 4, 5, and 6 isolation tests.
- One-question units accidentally entering confirmation or variation logic — Task 4 singleton eligibility test.
- Practice accidentally persisting records or changing review state — Task 5 no-write test.
- Legacy Chinese／Mathematics records and routes breaking when the union expands — Task 6 compatibility tests and Task 7 browser smoke.

## File Map

- Create four banks: `lib/questions/jiejie-natural-science.ts`, `lib/questions/jiejie-social-studies.ts`, `lib/questions/meimei-natural-science.ts`, `lib/questions/meimei-social-studies.ts`.
- Create content test: `lib/questions/sprint-23-natural-social.test.mjs`.
- Modify subject validation: `lib/learning-records.ts`, `lib/review-time-settings.ts` and their existing tests.
- Modify explicit bank mappings: `lib/learning-record-display.ts`, `components/parent/ParentLearningRecords.tsx`.
- Create student routes under `app/jiejie/natural-science/`, `app/jiejie/social-studies/`, `app/meimei/natural-science/`, and `app/meimei/social-studies/`, each with first-practice, `review`, and `reinforce` pages following the Mathematics route pattern.
- Modify student home navigation files: `app/jiejie/page.tsx`, `app/meimei/page.tsx`.
- Add or modify focused tests in existing Learning Record, review-time, spaced-review, reinforcement, parent-summary, and browser test files where the current architecture owns the behavior.

---

### Task 1: Add the four approved candidate banks and exact content tests

**Files:**
- Create: `lib/questions/jiejie-natural-science.ts`
- Create: `lib/questions/jiejie-social-studies.ts`
- Create: `lib/questions/meimei-natural-science.ts`
- Create: `lib/questions/meimei-social-studies.ts`
- Create: `lib/questions/sprint-23-natural-social.test.mjs`
- Reference only: `docs/superpowers/specs/2026-09-22-sprint-23-natural-social-design.md`

**Interfaces:**
- Consume the existing Question type and bank shape used by `lib/questions/*-mathematics.ts`.
- Produce four arrays of four questions with IDs exactly listed in the Design and no `reviewGroupId`.

- [ ] **Step 1: Write failing exact-match tests**

  Load the four TypeScript banks through the existing test loader pattern and assert each bank has four entries. Assert every expected ID, student, subject, unit/topic, question, four options, answer index, hint, explanation, and absence of `reviewGroupId` matches the approved Design. Assert the revised `meimei-natural-science-3` wording includes cup mouth down, upright/non-tilted, and slow insertion.

- [ ] **Step 2: Run the focused test to verify RED**

  Run `node --test lib/questions/sprint-23-natural-social.test.mjs`.

  Expected RED: the four bank modules do not exist and the 16 expected question records cannot be loaded.

- [ ] **Step 3: Add the minimal four bank modules**

  Copy only the 16 approved candidate records from the Design. Preserve each question’s wording, hint, explanation, answer content, and final option ordering. Do not add a third unit, variation, or review group.

- [ ] **Step 4: Run content tests and question-bank validation**

  Run `node --test lib/questions/sprint-23-natural-social.test.mjs lib/questions/question-bank-validation.test.mjs`.

  Expected PASS: exact content, four-option shape, unique IDs, valid answer indexes, and bank validation all pass.

- [ ] **Step 5: Completion condition**

  Four banks contain exactly 16 approved candidates; every bank has two questions per approved unit; no production route imports them yet.

### Task 2: Lock answer uniqueness, option distribution, and metadata invariants

**Files:**
- Modify: `lib/questions/sprint-23-natural-social.test.mjs`
- Modify: `lib/questions/question-bank-validation.ts` only for shared invariants that its current API already owns; keep all Sprint 23 exact-copy checks in the Sprint 23 test.
- Test existing: `lib/questions/question-bank-validation.test.mjs`

**Interfaces:**
- Consume the four banks from Task 1.
- Produce deterministic content guards for future edits.

- [ ] **Step 1: Write failing invariant tests**

  Assert every question has exactly four options, the answer index is in range, the answer text is unique among options, and the answer text at `options[answer]` equals the approved correct answer. Assert answer indexes are distributed as `0`, `1`, `2`, and `3` exactly four times each across all 16 questions. Assert every unit has exactly one basic concept and one scenario application question.

- [ ] **Step 2: Run the focused test to verify RED**

  Temporarily run the distribution assertion against the pre-reordering bank fixture or an intentionally invalid fixture and confirm it fails for concentrated answer positions. Remove the temporary invalid fixture after RED is observed; do not weaken the invariant.

- [ ] **Step 3: Add the smallest reusable validation**

  Keep content-specific assertions in the Sprint 23 test. Only extend shared validation if the existing validator lacks an already-required invariant such as four options, in-range answer index, or unique answer text.

- [ ] **Step 4: Run focused validation**

  Run `node --test lib/questions/sprint-23-natural-social.test.mjs lib/questions/question-bank-validation.test.mjs`.

- [ ] **Step 5: Completion condition**

  All 16 answer indexes map to exactly one option, and the distribution guard prevents future all-first-option content.

### Task 3: Add `SubjectId` support and four first-practice routes

**Files:**
- Modify: `lib/learning-records.ts`
- Modify: `lib/review-time-settings.ts`
- Modify: `lib/learning-records.test.mjs`
- Modify: `lib/review-time-settings.test.mjs`
- Create/modify: `app/jiejie/page.tsx`, `app/meimei/page.tsx`
- Create: `app/jiejie/natural-science/page.tsx`, `app/jiejie/social-studies/page.tsx`, `app/meimei/natural-science/page.tsx`, `app/meimei/social-studies/page.tsx`

**Interfaces:**
- Consume `natural_science` and `social_studies` as new `SubjectId` values.
- Produce first-practice pages that pass the selected student, subject, bank, theme, and home link into the existing Question Flow.

- [ ] **Step 1: Write failing type and storage tests**

  Add tests that save and read one natural-science and one social-studies Learning Record, accept review settings for both subjects, and retain existing Chinese and Mathematics records in the same storage array.

- [ ] **Step 2: Run RED**

  Run `npm test -- --test-name-pattern "natural|social|subject"` or the repository’s focused Node test command for the changed files.

  Expected RED: the current `SubjectId` validators reject the two new subjects and route files are absent.

- [ ] **Step 3: Implement the smallest subject extension and route composition**

  Add only the two union values and permitted-subject checks. Copy the existing Mathematics route composition pattern for four first-practice pages; do not create a new Question Flow.

- [ ] **Step 4: Run focused type, storage, and route checks**

  Run the changed Node tests and `npx tsc --noEmit --incremental false`.

- [ ] **Step 5: Completion condition**

  Both new subjects type-check, all four first-practice routes render the shared flow, and legacy records remain readable.

### Task 4: Connect review, 1/3/7 scheduling, retry, and singleton confirmation protection

**Files:**
- Create: `app/jiejie/natural-science/review/page.tsx`, `app/jiejie/natural-science/reinforce/page.tsx`, `app/jiejie/social-studies/review/page.tsx`, `app/jiejie/social-studies/reinforce/page.tsx`, and the four corresponding `app/meimei/...` pages.
- Modify: none expected in `components/review/TodayReviewPage.tsx`, `lib/spaced-review.ts`, or `lib/understanding-confirmation.ts`; add only the route pages and their focused tests because these shared modules already accept student／subject parameters.
- Test: existing spaced-review, review-flow, and confirmation tests plus `lib/sprint-23-natural-social.test.mjs` if a focused file is needed.

**Interfaces:**
- Consume the four banks, student IDs, and new SubjectIds.
- Produce review and reinforcement route composition using existing selection and session logic.

- [ ] **Step 1: Write failing focused tests**

  Seed synthetic records for each new subject and assert Today Review selects only the same student and subject, applies existing 1/3/7 due rules, preserves retry behavior, and returns no confirmation candidate when the unit has only one question and no `reviewGroupId`.

- [ ] **Step 2: Run RED**

  Run the focused spaced-review and confirmation tests.

  Expected RED: the new subjects have no route/bank entry and the new subject records cannot be resolved to review questions.

- [ ] **Step 3: Add route composition and only necessary mapping parameters**

  Reuse `TodayReviewPage` and existing review/session functions. Do not change due-date arithmetic, retry classification, confirmation rules, or timer/session persistence.

- [ ] **Step 4: Run focused verification**

  Run the relevant spaced-review, review-flow, and confirmation test files.

- [ ] **Step 5: Completion condition**

  Natural and social review routes work for both students, while 1/3/7, retry, and singleton confirmation semantics are unchanged.

### Task 5: Connect Practice with no-write guarantees

**Files:**
- Modify: none expected in `components/practice/ChineseReinforcementPracticePage.tsx` or `lib/reinforcement-practice.ts`; add route composition and focused tests because the existing practice flow already accepts a subject and no-write mode.
- Test: `lib/reinforcement-practice.test.mjs` and focused Sprint 23 practice tests.

**Interfaces:**
- Consume the new student／subject records and banks.
- Produce the same deterministic reinforcement candidates and no-write Question Flow behavior as Mathematics.

- [ ] **Step 1: Write failing tests**

  Seed natural and social retry records for both students. Assert candidate selection is student／subject isolated, capped by existing rules, excludes today/due/pending-confirmation items, and does not write Learning Records, ReviewSessions, review settings, or timer state after answering.

- [ ] **Step 2: Run RED**

  Run `node --test lib/reinforcement-practice.test.mjs` with the new cases.

  Expected RED: new subject candidates and routes are not available or are not mapped to a bank.

- [ ] **Step 3: Implement the minimal subject-aware mapping**

  Pass the new `SubjectId` and question bank through the existing practice component and selection functions. Preserve primary-only, no-write, and isolation behavior.

- [ ] **Step 4: Run focused verification**

  Run the full reinforcement test file and the relevant Learning Record tests.

- [ ] **Step 5: Completion condition**

  Four new reinforce routes work and a practice session leaves all persisted learning and review state unchanged.

### Task 6: Wire Parent Summary, review settings, display mapping, and legacy compatibility

**Files:**
- Modify: `lib/learning-record-display.ts`
- Modify: `components/parent/ParentLearningRecords.tsx`
- Modify: `lib/parent-learning-summary.test.mjs`, `lib/learning-record-display.test.mjs`, and `lib/review-time-settings.test.mjs`.

**Interfaces:**
- Consume four new banks and the expanded SubjectId.
- Produce four isolated Parent Summary sections and subject-specific review settings without changing metric definitions.

- [ ] **Step 1: Write failing tests**

  Seed mixed Chinese, Mathematics, natural-science, and social-studies records for both students. Assert each summary counts only its own student／subject and uses the matching bank for question text. Assert review settings with the same student but different subjects remain independent. Assert old Chinese／Mathematics records still display.

- [ ] **Step 2: Run RED**

  Run the focused parent-summary, display, Learning Record, and review-settings tests.

  Expected RED: explicit two-subject mappings do not include the new banks or section keys.

- [ ] **Step 3: Add four explicit mappings and sections**

  Extend existing maps and Parent Summary section construction with natural and social entries. Keep the existing storage keys, summary calculations, labels, and review-setting key format.

- [ ] **Step 4: Run focused verification**

  Run the modified parent-summary, display, Learning Record, and review-settings test files.

- [ ] **Step 5: Completion condition**

  Parent Summary and review settings show four new student／subject combinations without mixing records or changing existing metrics.

### Task 7: Add disposable Browser smoke coverage

**Files:**
- Create: `tests/browser/sprint-23-natural-social.spec.ts`
- Modify: none expected in the browser fixture/helper files; use the existing fixture and modify navigation pages only when a smoke test demonstrates a missing link.

**Interfaces:**
- Consume the existing Playwright fixture, `newIsolatedContext`, synthetic storage builder, and storage whitelist.
- Produce browser evidence for all four new subject flows and isolation boundaries.

- [ ] **Step 1: Write failing smoke tests**

  Add tests for 姐姐自然、姐姐社會、妹妹自然、妹妹社會 first practice; answer, Hint, Explanation, retry, Learning Record write; Today Review; practice no-write; review settings; Parent Summary; cross-student and cross-subject isolation; existing Chinese/Mathematics navigation; and no console errors.

- [ ] **Step 2: Run RED**

  Run `npm run test:browser -- tests/browser/sprint-23-natural-social.spec.ts`.

  Expected RED: the new routes or subject mappings are not yet present.

- [ ] **Step 3: Add only browser-facing wiring required by failing smoke tests**

  Keep disposable Chromium contexts, synthetic whitelisted storage, and existing route composition. Do not read or clear any real browser profile.

- [ ] **Step 4: Run focused smoke**

  Run `npm run test:browser -- tests/browser/sprint-23-natural-social.spec.ts` and confirm no console errors.

- [ ] **Step 5: Completion condition**

  All new subject flows and isolation checks pass in disposable contexts, including practice no-write and Parent Summary.

### Task 8: Full regression, documentation synchronization, and implementation handoff

**Files:**
- Modify after implementation only: `PROJECT_STATUS.md`, `docs/roadmap.md`, `docs/sprint-log.md`, and this Plan’s task checkboxes.
- Test: repository-wide test, lint, TypeScript, build, browser, and diff checks.

**Interfaces:**
- Consume the completed Tasks 1–7 implementation and verification results.
- Produce an accurate implementation status without declaring Sprint 23 completed before final Human approval.

- [ ] **Step 1: Run the full verification sequence**

  Run, in the canonical repository:

  ```text
  npm test
  npm run lint
  npx tsc --noEmit --incremental false
  npm run build
  npm run test:browser
  git diff --check
  ```

- [ ] **Step 2: Investigate failures without weakening tests**

  For any failure, identify the owning subject／student mapping or shared behavior, add a focused regression test first, make the smallest compatible correction, rerun focused verification, then rerun the full sequence.

- [ ] **Step 3: Synchronize documents**

  Record actual question counts, routes, isolation results, Node/browser totals, known limitations, and schema preservation in `PROJECT_STATUS.md`, `docs/roadmap.md`, and `docs/sprint-log.md`. Do not mark Sprint 23 Completed until the final Human approval and close stage.

- [ ] **Step 4: Completion condition**

  All focused and regression checks pass, documentation matches the actual implementation, no unrelated files are present, and the work is ready for the later Human Implementation Review／Final Review gates.

## Final Verification Commands

After Tasks 1–8 are implemented, run:

```text
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm run test:browser
git diff --check
```

This Plan itself does not authorize implementation, commit, push, merge, rebase, release, or Sprint 23 close.
