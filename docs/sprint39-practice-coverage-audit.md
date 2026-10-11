# Sprint 39 Practice and Monthly Question Bank Coverage Audit

## Scope

- Repository baseline: Sprint 38 final HEAD `3ab84c411bf1ac2ca1b949aee0ef10a9c1171f92`.
- Confirmed first-month scope only: the eight existing student／subject banks already exposed by the explicit allowlist.
- 姐姐國語 and 妹妹自然 remain limited to their already confirmed ranges; no unconfirmed range was introduced.
- All 40 additions are fully original singleton questions. No licensed text was reproduced, and no Learning Record／ReviewSession／Auth／Production behavior was changed.

## Audit result

Before implementation, all eight active practice banks were `70`. Monthly allowlist counts were uneven (`13/18/17/15/17/15/17/15`). The selected gap-sized monthly expansion brings every bank to `18` eligible questions.

| Bank | Questions | Learning units | Active | Monthly | Answer indexes |
| --- | ---: | ---: | ---: | ---: | --- |
| 姐姐國語 | 84 | 82 | 75 | 18 | 20/19/18/18 |
| 姐姐數學 | 77 | 77 | 75 | 18 | 20/20/18/17 |
| 姐姐自然 | 75 | 75 | 75 | 18 | 20/21/19/15 |
| 姐姐社會 | 77 | 77 | 75 | 18 | 17/20/20/18 |
| 妹妹國語 | 75 | 72 | 75 | 18 | 23/20/17/15 |
| 妹妹數學 | 75 | 75 | 75 | 18 | 19/22/19/15 |
| 妹妹自然 | 75 | 75 | 75 | 18 | 18/18/21/18 |
| 妹妹社會 | 75 | 75 | 75 | 18 | 20/22/16/17 |
| **Total** | **613** | **608** | **600** | **144** | — |

## Addition plan and disposition

- Added five practice questions to each of the eight banks: `40` total.
- Added `17` of those questions to the monthly allowlist, sized to close the per-bank gap to `18`; 姐姐數學 already had `18` and received no new monthly entry.
- 妹妹自然 additions remain restricted to `認識植物` and `空氣和水`; forbidden `動物` and `磁鐵` concepts remain absent.
- Existing normalized duplicate baseline remains unchanged outside this batch; Sprint 39 additions have no normalized question-stem collision with the full bank.

## Verification

- Sprint 39 focused QA: `4/4`.
- Full Node suite: `225/225`.
- `npm run lint`: PASS.
- `npx tsc --noEmit --incremental false`: PASS.
- `npm run build`: PASS; 39 static routes generated.
- Disposable Browser regression: `45/45`.
- `git diff --check`: PASS before commit.
- Commit/push: `3321edd` pushed; branch ahead/behind `0/0`.
- Preview deployment: `dpl_QR4Uxkc2rhvP3Vc6vWEyPHXD3f3N` is `READY` at `https://2026ast-hosting-preview-qefelgp01-2026-ast.vercel.app/`. Vercel Authentication is disabled; Preview routes proceed to Clerk. Production remains Deferred.

## Closeout

Sprint 39 is **Completed** after Human online / tablet acceptance PASS. All 40 additions are implemented; Deferred and Human Exception are `0`. The accepted release HEAD is `6d2f35d49e0712d34d21e55154e5cd5dfda94a10`. Learning Record compatibility, Auth, and Production remain unchanged.
