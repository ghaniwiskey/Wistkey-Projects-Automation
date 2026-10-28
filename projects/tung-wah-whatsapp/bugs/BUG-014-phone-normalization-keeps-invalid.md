---
id: BUG-014
title: "Phone normalization keeps invalid numbers and mangles 00-prefix and \".0\" values"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:22.784Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-049]
frequency: always
---
## Summary
The upload accepts numbers that are not valid Hong Kong mobile numbers, and turns some common formats into wrong numbers. Messages then go to wrong or non-existent numbers (and could reach a stranger in another country).

## Steps to reproduce
1. Open the draft template "testing", which has no contacts.
2. Upload data/contacts-phone-formats-2.xlsx.
3. Upload data/contacts-send-merge-invalid.xlsx to attendance_confirmation and send.

## Expected
- Numbers starting with 00852 and numbers ending in ".0" become 85265248661.
- 9-digit, 10-digit and all-zero numbers are rejected and reported in the upload summary.

## Actual
- "0085265248661" becomes 852085265248661 (wrong number).
- "85265248661.0" becomes 852652486610 (wrong number).
- "652486612" (9 digits) is kept as 652486612.
- "00000000" becomes 8520000000 and is sent: Twilio reports Undelivered while the app shows SENT.

## Evidence
- Screenshot: ![24-phone-normalization.png](../explorations/2026-10-28-core-journeys/24-phone-normalization.png)
- Screenshot: ![22-twilio-merged-and-invalid.jpg](../explorations/2026-10-28-core-journeys/22-twilio-merged-and-invalid.jpg)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
