---
id: BUG-023
title: "AUTHENTICATION category can never be submitted and leaves an orphan Twilio draft"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:32.532Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-065]
frequency: always
---
## Summary
The form offers the AUTHENTICATION category, but always builds the template as twilio/quick-reply content. Meta requires whatsapp/authentication content for this category, so submission always fails. The content is still created in Twilio (left behind as an unused draft), and the error in the warning is in English.

## Steps to reproduce
1. Open 新建模板 (New template): category AUTHENTICATION, Meta ticked, any body and button.
2. Submit.

## Expected
The category works, or it is not offered; nothing is left behind in Twilio.

## Actual
Alert "模板已創建！ 警告：模板已創建但審核提交失敗: Only whatsapp/authentication is valid for category AUTHENTICATION, but provided content is for the twilio/quick-reply type" ("Template created! Warning: template created but submission for review failed: ..."). The draft qa_auth_<n> is left in Twilio.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
