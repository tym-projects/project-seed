# Sprint 43 Mapping / Renderer Contract Remediation Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace generic Sprint 43 visual mappings with typed semantic contracts, downgrade unsafe rows to text-only, and stop at the Round 2 Full Mapping Fidelity Review Gate.

**Architecture:** Keep the existing eight visual types and baseline semantics. Add explicit per-type data shapes and deterministic question-specific mapping helpers in the generator; make each renderer consume only its required semantic fields and return `null` when they are absent. The manifest becomes the generated audit artifact and the validator checks each type contract against source-question facts.

**Tech Stack:** TypeScript/TSX, Node test runner, TypeScript transpilation harness, Next.js, PowerShell, Git.

**Spec:** `C:\Users\admin\.codex\attachments\8b78453e-c6ac-412a-88a2-6b99cf0c5521\Pasted text.txt`

## Global Constraints

- Preserve the 16 approved baseline visual semantics.
- Round 2 IMPLEMENT target is at most 82: baseline 16 plus retained remediation candidates; never backfill downgraded rows.
- Downgrade the specified 26 IDs; keep the existing 26 DEFERRED IDs unchanged.
- Do not modify question banks, Learning Record, ReviewSession, retry, Auth, production annotation, or deployment.
- No renderer fallback values, hard-coded representative values, empty visual tables, or generic numeric arrays in production specs.
- Run focused tests, full `npm test`, lint, TypeScript, webpack build, and `git diff --check`; stop at review gate.

## Review Focus

- Thousand-separated numerals: preserve `2,350` as `2350`; test parser and manifest fields.
- Ordinal context numbers: exclude `第1號` from circle mathematical fields; test `contextLabel`.
- Unknown and intermediate results: keep requested totals, counts, remainders, and conversions blank/unknown.
- Renderer safety: missing required props return `null` and never invent defaults.
- Baseline compatibility: all 16 existing specs retain their rendered semantics and exact protected data.

### Task 1: Contract tests and Round 2 decision closure

**Files:**
- Modify: `lib/math-visuals.test.mjs`
- Modify: `lib/questions/sprint43-visual-mapping.test.mjs`
- Modify: `scripts/sprint43-build-visual-manifest.mjs`

- [ ] Write failing tests for typed contracts, downgraded IDs, parser commas, ordinal exclusion, baseline preservation, no generic arrays, and target counts.
- [ ] Run focused tests and confirm expected failures against current 108-row manifest.
- [ ] Implement the minimum shared contract/type helpers and explicit Round 2 ID sets.
- [ ] Re-run focused tests and confirm the decision closure is baseline 16 + remediation 66 + downgraded 26 + deferred 26.

### Task 2: Typed mapping generation

**Files:**
- Modify: `scripts/sprint43-build-visual-manifest.mjs`
- Modify: generated `docs/sprint43-math-visual-manifest.json`
- Modify: generated `docs/sprint43-math-visual-mapping-review.md`

- [ ] Add comma-safe numeric tokenization and type-specific explicit mapping helpers.
- [ ] Emit only semantic fields required by each renderer contract.
- [ ] Encode circle `contextLabel`, count, radius/diameter role, measurement role, and unknown values explicitly.
- [ ] Regenerate the manifest and summary; verify no answer, operation result, or intermediate conversion is stored.

### Task 3: Safe renderer migration

**Files:**
- Modify: `lib/math-visuals.ts`
- Modify: `components/question/MathVisual.tsx`
- Modify: `lib/math-visuals.test.mjs`

- [ ] Add failing safe-fail and prop-driven renderer tests.
- [ ] Add typed data unions while preserving baseline data compatibility.
- [ ] Remove radius `1`, length/width, empty-column, and 36/48 fallbacks.
- [ ] Render remediation candidates from semantic props only; keep measurement intermediate results hidden.

### Task 4: Full verification and governance handoff

**Files:**
- Modify: `PROJECT_STATUS.md`
- Modify: `docs/sprint43-math-visual-mapping-review.md`

- [ ] Run focused Sprint 43 tests, `npm test`, `npm run lint`, `npx tsc --noEmit --incremental false`, `npx next build --webpack`, and `git diff --check`.
- [ ] Run representative headless render smoke for the 16 baseline IDs if the existing harness is available; record any unavailable browser coverage.
- [ ] Review diff and counts; commit with `fix: harden Sprint 43 visual mapping contracts`.
- [ ] Push `codex/sprint43-math-visual-aids` only after verification, then confirm status and stop at Round 2 gate without annotation or deploy.
