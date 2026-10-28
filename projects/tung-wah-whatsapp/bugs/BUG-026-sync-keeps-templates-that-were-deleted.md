---
id: BUG-026
title: "Sync keeps templates that were deleted in Twilio"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:32.983Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-069]
frequency: always
---
## Summary
Sync only adds or updates templates; it never removes them. A template deleted in Twilio stays in the app as 草稿 (Draft), so the number of cards in the list does not match the count in the sync message.

## Steps to reproduce
1. Create a QA draft.
2. Delete it in Twilio.
3. Click 從 Twilio 同步 (Sync from Twilio).

## Expected
The template is removed from the app, or marked as deleted.

## Actual
"同步成功！共 10 個模板" ("Sync successful! 10 templates in total"), while 11 cards are listed.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
