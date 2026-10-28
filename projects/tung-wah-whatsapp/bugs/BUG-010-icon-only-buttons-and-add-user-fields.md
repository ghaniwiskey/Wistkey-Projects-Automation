---
id: BUG-010
title: "Icon-only buttons and add-user fields have no accessible name"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.786Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-045]
frequency: always
---
## Summary
Several controls cannot be identified by screen readers and other assistive tools:
- These icon-only buttons have no accessible name: the trash (delete) icons on template cards, users and contacts; the X that closes the dialog; and the x that removes a button row. They are read out only as "button".
- In the 添加用户 (Add user) dialog, the field labels are not linked to their inputs, so the text boxes have no name.

## Steps to reproduce
1. Open the templates list, 用戶管理 (User management) with the 添加用户 (Add user) dialog, and a contacts page.
2. Inspect the accessibility tree.

## Expected
Each control has a name.

## Actual
The accessibility snapshot shows "button" with no name; the add-user text boxes have no label.

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-28-core-journeys/14-unnamed-icon-buttons.png)
## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
