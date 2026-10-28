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
The append option skips an existing number only when its original cell text matches. It imports duplicates in one file and different formats of the same number. When sending, the app combines contacts with the same phone into one message, joins their values with "，", and counts them separately in the statistics.

## UI labels in English
- 聯繫人列表: Contact list
- 聯繫人: Contacts

## Steps to reproduce
1. Open the draft template "testing" with no contacts
2. Upload contacts-missing-columns.xlsx (QA Tester <QA phone>) with 追加
3. Upload contacts-phone-formats.xlsx with 追加 (rows "<QA phone, international format>", "<QA phone, local format>", "<QA phone>" twice)
4. Open 聯繫人

## Expected
Only one contact with <QA phone>; the others are counted as skipped.

## Actual
Upload result {"total":6,"added":6,"skipped":0}; 聯繫人列表 shows 5 contacts with phone <QA phone>. Re-uploading the exact same file is skipped correctly ("跳過 1 個已存在號碼").

## Evidence
- Screenshot: ![05-append-duplicates-not-skipped.webp](../explorations/2026-10-28-core-journeys/05-append-duplicates-not-skipped.webp)

## Environment
- Base URL: http://localhost:3000/templates/cmvongu2r0003kjy3sclvuifm/contacts
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: corrected impact after reading the send route and sending data/contacts-send-merge-invalid.xlsx: one merged message per phone ("Hi QA Twin A，QA Twin B", Twilio 00:10:04 PDT), not one message per row. Linked TWW-054.
