---
id: BUG-017
title: "Variable mapping accepts empty or unknown columns and drops typed text"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.170Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-056]
frequency: always
---
## Summary
儲存映射 (Save mapping) saves any value: empty "", only spaces "   ", a column that does not exist, or free text. Problems:
- Every typed word is looked up as a column name, so normal text such as "先生" ("Mr.") is dropped without warning.
- An empty or unknown mapping sends no value for the variable, so Twilio uses the sample value ("Hi David", see BUG-003).

The input's placeholder says "點擊上方列名插入，或手動輸入" ("Click a column name above to insert it, or type it manually").

## Steps to reproduce
1. Open attendance_confirmation.
2. Save the mapping as each of: "", "   ", "不存在的欄" ("column that does not exist"), "姓名 先生" ("Name Mr.").

## Expected
Empty and unknown columns are rejected; typed text is either sent as written or rejected.

## Actual
All four are saved with "變數映射已儲存" ("Variable mapping saved").

## Evidence
- Screenshot: ![27-mapping-no-validation.png](../explorations/2026-10-28-core-journeys/27-mapping-no-validation.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
