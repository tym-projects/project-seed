# Hosting Authentication Design — Phase 1B

## Scope

This isolated branch adds the Clerk integration boundary only. The Clerk Development instance, Vercel Preview project, and three Development test users now exist outside the repository. This branch does not configure Clerk Production, launch Production, migrate Learning Record data, or implement Role Authorization.

## Architecture

- `@clerk/nextjs` provides `ClerkProvider`, prebuilt sign-in UI, and session handling.
- `app/layout.tsx` places `ClerkProvider` inside `<body>` and renders minimal signed-in/signed-out controls.
- Root `proxy.ts` uses `clerkMiddleware()` and applies an explicit route policy: public Clerk/sign-in/static paths pass through, authenticated requests pass through, and signed-out application requests redirect to Clerk sign-in.
- `app/sign-in/[[...sign-in]]/page.tsx` uses Clerk's prebuilt `<SignIn withSignUp={false} />`.
- Metadata sets `robots.index=false` and `robots.follow=false`; this is not an access-control mechanism.

## Route protection matrix

| Route family | Classification | Rule |
| --- | --- | --- |
| `/sign-in/**` | Public | Required to establish a session |
| `/__clerk/**` | Public handshake | Required Clerk frontend handshake |
| `/_next/**`, static assets | Static/Internal | Excluded by proxy matcher |
| `/` | Auth Required | Signed-out requests redirect to Clerk sign-in |
| `/parent` | Auth Required | Signed-out requests redirect to Clerk sign-in |
| `/jiejie/**` | Auth Required | Signed-out requests redirect to Clerk sign-in |
| `/meimei/**` | Auth Required | Signed-out requests redirect to Clerk sign-in |
| practice/review/reinforce/exam routes | Auth Required | Covered by the student route families |

The proxy does not use `auth.protect()` or `createRouteMatcher`; the explicit policy preserves the request URL as `returnBackUrl` for sign-in redirects.

## Account model and access mode

V1 has authentication only, not authorization. The original design names were `parent`, `jiejie`, and `meimei`; they are historical planning names, not the current Clerk Development usernames. The actual Development users are `yenmin`, `ariel`, and `linda`. All three authenticated Development users intentionally share whole-site access until a later authorization design.

The final Clerk Development dashboard state is: username/password login retained, Google login off, public sign-up off, and Access mode Invite-only. The Development users `yenmin`, `ariel`, and `linda` are retained. This is an Authentication-only V1; the code does not pretend to configure Dashboard state.

The current Development test-user inventory contains the three Human-tested accounts: `yenmin`, `ariel`, and `linda`. Human Preview login has passed for all three. V1 currently provides Authentication only: all authenticated users share whole-site access until a later authorization phase.

Final Human Authentication Gate status: correct login for all three accounts, `yenmin` Parent mode access, logout protection on `/parent`, and one wrong-password rejection all passed. Google login is off, public sign-up is off, and Clerk Access mode is Invite-only.

Each account uses a unique username and password. Password recovery remains Human-managed in Clerk Dashboard. No credential, verification code, key, or token is recorded here.

## Learning Record boundary

Clerk identity is intentionally separate from the existing browser storage identity. Learning Records, ReviewSession, Parent Center, Backup/Restore, and all existing learning semantics remain browser-side and unchanged. Clerk user IDs are not written into Learning Records. On a new cloud origin, the approved one-time flow remains: export from 3100, sign in to the cloud origin, import, verify Parent Center, then keep using the cloud origin.

## Session and UX

Clerk Hobby's fixed seven-day session lifetime is an explicit family UX trade-off. A tablet may require password entry again after expiry. The prebuilt UI is retained to minimize custom authentication risk; Clerk branding and exact recovery UI remain Dashboard/product configuration decisions.

## Secrets

`.env.example` contains placeholders only. Real `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be supplied through local `.env.local` or Vercel Environment Variables. `.env*` is ignored by Git. No secret is required for static/config tests; real sign-in E2E is an environment gate.

## Preview and Production

- Clerk Development instance and development keys: Preview only.
- Clerk Production instance and production keys: Vercel production only.
- Users and sessions are not assumed to transfer between instances.
- The current Vercel Preview project is `2026ast-hosting-preview`; the latest verified Preview is READY at `https://2026ast-hosting-preview-k81jmt0k8-2026-ast.vercel.app`.
- Vercel Deployment Protection currently requires Vercel Authentication. One Protection Exception lists the older Preview domain `2026ast-hosting-preview-3v4b7jef5-2026-ast.vercel.app`; it is a cleanup DELETE CANDIDATE. No Sharable Link was listed. One automation-bypass metadata entry exists and is a cleanup REVOKE CANDIDATE; its value is intentionally not recorded.
- The Production placeholder and older Preview deployments remain and require a separate cleanup review. No deployment or bypass resource was deleted or revoked in this closeout.

## Open decisions

1. Keep the documented Development recovery policy aligned with the Clerk Dashboard.
2. Decide whether the seven-day Hobby session is acceptable.
3. Add real-key Preview E2E before production deployment.
4. Complete the independent Role Authorization phase after Hosting/Auth closeout, using TDD:
   - `yenmin`: all content and Parent mode.
   - `ariel`: 姐姐 home and related features only; no 妹妹 entry and no Parent mode.
   - `linda`: 妹妹 home and related features only; no 姐姐 entry and no Parent mode.
   This backlog item is intentionally not implemented in the Hosting/Auth branch.
