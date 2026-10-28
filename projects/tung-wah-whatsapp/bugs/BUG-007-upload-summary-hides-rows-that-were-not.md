---
id: BUG-007
title: "Upload summary hides rows that were not imported"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm"
updated: 2026-10-28T06:37:46.397Z
found: 2026-10-28T06:37:46.397Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-030]
frequency: always
---
## Summary
Rows with an invalid ("abcdefg") or empty phone are dropped silently: the result says total 6, skipped 0 for a file with 8 rows.

## Steps to reproduce
1. Open a draft template with no contacts
2. Upload contacts-phone-formats.xlsx (8 data rows)

## Expected
The summary reports 2 rejected rows and why.

## Actual
{"total":6,"added":6,"skipped":0,"message":"成功導入 6 個聯繫人"}; the UI only shows "上傳成功！".

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-28-core-journeys/15-upload-summary.png)
## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
