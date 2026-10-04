# Sprint 37 Practice Coverage Matrix

Status: Completed. This matrix is the production scope ledger; all 355 implemented questions map to one row and all eight active practice pools equal 60.

| Student | Subject | Confirmed scope | Existing active | Target | Planned new | Basic | Application | Reasoning | Candidate ID range |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| 姐姐 | 國語 | 六上第壹、貳單元，第1–6課 | 12 | 60 | 48 | 16 | 20 | 12 | S37-JC-001–048 |
| 姐姐 | 數學 | 南一六上第1–4單元 | 18 | 60 | 42 | 14 | 17 | 11 | S37-JM-001–042 |
| 姐姐 | 自然 | 康軒六上第1–2單元 | 17 | 60 | 43 | 14 | 17 | 12 | S37-JN-001–043 |
| 姐姐 | 社會 | 六上第一次月考前兩單元 | 14 | 60 | 46 | 15 | 19 | 12 | S37-JS-001–046 |
| 妹妹 | 國語 | 三上第1–6課 | 16 | 60 | 44 | 14 | 14 | 16 | S37-MC-001–044 |
| 妹妹 | 數學 | 南一三上第1–4單元 | 17 | 60 | 43 | 14 | 18 | 11 | S37-MM-001–043 |
| 妹妹 | 自然 | 認識植物、空氣和水；排除動物／磁鐵 | 17 | 60 | 43 | 14 | 17 | 12 | S37-MN-001–043 |
| 妹妹 | 社會 | 三上第1–2單元 | 14 | 60 | 46 | 15 | 19 | 12 | S37-MS-001–046 |
| **Total** | **8 banks** | **confirmed first-month scope only** | **125** | **480** | **355** | **116** | **141** | **98** | **355 entries** |

## Skill allocation rules

- Basic covers core concepts, direct interpretation, and grade-appropriate foundational calculation.
- Application covers life situations, comparison, information selection, and two-step use of a known method.
- Reasoning covers inference, error analysis, data integration, reverse reasoning, or multi-condition decisions.
- The counts are planning targets, not permission to create repetitive variants. A materially different reasoning path or representation is required for near-neighbor content.

## Existing active filters

The existing Sprint 36 filtered-out IDs remain inactive. Sprint 37 only appends new in-scope IDs to the current active views; it does not replace the filters with whole-bank arrays.

## Phase 1 repository scan

| Bank | Current questions | Current active | Highest existing numeric ID | Next candidate question ID |
|---|---:|---:|---:|---|
| 姐姐／國語 | 21 | 12 | 21 | `jiejie-chinese-22` |
| 姐姐／數學 | 20 | 18 | 20 | `jiejie-mathematics-21` |
| 姐姐／自然 | 17 | 17 | 17 | `jiejie-natural-science-18` |
| 姐姐／社會 | 16 | 14 | 16 | `jiejie-social-studies-17` |
| 妹妹／國語 | 16 | 16 | 16 | `meimei-chinese-17` |
| 妹妹／數學 | 17 | 17 | 17 | `meimei-mathematics-18` |
| 妹妹／自然 | 17 | 17 | 17 | `meimei-natural-science-18` |
| 妹妹／社會 | 14 | 14 | 14 | `meimei-social-studies-15` |

The scan found no cross-bank question-ID collision. The current `lib/first-exam-practice.ts` allowlist remains 87 IDs. No protected Learning Record, ReviewSession, Backup/Restore, retry, or scheduling source file is modified in Phase 1.
