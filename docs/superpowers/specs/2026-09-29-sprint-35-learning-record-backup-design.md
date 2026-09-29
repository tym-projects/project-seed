# Sprint 35 — Learning Record Backup & Restore Design

## Scope

Sprint 35 adds a local JSON backup and restore workflow for the existing
`project-seed:learning-records:v1` Learning Record array. It does not change
the storage key, persisted record shape, ReviewSession storage, question banks,
monthly allowlists, or learning rules. ReviewSession remains excluded because it
is temporary session state rather than completed Learning Record history.

## Backup envelope

```json
{
  "format": "project-seed-learning-records-backup",
  "version": 1,
  "exportedAt": "ISO-8601 timestamp",
  "recordCount": 0,
  "records": []
}
```

`records` preserves each existing Learning Record object without adding fields.
The envelope is UTF-8 JSON and contains no other storage keys, browser data,
session state, device information, or account data.

## Validation and merge

Import validates the complete envelope and every record before any write. Invalid
JSON, wrong format/version, invalid timestamp/count/container, invalid record,
or conflicting duplicate id rejects the whole file. The existing record `id` is
the deterministic identity. Existing records stay first; imported records with
the same id and identical content are skipped; new ids append in file order.
One `localStorage.setItem` happens only after parsing, validation, conflict
checking, and merge are complete. A failed write leaves the existing value
untouched. Re-importing the same backup is idempotent.

## UI and safety

The parent center contains a compact 「學習紀錄備份」 panel with export and
file-import controls plus counts and timestamps, but never renders record
contents. Automated and Browser tests use synthetic storage and backup files in
disposable contexts. Formal users must use a normal browser and keep the same
origin; no cloud sync, account system, migration, or automatic repair is added.

## Acceptance

Focused Node and Browser tests cover envelope validation, safe merge,
idempotency, write failure, export/import feedback, reload persistence, Parent
Summary compatibility, no console errors, and tablet portrait/landscape layout.
