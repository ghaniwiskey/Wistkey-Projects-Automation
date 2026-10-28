---
id: TWW-085
title: "Users cannot delete or edit other users' templates"
feature: security
priority: P0
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Only the owner (or admin) can delete or edit a template, in the app and in Twilio.

## Preconditions
- A QA editor created by the admin (delete afterwards)
- A disposable QA draft owned by the admin

## Steps
1. As the QA editor call DELETE /api/templates/<admin draft id>
2. Call PATCH with a new questionTitle
3. Check the draft in Twilio (Content API or console)

## Expected
- Both return 403/404
- The Twilio content still exists and the app record is unchanged

## Notes
NEVER use a real or approved template: when the bug is present the Twilio content is deleted.
Related: BUG-029 (open).
