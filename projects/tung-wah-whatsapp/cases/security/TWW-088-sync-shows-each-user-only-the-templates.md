---
id: TWW-088
title: "Sync shows each user only the templates they may see"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
從 Twilio 同步 does not reveal other users' templates.

## Preconditions
- A QA editor created by the admin (delete afterwards)

## Steps
1. Log in as the QA editor (owns no templates)
2. Click 從 Twilio 同步

## Expected
- Only the editor's templates (none) are listed

## Notes
Related: BUG-002 (open).
