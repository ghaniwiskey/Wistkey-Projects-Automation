---
id: TWW-106
title: "Viewer's sync from Twilio does not change app data"
feature: security
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
---

## Goal
Sync is a read-only refresh for viewers.

## Preconditions
- Admin account and a QA viewer (delete afterwards)
- A throwaway Twilio draft qa_sync_<unique> with a QA contact (Twilio draft approval per run, README > Testing permissions)

## Data
- Throwaway template qa_sync_<unique>

## Steps
1. As admin note the throwaway template, its contact count and a field such as 問題標題
2. Delete the throwaway template directly in Twilio (console or Content API)
3. Log in as the QA viewer and click 從 Twilio 同步
4. Log in as admin and open 消息模版

## Expected
- The viewer's sync shows Twilio's current templates
- As admin, the throwaway template and its contacts are unchanged by the viewer's sync (only an admin's or editor's sync may remove it, see Q-011)

## Notes
Passed in runs/2026-10-30_1349_local_manual: after the throwaway draft was deleted directly in Twilio, viewer sync returned 200 without changing the local template, timestamps or QA contact. The editor then removed the stale local draft. Broad BUG-039 was superseded; remaining export and detail-control defects are BUG-044/BUG-045, not failures of this no-write sync scenario.
