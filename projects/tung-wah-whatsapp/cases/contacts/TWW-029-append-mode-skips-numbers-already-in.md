---
id: TWW-029
title: "Append mode skips numbers already in the list"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
追加 never creates two contacts with the same (normalized) phone number.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx
- Excel file projects/tung-wah-whatsapp/data/contacts-phone-formats.xlsx

## Steps
1. Log in as admin, open a draft template with no contacts
2. Upload the valid HK file with 追加
3. Upload the phone-formats file with 追加 (contains the same number 4 times in different formats)
4. Upload the valid HK file again with 追加
5. Open 聯繫人, then delete all contacts (cleanup)

## Expected
- Only one contact with 85265248661 exists
- The upload summary counts the duplicates as skipped ("跳過 N 個已存在號碼")

## Notes
Related: BUG-004 (open).
Send merges same-phone contacts into one message (see TWW-054).
