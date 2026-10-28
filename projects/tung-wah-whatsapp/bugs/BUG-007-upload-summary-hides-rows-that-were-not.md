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
Rows with an invalid or blank phone number are silently left out. For an 8-row file, the upload result reports 6 total and 0 skipped, so staff cannot tell that two rows were rejected.

## UI labels in English
- 聯繫人: Contacts
- 上傳成功！: Upload successful!

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
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
