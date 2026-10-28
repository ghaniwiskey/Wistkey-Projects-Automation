---
id: BUG-020
title: "New template dialog cannot be closed with Escape and does not keep keyboard focus"
severity: minor
status: wont-fix
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T10:39:29.918Z
found: 2026-10-28T07:16:23.546Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: []
frequency: always
---
## Summary
The New template pop-up does not work with the keyboard: focus stays behind it, Tab moves around the page, and Escape does not close it.

## Steps to reproduce
1. Open 新建模板 (New template).
2. Press Tab 20 times, then Escape.

## Expected
Focus moves into the pop-up and stays inside it when pressing Tab; Escape closes it (as the 添加用户 (Add user) dialog does).

## Actual
Focus stays outside the pop-up, Tab moves to elements behind it, and Escape is ignored. The pop-up is not marked as a dialog (no role=dialog).

## Evidence
- Screenshot: ![29-template-modal-keyboard.png](../explorations/2026-10-28-core-journeys/29-template-modal-keyboard.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-28: status open -> wont-fix.
- 2026-10-28: Wont-fix follow-up: TWW-062 now expect the accepted behavior; tests list emptied..
