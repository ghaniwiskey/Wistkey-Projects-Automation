---
id: TWW-069
title: "Sync removes templates deleted in Twilio"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The app list matches Twilio after 從 Twilio 同步.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Create a QA draft
2. Delete it directly in Twilio (Content Template Builder or API)
3. Click 從 Twilio 同步

## Expected
- The template disappears from the app (or is marked as removed)
- The sync count matches the cards shown

## Notes
Deleting the stale card in the app still works (Twilio 404 is ignored).
Related: BUG-026 (open).
