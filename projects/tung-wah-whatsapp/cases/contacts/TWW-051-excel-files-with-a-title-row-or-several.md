---
id: TWW-051
title: "Excel files with a title row or several sheets"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Real Tung Wah exports (title rows, extra sheets) import as agreed.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-header-row-2.xlsx
- Excel file projects/tung-wah-whatsapp/data/contacts-two-sheets.xlsx

## Steps
1. Upload the header-row-2 file (title in row 1, headers in row 2)
2. Upload the two-sheets file
3. Delete the contacts (cleanup)

## Expected
- The title-row file imports 1 contact, or the error says the headers must be in row 1
- The two-sheets file imports what was agreed (first sheet only, or all sheets) and says so

## Notes
Currently: title row -> "Excel中沒有找到聯繫人"; only the first sheet is read. Related: Q-008.
