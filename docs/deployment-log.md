# Deployment Log

## Sprint 42 deployment gate — 2026-10-29

- No new deployment created. The required Browser gate returned `4 passed / 4 skipped / 45 failed` because local authenticated Browser flows had no Clerk credentials.
- Existing Preview anonymous smoke still returns HTTP `307` for `/`, `/jiejie`, `/meimei`, and `/parent`; no HTTP `500` observed.
- Auth source preflight passed (`@clerk/nextjs`, `proxy.ts`, role tests); Vercel CLI is unavailable locally, so Preview env metadata was not independently queried.
- Production and `2026ast-production` were not used or modified. Next step is credentialed Browser regression followed by Preview-only deployment.

## Sprint 41 Preview closeout — 2026-10-29

- Sprint 41 Human Acceptance is complete; the existing Preview deployment `dpl_9bQLWRDDy79t2Nk2PGkeHmRYbBqh` remains the accepted runtime evidence.
- URL: `https://2026ast-hosting-preview-qqqp4i6uu-2026-ast.vercel.app/`; status `READY`; Vercel Authentication remains OFF.
- Anonymous `/`, `/jiejie`, `/meimei`, and `/parent` smoke returned Clerk HTTP `307`; no HTTP `500` was observed.
- No Production deployment was created and `2026ast-production` was not modified.

## Post-Sprint 39 Auth Regression Remediation — 2026-10-11

- Project: `2026ast-hosting-preview` (Vercel Preview only); deployment `dpl_8eUJuT6BXxwP5jdx7f3771xTQRwh`; status `READY`.
- Current family URL: `https://2026ast-hosting-preview-gd6yctj5a-2026-ast.vercel.app/`.
- Root cause: a Preview branch omitted `proxy.ts`, `@clerk/nextjs`, and parent／jiejie／meimei role guards. The deployment therefore succeeded while the application was not protected.
- Remediation: `f0efa4c` restored Clerk middleware / proxy, all protected route handling, and role guards; `097d86b` is the final verified auth baseline.
- Verification: focused auth `28/28`, Node `253/253`, lint, TypeScript, build, diff-check, anonymous fail-closed routes, and Human Authentication Review for anonymous／yenmin／ariel／linda all PASS.
- Vercel Authentication: `OFF`. The enforced family path is Internet → Vercel Preview → Clerk → role authorization. Production was not used and remains Deferred.
- The earlier unprotected Preview `https://2026ast-hosting-preview-qefelgp01-2026-ast.vercel.app/` is retained only as historical evidence and is **Superseded / Do Not Use**.

## Sprint 37 Preview — 2026-10-04

- Project: `2026ast-hosting-preview`
- Team: `2026-ast`
- Project ID: `prj_EXcWjKE7Q4RFFDyokLBqZSKkDuQh`
- Environment: Vercel Preview
- Source branch: `codex/sprint37-practice-bank-scale-up`
- Source commit: `3879fb45471170c61fc0ac35cdebbdcecafcbbd6`
- Deployment ID: `dpl_BtJVhswTFpHREHtaNs7SnB4VvALX`
- Status: `READY`
- URL: `https://2026ast-hosting-preview-hdpe67kx4-2026-ast.vercel.app`
- Previous known-good deployment retained: `dpl_4CcR38yoiyzpT6ftLLWxwEoP3X7M` (`https://2026ast-hosting-preview-67brvrvab-2026-ast.vercel.app`)
- Production policy: `2026ast-production` was not used; Production remains Deferred.
- Preview Clerk Development variables were preserved; no Auth, role, or source configuration was changed.
- Authenticated route smoke: HTTP 200 for home, parent, student entries, eight subject practice routes, and monthly routes.
- Browser subject smoke: eight of eight routes loaded a question, accepted an answer, displayed result feedback, and advanced to the next question.
- Local source verification at the deployed commit: Active Practice `60 × 8 = 480`, total questions `493`, learning units `488`, Monthly allowlist `87`.
- Login／role account smoke: not independently executed in this session because no credentials were entered; this is recorded as an unverified item, not a PASS claim.

## Question Bank Auto-Deploy Rule

Pure question-bank changes may be deployed automatically to `2026ast-hosting-preview` after all required focused／scope／duplicate／unique-answer／option／answerIndex checks, Node tests, lint, TypeScript, build, Browser regression, diff-check, commit, push, and Preview route smoke pass. This rule does not apply to Learning Record, ReviewSession, Backup/Restore, retry／1/3/7, Auth／Clerk／role authorization, migrations, major UI architecture, personal-data risk, or Production hosting changes; those remain Human Review Gates. `--prod` and `2026ast-production` are prohibited unless separately approved.
