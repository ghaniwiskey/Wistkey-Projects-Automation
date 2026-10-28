---
id: TWW-098
title: "Editing message text or buttons keeps the app and Twilio the same"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
What the app shows as the message is what members receive.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- The draft template testing

## Data
- New body text: QA edited body <unique>

## Steps
1. Open http://localhost:3000/templates/<testing id>/edit
2. Change the body text and one button title, then save
3. Compare the template detail page with the same content in the Twilio console

## Expected
- The edit page is not offered for Twilio templates, or
- the change also reaches Twilio, so the app and Twilio show the same text and buttons

## Notes
From the code: the edit page PATCHes /api/templates/<id> with name, body and buttons, changing only the database. For an approved template the app would then show text that differs from what WhatsApp sends, and replies would be matched against the edited button titles. Use only the draft template testing and restore the original text afterwards.
