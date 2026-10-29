---
id: BUG-006
title: "Template name rule (English, digits, underscore) is not enforced"
severity: minor
status: verified
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T09:31:28.458Z
found: 2026-10-28T06:37:46.267Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-016]
frequency: always
---
## Summary
The template name hint says only English letters, digits and underscore are allowed, but names with spaces and Chinese characters are accepted. Meta rejects such names when the template is submitted.

## Steps to reproduce
1. Open 新建模板 (New template) and untick Meta submission.
2. Enter name "QA Draft 測試 <n>" (測試 = "test"), body "QA draft, please ignore.", button OK.
3. Click 創建模板 (Create template).
4. Delete the template afterwards (it is also created in Twilio).

## Expected
A validation message under 模板名稱 (Template name), whose hint says 英文、數字、底線 (English letters, digits, underscore). No template is created.

## Actual
"模板已創建！" ("Template created!"). The template is created in the app and in Twilio with that name (Twilio friendly_name).

Our run: "QA Draft 測試 1793168875770" created Twilio content HX4fdb2bf84325db06231c9e4e918bc937 (deleted afterwards).

## Evidence
- Screenshot: ![04-template-form-filled.png](../explorations/2026-10-28-core-journeys/04-template-form-filled.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
