---
id: TWW-020
title: "Deleting a template removes it from Twilio"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Delete removes the template in the app and in Twilio, so a sync does not bring it back.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Create a QA draft template (no Meta submission)
2. Open it and click 刪除, confirm
3. Click 從 Twilio 同步 on the templates list

## Expected
- The app returns to the list without the template
- After sync the template is still absent

## Notes
Writes to Twilio; needs approval per run.
