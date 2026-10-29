# Sprint 42 QA Validation Outcome

Status: **Completed after Human Acceptance**.

## Focused QA

- Five focused tests passed: exact count, singleton/option/answer integrity, application-heavy coverage and answer distribution, duplicate/near-duplicate and scope checks, and manifest/monthly isolation.
- Active Practice: eight banks × `150` = `1200`; Sprint 42 additions: `400`; each addition is a singleton learning unit.
- Monthly allowlist remains exactly `170`; no Sprint 42 ID is included.
- 妹妹自然 additions remain restricted to existing plants and air/water scope; animal and magnet terms are rejected.
- Full Node `267/267`, lint, TypeScript, Webpack build `40/40`, Auth source/role regression and diff-check passed.
- Fresh verification reproduced the known standard `npm run build` Turbopack `globals.css` child-process panic; the explicit `npx next build --webpack` path completed with 40/40 static pages and exit code 0. No build script, CSS, dependency, or tooling change was made.
- Full Browser regression is `4 passed / 4 skipped / 45 failed`; the failures are authenticated flows blocked by absent local Clerk credentials. Automated anonymous/auth regression passed; authenticated student interaction is classified Human-only, not a Sprint 42 application regression.

## Remaining release evidence

Auth source preflight passed. One-time Vercel CLI `57.0.0` linked the existing `2026ast-hosting-preview` project and created `dpl_8izpHbQ5thwzcNBwn6AhpcFpb7CB`, target Preview, READY at `https://2026ast-hosting-preview-avp3b396b-2026-ast.vercel.app`. Anonymous `/`, `/jiejie`, `/meimei`, `/parent` each returned Clerk `307` with no `500`. Owner Human Acceptance passed the 16 requested samples, 姐姐／妹妹 role boundaries, and anonymous Clerk protection; Human Exception `0`. Production and `2026ast-production` were not modified.
