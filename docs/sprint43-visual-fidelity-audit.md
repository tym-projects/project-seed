# Sprint 43 Visual Fidelity and Answer Leakage Audit

## Audit dimensions

Every candidate is reviewed in this order:

1. **Number** — every numeral shown appears in the stem or is an explicitly structural label such as 1 cm = 10 mm only when already taught by the question context.
2. **Unit** — cm, mm, m, 公升, 平方公分, and other units are not mixed or silently converted.
3. **Quantity** — the visual does not add objects, groups, lengths, or totals.
4. **Relation** — equality, ratio, containment, order, boundary, and part-whole relations match the stem.
5. **Condition** — “equal”, “maximum”, “full segment”, “radius”, and similar constraints remain visible.
6. **Completeness** — every required known condition is represented or intentionally left in text.
7. **Unknown** — the requested quantity stays blank/unknown; no answer-shaped placeholder is allowed.
8. **Skill** — the visual supports the intended skill and does not substitute a simpler recognition task.
9. **Grade** — density, vocabulary, and abstraction match 姐姐 structural or 妹妹 concrete treatment.

## First-pass findings for 16 representatives

| Group | Fidelity conclusion | Leakage conclusion |
|---|---|---|
| 姐姐分數 2 | PASS with a partition-only bar; quotient remains unknown | PASS if no half-unit count is prefilled |
| 姐姐圓 4 | PASS with radius marker and no scale claim | PASS if area is not shaded or labelled |
| 姐姐分數 11 | PASS with a partition-only bar; per-segment length remains unknown | PASS if 1/4 is not prefilled |
| 姐姐圓 13 | PASS with diameter through centre | PASS if circumference is not written on the arc |
| 姐姐多步驟 63 | CONDITIONAL PASS only with neutral unpartitioned quantities; otherwise TEXT_ONLY_PREFERRED | PASS only if no group boundary, common factor, or per-group value is shown |
| 姐姐小數 67 | PASS with repeated-length template and blank remainder | PASS if segment count and remainder stay unknown |
| 姐姐圓 72 | PASS with two radius markers and no filled area comparison | PASS if 4 is not encoded by four sectors or labels |
| 姐姐面積周長 110 | PASS with neutral rectangle and dimension labels only | PASS if no area/perimeter cue or answer value is placed in the shape |
| 妹妹位值 1 | PASS with four columns including zero tens | PASS if decomposition row is empty |
| 妹妹四位數加法 2 | PASS with aligned place columns and blank carry cells | PASS if carries and result are empty |
| 妹妹乘法 3 | PASS with equal-group template | PASS if total is not represented by 72 marks |
| 妹妹 mm 4 | PASS with `MEASUREMENT_RELATION`, not a read-off ruler | PASS if 37 mm endpoint is not marked |
| 妹妹乘法 9 | PASS with equal-group containers | PASS if 1224 is not represented |
| 妹妹 mm 10 | PASS with `MEASUREMENT_RELATION`, not a read-off ruler | PASS if 9cm3mm is not displayed |
| 妹妹四位數 61 | PASS with neutral `BAR_MODEL`; operation remains for the learner | PASS if no plus sign, vertical addition, carry, or answer is shown |
| 妹妹百位 62 | PASS with neutral columns | PASS if result or target column is not pre-highlighted |

## Scope anomaly

姐姐 5 uses the word「比」and must not be treated as authorization to add a new ratio/proportion curriculum topic. The question remains a documented scope anomaly until its intended Unit 2 / fraction relation is confirmed. Sprint 43 does not modify the question and does not implement its visual before that confirmation.

## Answer leakage tests for a future implementation

- Remove the visual and confirm the question remains fully answerable from text.
- Show the visual without options and confirm it does not identify a unique option by inspection.
- Replace the answer values in a test fixture; the visual descriptor must remain unchanged unless the changed value is an explicit known condition.
- Verify unknown fields render as blank or neutral, never as zero, a measured endpoint, a group count, or an answer-shaped placeholder.
- Verify no alt text, aria label, `data-*` attribute, or debug label contains the answer.

## Ambiguity stop rules

Move a candidate to `TEXT_ONLY_PREFERRED` when:

- a drawn scale would be needed to make the visual look meaningful;
- the visual needs an unprovided count, length, order, or grouping;
- the same drawing can reasonably be read as two different relations;
- an icon count is likely to be mistaken for the exact quantity;
- a visual would make an option recognizable without applying the intended operation.
