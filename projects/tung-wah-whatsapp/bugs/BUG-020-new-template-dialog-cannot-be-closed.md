---
id: BUG-020
title: "New template dialog cannot be closed with Escape and does not keep keyboard focus"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.546Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-062]
frequency: always
---
## Summary
The 新建模板 (New template) pop-up does not work well with the keyboard:
- It is not marked as a dialog (no role=dialog).
- Keyboard focus stays on the page behind it, and Tab moves to elements behind the pop-up.
- Escape does nothing.

The 添加用户 (Add user) dialog does all of this correctly.

## Steps to reproduce
1. Open 新建模板 (New template).
2. Press Tab 20 times, then Escape.

## Expected
Focus moves into the dialog and stays inside it when pressing Tab; Escape closes it.

## Actual
Focus is outside the dialog; Escape is ignored.

## Evidence
- Screenshot: ![29-template-modal-keyboard.png](../explorations/2026-10-28-core-journeys/29-template-modal-keyboard.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
