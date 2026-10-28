---
id: BUG-006
title: "Template name rule (English, digits, underscore) is not enforced"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.267Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-016]
frequency: always
---
## Summary
The hint under 模板名稱 (Template name) says it accepts only 英文、數字、底線 (English letters, digits, underscore). But the name "QA Draft 測試 <n>" (with spaces and the Chinese word 測試, "test") is accepted by the form, the API and Twilio. Meta will reject such a name when the template is submitted for review.

## Steps to reproduce
1. Open 新建模板 (New template) and untick Meta submission.
2. Enter name "QA Draft 測試 1793168875770", body "QA draft, please ignore.", button OK.
3. Click 創建模板 (Create template).

## Expected
A validation message appears and no template is created.

## Actual
Alert "模板已創建！" ("Template created!"). Twilio content HX4fdb2bf84325db06231c9e4e918bc937 was created with that friendly_name (the template's name in Twilio). It was deleted afterwards.

## Evidence
- Screenshot: ![04-template-form-filled.png](../explorations/2026-10-28-core-journeys/04-template-form-filled.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
