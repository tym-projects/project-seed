# Sprint 40 QA validation outcome

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
- Preview env pull used the supported `--environment preview --git-branch codex/sprint38-practice-bank-expansion` syntax. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is present; `CLERK_SECRET_KEY` is present by name but resolves to an empty value for this branch, so Preview Env Gate is FAIL／blocked.
- Because the Preview Env Gate failed, Browser regression was not rerun and deployment was not attempted. A production server smoke using the empty Clerk secret returned HTTP `500` for `/`, `/jiejie`, `/meimei`, and `/parent`; no Browser PASS is claimed.

## Deployment decision

Deployment to `2026ast-hosting-preview` was not performed. `--prod` and `2026ast-production` were not used. Human Environment Gate remains required: provide a non-empty Preview `CLERK_SECRET_KEY` for the current branch, then rerun production Browser regression and the final gates.
