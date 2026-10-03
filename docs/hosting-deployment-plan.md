# Hosting Authentication and Role Authorization Deployment Plan — Final Closeout

This document tracks the Hosting/Auth closeout. It records configuration and verification state only; secrets, passwords, share tokens, and bypass values are never recorded.

## Phase 0 — Environment gate

1. Human creates Clerk Development and Production instances.
2. Configure username/password and the approved non-public access policy.
3. Provide real keys only through local `.env.local` and Vercel Environment Variables.

## Phase 1 — Preview

1. Use the isolated auth branch/worktree.
2. Run focused auth tests, full Node tests, lint, TypeScript, and build.
3. Deploy a Vercel Preview using Clerk Development keys. DONE: Human-verified Role Authorization deployment `dpl_4CcR38yoiyzpT6ftLLWxwEoP3X7M` is READY at `https://2026ast-hosting-preview-67brvrvab-2026-ast.vercel.app`.
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

## Hosting/Auth and Role Authorization closeout state

- Vercel Preview Next.js hosting: PASS.
- Clerk Authentication: PASS.
- Human login for `yenmin`, `ariel`, and `linda`: PASS.
- One deliberate wrong-password rejection: PASS.
- Google login: OFF; Public signup: OFF; Access mode: Invite-only.
- Role Authorization: Completed / Human Verified.
- Implementation commit: `afed01b` (`feat: add Clerk role authorization`).
- Authorization source: Clerk `publicMetadata.role` exposed through the session custom claim `metadata`; username and Clerk user ID are not authorization sources.
- `yenmin` → `parent`: all content and Parent mode.
- `ariel` → `jiejie`: 姐姐 home and related features only; direct access to 妹妹/Parent routes is blocked.
- `linda` → `meimei`: 妹妹 home and related features only; direct access to 姐姐/Parent routes is blocked.
- Missing or invalid roles fail closed to `/access-denied`; reload and back navigation do not bypass the policy.
- The shared policy is enforced by proxy, server layouts, and role-aware home/navigation.
- Final Clerk state: username/password login retained; Google login OFF; Public signup OFF; Access mode Invite-only. No password, key, token, or bypass value is recorded.
- Vercel Deployment Protection remains enabled. The earlier Hosting/Auth Preview `AiUo9PyK3` is retained as a rollback candidate; no Preview was deleted in this closeout.
- Learning Record has not been migrated to the cloud, and Vercel Production has not been formally launched.
- Human Role Authorization Preview acceptance passed for `yenmin`, `ariel`, and `linda`. No credential, key, token, user ID, or bypass value is recorded here.
- The Learning Record remains `project-seed:learning-records:v1` in same-origin/profile localStorage. It has not been migrated, and this storage is not account-isolated.
- Production is not live: Clerk Production, production users/roles, production session claims, Production deployment, and Learning Record migration are all still pending.
