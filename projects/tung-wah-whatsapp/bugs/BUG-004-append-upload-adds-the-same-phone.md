---
id: BUG-004
title: "Append upload adds the same phone number several times (duplicates in one file or in other formats)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm/contacts"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.009Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-029, TWW-054]
frequency: always
---
## Summary
In the upload mode 追加 (跳過已存在號碼) ("Append, skip numbers that already exist"), the app only skips a number when the cell text is exactly the same as an existing contact's phone. So these are all imported as new contacts:
- the same number more than once in one file;
- the same number written another way, such as "+852 6524 8661" or "65248661".

When sending, the app merges contacts with the same phone into one message and joins their values with a Chinese comma "，". The member gets "Hi QA Twin A，QA Twin B, ..." and the statistics count the same person several times.

## Steps to reproduce
1. Open the draft template "testing", which has no contacts.
2. Upload contacts-missing-columns.xlsx (QA Tester, 85265248661) with 追加 (Append).
3. Upload contacts-phone-formats.xlsx with 追加 (Append). It has the rows "+852 6524 8661", "65248661", and "85265248661" twice.
4. Open 聯繫人 (Contacts).

## Expected
Only one contact with 85265248661; the other rows are counted as skipped.

## Actual
Upload result {"total":6,"added":6,"skipped":0} (6 added, 0 skipped). 聯繫人列表 (Contact list) shows 5 contacts with phone 85265248661. Uploading the exact same file again is skipped correctly: "跳過 1 個已存在號碼" ("Skipped 1 number that already exists").

## Evidence
- Screenshot: ![05-append-duplicates-not-skipped.webp](../explorations/2026-10-28-core-journeys/05-append-duplicates-not-skipped.webp)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: corrected impact after reading the send route and sending data/contacts-send-merge-invalid.xlsx: one merged message per phone ("Hi QA Twin A，QA Twin B", Twilio 00:10:04 PDT), not one message per row. Linked TWW-054.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
