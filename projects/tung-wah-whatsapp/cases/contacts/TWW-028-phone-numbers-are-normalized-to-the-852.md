---
id: TWW-028
title: "Phone numbers are normalized to the 852 format"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Local and formatted HK numbers become 852XXXXXXXX.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-phone-formats.xlsx

## Steps
1. Log in as admin and open a draft template with no contacts
2. Upload the phone-formats file
3. Open 聯繫人
4. Delete the uploaded contacts (cleanup)

## Expected
- "+852 6524 8661" and "65248661" are stored as 85265248661
- "85291234567" stays as is
