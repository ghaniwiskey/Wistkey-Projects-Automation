---
id: TWW-031
title: "Overwrite mode replaces contacts after confirmation"
feature: contacts
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
覆蓋 clears old contacts and replies only after the user confirms.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-valid-hk.xlsx
- Excel file projects/tung-wah-whatsapp/data/contacts-missing-columns.xlsx

## Steps
1. Log in as admin, open a draft template and upload the valid HK file
2. Select 覆蓋 and upload the missing-columns file
3. Delete the contacts (cleanup)

## Expected
- A confirmation warns that old contacts and replies will be deleted
- After confirming, only the new file's contacts remain
- The mode returns to 追加 after the upload

## Notes
Overwrite itself works; currently there is no confirmation and 覆蓋 stays selected (see question).
Related: Q-002.
