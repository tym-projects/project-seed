# Sprint 43 Mathematics Visual Aids — Design

## Status and gate

Status: **Production Annotation Integration Design — Proposed**. This amendment defines the later integration path but authorizes no 81-question annotation implementation, question-bank edit, production-code commit, deployment, or Learning Record change. Sprint 43 remains at the Production Annotation Design Review Gate.

## Production annotation integration amendment

The approved integration shape is data-driven and reuses the existing representative path:

```text
question.id
  -> mathVisualSpecs
  -> typed visual data
  -> MathVisual
  -> QuestionCard optional rendering
```

The production annotation layer is an independent typed mapping keyed by the formal question ID. It does not modify the Question schema or add `visual` metadata to the 81 question objects. `QuestionCard` performs only an ID lookup: when a mapping exists it renders `MathVisual`; when it does not exist, the question remains text-only. A missing or invalid lookup must safe-fail to text-only.

`QuestionCard` must not switch on question IDs, parse question text, infer geometry, derive visuals from answers or options, or create invented fallback data. `MathVisual` must not know question IDs and must not contain question-specific renderer branches. Rendering must not affect answer selection, submit, retry, result state, hint, explanation, Learning Record, or spaced review.

The runtime source of truth is the typed `mathVisualSpecs` module (or a repository module with the same typed role). `docs/sprint43-math-visual-manifest.json` is the governance and QA source of truth; production runtime must not import or dynamically interpret the unvalidated JSON manifest. The manifest is converted or validated against the typed mapping before release.

The 81 `IMPLEMENT` records must have exact set equality with the production mapping: 81 mappings, 81 unique IDs, no `TEXT_ONLY_PREFERRED`, downgraded, optional-only, or extra IDs. The 16 representative mappings are the architecture prototype and must remain a subset of the same 81-item mapping; no second annotation mechanism or renderer contract is introduced.

All mappings use only the eight approved renderer types and their existing renderer-valid typed fields. Generic numeric arrays, renderer inference, undefined fallbacks, invented units, answer-derived fields, option-derived fields, explanation-derived fields, NaN, null display, and undefined display are prohibited. If a value cannot be represented safely, implementation must stop for that record and return to Human Review; implementation must not silently downgrade it.

The selected mapping strategy is **manifest validation plus a controlled typed mapping source**. The existing `scripts/sprint43-build-visual-manifest.mjs` remains the deterministic, no-network manifest generation and validation entry point. A later implementation may add the smallest deterministic conversion/generation step needed to produce or verify the typed mapping, but runtime truth remains `mathVisualSpecs`, not JSON. Generation must be repeatable, reviewable, TypeScript-compilable, and free of network, AI runtime, and randomness. Automated parity tests prevent drift between the two sources.

The later implementation gate must cover: exact 81-item coverage and ID parity; allowed types and renderer validity; representative-subset and downgraded-absence checks; no answer/options leakage or invented values; mapped visual versus unmapped text-only behavior; safe failure; unchanged question content, answers, Learning Record, Review logic, and Monthly allowlist. Sprint 43 must remain independent of Sprint 44 and must not merge or cherry-pick Sprint 44 before its own completion.

## Intent

Audit the existing 姐姐／妹妹 mathematics banks and decide, question by question, whether a small black-and-white visual would improve comprehension without changing the mathematics, revealing the answer, or adding information that the stem does not provide.

The current baseline is 150 active questions in each bank, with monthly allowlists of 18 (姐姐) and 26 (妹妹). The first phase is reviewable design material only.

## Goals

- Audit all 300 active mathematics questions and separately mark the 44 monthly questions.
- Define a small, data-driven visual type catalog suitable for SVG + React later.
- Propose an optional, backward-compatible visual schema without changing the current Question shape.
- Produce a complete mapping row for every question recommended for a visual.
- Run a first-pass number/unit/quantity/relation/condition/completeness/unknown/skill/grade fidelity audit.
- Run an answer-leakage and ambiguity audit.
- Prepare eight representative questions per learner: 姐姐分數／小數／圓／多步驟；妹妹位值／四位數加減／乘法分組／mm 測量.
- Explicitly preserve `TEXT_ONLY_PREFERRED` for cases where text is clearer or a visual would leak the answer.

