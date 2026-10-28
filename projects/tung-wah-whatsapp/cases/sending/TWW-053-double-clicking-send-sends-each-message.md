---
id: TWW-053
title: "Double-clicking send sends each message once"
feature: sending
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
An impatient double click does not message members twice.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx
- Recipient: WhatsApp +852 6524 8661 only

## Steps
1. Have one pending QA contact on attendance_confirmation (mapping 姓名 saved)
2. Double-click 發送到 WhatsApp and accept the confirmation
3. Check the Twilio messaging log

## Expected
- Only one /api/send request and one outbound message per contact
