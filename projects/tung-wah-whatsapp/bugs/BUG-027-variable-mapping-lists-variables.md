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
Variable mapping lists variables alphabetically instead of the order they appear in the message. For the example message, {{event_date}} appears before {{first_name}}.

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
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
