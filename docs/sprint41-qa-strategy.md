# Sprint 41 QA / Duplicate Strategy

Status: **Design Review Gate**. No Sprint 41 question content is included here.

## Required checks

1. Count closure: each `practiceQuestions` export reaches exactly 100; total reaches 800.
2. ID uniqueness: no duplicate IDs within a bank or across all eight banks.
3. Options and answer: exactly four distinct options, one unique correct option, valid `answer`/`answerIndex`, and no answer mismatch with explanation.
4. Scope: every question topic/stem/explanation matches the confirmed first-month-exam range; 妹妹自然 rejects `動物` and `磁鐵`.
5. Learning units: new questions are singleton unless an explicit approved group is recorded; no accidental grouping.
6. Grade level: wording, arithmetic size, vocabulary, distractors, and explanation are suitable for the existing student/course scope.
7. Hint leakage: hints guide the method or clue without naming the answer or reproducing a distinctive option.
8. Explanation consistency: explanation resolves the stem and correct option, including calculations and causal claims.
9. Duplicate/near-duplicate: compare normalized question stems, options, answer text, hints, explanations, and topic/form combinations against the full existing banks and all Sprint 41 candidates.
10. Monthly isolation: only `approved` IDs enter the allowlist; `defer` and `eligible-review` remain out.

## Near-duplicate normalization

The focused test should normalize Unicode whitespace and punctuation, remove harmless spacing differences, compare traditional text without changing meaning, and flag high-overlap stems/options. Numeric or name-only substitutions are not sufficient evidence of originality; those candidates require a different concept, operation, misconception, or context and a documented rationale.

## Evidence outputs

- focused test result and per-bank counts;
- manifest QA disposition summary;
- scope and provenance audit;
- monthly allowlist before/after;
- full test, lint, TypeScript, build, Browser, auth preflight, and diff-check evidence after implementation.

