# Sprint 43 Visual Aid QA and Governance

## Current phase boundary

This amendment defines the proposed Production Annotation integration path and ends at the Production Annotation Design Review Gate. It does not authorize 81-question annotation, production question-bank edits, renderer changes, deployment, merge, or Sprint 44 integration.

## Production Annotation Integration Design — Proposed

The later production path is:

```text
question.id -> mathVisualSpecs -> typed visual data -> MathVisual -> QuestionCard optional rendering
```

The mapping is external, typed, and keyed by formal question ID. It does not change the Question schema or add visual metadata to question objects. `QuestionCard` may perform only `mathVisualSpecs[question.id]`: a present mapping renders `MathVisual`; an absent or invalid mapping safe-fails to the original text-only question. `QuestionCard` must not hard-code IDs, parse question text, infer geometry, derive data from answers/options, or invent fallback values. `MathVisual` must remain question-ID agnostic and must not contain single-question special cases.

Runtime source of truth is the typed `mathVisualSpecs` module. `docs/sprint43-math-visual-manifest.json` is the governance／QA source of truth and must not be imported or dynamically interpreted by React runtime. The existing manifest builder remains the deterministic, no-network validation/generation entry point; a later implementation may add only the smallest controlled conversion or parity step needed to keep the typed runtime mapping aligned with the manifest.

The implementation gate requires exact set equality:

- manifest `IMPLEMENT` count = `81`;
- production mapping count = `81`;
- mapping IDs equal manifest `IMPLEMENT` IDs exactly;
- all 16 representative IDs are a subset;
- all 27 downgraded IDs, all `TEXT_ONLY_PREFERRED`, optional-only, and extra IDs are absent.

All 81 records must use the existing eight renderer-valid typed contracts only. No generic numeric fields, answer／option／explanation-derived values, inferred geometry, invented units, NaN, null display, or undefined display are allowed. An unsafe record returns to Human Review; it is not silently downgraded during implementation.

The required test contract covers coverage/parity, type validity, fidelity and leakage, mapped versus unmapped rendering, safe failure, unchanged answers and question content, unchanged Learning Record／Review logic／Monthly allowlist, and Sprint 44 isolation. Sprint 44 is not a dependency and must not be merged or cherry-picked into Sprint 43.

## Required row fields

Every future visual mapping must contain: `questionId`, original question, intended skill, visual type, numbers/units/text, quantity/order/spatial relations, visual purpose, fidelity risk, answer leakage risk, ambiguity risk, and proposed result. The nine fidelity dimensions are mandatory.

## Future implementation gates

1. **Mapping parity gate** — exactly 81 typed mappings equal the manifest `IMPLEMENT` ID set.
2. **Schema gate** — the existing Question shape remains valid without visual metadata and typed mapping validation is explicit.
3. **Data gate** — visual data is derived only from known conditions; no answer or inferred fact is stored.
4. **Renderer gate** — SVG + React output is deterministic, black-and-white, keyboard/read-aloud friendly, and has a text fallback.
5. **Fidelity gate** — representative human review confirms number/unit/quantity/relation/condition/completeness/unknown/skill/grade fidelity.
6. **Leakage gate** — visual-only, alt-text, DOM, and screenshot review show no answer leakage.
7. **Regression gate** — existing question, Learning Record, ReviewSession, retry, 1/3/7, auth, and role tests remain unchanged and pass.
8. **Scope gate** — no bulk rollout until the first small approved set passes the Visual Fidelity Review.

## Accessibility requirements

- Provide a concise accessible description that states the known relations, not the answer.
- Never rely on line thickness, position, or shading alone to convey meaning.
- Preserve readable text labels and a no-visual fallback.
- Avoid decorative marks that could be interpreted as quantities.
- Test at both existing tablet viewport sizes and with the visual hidden.

## QA evidence to record later

- mapping completeness and disposition counts;
- schema validation and backward-compatibility tests;
- exact SVG/DOM snapshot or equivalent deterministic output;
- answer leakage audit results, including alt text and DOM inspection;
- browser regression with visuals on and off;
- `git diff --check`, working tree, commit, push, and deployment status separately.

## Protected boundaries

The following remain explicitly out of scope: `Learning Record`, `ReviewSession`, retry, 1/3/7 scheduling, Backup/Restore, Auth/Clerk, role authorization, Production hosting, monthly allowlist semantics, and non-mathematics question banks.

## Review decision vocabulary

- `APPROVE_FOR_PILOT`
- `REVISE_MAPPING`
- `TEXT_ONLY_PREFERRED`
- `HOLD_FOR_OWNER`

No implementation work may begin from a row marked `REVISE_MAPPING` or `HOLD_FOR_OWNER`.

## Representative implementation evidence

- Representative IDs are exactly 16: 姐姐 `2, 4, 11, 13, 63, 67, 72, 110`; 妹妹 `1, 2, 3, 4, 9, 10, 61, 62`.
- Implemented renderer types are exactly eight: `FRACTION_PART_BAR`, `DECIMAL_MEASURE_SEGMENTS`, `CIRCLE_RADIUS_DIAMETER`, `RECTANGLE_DIMENSIONS`, `GROUPING_ARRAY`, `PLACE_VALUE_COLUMNS`, `MEASUREMENT_RELATION`, and `BAR_MODEL`.
- Focused tests cover schema parse, type/data presence, units and labels, explicit unknowns, no answer/options coupling, optional attachment, backward compatibility, safe failure, bank non-mutation, and accessible deterministic SVG branches.
- Render evidence for this gate is deterministic source/markup evidence: each renderer branch emits an accessible `<svg role="img">` with a question-specific label and leaves the requested result blank. Authenticated browser screenshots were not run because no student credentials were supplied; no production localStorage or Learning Record fixture was used.
- The remaining review is a human rendered-fidelity check of the actual visual appearance and tablet layout. This phase stops there and does not annotate the other 284 questions.

## Round 2.1 closeout evidence

- Renderer Fidelity Gate decision: **PASS WITH DOCUMENTED ENVIRONMENT WAIVER**.
- Direct viewport evidence remains `20/20 PASS`: ten representative questions at `1280×800` and `1024×600`.
- `jiejie-mathematics-151` was loaded from the formal runtime question export and passed SSR semantic evidence: question text is correct, options count is `4`, labels are `長 7` and `寬 2`, no invented `公分`, answer, or explanation is rendered.
- A dedicated 151 screenshot was waived because it uses the existing `RECTANGLE_DIMENSIONS` renderer, introduces no new layout class or responsive behavior, and its equivalent SSR evidence passed. This is not reported as `22/22` Browser PASS.
- The latest Webpack rerun encountered environment/tooling failures (`fonts.googleapis.com` DNS resolution and existing `.next` `EPERM` directory creation). Earlier Webpack evidence for the same production diff was PASS; no Next, font, globals.css, or build-architecture change was made.
- Current rerun evidence: focused visual tests `20/20`, full Node `287/287`, lint PASS, TypeScript PASS, and `git diff --check` PASS.
