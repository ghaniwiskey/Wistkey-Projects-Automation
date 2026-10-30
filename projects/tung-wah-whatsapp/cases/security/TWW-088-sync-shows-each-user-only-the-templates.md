---
id: TWW-088
title: "Sync shows every template to editors and viewers"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
從 Twilio 同步 gives every role the full template list.

## Preconditions
- A QA editor and a QA viewer created by the admin (delete afterwards)

## Steps
1. Log in as the QA editor (owns no templates) and click 從 Twilio 同步
2. Log in as the QA viewer and click 從 Twilio 同步

## Expected
- Both see the same templates as the admin
- The viewer's sync does not change data (TWW-106)

## Notes
Editors and viewers see all synced Twilio templates. Viewer sync is read-only. Both role sync checks and the viewer no-write check passed in runs/2026-10-30_1349_local_manual; remaining BUG-038/BUG-039 failures are elsewhere.
