# Sprint 40 QA validation outcome

## Final Preview recovery — 2026-10-28

- Clerk Development Secret rotation completed with prefix-only evidence: publishable `pk_test_`, Secret `sk_test_`, pairing matched; previous Secret retained.
- Preview env `CLERK_SECRET_KEY` updated and deployment `dpl_S1VAGDDQeQd2B8KcUUwYdxXiVcdB` reached `READY` at `https://2026ast-hosting-preview-kyvpdjf0m-2026-ast.vercel.app`.
- Anonymous runtime smoke passed for `/`, `/jiejie`, `/meimei`, and `/parent` with HTTP `307` Clerk redirects and no `500`. Vercel Authentication remained OFF.
- Authenticated question interaction was not claimed as automated Browser PASS; it is explicitly reserved for Human Acceptance because child credentials were not supplied.

## Human Acceptance — PASS

- Owner acceptance passed for Sprint 40 questions, 10-question spot check, 妹妹第一次月考練習, linda role authorization, anonymous → Clerk, and Preview runtime.
- Human Exception: `0`.

## Passed

- Focused Sprint 40 QA: `3/3`。
- Full Node suite: `256/256`。
- `npm run lint`: PASS。
- `npx tsc --noEmit --incremental false`: PASS。
- `git diff --check`: PASS。
- `npx next build --webpack`: PASS；40/40 static pages generated。
- Static Auth preflight: `@clerk/nextjs` present; root `proxy.ts`／`clerkMiddleware` present; parent／jiejie／meimei role guard and route authorization focused tests `28/28` PASS。

## Build and Browser recovery evidence

- `npm run build`: Next.js `16.3.5` defaulted to Turbopack and reproduced the `app/globals.css` child-process panic. Sprint 40 did not modify CSS, PostCSS, Tailwind, Next config, build tooling, or dependencies.
- `npx next build --help` explicitly supports `--webpack`; `npx next build --webpack` passed in the complete-permission/network environment, including TypeScript and `40/40` static pages. This is recorded as `Turbopack FAIL (known tooling/environment panic)` and `Webpack production build PASS`; the build script was not changed.
- The pre-rotation Preview env pull found an empty branch Secret; the Owner-approved Development Secret rotation repaired it. Post-rotation Vercel metadata shows both required Preview variables present/configured, and the new Preview runtime passed the anonymous Clerk contract.
- The earlier local production-server `HTTP 500` smoke was caused by the pre-rotation empty local Secret and is historical only; Preview deployment and runtime smoke now pass. Authenticated child-question interaction remains Human Acceptance because child credentials were not supplied.

## Deployment decision

Deployment to `2026ast-hosting-preview` completed as Preview `dpl_S1VAGDDQeQd2B8KcUUwYdxXiVcdB`; `--prod` and `2026ast-production` were not used. Human Acceptance is complete; next step is waiting for Owner direction and no new Sprint starts automatically.
