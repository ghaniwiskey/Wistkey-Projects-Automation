---
id: BUG-007
title: "Upload summary hides rows that were not imported"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.397Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-030]
frequency: always
---
## Summary
Rows with an invalid phone ("abcdefg") or an empty phone are dropped without telling the user. For a file with 8 rows, the result says total 6, skipped 0, so the 2 dropped rows are not mentioned anywhere.

## Steps to reproduce
1. Open a draft template with no contacts.
2. Upload contacts-phone-formats.xlsx (8 data rows).

## Expected
The summary reports the 2 rejected rows and why they were rejected.

## Actual
Server response {"total":6,"added":6,"skipped":0,"message":"成功導入 6 個聯繫人"} ("Successfully imported 6 contacts"). The UI only shows "上傳成功！" ("Upload successful!").

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-28-core-journeys/15-upload-summary.png)
## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
