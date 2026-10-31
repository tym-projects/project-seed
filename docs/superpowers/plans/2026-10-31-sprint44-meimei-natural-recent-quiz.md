# Sprint 44 Correct Baseline Migration and Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** From the verified Sprint 42 commit, create a clean Sprint 44 v2 branch, preserve the existing 150-question妹妹自然 baseline, and add 36 new Active Practice questions with IDs 151–186.

**Architecture:** Start from the exact correct-baseline commit and preserve the final exported 妹妹自然 bank questions 1–150 semantically; those questions are composed from the main bank and the existing Sprint 38–42 additions modules. Append a dedicated `sprint44-question-additions.ts` module through the existing additions pattern. Monthly selection remains owned by the existing 28-ID allowlist and is not changed.

**Tech Stack:** TypeScript question modules, Node `node:test` focused tests, npm test/lint, TypeScript no-emit, Next webpack build, Git branch operations.

**Spec:** `docs/superpowers/specs/2026-10-31-sprint44-meimei-natural-recent-quiz-design.md`

## Global Constraints

- Correct baseline is `c4632889b87d4f11a8016a72253532b62ef3ca19`.
- Formal repository is `C:\Users\admin\Documents\2026AST-dev`; do not work in the OneDrive copy.
- Preserve the old `codex/sprint44-meimei-natural-recent-quiz` branch; do not rebase or merge it.
- Salvage must remain outside the repository and must not be committed.
- New IDs are exactly `meimei-natural-science-151` through `meimei-natural-science-186`.
- New questions are Active Practice only; Monthly allowlist remains exactly 28 IDs.
- Do not change Learning Record, Review, Auth, MathVisual, font architecture, Next configuration, or `globals.css`.
- Before migration, read `AGENTS.md`, `PROJECT_SEED_BIBLE.md`, `PROJECT_STATUS.md`, the Sprint 44 design, and this plan; verify `git rev-parse --show-toplevel` is `C:/Users/admin/Documents/2026AST-dev`.
- Stop before commit/push at the Correct Baseline Question Content Review Gate; commit and push require a later Owner/ChatGPT approval. Never deploy, tag, release, or merge in this Sprint.

## Review Focus

- Dirty old-branch files must be preserved before cleanup: salvage verification compares file lists and hashes before any reset/checkout.
- The new branch must actually start at the specified commit: branch HEAD, 8-subject Active counts,妹妹自然 max ID, Monthly count, and clean tree are checked before implementation.
- Baseline question semantics must not drift: regression test compares IDs, question text, options, answer, hint, and explanation for all 150 baseline questions against the canonical commit.
- Baseline regression must export the canonical final 150-question bank from the main bank plus the existing additions modules and deep-compare `id`, `topic`, `type`, `title`, `instruction`, `question`, `options`, `answer`, `hint`, `explanation`, and `encouragement`.
- Monthly must not grow accidentally: focused test compares the exact 28-ID allowlist before and after and asserts no new ID is present.
- Numeric ID validation must use parsed suffixes, prove the contiguous ranges `151–186`, and reject accidental reuse of old Sprint 44 IDs `13–48`.
- Science content must not encode a misconception as correct: focused QA asserts the requested Plant/Air-Water concepts, four unique options, one valid answer, and non-empty feedback fields.
- Browser/E2E status must be reported explicitly as `NOT RUN` when not executed; Node, lint, TypeScript, and build results must not be described as Browser PASS.

### Task 1: Salvage the old Sprint 44 work

