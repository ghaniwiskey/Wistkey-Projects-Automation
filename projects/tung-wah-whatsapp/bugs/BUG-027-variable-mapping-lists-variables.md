---
id: BUG-027
title: "Variable mapping lists variables alphabetically instead of message order"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:33.138Z
found: 2026-10-28T08:06:33.138Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-072]
frequency: always
---
## Summary
For "您好 {{first_name}}，提醒您 {{event_date}} …" the mapping shows {{event_date}} first.

## Steps to reproduce
1. Open qa_event_reminder_<n>

## Expected
{{first_name}} first.

## Actual
{{event_date}} first.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
