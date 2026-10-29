---
id: BUG-017
title: "Variable mapping accepts empty or unknown columns and drops typed text"
severity: major
status: verified
env: local
url: "http://localhost:3000/templates/<template id>"
updated: 2026-10-29T09:31:29.534Z
found: 2026-10-28T07:16:23.170Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-056]
frequency: always
---
## Summary
Variable mapping saves empty values, unknown columns and free text without any check. Typed text is silently dropped and an empty mapping makes Twilio send the sample value (see BUG-003).

## Steps to reproduce
1. Open an APPROVED template with a variable, with contacts uploaded (columns 姓名 (Name), 手提電話 (Mobile phone)).
2. In 變數映射配置 (Variable mapping), save each of these values with 儲存映射 (Save mapping): "" (empty), "   " (spaces), "不存在的欄" ("column that does not exist"), "姓名 先生" ("Name Mr.").

## Expected
Empty and unknown columns are rejected. Typed text is either sent as written or rejected.

## Actual
- All four are saved with "變數映射已儲存" ("Variable mapping saved").
- Every typed word is looked up as a column, so "先生" ("Mr.") is dropped.
- An empty or unknown mapping sends no value, so Twilio uses the sample value ("Hi David", BUG-003).
- The input's placeholder says "點擊上方列名插入，或手動輸入" ("Click a column name above to insert it, or type it manually").

## Evidence
- Screenshot: ![27-mapping-no-validation.png](../explorations/2026-10-28-core-journeys/27-mapping-no-validation.png)

## Environment
- Base URL: http://localhost:3000/templates/<template id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