**Files / outputs:**
- Read: `lib/questions/sprint44-question-additions.ts`
- Read: `lib/questions/sprint44-meimei-natural-recent-quiz.test.mjs`
- Read: `docs/sprint44-meimei-natural-recent-quiz-content-review.md`
- Read: `docs/superpowers/specs/2026-10-31-sprint44-meimei-natural-recent-quiz-design.md`
- Read: `PROJECT_STATUS.md`
- Create outside repo: `C:\Users\admin\Documents\2026AST-sprint44-salvage\`
- Create outside repo: `C:\Users\admin\Documents\2026AST-sprint44-salvage\SALVAGE_MANIFEST.md` (or `salvage-manifest.json`)

**Interfaces:** Produces a verified external salvage copy of exactly the current Sprint 44 artifacts and a manifest containing source repo, branch, HEAD, timestamp, source/salvage paths, sizes, and SHA-256 hashes. The old `meimei-natural-science.ts` is evidence for the stale branch only and is never used as the new baseline.

- [ ] Before any cleanup, verify the repository root and read the five startup documents listed in Global Constraints; stop if the root is not `C:/Users/admin/Documents/2026AST-dev`.
- [ ] Record the current source branch `codex/sprint44-meimei-natural-recent-quiz`, HEAD `27d5c4690b1b4f27e030f0fce46196125fd4334f`, and the exact seven dirty paths before copying.
- [ ] Create the salvage directory outside the repository and copy these exact files: `lib/questions/sprint44-question-additions.ts`, `lib/questions/sprint44-meimei-natural-recent-quiz.test.mjs`, `docs/sprint44-meimei-natural-recent-quiz-content-review.md`, `docs/superpowers/specs/2026-10-31-sprint44-meimei-natural-recent-quiz-design.md`, `docs/superpowers/plans/2026-10-31-sprint44-meimei-natural-recent-quiz.md`, and `PROJECT_STATUS.md` as the stale-branch snapshot.
- [ ] If any additional dirty path exists, stop and obtain confirmation; do not silently include it or clean it.
- [ ] Write the manifest with each source path, salvage path, byte size, and SHA-256; verify every source hash equals its salvage hash and confirm the salvage directory is outside the repository.

**Human Gate 1 — Salvage Verification:** Stop after the manifest verification and report source branch, source HEAD, file count/list, sizes, hashes, salvage path, and verification result. Do not clean or switch branches until Owner/ChatGPT approves.

### Task 2: Clean the stale branch and establish the correct baseline branch

**Files:**
- Modify only through Git cleanup: current dirty Sprint 44 files are removed from the old branch working tree after salvage verification.
- Create branch: `codex/sprint44-meimei-natural-recent-quiz-v2` at `c4632889b87d4f11a8016a72253532b62ef3ca19`.

**Interfaces:** Consumes Task 1’s verified salvage. Produces a clean v2 branch whose HEAD is the canonical Sprint 42 commit and retains the old branch untouched in Git history.

- [ ] Restore the old branch working tree to clean using the least-destructive Git operation that removes only the verified Sprint 44 working-tree changes; if `.git/index.lock` permission is encountered, stop immediately.
- [ ] After Human Gate 1, restore only these exact tracked paths: `PROJECT_STATUS.md` and `lib/questions/meimei-natural-science.ts`, using `git restore -- <exact-path>`; never use `git restore .`, `git reset --hard`, or `git clean -fd`.
- [ ] Remove only these exact untracked paths after confirming their salvage hashes: `docs/sprint44-meimei-natural-recent-quiz-content-review.md`, `docs/superpowers/plans/2026-10-31-sprint44-meimei-natural-recent-quiz.md`, `docs/superpowers/specs/2026-10-31-sprint44-meimei-natural-recent-quiz-design.md`, `lib/questions/sprint44-meimei-natural-recent-quiz.test.mjs`, and `lib/questions/sprint44-question-additions.ts`; do not use wildcards and do not touch the external salvage directory.
- [ ] Verify the old branch is clean and still exists.
- [ ] Create/switch to `codex/sprint44-meimei-natural-recent-quiz-v2` directly from the correct commit; do not rebase, merge, or cherry-pick the old branch.
- [ ] Immediately verify repo root, branch, exact HEAD `c4632889b87d4f11a8016a72253532b62ef3ca19`, and clean tree.
- [ ] Programmatically verify clean tree, 8 subjects × 150 Active Practice, 妹妹自然 max numeric ID suffix 150, and exact Monthly count 28; stop if any gate fails.

**Human Gate 2 — Correct Baseline:** Report the exact root, branch, HEAD, clean-tree result, all eight Active counts, numeric max ID, Monthly count, and proof that old-branch Sprint 44 additions `meimei-natural-science-13` through `-48` were not carried into v2 as new questions. Stop for approval before tests or production implementation.

### Task 3: Add failing migration and regression tests first

**Files:**
- Create or modify: `lib/questions/sprint44-meimei-natural-recent-quiz.test.mjs`
- Create: `lib/questions/sprint44-correct-baseline-regression.test.mjs`

**Interfaces:** Tests load TypeScript question modules using the project’s existing `typescript.transpileModule`/VM pattern. The regression test materializes or otherwise loads the canonical final exported bank from Git commit `c4632889...`, including the main bank and Sprint 38–42 additions modules, and compares the 150 baseline questions semantically.

- [ ] Add a RED assertion before implementation that IDs `meimei-natural-science-151` through `-186` are absent and final Active count 186 is not yet satisfied; also assert the expected coverage and exact Monthly allowlist contract.
- [ ] Update the focused test to expect IDs 151–186, final Active count 186, Plant/Air-Water 18/18, basic/application 12/24, answer distribution 9/9/9/9, four unique options, non-empty feedback, unique question text, and exact Monthly allowlist of 28.
- [ ] Add assertions for the specified science concepts: 互生、對生、輪生、軸根、鬚根、根固定與吸水、空氣有重量／占空間／可壓縮、水較不易壓縮、水傳遞力量、氣球漏氣水中氣泡、杯內空氣阻擋水； reject the listed misconceptions as correct answers.
- [ ] Add a canonical semantic snapshot/deep-equality regression for all 150 original questions and fields: `id`, `topic`, `type`, `title`, `instruction`, `question`, `options`, `answer`, `hint`, `explanation`, and `encouragement`.
- [ ] Add checks that all other seven subject banks match the canonical commit and that no Sprint 43 source is introduced.
- [ ] Run the focused tests before implementation and confirm they fail for the expected missing additions/integration or stale expectations.

### Task 4: Migrate the 36 question contents and integrate minimally

**Files:**
- Create: `lib/questions/sprint44-question-additions.ts`
- Modify: `lib/questions/meimei-natural-science.ts` at the existing additions integration point only

**Interfaces:** `sprint44-question-additions.ts` exports `sprint44MeimeiNaturalQuestions: Question[]`. The main bank appends this array without rewriting questions 1–150.

- [ ] Copy only the salvaged 36 question contents into the new module, remap old content IDs `13–48` to contiguous IDs `151–186`, and preserve question, options, answer, hint, explanation, and encouragement content unless a QA correction is required; do not copy the old IDs or the old main bank.
- [ ] Integrate the additions module using the existing CommonJS-compatible additions pattern and no Monthly changes.
- [ ] Verify no duplicate ID, no old `13–48` Sprint 44 addition is exported as a new question, and no Sprint 38–42 additions are overwritten.
- [ ] Run the focused tests and confirm all migration/content/regression assertions pass.

### Task 5: Update governance and Content Review documentation

**Files:**
- Modify: `docs/sprint44-meimei-natural-recent-quiz-content-review.md`
- Modify: `PROJECT_STATUS.md`
- Preserve: `docs/superpowers/specs/2026-10-31-sprint44-meimei-natural-recent-quiz-design.md`

**Interfaces:** Documentation reflects the correct baseline only and becomes the evidence record for the final review gate.

- [ ] Rewrite Content Review to state baseline Active 150, baseline max 150, Monthly 28 → 28, final Active 186, and IDs 151–186.
- [ ] List all 36 IDs with one-sentence intent, topic, and basic/application classification; retain no student name/class/seat number.
- [ ] Record the stale-branch discovery as pre-commit, no Git-history pollution, and add the prevention rule that Git synchronization does not prove product baseline correctness.
- [ ] Record any environment-only Webpack DNS limitation without changing font architecture, Next, or globals.css.
- [ ] Record `Browser / E2E: NOT RUN` with the reason that this Sprint is a question-bank content expansion unless a separate browser acceptance is explicitly requested.
- [ ] Ensure the correct-baseline current state never reports Active `12` or Monthly `12`; retain those values only in the salvage/incident evidence.

### Task 6: Run the required validation and stop at the review gate

**Files:** No further production files unless a failing validation requires a focused correction.

- [ ] Run Sprint 44 focused tests.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npx tsc --noEmit --incremental false`.
- [ ] Run `npx next build --webpack`; if the existing `fonts.googleapis.com ENOTFOUND` issue recurs, record it as an environment issue and do not alter font architecture.
- [ ] Run `git diff --check`.
- [ ] Review the final diff for absence of Learning Record, Review, Auth, MathVisual, Sprint 43, deployment, and unrelated changes.
- [ ] Confirm all required validation is complete and prepare the Content Review Summary and updated `PROJECT_STATUS.md`.
- [ ] Stop before Git commit/push at **Sprint 44 — Question Content Review Gate — Correct Baseline**. Report validation, Browser/E2E status, final diff scope, and content-review evidence; do not commit or push without explicit Owner/ChatGPT approval.

