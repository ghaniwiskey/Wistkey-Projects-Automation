---
id: BUG-004
title: "Append upload adds the same phone number several times (duplicates in one file or in other formats)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates/<template id>/contacts"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T06:37:46.009Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-029, TWW-054]
frequency: always
---
## Summary
Append upload only skips a number written exactly like an existing one, so the same person can be imported several times. When sending, they get one merged message like "Hi A，B" and are counted several times.

## Steps to reproduce
1. Open a draft template with no contacts (drafts cannot be sent, so nothing goes out).
2. Upload with 追加 (跳過已存在號碼) ("Append, skip numbers that already exist") an Excel file with columns 姓名 (Name), 手提電話 (Mobile phone) and one row: Person 1, 852<P>.
3. Upload with 追加 (Append) a second file with the same number written 4 ways: "+852 <first 4 digits of P> <last 4 digits of P>", "<P>", "852<P>", "852<P>".
4. Open 聯繫人 (Contacts).
5. Optional, merge effect (sends 1 real message): on an APPROVED template with {{first_name}} mapped to 姓名, upload two rows with the same number in different formats (Twin A, 852<P> and Twin B, <P>) and send.

## Expected
Only one contact with 852<P>; the other rows are counted as skipped.

## Actual
- Step 3: all rows are added, 0 skipped.
- Step 4: the contact list shows the same number 5 times.
- Uploading the exact same file again is skipped correctly: "跳過 1 個已存在號碼" ("Skipped 1 number that already exists").
- Step 5: one message to that number with both names joined by a Chinese comma "，", e.g. "Hi Twin A，Twin B, ...". The statistics count the person twice.

Our run: data/contacts-phone-formats.xlsx (8 rows, also containing other numbers) returned {"total":6,"added":6,"skipped":0}; 聯繫人列表 (Contact list) showed 5 contacts with 85265248661. Step 5 with data/contacts-send-merge-invalid.xlsx sent "Hi QA Twin A，QA Twin B" (Twilio, 00:10:04 PDT).

## Evidence
- Screenshot: ![05-append-duplicates-not-skipped.webp](../explorations/2026-10-28-core-journeys/05-append-duplicates-not-skipped.webp)

## Environment
- Base URL: http://localhost:3000/templates/<template id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: corrected impact after reading the send route and sending data/contacts-send-merge-invalid.xlsx: one merged message per phone ("Hi QA Twin A，QA Twin B", Twilio 00:10:04 PDT), not one message per row. Linked TWW-054.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
