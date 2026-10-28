# Sprint 40 QA validation outcome

## Passed

- Focused Sprint 40 QA: `3/3`。
- Full Node suite: `256/256`。
- `npm run lint`: PASS。
- `npx tsc --noEmit --incremental false`: PASS。
- `git diff --check`: PASS。
- Static Auth preflight: `@clerk/nextjs` present; root `proxy.ts`／`clerkMiddleware` present; parent／jiejie／meimei role guard and route authorization tests included in the passing Node suite。

## Build and Browser recovery evidence

- `npm run build`: Next.js `16.3.5` defaulted to Turbopack and reproduced the `app/globals.css` child-process panic. Sprint 40 did not modify CSS, PostCSS, Tailwind, Next config, build tooling, or dependencies.
- `npx next build --help` explicitly supports `--webpack`; `npx next build --webpack` passed in the complete-permission/network environment, including TypeScript and `40/40` static pages. This is recorded as `Turbopack FAIL (known tooling/environment panic)` and `Webpack production build PASS`; the build script was not changed.
- Production server was started from the webpack build on isolated port `3103` and reported ready. Browser regression ran against that server: `53` total, `1` passed, `4` skipped (credential injection), `48` failed. Shared root cause was missing local Clerk keys; server logs showed `@clerk/nextjs: Clerk keys are missing from your environment`, and HTTP/browser responses were `500` rather than Clerk redirects.
- Preview Auth environment existence was not confirmed: Vercel CLI was not installed and `npx vercel@latest env ls preview` did not complete. No secret value was read or logged.

## Deployment decision

Deployment to `2026ast-hosting-preview` was not performed. `--prod` and `2026ast-production` were not used.
