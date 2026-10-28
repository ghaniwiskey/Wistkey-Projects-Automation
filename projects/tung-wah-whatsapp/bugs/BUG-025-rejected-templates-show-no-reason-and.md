---
id: BUG-025
title: "Rejected templates show no reason and cannot be fixed or resubmitted; drafts cannot be submitted later"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:06:32.831Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-067, TWW-068]
frequency: always
---
## Summary
Twilio returns Meta's rejection reason (rejection_reason), but the app only shows the badge 已拒絕 (Rejected). There is no way to edit and resubmit a rejected template, and no way to submit a draft for review later. The only way forward is to delete the template and create it again.

## Steps to reproduce
1. Submit a template with the body "{{first_name}} 你好，你的會員編號是 {{member_no}}" ("{{first_name}} hello, your member number is {{member_no}}").
2. Sync and open the template.

## Expected
The rejection reason is shown; edit/resubmit (and submit-draft) are available.

## Actual
Only the 已拒絕 (Rejected) badge; no actions.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![32-templates-rejected-duplicate.png](../explorations/2026-10-28-core-journeys/32-templates-rejected-duplicate.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
