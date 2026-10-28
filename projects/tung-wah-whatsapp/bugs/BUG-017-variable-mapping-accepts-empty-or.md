---
id: BUG-017
title: "Variable mapping accepts empty or unknown columns and drops typed text"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd"
updated: 2026-10-28T07:16:23.170Z
found: 2026-10-28T07:16:23.170Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-056]
frequency: always
---
## Summary
儲存映射 saves "", "   ", a column that does not exist, or free text. Every word is looked up as a column, so text such as "先生" is dropped silently, and an empty/unknown mapping sends no variable, so Twilio uses the sample value ("Hi David", see BUG-003). The input placeholder says "點擊上方列名插入，或手動輸入".

## Steps to reproduce
1. Open attendance_confirmation
2. Save the mapping as "", "   ", "不存在的欄", "姓名 先生"

## Expected
Empty/unknown columns rejected; typed text either sent literally or rejected.

## Actual
All four saved with "變數映射已儲存".

## Evidence
- Screenshot: ![27-mapping-no-validation.png](../explorations/2026-10-28-core-journeys/27-mapping-no-validation.png)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2t0005kjy3stn25txd
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
