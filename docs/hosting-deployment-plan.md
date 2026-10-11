# Hosting Authentication Deployment Plan — Phase 1B

This document tracks the Hosting/Auth closeout. It records configuration and verification state only; secrets, passwords, share tokens, and bypass values are never recorded.

## Phase 0 — Environment gate

1. Human creates Clerk Development and Production instances.
2. Configure username/password and the approved non-public access policy.
3. Provide real keys only through local `.env.local` and Vercel Environment Variables.

## Phase 1 — Preview

1. Use the isolated auth branch/worktree.
2. Run focused auth tests, full Node tests, lint, TypeScript, and build.
3. Deploy a Vercel Preview using Clerk Development keys. DONE: latest verified deployment is READY at `https://2026ast-hosting-preview-k81jmt0k8-2026-ast.vercel.app`.
4. Create or invite the three test users in the Development instance. DONE: `yenmin`, `ariel`, and `linda` are present; Human login passed for all three.
5. Verify signed-out redirects, sign-in, sign-out, reload/back, all student/parent routes, and no public signup. DONE: signed-out `/`, `/parent`, `/jiejie`, and `/meimei` redirect to Clerk; Human confirmed logout protection and one wrong-password rejection. Final Clerk state is Google OFF, Public signup OFF, and Access mode Invite-only.

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
- V1 currently has Authentication only. Role Authorization is not implemented.
- The formal next phase is independent Role Authorization design and TDD after this Hosting/Auth closeout:
  - `yenmin` can see all content and Parent mode.
  - `ariel` is limited to 姐姐 home and related features; no 妹妹 entry and no Parent mode.
  - `linda` is limited to 妹妹 home and related features; no 姐姐 entry and no Parent mode.
- Do not fold this requirement into Sprint 36 or lose it in a later Sprint.
- Final Clerk state: username/password login retained; Google login OFF; Public signup OFF; Access mode Invite-only. No password, key, token, or bypass value is recorded.
- Vercel Deployment Protection requires Vercel Authentication. One older Preview domain is listed as a Protection Exception and is a cleanup DELETE CANDIDATE. No Sharable Link was listed. One automation-bypass metadata entry exists and is a cleanup REVOKE CANDIDATE; its value is intentionally omitted.
- Production placeholder and older Preview deployments remain for a separate cleanup review; no deletion or revoke was performed.
- Learning Record has not been migrated to the cloud, and Vercel Production has not been formally launched.
- Real Clerk Preview sign-in E2E has been exercised by Human for the three Development users, including one deliberate wrong-password rejection. No correct password is recorded or requested from Codex. Production deployment is not authorized by this document.
