---
id: BUG-023
title: "AUTHENTICATION category can never be submitted and leaves an orphan Twilio draft"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:32.532Z
found: 2026-10-28T08:06:32.532Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-065]
frequency: always
---
## Summary
The form always creates twilio/quick-reply content, but Meta requires whatsapp/authentication for the AUTHENTICATION category. Submission fails, an English warning appears, and the created content remains in Twilio as an orphan draft.

## UI labels in English
- 新建模板: New template
- 模板已創建！: Template created!

## Steps to reproduce
1. 新建模板, category AUTHENTICATION, Meta ticked, any body and button
2. Submit

## Expected
Category works or is not offered; no orphan content.

## Actual
Alert "模板已創建！ 警告：模板已創建但審核提交失敗: Only whatsapp/authentication is valid for category AUTHENTICATION, but provided content is for the twilio/quick-reply type"; draft qa_auth_<n> left in Twilio.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
