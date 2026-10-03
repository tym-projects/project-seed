# Hosting Authentication and Role Authorization — Final Closeout

## Scope

This branch contains the Clerk integration and completed Role Authorization boundary. The Clerk Development instance, Vercel Preview project, and three Development test users exist outside the repository. Clerk Production, Production launch, and Learning Record migration remain out of scope.

## Architecture

- `@clerk/nextjs` provides `ClerkProvider`, prebuilt sign-in UI, and session handling.
- `app/layout.tsx` places `ClerkProvider` inside `<body>` and renders minimal signed-in/signed-out controls.
- Root `proxy.ts` uses `clerkMiddleware()` and applies an explicit route policy: public Clerk/sign-in/static paths pass through, authenticated requests pass through, and signed-out application requests redirect to Clerk sign-in.
- `app/sign-in/[[...sign-in]]/page.tsx` uses Clerk's prebuilt `<SignIn withSignUp={false} />`.
- `publicMetadata.role` is copied into the Clerk session custom claim `metadata`; the application accepts only `parent`, `jiejie`, or `meimei`.
- `lib/role-authorization-policy.ts` is the single source of truth for parsing roles, route decisions, home routes, and fail-closed handling.
- Proxy enforcement, server layout guards, and role-aware home/navigation all consume the shared policy. Missing or invalid roles fail closed to `/access-denied`.
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

## Account model, access mode, and authorization

The application uses three roles: `parent`, `jiejie`, and `meimei`. Development account mapping is configured through Clerk public metadata, not username- or user-ID-based authorization: `yenmin` → `parent`, `ariel` → `jiejie`, and `linda` → `meimei`.

The final Clerk Development dashboard state is: username/password login retained, Google login off, public sign-up off, and Access mode Invite-only. The Development users `yenmin`, `ariel`, and `linda` are retained. The code does not pretend to configure Dashboard state; role metadata and session claims were configured and Human-verified separately.

The current Development test-user inventory contains the three Human-tested accounts: `yenmin`, `ariel`, and `linda`. Human Preview login and role authorization have passed for all three.

Final Human Authentication Gate status: correct login for all three accounts, `yenmin` Parent mode access, logout protection on `/parent`, and one wrong-password rejection all passed. Google login is off, public sign-up is off, and Clerk Access mode is Invite-only.

Each account uses a unique username and password. Password recovery remains Human-managed in Clerk Dashboard. No credential, verification code, key, or token is recorded here.

## Learning Record boundary

Clerk identity and role are intentionally separate from the existing browser storage identity. Learning Records, ReviewSession, Parent Center, Backup/Restore, and all existing learning semantics remain browser-side and unchanged. Clerk user IDs and roles are not written into Learning Records. The storage key remains `project-seed:learning-records:v1`; same-origin/profile localStorage is not account-isolated storage.

## Session and UX

Clerk Hobby's fixed seven-day session lifetime is an explicit family UX trade-off. A tablet may require password entry again after expiry. The prebuilt UI is retained to minimize custom authentication risk; Clerk branding and exact recovery UI remain Dashboard/product configuration decisions.

## Secrets

`.env.example` contains placeholders only. Real `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must be supplied through local `.env.local` or Vercel Environment Variables. `.env*` is ignored by Git. No secret is required for static/config tests; real sign-in E2E is an environment gate.

## Preview and Production

- Clerk Development instance and development keys: Preview only.
- Clerk Production instance and production keys: Vercel production only.
- Users and sessions are not assumed to transfer between instances.
- The current Vercel Preview project is `2026ast-hosting-preview`; the Human-verified Role Authorization Preview is deployment `dpl_4CcR38yoiyzpT6ftLLWxwEoP3X7M`, READY at `https://2026ast-hosting-preview-67brvrvab-2026-ast.vercel.app`.
- The earlier Hosting/Auth Preview `AiUo9PyK3` remains available as a rollback candidate. No Preview was deleted in this closeout.

## Open decisions

1. Keep the documented Development recovery policy aligned with the Clerk Dashboard.
2. Decide whether the seven-day Hobby session is acceptable.
3. Production Readiness Planning remains a future gate: Clerk Production, production users/roles, production session claims, Production deployment, and Learning Record migration are not complete.
4. Alternatively resume Sprint 36 question-bank work. Neither next step is started automatically.
