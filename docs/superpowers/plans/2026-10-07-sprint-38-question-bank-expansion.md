# Sprint 38 Question Bank Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an auditable first batch of original, in-scope practice and monthly questions while preserving the existing learning architecture.

**Architecture:** Store the batch in a shared typed additions module and append it to each existing bank. Extend the existing first-exam allowlist with selected IDs and validate the result through focused tests plus the full project gates.

**Tech Stack:** TypeScript, Node test runner, existing Next.js question-bank modules.

**Spec:** `docs/superpowers/specs/2026-10-07-sprint-38-question-bank-expansion-design.md`

## Global Constraints

- Canonical repository only: `C:\Users\admin\Documents\2026AST-dev`.
- Confirmed first-month scopes only.
- No Learning Record, ReviewSession, Backup/Restore, retry, scheduling, Auth or Production changes.
- Preserve existing姐姐 out-of-scope practice exclusions.
- No unlicensed question-bank text reproduction.

## Review Focus

- Bank IDs remain collision-free: focused manifest and bank QA.
- Monthly IDs all exist and remain in scope: monthly inventory QA.
- Four options have one indexed answer: option and answer validation.
- 妹妹自然 stays within plant/air/water: forbidden-topic QA.
- Existing practice filters do not reactivate excluded history: active-view QA.

### Task 1: Add the first 80 original questions

**Files:**
- Create: `lib/questions/sprint38-question-additions.ts`
- Modify: the eight `lib/questions/*` bank modules

- [x] Add ten singleton questions per bank with explanations and hints.
- [x] Append additions without changing protected schemas or historical questions.

### Task 2: Extend monthly inventory and manifest

**Files:**
- Modify: `lib/first-exam-practice.ts`
- Create: `docs/sprint38-candidate-manifest.json`
- Create: `docs/sprint38-source-provenance.md`

- [x] Add five validated IDs per bank to the monthly allowlist.
- [x] Record scope and provenance for all 80 candidates.

### Task 3: Add focused QA and audit documents

**Files:**
- Create: `lib/questions/sprint-38-qa.test.mjs`
- Create: `docs/sprint38-practice-coverage-audit.md`

- [x] Verify unique IDs, four distinct options, answer index validity, scope restrictions, monthly count, active counts and preserved exclusions.
- [ ] Run full Node, lint, TypeScript, build and Browser regression before Preview deployment.
