---
id: BUG-010
title: "Icon-only buttons and add-user fields have no accessible name"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T06:37:46.786Z
found: 2026-10-28T06:37:46.786Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-045]
frequency: always
---
## Summary
Trash icons (template cards, users, contacts), the dialog close X and the button-row remove x are unnamed buttons; the add-user labels are not linked to their inputs.

## Steps to reproduce
1. Open the templates list, 用戶管理 (and 添加用户), a contacts page
2. Inspect the accessibility tree

## Expected
Each control has a name.

## Actual
Snapshot shows "button" with no name; add-user textboxes have no label.

## Evidence
- Screenshot: ![evidence](../explorations/2026-10-28-core-journeys/14-unnamed-icon-buttons.png)
## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
