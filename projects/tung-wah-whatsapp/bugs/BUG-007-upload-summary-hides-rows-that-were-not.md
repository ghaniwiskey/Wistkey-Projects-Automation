---
id: BUG-007
title: "Upload summary hides rows that were not imported"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates/<template id>"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T06:37:46.397Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-030]
frequency: always
---
## Summary
Rows with an invalid or empty phone are dropped without telling the user; the upload summary does not mention them.

## Steps to reproduce
1. Open a draft template with no contacts.
2. Upload an Excel file (columns 姓名 (Name), 手提電話 (Mobile phone)) with 4 rows: two valid numbers (e.g. 852<P> and another 8-digit HK number), one row with phone "abcdefg", one row with an empty phone.

## Expected
The summary reports the 2 rejected rows and why.

## Actual
The result counts only the valid rows, with skipped 0. The UI only shows "上傳成功！" ("Upload successful!").

Our run: data/contacts-phone-formats.xlsx (8 data rows) returned {"total":6,"added":6,"skipped":0,"message":"成功導入 6 個聯繫人"} ("Successfully imported 6 contacts").

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-28-core-journeys/15-upload-summary.png)
## Environment
- Base URL: http://localhost:3000/templates/<template id>
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
