# Sprint 34 Implementation Plan — two first-exam banks

## Task order

1. **Question-bank RED tests** — add exact IDs, feedback completeness, singleton metadata, retired-question exclusion, and allowlist expectations; run `node --test lib/questions/sprint-34-first-exam.test.mjs` and confirm missing IDs/allowlists fail.
2. **Question content** — append eight original Jiejie Chinese and eight original Meimei Natural Science questions; keep existing content and IDs unchanged. Run focused tests and the two bank tests.
3. **Monthly wiring** — add the 16 approved IDs to `lib/first-exam-practice.ts`, preserving existing six banks and shared flow. Run focused allowlist tests and the full Node suite.
4. **Documents and readiness** — update `PROJECT_STATUS.md`, roadmap, sprint log, and this plan with actual counts, evidence boundary, pending-review status, and validation results.
5. **Verification** — run focused tests, `npm test`, lint, TypeScript with `--incremental false`, build, disposable Browser smoke, tablet viewports, and `git diff --check`. Keep 3100 untouched; create a separate LAN test server before Human tablet review.

## Completion gate

Sprint 34 implementation and Human tablet review are complete. The final formal-origin verification is performed on the updated 3100 service before the close is considered fully operationally verified.

## Implementation evidence

- Added 16 singleton questions: 8 姐姐國語 and 8 妹妹自然.
- Added both monthly allowlists without changing persisted schemas, storage keys, or learning semantics.
- Actual inventory is 94 questions and 89 learning units; the monthly allowlists contain 85 questions in total.
- Full Node regression, isolated build, Browser, and LAN verification passed before Human tablet review.

## Verification record

- Focused Node: 5/5, including the answer-position audit.
- Full Node: 196/196.
- Lint: passed.
- TypeScript: passed with `--incremental false` in the formal repository after replacing the confirmed old `.next` build artifact with a recoverable backup.
- Isolated production build: passed.
- Disposable Browser smoke: 41/41 passed, including the newly enabled Jiejie Chinese and Meimei Natural Science monthly routes.
- Focused monthly Browser: 4/4 passed, including portrait and landscape viewport checks.
- `git diff --check`: passed.
- Isolated LAN server: `http://192.168.22.208:3101`, serving the Sprint 34 build; formal 3100 remained untouched.

## Answer-position quality audit

- RED evidence: the initial audit found concentrated positions in the new Jiejie Chinese bank (8/0/0/0) and Meimei Natural Science bank (9/1/1/1).
- Minimal correction: reorder existing options and update only `answer` for 12 questions; no question content, ID, metadata, hint, explanation, allowlist, schema, or learning behavior changed.
- After correction: Jiejie Chinese 2/2/2/2; Meimei Natural Science 3/3/3/3. Other banks remain unchanged; overall monthly distribution is 25/32/21/11.
- Answer-position focused test now uses quality thresholds rather than exact 25% quotas and verifies the new questions are not all index 0.
- Close status: Sprint 34 Completed; implementation commit and push follow the final staged-diff review, with formal 3100 kept running for Human re-verification and 3101 retained until that check passes.
