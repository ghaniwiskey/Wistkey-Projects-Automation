---
id: BUG-022
title: "Newly submitted template shows 草稿 (Draft) until the next sync; several Twilio statuses become DRAFT"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:32.376Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-064]
frequency: always
---
## Summary
Sync only understands three Twilio statuses: APPROVED, PENDING and REJECTED. The Twilio statuses "received" (just submitted), "paused" and "disabled" all become DRAFT. So a template that is under review first shows 草稿 (Draft), and a paused or disabled template would look like a draft.

## Steps to reproduce
1. Create a template with Meta submission ticked.
2. Look at its card right after the success alert.
3. Click 從 Twilio 同步 (Sync from Twilio).

## Expected
The card shows 審核中 (Under review) right away; paused and disabled templates are shown as paused or disabled.

## Actual
The card shows 草稿 (Draft) first, and 審核中 (Under review) only after a later sync.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![31-pending-card.png](../explorations/2026-10-28-core-journeys/31-pending-card.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
