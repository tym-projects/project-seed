# Sprint 38 Practice and Monthly Question Bank Expansion

## Final outcome

Status: **Completed**. All 80 original singleton candidates were implemented with no Deferred or Human Exception. Human tablet / online acceptance passed for 16 cross-subject samples, general practice, first monthly-exam practice, and the yenmin / ariel / linda roles. The accepted Preview deployment is `dpl_31EMD566uLxSduwuaMVToY4FKM3w` at `https://2026ast-hosting-preview-ty5kcu0d1-2026-ast.vercel.app/`, built from source commit `17f15c5d96ff152a92bc508e4740d43d1eb29747`. Later governance-only commits are distinct from that deployed source.

## Goal

Expand practice coverage beyond the Sprint 37 60-question baseline while improving topic and question-type coverage inside the confirmed first-month exam scopes.

## Scope

Only the eight previously confirmed first-month scopes are eligible. 妹妹自然 remains limited to「認識植物」與「空氣和水」; 動物 and 磁鐵 remain excluded.

## Architecture

Append original singleton question objects through the existing bank modules. Keep existing practice filters and question-card schema. Extend the first-exam allowlist only with validated in-scope IDs. Do not modify Learning Record, ReviewSession, Backup/Restore, retry, scheduling, Auth or Production.

## Batch decision

Coverage audit identified a need for additional reading inference, application, fair-test/data reasoning, family/social scenarios and multi-step calculations. The first internal batch adds 80 questions, ten per bank, with five per bank selected for the monthly allowlist.

## QA and deployment

The candidate manifest records bank, scope, question IDs and monthly membership. Focused QA validates singleton IDs, four-option uniqueness, answer indices, scope boundaries, preserved exclusions and monthly inventory. Full Node, lint, TypeScript, build and Browser verification are required before Preview deployment under the existing Question Bank Auto-Deploy Rule.
