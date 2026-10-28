---
id: TWW-027
title: "Upload with no contacts shows a clear error"
feature: contacts
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Empty or non-Excel files are rejected with a message.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Excel file projects/tung-wah-whatsapp/data/contacts-header-only.xlsx
- projects/tung-wah-whatsapp/data/not-excel.txt

## Steps
1. Log in as admin and open a draft template
2. Upload the header-only Excel file
3. Upload a .txt file

## Expected
- Both show the alert "Excel中沒有找到聯繫人"
- The contact count does not change
