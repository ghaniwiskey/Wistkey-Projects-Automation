---
id: BUG-006
title: "Template name rule (English, digits, underscore) is not enforced"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T06:37:46.267Z
found: 2026-10-28T06:37:46.267Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-016]
frequency: always
---
## Summary
The hint says 模板名稱 accepts only 英文、數字、底線, but "QA Draft 測試 <n>" is accepted by the form, the API and Twilio; Meta will reject it on submission.

## Steps to reproduce
1. Open 新建模板, untick Meta submission
2. Name "QA Draft 測試 1793168875770", body "QA draft, please ignore.", button OK
3. Click 創建模板

## Expected
A validation message; no template created.

## Actual
Alert "模板已創建！"; Twilio content HX4fdb2bf84325db06231c9e4e918bc937 created with that friendly_name (deleted afterwards).

## Evidence
- Screenshot: ![04-template-form-filled.png](../explorations/2026-10-28-core-journeys/04-template-form-filled.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
