# Sprint 43 Mathematics Visual Aid Audit

## Baseline

| Bank | Active questions | Monthly allowlist | Learner treatment |
|---|---:|---:|---|
| 姐姐數學 | 150 | 18 | structural, relationship-first |
| 妹妹數學 | 150 | 26 | concrete, countable, unit-first |
| **Total** | **300** | **44** | no allowlist change |

The current question object remains the only production source. This audit proposes no content or schema mutation.

## Disposition definitions

- `HIGHLY_RECOMMENDED`: the intended relation is spatial, grouped, partitioned, or unit-based and a faithful diagram is likely to reduce cognitive load without revealing the answer.
- `USEFUL`: a visual may support comprehension, but text and arithmetic remain primary.
- `OPTIONAL`: a visual could help some learners, but the fidelity or maintenance benefit is modest.
- `TEXT_ONLY_PREFERRED`: text is more precise, the visual would duplicate arithmetic, or any plausible visual risks leaking the answer.

## Planned first-pass distribution

These are design targets for the 300-question audit, not implementation counts:

| Disposition | 姐姐 | 妹妹 | Total | Rationale |
|---|---:|---:|---:|---|
| HIGHLY_RECOMMENDED | 24 | 32 | 56 | structural relations, grouping, units, or explicit geometric relations |
| USEFUL | 36 | 42 | 78 | concrete context or multi-step relation with safe unknowns |
| OPTIONAL | 22 | 18 | 40 | possible aid, but text remains sufficient |
| TEXT_ONLY_PREFERRED | 68 | 58 | 126 | pure symbolic computation, answer-sensitive scale, or ambiguity risk |
| **Total** | **150** | **150** | **300** | |

## Planned visual-type distribution

| Visual type | 姐姐 | 妹妹 | Total |
|---|---:|---:|---:|
| `FRACTION_PART_BAR` | 10 | 0 | 10 |
| `DECIMAL_MEASURE_SEGMENTS` | 12 | 0 | 12 |
| `CIRCLE_RADIUS_DIAMETER` | 12 | 0 | 12 |
| `RECTANGLE_DIMENSIONS` | 10 | 0 | 10 |
| `RATIO_PARTS` | 8 | 0 | 8 |
| `GROUPING_ARRAY` | 8 | 18 | 26 |
| `PLACE_VALUE_COLUMNS` | 0 | 18 | 18 |
| `UNIT_RULER` | 0 | 12 | 12 |
| `TEXT_ONLY` / no visual | 90 | 102 | 192 |
| **Total** | **150** | **150** | **300** |

The counts are planned audit buckets. A question may move to `TEXT_ONLY_PREFERRED` after fidelity or leakage review; the final classification must follow the row-level audit, not the target table.

## Monthly treatment

The 44 current monthly questions are audited with the same criteria but remain in their existing explicit allowlist. A visual proposal never admits or removes a question from Monthly practice.

## Scope observations

- 姐姐: strongest candidates are fraction partitioning, decimal measurement, circle radius/diameter, rectangle area-versus-perimeter, ratio parts, and multi-step grouping.
- 妹妹: strongest candidates are place-value columns, four-digit addition/subtraction with regrouping, multiplication arrays, equal grouping, and mm/cm conversion.
- Pure calculation items with no meaningful spatial or unit relation should normally remain text-only.
