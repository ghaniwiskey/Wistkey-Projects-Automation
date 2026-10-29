---
id: TWW-054
title: "Contacts sharing a phone get one message with their own name"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
A family sharing a phone is messaged correctly.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-send-merge-invalid.xlsx
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. Upload the merge file to attendance_confirmation (QA Twin A 85265248661, QA Twin B 65248661)
2. Send and check the message in Twilio

## Expected
- The agreed behavior: one message per person, or one message whose wording handles several names (not "Hi QA Twin A，QA Twin B")
- Report counts one person per phone

## Notes
Since the BUG-004 fix (verified 2026-10-29) the second row with the same number is skipped at upload (Excel 文件內重複號碼), so only the first person gets the message; the send step was not rerun.
