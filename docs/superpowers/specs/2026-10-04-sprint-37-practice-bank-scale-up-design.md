# Sprint 37 Practice Bank Scale-up to 60 per Subject — Design

## Goal

Raise each of the eight existing `student/subject` active practice pools to exactly 60 questions while preserving the existing question, learning-record, review, and monthly-exam architecture.

## Baseline

- Branch source: `sprint36-practice-expansion`
- Baseline HEAD: `6469ce986b24f9f41b2aba5e0e69ebe9a87b881b`
- Active practice: 姐姐 12/18/17/14；妹妹 16/17/17/14
- Target: 60 for each bank, 480 total active practice questions
- Planned additions: 355 singleton questions
- Monthly allowlist: 87, unchanged

Phase 1 scan confirms current bank sizes `21/20/17/16/16/17/17/14`, active sizes `12/18/17/14/16/17/17/14`, no cross-bank ID collisions, and next numeric IDs `22/21/18/17/17/18/18/15` in the matrix order.

## Scope

Only the Human-confirmed first-month-exam ranges are eligible. 姐姐國語 uses 六上第壹、貳單元第 1–6 課；姐姐數學 uses 南一六上第 1–4 單元；姐姐自然 uses 康軒六上第 1–2 單元；姐姐社會 uses 六上前兩單元；妹妹國語 uses 三上第 1–6 課；妹妹數學 uses 南一三上第 1–4 單元；妹妹自然 uses「認識植物」與「空氣和水」；妹妹社會 uses 三上第 1–2 單元。妹妹自然明確排除動物與磁鐵。

## Architecture

- Append original singleton `Question` objects to the existing eight bank modules.
- Keep `practiceQuestions` as the active view and preserve Sprint 36 exclusions.
- Do not add `reviewGroupId`, storage keys, schema fields, migrations, or new dependencies.
- Use stable next-unused numeric IDs after scanning every bank and historical ID.
- Keep monthly eligibility in `lib/first-exam-practice.ts` unchanged at 87 IDs.

## Content and provenance

Questions are original, self-contained practice content. Public sources may inform knowledge points, grade level, common misconceptions, and question shapes; unlicensed pages are never copied verbatim. Each manifest entry records provenance class, source URL/title/access date when research was used, and the reuse basis. No commercial question bank is bulk-reproduced.

## QA contract

Every entry must pass scope, four-option uniqueness, exactly-one-answer, answer/explanation consistency, non-leaking hint, grade-level, completeness, singleton-learning-unit, and near-duplicate checks. Answer positions are balanced when option order can be changed without reducing clarity. A failed candidate is rewritten before implementation; only a genuine unresolved scope, evidence, copyright, or ambiguity issue becomes a Human Exception.

## Gates

Sprint 37 remains `Planning` during Phase 1 and `Implementation Complete / Awaiting Human Acceptance` after all eight active pools reach 60 and final regression passes. It cannot be marked `Completed` before Human Acceptance.
