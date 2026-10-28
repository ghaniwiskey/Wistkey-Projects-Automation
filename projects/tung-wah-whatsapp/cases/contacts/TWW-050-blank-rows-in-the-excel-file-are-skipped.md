---
id: TWW-050
title: "Blank rows in the Excel file are skipped"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Empty rows do not create contacts.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-blank-rows.xlsx

## Steps
1. Upload the blank-rows file to a draft template with no contacts
2. Delete the contacts (cleanup)

## Expected
- Exactly 2 contacts (Row A, Row B) are imported; summary total 2
