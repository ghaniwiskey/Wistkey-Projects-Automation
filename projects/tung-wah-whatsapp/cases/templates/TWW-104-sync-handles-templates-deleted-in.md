---
id: TWW-104
title: "Sync handles templates deleted in Twilio without silently losing replies"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Reply history is not lost without warning when a template disappears from Twilio.

## Preconditions
- An admin account
- A throwaway Twilio draft with a QA contact (approval per run, README > Testing permissions)

## Data
- Throwaway template qa_sync_<unique>

## Steps
1. Create a throwaway template and upload a QA contact
2. Delete the template directly in Twilio (console or Content API)
3. In the app click 從 Twilio 同步

## Expected
- The user is warned, or the template is kept and marked as deleted, before contacts and replies are removed

## Notes
Depends on Q-011. 2026-10-29: the sync deleted the template with its contacts and replies without a warning (BUG-026 fix).
