---
id: BUG-023
title: "AUTHENTICATION category can never be submitted and leaves an orphan Twilio draft"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:06:32.532Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-065]
frequency: always
---
## Summary
The AUTHENTICATION category can be chosen but can never be submitted, and every attempt leaves an unused template behind in Twilio.

## Steps to reproduce
Note: this submits to Meta, which cannot be undone. Use a throwaway name (e.g. qa_auth_<n>).
1. Open 新建模板 (New template): category AUTHENTICATION, Meta ticked, any body and button.
2. Submit.

## Expected
The category works, or it is not offered; nothing is left behind in Twilio.

## Actual
- Alert "模板已創建！ 警告：模板已創建但審核提交失敗: Only whatsapp/authentication is valid for category AUTHENTICATION, but provided content is for the twilio/quick-reply type" ("Template created! Warning: template created but submission for review failed: ..."). The error part is in English.
- The template stays in Twilio as a draft.
- Cause: the form always builds twilio/quick-reply content; Meta requires whatsapp/authentication content for this category.

## Evidence
- Screenshot: ![34-template-validation.png](../explorations/2026-10-28-core-journeys/34-template-validation.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
