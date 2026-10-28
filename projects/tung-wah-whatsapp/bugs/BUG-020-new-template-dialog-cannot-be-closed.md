---
id: BUG-020
title: "New template dialog cannot be closed with Escape and does not keep keyboard focus"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T07:16:23.546Z
found: 2026-10-28T07:16:23.546Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-062]
frequency: always
---
## Summary
The new-template modal has no dialog role. Keyboard focus remains on the page and Tab can reach controls behind the modal; Escape does not close it. The add-user dialog handles these correctly.

## UI labels in English
- 新建模板: New template

## Steps to reproduce
1. Open 新建模板
2. Press Tab 20 times, then Escape

## Expected
Focus inside, trapped, Escape closes.

## Actual
Focus outside the modal, Escape ignored.

## Evidence
- Screenshot: ![29-template-modal-keyboard.png](../explorations/2026-10-28-core-journeys/29-template-modal-keyboard.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
