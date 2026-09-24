# Sprint 28 第一批數學題庫 Design

## 實作狀態

- 七題已加入正式數學題庫並完成 Final Human Review；Sprint 28 已結案。
- 姐姐第 3 單元小數除法估算題仍未加入。
- 目前正式題庫實際盤點：56 題、51 個 learning units。
- Human 實際平板驗收：6/6 通過。
- 後續 backlog：規劃題目隨機順序的最小安全方案；本 Sprint 未實作。

## 目標

將 Human 核准的 7 題數學候選加入姐姐、妹妹正式數學題庫，補足不同細部觀念；姐姐第 3 單元小數除法估算題不在本批。

## 範圍

- 姐姐：新增 `jiejie-mathematics-7`、`jiejie-mathematics-8`、`jiejie-mathematics-9`。
- 妹妹：新增 `meimei-mathematics-7`、`meimei-mathematics-8`、`meimei-mathematics-9`、`meimei-mathematics-10`。
- 七題均為原創選擇題、新 singleton learning unit，不設定 `reviewGroupId`，不建立 variation。
- 不修改既有 12 題的任何欄位，不新增其他科目或其他數學題。

## 題目對應

| ID | 學生／單元 | 細部觀念 | 正解／index |
|---|---|---|---:|
| `jiejie-mathematics-7` | 姐姐／第 1 單元 | 最大公因數 | 12／3 |
| `jiejie-mathematics-8` | 姐姐／第 2 單元 | 整數除以分數的生活應用 | 8 瓶／3 |
| `jiejie-mathematics-9` | 姐姐／第 4 單元 | 圓周長 | 25.12 公分／1 |
| `meimei-mathematics-7` | 妹妹／第 1 單元 | 四位數大小比較 | 4700／1 |
| `meimei-mathematics-8` | 妹妹／第 2 單元 | 四位數退位減法 | 2232／1 |
| `meimei-mathematics-9` | 妹妹／第 3 單元 | 三位數乘一位數 | 1224／2 |
| `meimei-mathematics-10` | 妹妹／第 4 單元 | 公分與毫米長度相加 | 9 公分 3 毫米／2 |

完整題幹、選項、Hint、Explanation 以 `docs/superpowers/specs/2026-09-23-sprint-28-candidate-questions.md` 的已核准版本為準；妹妹第 4 單元使用修正版選項，不得恢復「8 公分 13 毫米」。

## 保護條件

- 沿用現有 Question schema、題庫載入與共用 Question Flow。
- 不改 Learning Record／ReviewSession schema、storage keys、1/3/7、retry、confirmation、practice no-write、timer 或 Parent Summary 語意。
- 不把既有 singleton 改成 review group，避免歷史紀錄與複習聚合語意改變。
- 題庫測試固定 7 題的完整內容、答案位置、唯一選項及沒有 `reviewGroupId`。

## 驗證範圍

- focused：Sprint 28 題庫 exact-match、唯一正解、數學答案及既有題目不變。
- regression：`npm test`、lint、TypeScript `--incremental false`、build、Browser smoke、`git diff --check`。
- Browser：姐姐／妹妹數學題目顯示、作答、解析、Learning Record questionId、Today Review／practice no-write、學生隔離及平板 768×1024／1024×768。

## 明確排除

- 姐姐第 3 單元 `6.3 ÷ 0.8` 估算題，等待教材確認。
- 國語、自然、社會及其他數學題目。
- 任何 schema、複習規則或題庫管理架構變更。
