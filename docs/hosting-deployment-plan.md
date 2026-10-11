# Hosting Authentication Deployment Plan — Phase 1B

This document tracks the Hosting/Auth closeout. It records configuration and verification state only; secrets, passwords, share tokens, and bypass values are never recorded.

## Phase 0 — Environment gate

1. Human creates Clerk Development and Production instances.
2. Configure username/password and the approved non-public access policy.
3. Provide real keys only through local `.env.local` and Vercel Environment Variables.

## Phase 1 — Preview

1. Use the canonical Preview feature branch with the auth changes integrated.
2. Run focused auth tests, full Node tests, lint, TypeScript, and build.
3. Deploy a Vercel Preview using Clerk Development keys. Never use `--prod` or `2026ast-production`.
4. Create or invite the three test users in the Development instance. DONE: `yenmin`, `ariel`, and `linda` are present; Human login passed for all three.
5. Verify signed-out redirects, sign-in, sign-out, reload/back, all student/parent routes, no public signup, and role authorization. Automated checks cover fail-closed route policy; credentialed acceptance remains a Human Authentication Review Gate. DONE: Human acceptance passed for anonymous, yenmin, ariel and linda.

## Phase 2 — Cloud smoke and tablet review

Verify the eight subject entry points, practice, Today Review, reinforce, monthly exam, Parent Center, Backup/Restore, 768×1024 and 1024×768. Use synthetic storage for automated tests. Human must use normal browsing, not private/incognito mode.

## Phase 3 — Production and record migration

1. Only after Preview approval, merge/push through the normal repository gate.
2. Deploy Vercel Production with Clerk Production keys.
3. From the existing normal-browser 3100 origin, export the Learning Record backup.
4. Sign in to the production cloud origin as `parent` and import the backup once.
5. Verify count, deduplication, and Parent Center display.
6. Do not clear or overwrite the old origin until Human confirms the cloud records.

> Account-name note: `parent`, `jiejie`, and `meimei` are original design names. The current Clerk Development users are `yenmin`, `ariel`, and `linda`; any Development authentication test must use those actual usernames.

## Rollback

Keep local 3100 available as short-term fallback. A Vercel rollback should target the last verified deployment. Authentication rollback and Learning Record migration rollback are separate decisions; never infer that reverting code restores browser storage.

## Current environment gate

## Hosting/Auth closeout state

- Vercel Preview Next.js hosting: PASS.
- Clerk Authentication: PASS.
- Human login for `yenmin`, `ariel`, and `linda`: PASS.
- One deliberate wrong-password rejection: PASS.
- Google login: OFF; Public signup: OFF; Access mode: Invite-only.
- Current application role authorization contract:
  - `yenmin` can see all content and Parent mode.
  - `ariel` is limited to 姐姐 home and related features; no 妹妹 entry and no Parent mode.
  - `linda` is limited to 妹妹 home and related features; no 姐姐 entry and no Parent mode.
- Keep this requirement separate from question-bank changes and protect it with regression tests.
- Final Clerk state: username/password login retained; Google login OFF; Public signup OFF; Access mode Invite-only. No password, key, token, or bypass value is recorded.
- Vercel Authentication is OFF. Clerk is the required application authentication boundary; do not use Vercel Deployment Protection to mask an application Auth regression.
- Production placeholder and older Preview deployments remain for a separate cleanup review; no deletion or revoke was performed.
- Learning Record has not been migrated to the cloud, and Vercel Production has not been formally launched.
- Real Clerk Preview sign-in E2E has been exercised by Human for the three Development users, including one deliberate wrong-password rejection. No correct password is recorded or requested from Codex. Production deployment is not authorized by this document.

## Post-Sprint 39 Auth Deployment Preflight

Before every `2026ast-hosting-preview` deployment, including a question-bank-only deployment, verify Clerk dependency, root `proxy.ts`, both required Preview Clerk environment-variable names, anonymous root／姐姐／妹妹／爸爸 redirects to Clerk, role guard tests, and parent／jiejie／meimei authorization regression tests. Any failure blocks deployment. This rule exists because a branch missing proxy, dependency, and role guards produced an unprotected Preview despite a successful deployment.
