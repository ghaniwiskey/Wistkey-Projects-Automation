---
id: BUG-026
title: "Sync keeps templates that were deleted in Twilio"
severity: minor
status: verified
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T09:31:30.064Z
found: 2026-10-28T08:06:32.983Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-069]
frequency: always
---
## Summary
Sync never removes templates that were deleted in Twilio, so they stay in the app as drafts and the list no longer matches the sync count.

## Steps to reproduce
1. Create a draft template (Meta unticked).
2. Delete it in Twilio Console > Messaging > Content Template Builder.
3. In the app, click 從 Twilio 同步 (Sync from Twilio).

## Expected
The template is removed from the app, or marked as deleted.

## Actual
The template stays in the list as 草稿 (Draft). The sync message counts one template fewer than the cards shown.

Our run: "同步成功！共 10 個模板" ("Sync successful! 10 templates in total") while 11 cards were listed.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