### Task 7: Commit and push only after Content Review approval

**Files:** No new implementation files; commit only the already-reviewed Sprint 44 changes.

**Interfaces:** Consumes an explicit approval recorded after Task 6. Produces a committed and pushed v2 branch, still awaiting deployment/Human Acceptance.

- [ ] Confirm the approval names the correct-baseline Content Review Gate and does not authorize deployment, tag, release, merge, or rebase.
- [ ] Commit only the reviewed files with message `feat: expand meimei natural practice from recent quizzes`.
- [ ] Push only `codex/sprint44-meimei-natural-recent-quiz-v2` to `origin/codex/sprint44-meimei-natural-recent-quiz-v2`.
- [ ] Verify exact HEAD, clean tree, ahead/behind, old branch retention, and report status as `Implemented / Committed / Awaiting Deployment Decision`, never `Completed`.

## Plan self-review

- Spec coverage: startup governance, exact salvage manifest, Human Gates 1–2, safe cleanup, baseline migration, exported-bank ID allocation, minimal integration, Monthly hard gate, 150-question regression, 36-question QA, science QA, Browser/E2E reporting, prevention rule, validation, governance documentation, pre-commit Content Review Gate, and conditional Git closeout are covered by Tasks 1–7.
- Type consistency: the additions export and main-bank append contract match the current project pattern; focused tests consume the final `questions` export and `getFirstExamQuestionIds` contract.
- TDD order: RED assertions are written and run after Human Gate 2 and before additions implementation; canonical regression remains a guard against baseline drift.
- Scope: no new dependencies, no architecture changes, no production deployment, and no changes outside the approved Sprint 44 question/document scope.
