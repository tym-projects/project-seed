# Sprint 42 Flexible Application Practice — Design

## Intent

Add 50 new Active Practice questions to each existing 姐姐／妹妹 × 國語／數學／自然／社會 bank, raising every bank from 100 to 150 and the total Active Practice count from 800 to 1200. The questions should be slightly more difficult and flexible through application, multi-step reasoning-like construction, information transformation, error diagnosis, comparison, causality, and short-text/data interpretation.

## Goals

- Add exactly 400 original singleton questions without changing the existing Question schema or difficulty enum.
- Stay within each bank's confirmed first-month-exam scope; 妹妹自然 excludes animals and magnets.
- Keep Monthly allowlist at 170; every Sprint 42 addition is deferred unless separately approved.
- Preserve Learning Record, ReviewSession, Backup/Restore, retry, 1/3/7, Auth, role authorization, and Production behavior.
- Validate unique IDs, four distinct options, one correct answer, answer index, explanation/hint quality, grade level, scope, duplicate/near-duplicate risk, and learning-unit counts.

## Non-goals and anti-goals

- No schema, enum, storage, selection, scheduling, auth, UI architecture, or Production changes.
- Do not create difficulty fields or infer a new difficulty model.
- Do not produce number/name-only variants or automatically add questions to the monthly exam bank.

## Approach

Use the established `sprint41-question-additions.ts` adapter pattern, extended as `sprint42-question-additions.ts`, with explicit per-bank authored rows and singleton IDs. This is the lowest-risk approach because the eight existing bank modules already append additions through that adapter and the shared QuestionCard flow consumes the same schema. A separate question file per bank would improve file size but would duplicate the established wiring; changing the schema or question engine would add risk without helping this content-only sprint.

## QA and release gates

The Sprint 42 focused test will assert exact eight-bank counts, 400 additions, singleton learning units, four unique options, valid answer indices, answer/explanation consistency checks, scope exclusions, basic/application distribution, answer-index distribution, normalized and near-duplicate checks against all active questions, and unchanged monthly allowlist. After focused QA, run the repository's full Node tests, lint, TypeScript, Webpack build, Browser regression, diff-check, Auth Deployment Preflight, Preview deployment and anonymous route smoke. The final status may be Implementation Complete / Awaiting Human Acceptance only.

