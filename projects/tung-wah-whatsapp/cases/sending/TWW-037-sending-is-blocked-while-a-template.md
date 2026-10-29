---
id: TWW-037
title: "Sending is blocked while a template variable has no mapping"
feature: sending
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Nobody receives a message with a wrong or placeholder value.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx
- Recipient: WhatsApp +852 6524 8661 only (README > Testing permissions)

## Steps
1. Log in as admin, open an approved template with {{first_name}} and no saved mapping
2. Upload the valid HK file
3. Click 發送到 WhatsApp

## Expected
- The send is refused with a message naming the unmapped variable ({{first_name}})
- Nothing is sent; Twilio shows no new outbound message

## Notes
On 2026-10-28 the message went out as "Hi David, ..." (Twilio sample value).
Related: BUG-003 verified 2026-10-29 (dev fix af9a789).
