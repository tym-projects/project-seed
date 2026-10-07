# Sprint 38 Practice Coverage Audit

## Baseline and result

The audit used the eight repository question-bank modules and preserved the existing filtered practice views. Each bank had 60 active questions before this batch; each now has 70 active questions. The 80 new questions are singleton learning units.

| Bank | Active before | Added | Active after | Main coverage direction |
|---|---:|---:|---:|---|
| 姐姐國語 | 60 | 10 | 70 | 主旨、因果、句序、詞義、人物觀點、篇章推論 |
| 姐姐數學 | 60 | 10 | 70 | 質因數、分數除法、小數除法、圓周長與面積 |
| 姐姐自然 | 60 | 10 | 70 | 天氣資料、公平實驗、水溶液與溶解條件 |
| 姐姐社會 | 60 | 10 | 70 | 社會變遷、世代互助、族群交流與文化融合 |
| 妹妹國語 | 60 | 10 | 70 | 段落理解、因果、句序、詞語、人物行動 |
| 妹妹數學 | 60 | 10 | 70 | 四位數、加減、乘法、毫米與生活應用 |
| 妹妹自然 | 60 | 10 | 70 | 植物觀察、條件控制、空氣與水的現象 |
| 妹妹社會 | 60 | 10 | 70 | 家庭分工、互助、學習步驟與進度檢查 |

## Inventory

- Total questions: 493 → 573
- Learning units: 488 → 568
- Active practice: 480 → 560
- Monthly allowlist: 87 → 127
- Additions: 80 singleton questions
- Existing姐姐 exclusions remain excluded; no out-of-scope old question was reactivated.
- 妹妹自然 additions contain no animal or magnet scope.

## Quality observations

The batch adds comprehension, application, comparison, data interpretation, fair-test reasoning and two-step calculation rather than numeric-only variants. Each item has four distinct options, one indexed answer, an explanation consistent with that answer, and a non-answer-revealing hint. The focused Sprint 38 QA checks IDs, option uniqueness, scope boundaries, active filters and monthly inventory.

## Closeout

Sprint 38 is **Completed** after Human tablet / online acceptance PASS. All 80 additions passed scope, duplicate, unique-answer and option QA; Deferred and Human Exception are `0`. The accepted Preview deployment is `dpl_31EMD566uLxSduwuaMVToY4FKM3w` from source commit `17f15c5d96ff152a92bc508e4740d43d1eb29747`. Learning Record compatibility is unchanged.
