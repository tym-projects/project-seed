# Sprint 28 Mathematics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the seven Human-approved original mathematics questions without changing existing question or learning semantics.

**Architecture:** Extend the two existing mathematics bank arrays only. Keep each new question as its own learning unit and reuse current validation, routes, review, practice, and storage behavior.

**Tech Stack:** TypeScript question-bank modules, Node `node:test`, existing Playwright smoke harness, Next.js.

**Spec:** `docs/superpowers/specs/2026-09-24-sprint-28-mathematics-design.md`

## Global Constraints

- Add exactly seven questions: three for 姐姐 and four for 妹妹.
- Do not add 姐姐第 3 單元小數除法估算題.
- Do not modify existing question content, IDs, answers, hints, explanations, or review groups.
- Every new question is a singleton learning unit with no `reviewGroupId` and no variation.
- Do not change persisted schemas, storage keys, review rules, or practice semantics.
- Final Human Review approved; commit and push are authorized only after final verification.

## Review Focus

- Exact question copy and answer index: pinned by the focused content test.
- Option uniqueness and no equivalent numeric answer: pinned by validation assertions and manual calculation checks.
- Existing 12 questions remain unchanged: pinned by Sprint 22 exact-match test.
- Student bank isolation: pinned by bank import and ID-prefix assertions.
- Review-group compatibility: pinned by absence of `reviewGroupId` on all seven new questions.

### Task 1: Add focused tests for the approved seven questions — complete

**Files:**
- Create: `lib/questions/sprint-28-mathematics.test.mjs`
- Test source: `lib/questions/jiejie-mathematics.ts`, `lib/questions/meimei-mathematics.ts`

- [x] Write exact-match expectations for all seven IDs, complete copy, answers, hints, explanations, and singleton metadata.
- [x] Add assertions for unique IDs, four unique options, valid answer index, and student-specific ID prefixes.
- [x] Run `node --test lib/questions/sprint-28-mathematics.test.mjs` and confirm RED because the seven IDs were not yet in the banks.

### Task 2: Add the seven questions with the smallest production change — complete

**Files:**
- Modify: `lib/questions/jiejie-mathematics.ts`
- Modify: `lib/questions/meimei-mathematics.ts`

- [x] Append the three approved 姐姐 questions and four approved 妹妹 questions exactly as specified in the Design.
- [x] Keep the existing questions unchanged and do not add `reviewGroupId`.
- [x] Run `node --test lib/questions/sprint-28-mathematics.test.mjs` and confirm GREEN.
- [x] Run `node --test lib/questions/sprint-22-mathematics.test.mjs lib/questions/sprint-28-mathematics.test.mjs` to prove old content and new content both pass.

### Task 3: Verify full behavior and synchronize planning documents — complete

**Files:**
- Modify: `docs/superpowers/specs/2026-09-23-sprint-28-candidate-questions.md`
- Modify: `PROJECT_STATUS.md`
- Modify: `docs/roadmap.md`
- Modify: `docs/sprint-log.md`
- Modify: this plan, recording actual verification and Human Review status

- [x] Run `npm test`: 167/167 passed.
- [x] Run `npm run lint`: passed.
- [x] Run `npx tsc --noEmit --incremental false`: passed.
- [x] Run `npm run build`: passed after clearing only the confirmed `.next\\trace` build artifact.
- [x] Run `npm run test:browser`: 32/32 passed with disposable Chromium and synthetic storage.
- [x] Run `git diff --check`: passed.
- [x] Record that the seven questions are implemented, the estimate candidate remains excluded, and Sprint 28 is `Implementation complete / Awaiting Final Human Review`; do not mark Completed.
- [x] Verify Git status contains only approved Sprint 28 changes.
- [x] Human completed the approved 6/6 tablet acceptance checks.
- [x] Final close verification passed; implementation commit and push completed.
- [x] Record random question ordering as a future backlog item only; do not implement it in Sprint 28.
