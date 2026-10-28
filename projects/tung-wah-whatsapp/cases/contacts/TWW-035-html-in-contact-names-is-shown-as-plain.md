---
id: TWW-035
title: "HTML in contact names is shown as plain text"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Uploaded values are escaped.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-phone-formats.xlsx

## Steps
1. Log in as admin, upload the phone-formats file to a draft template
2. Open 聯繫人
3. Delete the contacts (cleanup)

## Expected
- The contact named <b>bold</b> shows the literal text "<b>bold</b>", not bold text
