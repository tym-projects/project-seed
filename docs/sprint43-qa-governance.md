# Sprint 43 Visual Aid QA and Governance

## Current phase boundary

This phase is documentation-only and ends at Visual Fidelity Review. There is no production visual schema, renderer, asset, deployment, or question-bank annotation.

## Required row fields

Every future visual mapping must contain: `questionId`, original question, intended skill, visual type, numbers/units/text, quantity/order/spatial relations, visual purpose, fidelity risk, answer leakage risk, ambiguity risk, and proposed result. The nine fidelity dimensions are mandatory.

## Future implementation gates

1. **Schema gate** — optional field preserves all legacy questions and has runtime validation.
2. **Data gate** — visual data is derived only from known conditions; no answer or inferred fact is stored.
3. **Renderer gate** — SVG + React output is deterministic, black-and-white, keyboard/read-aloud friendly, and has a text fallback.
4. **Fidelity gate** — representative human review confirms number/unit/quantity/relation/condition/completeness/unknown/skill/grade fidelity.
5. **Leakage gate** — visual-only, alt-text, DOM, and screenshot review show no answer leakage.
6. **Regression gate** — existing question, Learning Record, ReviewSession, retry, 1/3/7, auth, and role tests remain unchanged and pass.
7. **Scope gate** — no bulk rollout until the first small approved set passes the Visual Fidelity Review.

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
