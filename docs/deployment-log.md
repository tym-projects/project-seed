# Deployment Log

## Sprint 43 + Sprint 44 Production release — 2026-10-31

- Project: `2026ast-production`; deployment ID: `dpl_J3PF2nXL39KEGN5NQvx7FrpDPpyU`; target: Production; status: **READY**.
- Source: exact `main` HEAD `fe3eb153f6edd336cc8b76016c7d656613e36957`; `main` and `origin/main` synchronized.
- Framework: **Next.js**; canonical URL: `https://2026ast-production.vercel.app/`.
- Sprint 43 evidence: 81 math visual mappings, unique `81`, renderer-valid `81/81`, representative set `16/16` preserved.
- Sprint 44 evidence: 妹妹自然 Active `186`, original `150` preserved, new `36`, Plants / Air-Water `18 / 18`, basic / application `12 / 24`, answer distribution `9 / 9 / 9 / 9`, Monthly `28`, new Monthly membership `0/36`.
- Runtime smoke: canonical `/`, `/jiejie`, `/meimei`, and `/parent` entered the Clerk authentication boundary; no 404/500. Static asset smoke passed.
- Owner Production Human Review: **ALL PASS**. Sprint 43 and Sprint 44 are **COMPLETED / CLOSED**.
- Final regression: `297/297 PASS`; lint, TypeScript, Webpack, and `git diff --check` **PASS**.
- Next Step: **等待 Owner / ChatGPT 規劃下一階段；不得自行啟動下一個 Sprint。**
- No Clerk secret, publishable key value, or other environment value is recorded here.

### Production Lessons Learned — Sprint 43 + Sprint 44

- Incident chain: **Other Framework / null → output empty and canonical routes 404 → Framework Preset corrected to Next.js → Production Clerk env missing → canonical routes HTTP 500 → env repaired and redeployed → Production smoke PASS**.
- Production Deployment Gate must verify project identity, Framework Preset, Root Directory, Build／Output settings, non-empty routes／middleware, and required Clerk env names／scope before release. Secret values must never be recorded.
- Canonical smoke uses `https://2026ast-production.vercel.app/` and checks `/`, `/jiejie`, `/meimei`, `/parent`, static assets and Clerk authentication boundary. Generated deployment URL SSO 302 is not alone a failure.
- Formal Production release evidence: `dpl_J3PF2nXL39KEGN5NQvx7FrpDPpyU`; Owner Production Human Review: **ALL PASS**.
- Historical deployment `dpl_6PVMjuJUVRD2yQNexyfcHqzwVpow`: **FAILED PRODUCTION SMOKE / SUPERSEDED**，因 missing Clerk env and HTTP 500；not a formal release。

## Sprint 42 Preview deployment — 2026-10-29

- Source branch: `codex/sprint38-practice-bank-expansion`; source HEAD: `f2bd949aa8b9846682bd4afc23188b6cef12e890`.
- One-time Vercel CLI `57.0.0` account: `tsengym2026-4854`; team: `2026-ast`; linked existing project: `2026ast-hosting-preview`; no new project and no Git Integration changes.
- Deployment ID: `dpl_8izpHbQ5thwzcNBwn6AhpcFpb7CB`; target: Preview; status: READY; URL: `https://2026ast-hosting-preview-avp3b396b-2026-ast.vercel.app`.
- Anonymous runtime smoke: `/`, `/jiejie`, `/meimei`, `/parent` all returned Clerk HTTP `307`; no HTTP `500`. Vercel Authentication remains OFF; authenticated Browser remains Human-only.
- Sprint 42 source/content evidence: eight banks `150` each, Active Practice `1200`, total questions `1213`, learning units `1208`, Monthly allowlist `170`; focused QA `5/5` passed. Full Browser remains `4 passed / 4 skipped / 45 failed` because child credentials were not supplied.
- Owner Human Acceptance passed the 16 requested samples, 姐姐／妹妹 role boundaries, and anonymous Clerk protection; Human Exception `0`. The Sprint 42 closeout is now complete. Production and `2026ast-production` were not used or modified.

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
