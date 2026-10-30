# Sprint 43 Mathematics Visual Aids — Phase 1 Plan

## Scope

This plan stops at Design / Visual Fidelity Review Gate. It changes documentation only.

## Work packages

1. **Baseline inventory** — record the two 150-question active banks, 18/26 monthly counts, current question schema, and protected boundaries.
2. **Audit** — classify each active question as `HIGHLY_RECOMMENDED`, `USEFUL`, `OPTIONAL`, or `TEXT_ONLY_PREFERRED`; record monthly membership without changing the allowlist.
3. **Visual type design** — keep the catalog small, black-and-white, deterministic, and learner-specific.
4. **Mapping** — create the required mapping fields for every recommended visual and the 16 representative questions.
5. **Fidelity review** — inspect number, unit, quantity, relation, condition, completeness, unknown, skill, and grade fidelity.
6. **Answer Leakage Audit** — reject graphics that encode the answer, scale, missing quantity, or an easier substitute skill.
7. **QA governance** — define later validation, accessibility, fallback, snapshot, and stop conditions; explicitly prohibit implementation in this phase.

## Deliverables

- Design: this file and `docs/superpowers/specs/2026-10-30-sprint43-math-visual-aids-design.md`.
- Inventory and disposition: `docs/sprint43-math-visual-audit.md`.
- Per-question mapping: `docs/sprint43-math-visual-mapping.md`.
- Fidelity and leakage record: `docs/sprint43-visual-fidelity-audit.md`.
- QA and governance: `docs/sprint43-qa-governance.md`.

## Explicit stop conditions

- Do not edit `lib/questions/**`, `components/**`, `app/**`, or any learning-state module.
- Do not create SVG files, renderer code, visual assets, or bulk question annotations.
- Do not modify the monthly allowlist or deploy.
- Stop and return to owner review if a visual requires an unstated fact or changes the intended skill.

## Acceptance evidence for this phase

- Git branch is `codex/sprint43-math-visual-aids`.
- Only the listed documentation files and the Sprint 43 status record are changed.
- `git diff --check` passes.
- Working tree is intentionally non-clean until the owner decides whether to commit this design phase; no push or deployment is implied.
