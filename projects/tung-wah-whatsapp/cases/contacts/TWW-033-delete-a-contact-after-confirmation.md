---
id: TWW-033
title: "Delete a contact after confirmation"
feature: contacts
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
A single contact can be removed.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open 聯繫人 of a template with QA contacts
2. Click the trash icon of one contact and cancel
3. Click it again and confirm

## Expected
- The confirmation reads "確定要刪除此聯繫人嗎？"
- Cancel keeps the contact; confirm removes it and the count drops by 1
