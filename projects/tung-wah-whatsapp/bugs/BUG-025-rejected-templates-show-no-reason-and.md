---
id: BUG-025
title: "Rejected templates show no reason and cannot be fixed or resubmitted; drafts cannot be submitted later"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-28T08:06:32.831Z
found: 2026-10-28T08:06:32.831Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-067, TWW-068]
frequency: always
---
## Summary
Twilio returns Meta's rejection_reason but the app only shows 已拒絕. There is no edit, resubmit or "submit draft" action, so the only way forward is delete and recreate.

## Steps to reproduce
1. Submit {{first_name}} 你好，你的會員編號是 {{member_no}}
2. Sync and open the template

## Expected
Reason shown; edit/resubmit or submit-draft available.

## Actual
Only the 已拒絕 badge; no actions.

## Evidence
- Screenshot: ![35-template-status-sync.png](../explorations/2026-10-28-core-journeys/35-template-status-sync.png)
- Screenshot: ![32-templates-rejected-duplicate.png](../explorations/2026-10-28-core-journeys/32-templates-rejected-duplicate.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
