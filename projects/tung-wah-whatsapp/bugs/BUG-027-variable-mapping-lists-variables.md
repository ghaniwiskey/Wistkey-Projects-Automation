---
id: BUG-027
title: "Variable mapping lists variables alphabetically instead of message order"
severity: trivial
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:06:33.138Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-072]
frequency: always
---
## Summary
Variable mapping lists the variables in alphabetical order instead of the order they appear in the message.

## Steps to reproduce
1. Create a draft template with the body "您好 {{first_name}}，提醒您 {{event_date}} 的活動" ("Hello {{first_name}}, a reminder about the event on {{event_date}}").
2. Open it and look at 變數映射配置 (Variable mapping).

## Expected
{{first_name}} first, as in the message.

## Actual
{{event_date}} first.

Our run: template qa_event_reminder_<n>, body "您好 {{first_name}}，提醒您 {{event_date}} …".

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
