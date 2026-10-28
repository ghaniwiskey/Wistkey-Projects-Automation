---
id: TWW-070
title: "Delete a template with contacts after confirmation"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Deleting a template warns about data loss and removes everything.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Create a QA draft and upload the blank-rows file to it
2. On the templates list click its trash icon; read the dialog; press Escape
3. Click the trash icon again and 確認刪除

## Expected
- Dialog "確認刪除" warns that contacts and replies are deleted and the template is removed from Twilio
- Escape closes the dialog without deleting
- After confirming the card is gone and its contacts list is empty
