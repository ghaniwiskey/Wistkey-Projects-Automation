---
id: BUG-014
title: "Phone normalization keeps invalid numbers and mangles 00-prefix and \".0\" values"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm"
updated: 2026-10-28T07:16:22.784Z
found: 2026-10-28T07:16:22.784Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-049]
frequency: always
---
## Summary
The upload accepts invalid Hong Kong mobile numbers and changes some common formats into the wrong number. Messages may go to a wrong or nonexistent number, potentially even a stranger abroad.

## Steps to reproduce
1. Open the draft template "testing" with no contacts
2. Upload data/contacts-phone-formats-2.xlsx
3. Upload data/contacts-send-merge-invalid.xlsx to attendance_confirmation and send

## Expected
00852… and …".0" normalize to <QA phone>; 9-digit, 10-digit and all-zero numbers are rejected and reported.

## Actual
"<QA phone with 00852 prefix>" -> <QA phone with an extra 8520 prefix>; "<QA phone with .0 suffix>" -> <QA phone with an extra trailing zero>; "<QA phone with an extra digit>" kept as <QA phone with an extra digit>; "<eight-zero test number>" -> <incorrectly prefixed zero number>, sent: Twilio Undelivered while the app shows SENT.

## Evidence
- Screenshot: ![24-phone-normalization.png](../explorations/2026-10-28-core-journeys/24-phone-normalization.png)
- Screenshot: ![22-twilio-merged-and-invalid.jpg](../explorations/2026-10-28-core-journeys/22-twilio-merged-and-invalid.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
