---
id: TWW-030
title: "Upload summary reports rows that were not imported"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Rows with an invalid or empty phone are reported, not silently dropped.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-phone-formats.xlsx

## Steps
1. Log in as admin, open a draft template with no contacts
2. Upload the phone-formats file (8 rows: one with letters, one with an empty phone)
3. Delete the contacts (cleanup)

## Expected
- The summary says how many rows were rejected and why (invalid phone / empty phone)
- total equals the number of data rows in the file

## Notes
Related: BUG-007 (open).
