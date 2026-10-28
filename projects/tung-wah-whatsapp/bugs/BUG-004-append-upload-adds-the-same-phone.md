---
id: BUG-004
title: "Append upload adds the same phone number several times (duplicates in one file or in other formats)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm/contacts"
updated: 2026-10-28T06:37:46.009Z
found: 2026-10-28T06:37:46.009Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-029, TWW-054]
frequency: always
---
## Summary
追加 (跳過已存在號碼) only skips a number when the raw cell text matches an existing contact. Duplicates inside one file and the same number written differently (+852 6524 8661, 65248661) are all imported, Send then merges contacts with the same phone into one message and joins their values with "，", so the member gets "Hi QA Twin A，QA Twin B, ..." and the stats count the person several times.

## Steps to reproduce
1. Open the draft template "testing" with no contacts
2. Upload contacts-missing-columns.xlsx (QA Tester 85265248661) with 追加
3. Upload contacts-phone-formats.xlsx with 追加 (rows "+852 6524 8661", "65248661", "85265248661" twice)
4. Open 聯繫人

## Expected
Only one contact with 85265248661; the others are counted as skipped.

## Actual
Upload result {"total":6,"added":6,"skipped":0}; 聯繫人列表 shows 5 contacts with phone 85265248661. Re-uploading the exact same file is skipped correctly ("跳過 1 個已存在號碼").

## Evidence
- Screenshot: ![05-append-duplicates-not-skipped.webp](../explorations/2026-10-28-core-journeys/05-append-duplicates-not-skipped.webp)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: corrected impact after reading the send route and sending data/contacts-send-merge-invalid.xlsx: one merged message per phone ("Hi QA Twin A，QA Twin B", Twilio 00:10:04 PDT), not one message per row. Linked TWW-054.
