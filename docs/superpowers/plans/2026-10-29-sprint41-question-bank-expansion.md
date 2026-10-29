# Sprint 41 Question Bank Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 174 original in-scope questions so all eight Active Practice banks reach exactly 100 questions.

**Architecture:** Reuse the existing per-bank TypeScript question exports and the Sprint additions merge pattern. Keep new content, manifest, coverage evidence, provenance, and focused QA separate from Learning Record, review, auth, and UI code.

**Tech Stack:** Next.js/TypeScript question banks, Node `node:test`, existing TypeScript transpile-based QA loaders, npm lint/typecheck/build, Playwright browser smoke.

**Spec:** `docs/superpowers/specs/2026-10-29-sprint41-question-bank-design.md`

## Global Constraints

- Canonical repository is `C:\Users\admin\Documents\2026AST-dev`; do not use OneDrive or historical copies.
- Target is exactly 100 Active Practice questions in each of the eight student/subject banks.
- Planned additions are 25/25/25/25 for 姐姐 and 17/17/15/25 for 妹妹, total 174.
- Stay within the confirmed first-month-exam scope; 妹妹自然 remains limited to `認識植物`／`空氣和水`.
- Prefer fully original singleton learning units; do not modify Learning Record, ReviewSession, Backup/Restore, retry, 1/3/7, Auth, Production, or schema.
- Do not auto-add every new question to Monthly allowlist; only explicit approvals may alter it.

## Review Focus

- Active Practice filtering must produce exactly the planned per-bank counts; test all eight exports.
- Existing retired/history questions must remain available where currently retained; test that additions do not reactivate excluded IDs.
- Duplicate and near-duplicate content must be rejected across both existing and Sprint 41 additions; test normalized stems, options, and answer/explanation pairs.
- Correct-answer position must be valid and not leak through option wording or hint/explanation; test all 174 additions.
- Monthly eligibility must be explicit and independent from Active Practice; test that deferred candidates do not enter the allowlist.

---

### Task 1: Lock Sprint 41 audit and coverage artifacts

**Files:**
- Create: `docs/sprint41-practice-coverage-matrix.md`
- Create: `docs/sprint41-candidate-manifest.json`
- Create: `docs/sprint41-source-provenance.md`
- Create: `docs/sprint41-qa-strategy.md`

**Interfaces:**
- Consumes: closed audit in `docs/superpowers/specs/2026-10-29-sprint41-question-bank-design.md`.
- Produces: eight-bank counts, slot-level coverage targets, manifest disposition schema, and provenance rules used by Tasks 2–4.

- [ ] **Step 1: Record the eight current counts and exact gaps**

  Assert the table is `75/75/75/75/83/83/85/75`, target `100` each, total `626 → 800`, total additions `174`.

- [ ] **Step 2: Define coverage slots per bank**

  Allocate each bank's 25/17/15/25 slots across approved topics and question forms; leave no slot as a generic “varied” placeholder.

- [ ] **Step 3: Define manifest and provenance fields**

  Use candidate ID, student, subject, topic, type, intended learning-unit policy, scope basis, originality status, source notes, monthly disposition, and QA disposition. The skeleton may contain planned slots but no fabricated question text.

- [ ] **Step 4: Review the artifacts against the design doc**

  Verify no slot expands scope and no manifest field implies automatic monthly inclusion.

### Task 2: Add Sprint 41 original question data

**Files:**
- Create: `lib/questions/sprint41-question-additions.ts`
- Modify: `lib/questions/jiejie-chinese.ts`
- Modify: `lib/questions/jiejie-mathematics.ts`
- Modify: `lib/questions/jiejie-natural-science.ts`
- Modify: `lib/questions/jiejie-social-studies.ts`
- Modify: `lib/questions/meimei-chinese.ts`
- Modify: `lib/questions/meimei-mathematics.ts`
- Modify: `lib/questions/meimei-natural-science.ts`
- Modify: `lib/questions/meimei-social-studies.ts`

**Interfaces:**
- Consumes: Task 1 coverage matrix and manifest slots; existing `QuestionCardQuestion` and `make()` conventions.
- Produces: eight arrays totaling 174 questions, merged into the corresponding active practice banks without schema changes.

- [ ] **Step 1: Write the focused failing count test**

  Add assertions that each bank has its planned final Active Practice count and that the new IDs are not present before the additions are wired.

