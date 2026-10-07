# Sprint 38 QA and Validation Outcome

Status: **Completed** after Human tablet / online acceptance PASS.

## Content and safety outcome

- Candidates implemented: `80/80`; Deferred `0`; Rejected `0`; Human Exception `0`.
- Active Practice: eight banks at `70`, total `560`.
- Monthly allowlist: `87 → 127`, with five new in-scope items per bank.
- Inventory: Total questions `493 → 573`; learning units `488 → 568`.
- The 80 new items have answerIndex distribution `21 / 21 / 19 / 19` for indices `0 / 1 / 2 / 3`.
- All new content is original. Existing excluded questions remain excluded.
- Learning Record, ReviewSession, Backup/Restore, retry, 1/3/7 scheduling, Auth and Production were not changed.

## Validation outcome

- Sprint 38 focused QA: `5/5` PASS.
- Scope, duplicate, unique-answer and option validation: PASS.
- Full Node suite: `221/221` PASS.
- Lint, TypeScript, production build, Browser regression `45/45`, and `git diff --check`: PASS.

## Acceptance and deployment

Human acceptance passed for 16 cross-subject samples, general practice, first monthly-exam practice, and yenmin / ariel / linda role flows. The accepted Preview deployment is `dpl_31EMD566uLxSduwuaMVToY4FKM3w` at `https://2026ast-hosting-preview-ty5kcu0d1-2026-ast.vercel.app/`, built from `17f15c5d96ff152a92bc508e4740d43d1eb29747`. The prior Preview deployment is retained for rollback; Production is Deferred and was not changed.
