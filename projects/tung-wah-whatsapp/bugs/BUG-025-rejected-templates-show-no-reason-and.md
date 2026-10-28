---
id: BUG-025
title: "Rejected templates show no reason and cannot be fixed or resubmitted; drafts cannot be submitted later"
severity: minor
status: wont-fix
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T10:39:30.297Z
found: 2026-10-28T08:06:32.831Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: []
frequency: always
---
## Summary
A rejected template shows no reason and cannot be fixed or resubmitted, and a draft cannot be submitted later. The only way forward is to delete and recreate.

## Steps to reproduce
Note: this submits to Meta, which cannot be undone.
1. Submit a template that Meta will reject, e.g. body "{{first_name}} 你好，你的會員編號是 {{member_no}}" ("{{first_name}} hello, your member number is {{member_no}}"; it starts with a variable).
2. Wait for the review, click 從 Twilio 同步 (Sync from Twilio) and open the template.
3. Open any draft template and look for a way to submit it.

## Expected
The rejection reason is shown; edit and resubmit (and submit-draft) are available.

## Actual
Only the 已拒絕 (Rejected) badge, with no actions. Twilio does return Meta's rejection_reason, but the app does not show it. Drafts have no submit action.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![32-templates-rejected-duplicate.png](../explorations/2026-10-28-core-journeys/32-templates-rejected-duplicate.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-28: status open -> wont-fix.
- 2026-10-28: Wont-fix follow-up: TWW-067, TWW-068 now expect the accepted behavior; tests list emptied..