## Non-goals and anti-goals

- No 81-question annotation, renderer expansion, component behavior change, SVG batch, or visual asset implementation in this design amendment.
- No question text, options, answer, explanation, hint, ID, monthly allowlist, or existing schema changes.
- No Learning Record, ReviewSession, retry, 1/3/7, Backup/Restore, Auth, role authorization, Production, or deployment work.
- Do not infer missing dimensions, scale, grouping, ordering, or answer values.
- Do not use decoration that looks like evidence.

## Design principles

1. The visual is a faithful explanation aid, not a second source of facts.
2. Black-and-white simple line art is the default; colour is not semantic.
3. SVG + React and data-driven descriptors are preferred for deterministic rendering and testability.
4. 妹妹 visuals should be concrete and countable; 姐姐 visuals should be more structural and relationship-oriented.
5. Every visual must show only known conditions. Unknowns remain blank, masked, or explicitly unspecified.
6. If a visual makes the correct option easier to identify without doing the intended skill, reject it.
7. If the text already carries the relation more precisely than a drawing, prefer text.

## Approaches considered

### A. Question-list first

Start with the 16 representative mappings and expand only after review. Lowest implementation risk, but weak as a reusable visual contract.

### B. Renderer contract first

Define renderer props and implement a few primitives before auditing questions. It gives fast visual feedback, but would cross the requested gate and risks designing to the renderer instead of the learning intent.

### C. Two-layer governance (selected)

Use the complete question audit and representative mappings as the decision source, while defining only a minimal visual catalog and optional schema proposal. Every candidate passes fidelity, leakage, ambiguity, and completeness gates before any future implementation. This preserves the current product boundary and gives a later implementer enough structure to work without inventing semantics.

## Proposed visual catalog

| Visual type | Intended use | Never infer |
|---|---|---|
| `FRACTION_PART_BAR` | Known fraction parts and comparison of parts | the requested quotient or an unprovided partition |
| `DECIMAL_MEASURE_SEGMENTS` | Decimal length/volume as labelled segments | scale not stated in the stem |
| `CIRCLE_RADIUS_DIAMETER` | Radius/diameter relation with a centre marker | circumference/area or a drawn-to-scale value |
| `RECTANGLE_DIMENSIONS` | Known length and width, area/perimeter distinction | an answer label or unspecified side length |
| `RATIO_PARTS` | Known ratio parts and given quantity | the unknown counterpart |
| `GROUPING_ARRAY` | Equal groups, rows, and countable objects | a remainder or target total not stated |
| `PLACE_VALUE_COLUMNS` | Thousands/hundreds/tens/ones decomposition | a missing digit or final answer |
| `MEASUREMENT_RELATION` | cm/mm conversion relation without a read-off ruler | measurement precision or answer endpoint beyond the stem |
| `BAR_MODEL` | known quantity relation with an unknown total | operation choice, computed total, or inferred scale |
| `TEXT_ONLY` | Text is already the clearest or safest representation | any decorative substitute |

## Optional backward-compatible schema proposal

The current question object remains valid when `visual` is absent.

```ts
type QuestionVisual = {
  status: 'HIGHLY_RECOMMENDED' | 'USEFUL' | 'OPTIONAL' | 'TEXT_ONLY_PREFERRED';
  type?: VisualType;
  purpose: string;
  data: Record<string, string | number | boolean | readonly number[]>;
  knownFacts: readonly string[];
  unknowns: readonly string[];
  accessibilityLabel: string;
  fidelityNotes: readonly string[];
  leakageNotes: readonly string[];
};

type QuestionWithOptionalVisual = QuestionCardQuestion & {
  visual?: QuestionVisual;
};
```

The proposal remains documentation-only and is not selected as the production annotation mechanism. The production path uses the external typed mapping described above, so no Question schema change is required. Any later implementation still requires an approved plan defining validation, renderer behaviour, snapshots, accessibility, and fallback behaviour.

## Review gate

Phase 1 may advance only when every planned visual has a mapping row, each row has all required fidelity fields, leakage is classified, unknowns are explicit, and the owner approves the Visual Fidelity Review. Otherwise the proposed result remains `TEXT_ONLY_PREFERRED` or `HOLD_FOR_REVIEW`.
