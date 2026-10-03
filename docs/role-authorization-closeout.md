# Role Authorization Final Closeout

Status: Completed / Human Verified.

## Verified baseline

- Implementation commit: `afed01b` (`feat: add Clerk role authorization`).
- Human Preview deployment: `dpl_4CcR38yoiyzpT6ftLLWxwEoP3X7M`.
- Preview target: `preview`; state: `READY`; framework: Next.js.
- Human accepted `yenmin`, `ariel`, and `linda` in Clerk Development.

## Authorization model

- Roles are `parent`, `jiejie`, and `meimei`.
- Clerk `publicMetadata.role` is the long-term source and is exposed through the session custom claim `metadata`.
- `yenmin` → `parent`: all content and Parent mode.
- `ariel` → `jiejie`: 姐姐 home and related features only; no 妹妹 area or Parent mode.
- `linda` → `meimei`: 妹妹 home and related features only; no 姐姐 area or Parent mode.
- Missing or invalid roles fail closed to authenticated `/access-denied`.
- Proxy enforcement, server layout guards, and role-aware home/navigation use the shared role policy.

## Data and production boundary

- Learning Record remains `project-seed:learning-records:v1` in same-origin/profile localStorage.
- Clerk user IDs and roles are not written into Learning Records.
- Same-origin/profile localStorage is not account-isolated storage; cloud sync and account isolation are not claimed.
- Clerk Development and Vercel Preview are verified. Clerk Production, production users/roles, production session claims, Production deployment, and Learning Record migration are not complete.
- The earlier Hosting/Auth Preview `AiUo9PyK3` remains a rollback candidate.

## Next-step candidates

1. Production Readiness Planning.
2. Resume Sprint 36 question-bank work.

Neither next step is started automatically.
