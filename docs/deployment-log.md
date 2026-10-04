# Deployment Log

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
