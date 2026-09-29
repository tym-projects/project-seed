# Sprint 35 Implementation Plan — Learning Record Backup & Restore

1. **Model tests (RED):** add pure tests for export envelope, strict validation,
   id-based merge, conflicting duplicates, idempotent re-import, invalid-import
   preservation, and storage-write failure.
2. **Pure implementation:** expose the existing record validator and add one
   backup module without changing the persisted schema or storage key.
3. **UI tests (RED):** add Browser coverage for export, file import, rejection,
   success summary, duplicate import, reload persistence, Parent Summary, and
   console errors using synthetic storage/files.
4. **Parent UI:** add the compact backup panel to `/parent`; use Blob download,
   file input, in-memory validation/merge, and one final storage write.
5. **Verification:** run focused Node/Browser tests, full Node, lint, TypeScript
   with `--incremental false`, build, full Browser smoke, and `git diff --check`.
   Start an isolated LAN server only after all automated checks pass; keep the
   formal 3100 service untouched and running.

## Constraints

- No question-bank or monthly-allowlist changes.
- No ReviewSession backup in V1.
- No new permanent storage key or schema migration.
- No cloud upload, account system, or real-user data in tests.
- Sprint 35 remains `Implementation complete / Awaiting Human Review` until
  Human tablet acceptance.
