# Sprint 40 妹妹第一次月考題型校準與 coverage audit

## Audit baseline

正式 repository 的 Sprint 39 baseline 為：妹妹國語、數學、自然各 75 題一般練習，第一次月考 allowlist 各 18 題。題數已足夠，但月考 allowlist 對 Owner 提供的近期考卷題型仍有明顯缺口，因此本輪以能力 coverage 而非單純題數擴增為準。

| 題庫 | 月考 baseline | 主要缺口 | 本輪補入 | 月考 after |
| --- | ---: | --- | ---: | ---: |
| 妹妹國語 | 18 | 字音／字形、國字／注音、選詞、句型、人物原因判斷等近期題型不足 | 8 | 26 |
| 妹妹數學 | 18 | 四位數生活情境加減、總量／剩餘／數量差／價格差／月份差與運算判斷不足 | 8 | 26 |
| 妹妹自然 | 18 | 植物構造辨識、葉序、木本／草本、軸根／鬚根、生活應用與判斷題不足 | 10 | 28 |

## Scope decisions

- 26 題全部為原創 singleton 題目，不逐字抄錄考卷。
- 妹妹自然僅使用「認識植物」與「空氣和水」；沒有動物或磁鐵內容。
- 沿用既有題目型別、四選一、hint／explanation 與 explicit monthly allowlist。
- 未修改 Learning Record、ReviewSession、Backup/Restore、retry、1/3/7、Auth、role authorization 或 UI 架構。

## Resulting inventory

- Total questions: `613 → 639`。
- Learning units: `608 → 634`；新增 26 題均為 singleton。
- Active Practice: `600 → 626`。
- Monthly allowlist: `144 → 170`；妹妹國語／數學／自然分別為 `26/26/28`。

## Candidate disposition

- Ready / implemented: `26`。
- Revised: `0`。
- Pending review: `0`。
- Rejected: `0`。

完整 question ID、題型 coverage 與 scope guard 見 [`sprint40-candidate-manifest.json`](sprint40-candidate-manifest.json)。
