---
id: BUG-022
title: "Newly submitted template shows 草稿 (Draft) until the next sync; several Twilio statuses become DRAFT"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:06:32.376Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-064]
frequency: always
---
## Summary
A template just submitted to Meta shows 草稿 (Draft) instead of 審核中 (Under review) until the next sync, because several Twilio statuses are all turned into Draft.

## Steps to reproduce
Note: this submits a template to Meta, which cannot be undone. Use a throwaway name.
1. Create a template with 創建後立即提交 Meta 審核 (Submit to Meta for review right after creating) ticked.
2. Look at its card right after the success alert.
3. Click 從 Twilio 同步 (Sync from Twilio).

## Expected
The card shows 審核中 (Under review) right away; paused and disabled templates are shown as such.

## Actual
- Step 2: 草稿 (Draft).
- Step 3: 審核中 (Under review) only after this later sync.
- Cause: sync maps only APPROVED, PENDING and REJECTED. Twilio's "received" (just submitted), "paused" and "disabled" all become DRAFT, so a paused or disabled template would also look like a draft.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![31-pending-card.png](../explorations/2026-10-28-core-journeys/31-pending-card.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
