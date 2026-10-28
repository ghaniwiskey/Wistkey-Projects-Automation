---
id: BUG-026
title: "Sync keeps templates that were deleted in Twilio"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:32.983Z
found: 2026-10-28T08:06:32.983Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-069]
frequency: always
---
## Summary
Sync only upserts; content removed in Twilio stays in the app as 草稿, so the list and the sync count disagree.

## Steps to reproduce
1. Create a QA draft
2. Delete it in Twilio
3. 從 Twilio 同步

## Expected
Template removed or flagged.

## Actual
"同步成功！共 10 個模板" while 11 cards are listed.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
