# Sprint 41 QA Validation Outcome

Status: **Implementation Complete / Awaiting Human Acceptance**. Not Completed.

## Counts

| Bank | Before | Added | Final Active | Monthly |
|---|---:|---:|---:|---:|
| 姐姐／國語 | 75 | 25 | 100 | 18 |
| 姐姐／數學 | 75 | 25 | 100 | 18 |
| 姐姐／自然 | 75 | 25 | 100 | 18 |
| 姐姐／社會 | 75 | 25 | 100 | 18 |
| 妹妹／國語 | 83 | 17 | 100 | 26 |
| 妹妹／數學 | 83 | 17 | 100 | 26 |
| 妹妹／自然 | 85 | 15 | 100 | 28 |
| 妹妹／社會 | 75 | 25 | 100 | 18 |
| **Total** | **626** | **174** | **800** | **170** |

Inventory: total questions `639 → 813`; learning units `634 → 808`.

Sprint 41 additions: `basic/application = 44/130`; answerIndex `0/1/2/3 = 46/42/44/42`.

## QA evidence

- Sprint 41 focused QA: `6/6 PASS`.
- Manifest completeness: PASS; eight banks, 174 planned/implemented IDs, all `ready`, singleton, monthly `defer`.
- Scope QA: PASS; 妹妹自然 contains no `動物` or `磁鐵`.
- Duplicate/near-duplicate QA: PASS for normalized stem duplicates; no exact normalized duplicate across the 174 additions.
- Unique-answer/options/answerIndex QA: PASS.
- Monthly isolation: PASS; allowlist unchanged at `170` and no Sprint 41 additions auto-added.
- Full Node tests: `262/262 PASS`.
- Lint: PASS.
- TypeScript `npx tsc --noEmit --incremental false`: PASS.
- Webpack production build: PASS; 40/40 static pages generated. The known Turbopack `app/globals.css` panic remains unchanged and the build script was not modified.
- `git diff --check`: pending final closeout run after documentation update.

## Browser and Auth

- Browser regression: BLOCKED locally before route assertions because the Playwright WebServer reports Clerk `Missing secretKey`.
- Local diagnostic: `CLERK_SECRET_KEY` is present but only two characters long; no secret value was output or recorded. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured.
- Auth structure preflight: Clerk dependency, root `proxy.ts`/Clerk middleware, role guards, and auth/role tests passed. Preview environment metadata and anonymous Preview route smoke were not re-verified in this session.
- Deployment: not performed because Browser regression and complete Preview Auth preflight are not PASS.

## Safety boundaries

- Learning Record, ReviewSession, Backup/Restore, retry, 1/3/7, Auth source, and schema were not intentionally modified.
- Production and `2026ast-production` were not touched.

## Human acceptance request

After the Clerk environment blocker is repaired, re-run Browser/Auth gates and deploy only the existing `2026ast-hosting-preview`. Then request Human Acceptance with 16 spot checks: eight banks × two questions, preferring one application and one reasoning/comprehension item per bank.
