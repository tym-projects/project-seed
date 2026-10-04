# Sprint 37 Practice Bank Scale-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 355 original in-scope singleton questions so all eight active practice banks reach exactly 60 questions.

**Architecture:** Extend the existing eight question-bank modules and their `practiceQuestions` views. Add static manifest/provenance/coverage records and pure Node validation tests; do not change persisted learning or review architecture.

**Tech Stack:** TypeScript question banks, Node `node:test`, existing transpile-based test helpers, Markdown/JSON governance files, Next.js existing test/build stack.

**Spec:** `docs/superpowers/specs/2026-10-04-sprint-37-practice-bank-scale-up-design.md`

## Global Constraints

- Active Practice must equal 60 for every one of the eight student/subject banks.
- Monthly allowlist remains exactly 87.
- Learning Record, ReviewSession, Backup/Restore, retry, and 1/3/7 scheduling are unchanged.
- Only confirmed first-month-exam scope is allowed; no animal or magnet content for 妹妹自然.
- New questions are independent singleton learning units unless existing schema gains an explicitly approved reason, which is out of scope.
- No force push, merge, tag, release, OneDrive access, or Sprint 36 history rewrite.

## Review Focus

- Active-view filtering must reach 60 without reactivating Sprint 36 exclusions — covered by the scale-up count/scope test.
- Manifest and bank IDs must remain one-to-one — covered by manifest completeness and collision tests.
- Four options must not hide equivalent answers — covered by option-equivalence checks and per-entry review.
- Large-bank answer positions must not concentrate — covered by answer-index distribution tests.
- Learning-record compatibility must survive 493 total questions — covered by existing Learning Record and full regression suites.

### Task 1: Phase 1 governance and manifest

**Files:**
- Create: `docs/superpowers/specs/2026-10-04-sprint-37-practice-bank-scale-up-design.md`
- Create: `docs/superpowers/plans/2026-10-04-sprint-37-practice-bank-scale-up.md`
- Create: `docs/sprint37-practice-coverage-matrix.md`
- Create: `docs/sprint37-candidate-manifest.json`
- Create: `docs/sprint37-source-provenance.md`
- Test: `lib/questions/sprint-37-manifest.test.mjs`

**Interfaces:** The manifest is the source of planned candidate IDs and bank allocations; later batch tasks replace `Planned` entries with final question metadata and `Implemented` status.

- [ ] Scan all existing IDs, active views, monthly allowlist IDs, and protected schema files.
- [ ] Reserve exactly 355 manifest entries with the approved eight-bank allocation.
- [ ] Record coverage skills and basic/application/reasoning targets.
- [ ] Run the manifest test and confirm 355 entries with no allocation drift.
- [ ] Commit the Phase 1 planning/QA checkpoint.

### Task 2: QA validators

**Files:**
- Create/Modify: `lib/questions/sprint-37-candidate-implementation.test.mjs`
- Create/Modify: `lib/questions/sprint-37-qa.test.mjs`

**Interfaces:** Validators consume question-bank modules and the JSON manifest; they produce deterministic failures for scope, collision, duplicate, option, answer, manifest, and active-count defects.

- [ ] Write failing tests for exact active counts, ID collision, manifest completeness, answer validity, and answer-index distribution.
- [ ] Implement the smallest pure validation helpers in test support or existing validation modules.
- [ ] Run focused QA and the full Node suite.
- [ ] Commit QA infrastructure before content batches.

### Task 3+: Content batches

**Files:** Eight `lib/questions/*.ts` banks, manifest, provenance, and focused tests.

- [ ] Generate one 40–60 question internal batch from the coverage matrix.
- [ ] Write/update the failing batch assertions first.
- [ ] Add original self-contained singleton questions with next-unused IDs.
- [ ] Run scope, answer, duplicate, manifest, and answer-index QA; rewrite failures.
- [ ] Update manifest/provenance and commit the passing batch.
- [ ] Repeat until all eight active counts equal 60.

### Final validation and handoff

- [ ] Run Sprint 37 focused tests, duplicate/scope/answer/manifest tests, `npm test`, lint, TypeScript, build, Browser regression, and `git diff --check`.
- [ ] Verify monthly allowlist 87 and protected Learning Record files unchanged.
- [ ] Update `PROJECT_STATUS.md`, `docs/roadmap.md`, and `docs/sprint-log.md` to `Implementation Complete / Awaiting Human Acceptance` only.
- [ ] Start the LAN test server, verify HTTP 200 and URL, prepare approximately 16 Human tablet checks, and stop at the Human Acceptance Gate.
