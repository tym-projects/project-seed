# Sprint 42 Question Bank Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 400 original, slightly more challenging singleton Active Practice questions so all eight banks reach 150 questions and 1200 total.

**Architecture:** Extend the existing additions-module pattern with explicit authored rows and append the module from each current bank. Keep the existing Question schema, selection, learning-record, review, auth, and deployment paths unchanged.

**Tech Stack:** TypeScript question banks, Node `node:test`, Next.js, ESLint, TypeScript, Playwright, Vercel Preview.

**Spec:** `docs/superpowers/specs/2026-10-29-sprint42-question-bank-design.md`

## Global Constraints

- Exactly 50 additions per bank; 400 total; every bank ends at 150 Active Practice questions.
- Use only existing `basic` and `application` types; no schema or difficulty enum changes.
- New questions are singleton learning units and deferred from the Monthly allowlist; allowlist remains 170.
- Stay in confirmed first-month scope; 妹妹自然 must not contain animals or magnets.
- Do not modify Learning Record, ReviewSession, Backup/Restore, retry, 1/3/7, Auth, role authorization, or Production.
- Turbopack globals.css issue remains governed; use the existing Webpack build path without changing build scripts.

## Review Focus

- Correct answers must remain unique after option shuffling — focused QA checks option uniqueness and answer/explanation alignment.
- Near-duplicates must not be hidden by changed numbers or names — focused QA compares normalized stems and token overlap.
- Short scenarios must stay in course scope — focused QA checks forbidden MeiMei science terms and topic scope metadata.
- Hints must guide method without revealing the answer — focused QA checks answer-text leakage and length/content heuristics.
- Adding content must not alter monthly practice — focused QA asserts the exact 170-ID allowlist and no Sprint 42 IDs.

### Task 1: Sprint 42 red test and governance records

**Files:**
- Create: `lib/questions/sprint42-qa.test.mjs`
- Create: `docs/sprint42-candidate-manifest.json`
- Create: `docs/sprint42-practice-coverage-audit.md`
- Modify: `docs/roadmap.md`, `docs/sprint-log.md`, `PROJECT_STATUS.md`

- [ ] Write the failing exact-count, singleton, distribution, scope, duplicate, and monthly-isolation tests.
- [ ] Run `node --test lib/questions/sprint42-qa.test.mjs`; expected: FAIL because Sprint 42 additions are not present.
- [ ] Record the eight-bank 100 → 150 coverage plan and 400 deferred monthly dispositions.

### Task 2: Authored question additions and bank wiring

**Files:**
- Create: `lib/questions/sprint42-question-additions.ts`
- Modify: eight existing `lib/questions/*` bank modules only where the Sprint 41 adapter is appended.

- [ ] Add 50 explicit rows per bank covering multiple topic/form types, with application-heavy prompts and singleton IDs beginning at the next unused index.
- [ ] Preserve four-option construction, answer index rotation, hint, explanation, and existing encouragement conventions.
- [ ] Append Sprint 42 questions after Sprint 41 in each bank without changing existing questions or monthly IDs.

### Task 3: Focused QA and inventory evidence

**Files:**
- Modify: `lib/questions/sprint42-qa.test.mjs`, `docs/sprint42-candidate-manifest.json`, `docs/sprint42-practice-coverage-audit.md`, `docs/sprint42-qa-validation-outcome.md`

- [ ] Run focused QA and fix any content or validation failures.
- [ ] Run an inventory script against the actual bank exports and record Active Practice, total questions, learning units, answer-index distribution, and basic/application distribution.
- [ ] Confirm monthly allowlist remains exactly 170.

### Task 4: Full verification, Preview deployment, and final status

**Files:**
- Modify: `PROJECT_STATUS.md`, `docs/roadmap.md`, `docs/sprint-log.md`, `docs/deployment-log.md`

- [ ] Run focused QA, `npm test`, `npm run lint`, `npx tsc --noEmit --incremental false`, `npx next build --webpack`, Browser regression, `git diff --check`, and Auth Deployment Preflight.
- [ ] Commit and push the question-bank change; verify clean and ahead/behind 0/0.
- [ ] Deploy only to existing `2026ast-hosting-preview` Preview with Vercel Authentication OFF; never use `--prod` or `2026ast-production`.
- [ ] Verify READY deployment, anonymous Clerk route smoke, and eight new-bank question loads.
- [ ] Mark the sprint at most Implementation Complete / Awaiting Human Acceptance and provide 16-question human spot-check selections.
