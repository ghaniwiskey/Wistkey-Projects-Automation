---
id: BUG-022
title: "Newly submitted template shows Draft until the next sync; several Twilio statuses map to DRAFT"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:32.376Z
found: 2026-10-28T08:06:32.376Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-064]
frequency: always
---
## Summary
A newly submitted template initially appears as "草稿" (Draft) instead of under review. Sync only maps APPROVED, PENDING and REJECTED; Twilio statuses received, paused and disabled all map to DRAFT, so paused or disabled templates would also look like drafts.

## UI labels in English
- 從 Twilio 同步: Sync from Twilio
- 審核中: Under review
- 草稿: Draft

## Steps to reproduce
1. Create a template with Meta submission
2. Look at the card right after the success alert
3. Click 從 Twilio 同步

## Expected
審核中 immediately; paused/disabled shown as such.

## Actual
草稿 first, 審核中 after a later sync.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![31-pending-card.png](../explorations/2026-10-28-core-journeys/31-pending-card.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