- [ ] **Step 2: Run the focused test and verify the expected RED result**

  Run `node --test lib/questions/sprint41-qa.test.mjs`; it must fail because Sprint 41 IDs/content are not yet present.

- [ ] **Step 3: Implement the eight bank arrays**

  Add exactly 174 original questions with four unique options, valid answer indices, non-leaking hints, consistent explanations, and singleton units unless a documented exception is approved.

- [ ] **Step 4: Wire each additions array into the existing bank module**

  Preserve current practice filters and retained historical questions; do not alter unrelated exports or review behavior.

- [ ] **Step 5: Run the focused test and verify GREEN**

  Expected: all Sprint 41 count, ID, option, scope, and singleton assertions pass.

### Task 3: Implement focused QA and duplicate checks

**Files:**
- Create: `lib/questions/sprint41-qa.test.mjs`
- Modify: `lib/questions/question-bank-validation.ts` only if an existing reusable validator cannot express the required check; prefer test-local normalization helpers.

**Interfaces:**
- Consumes: Task 1 manifest/coverage/provenance and Task 2 eight bank exports.
- Produces: repeatable QA for scope, counts, unique answers/options, answerIndex, duplicate/near-duplicate, explanation consistency, hint leakage, grade level, and learning units.

- [ ] **Step 1: Add RED checks for every review focus item**

  Cover all eight banks, all 174 additions, the approved scope patterns, monthly disposition, and no reactivation of retired IDs.

- [ ] **Step 2: Run focused QA and verify failures identify missing Sprint 41 implementation**

  Use `node --test lib/questions/sprint41-qa.test.mjs` and correct test fixtures or assertions if the failure is caused by the test itself.

- [ ] **Step 3: Add the minimal QA/data changes needed for GREEN**

  Keep production behavior unchanged; any validator extension must be generic and covered by its own test.

- [ ] **Step 4: Run focused QA again**

  Expected: all focused QA checks pass with no duplicate, scope, answer, or unit errors.

### Task 4: Decide and apply explicit Monthly allowlist changes

**Files:**
- Modify: `lib/first-exam-practice.ts` only for explicitly approved IDs.
- Modify: `lib/questions/sprint41-qa.test.mjs` for the final allowlist count/disposition assertions.

**Interfaces:**
- Consumes: Task 1 monthly disposition fields and Task 3 QA evidence.
- Produces: an explicit allowlist delta or a documented unchanged baseline of 170.

- [ ] **Step 1: Review candidate coverage against confirmed exam scope**

  Mark each candidate `defer`, `eligible-review`, or `approved`; no default promotion.

- [ ] **Step 2: Write the allowlist regression test first**

  Assert every allowlisted Sprint 41 ID is explicitly approved and every deferred ID is absent.

- [ ] **Step 3: Apply only the approved allowlist delta**

  Keep the allowlist at 170 when no new candidate is necessary; otherwise record the exact before/after count and rationale.

- [ ] **Step 4: Run focused monthly tests**

  Expected: explicit disposition and confirmed scope checks pass.

### Task 5: Full verification and release decision

**Files:**
- Modify: `PROJECT_STATUS.md`
- Modify: `docs/sprint-log.md`
- Create or modify: Sprint 41 QA/evidence closeout files as needed.

**Interfaces:**
- Consumes: Tasks 1–4 implementation and evidence.
- Produces: verification record and either Implementation Complete / Awaiting Human Acceptance or a blocker report; never self-label Completed.

- [ ] **Step 1: Run focused question tests**

- [ ] **Step 2: Run `npm test`**

- [ ] **Step 3: Run `npm run lint` and `npx tsc --noEmit --incremental false`**

- [ ] **Step 4: Run production build using the accepted Webpack fallback if the known Turbopack `app/globals.css` panic recurs**

- [ ] **Step 5: Run Browser regression, `git diff --check`, and Auth Deployment Preflight**

- [ ] **Step 6: Verify Git state, commit/push the approved implementation, and only then deploy existing `2026ast-hosting-preview` if every Auto-Deploy gate passes**

- [ ] **Step 7: Record Preview URL, source commit, counts, allowlist, test evidence, browser/auth limitations, Learning Record status, Production status, Human 16-question spot-check request, and blocker status**

