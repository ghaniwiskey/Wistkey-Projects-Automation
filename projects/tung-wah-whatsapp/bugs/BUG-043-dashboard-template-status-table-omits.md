---
id: BUG-043
title: "Dashboard template status table omits local-only templates counted in cards and message records"
severity: minor
status: wont-fix
env: local
url: "https://murmuring-amused-diaper.ngrok-free.dev/dashboard"
updated: 2026-10-30T07:26:24.132Z
found: 2026-10-30T06:53:37.807Z
foundBy: "runs/2026-10-30_1349_local_manual"
tests: []
frequency: always
---
## Summary
The dashboard cards and message records include local-only templates, but the template status table only lists Twilio-backed templates. The legacy template and its contact cannot be reconciled against the table.

## Steps to reproduce
1. Log in as an admin with at least one local-only template containing a contact and at least one Twilio-backed template.
2. Open 儀表板 (Dashboard) and compare 總模板數 (Total templates) with the 模板審核狀態 (Template status) rows.
3. Find the local-only template in 消息記錄 (Message records); reload the dashboard and compare again.

## Expected
The status table lists every template included in the totals and message records (TWW-108).

## Actual
Total templates is 6, but the status table lists 5 Twilio-backed templates. qa_legacy_909191 is absent from the table, while its pending contact appears in message records. Observed before and after the QA send; cards and cross-role message scope are otherwise correct.

## Evidence
- Screenshot: ![dashboard mismatch](../explorations/2026-10-30-report-retest/043-dashboard-missing-legacy.png)
- GET /api/templates returns 6 records, including qa_legacy_909191 with twilioContentSid null; GET /api/twilio/templates returns 5.

## Environment
- Base URL: https://murmuring-amused-diaper.ngrok-free.dev/dashboard
- Env: local

## History
- 2026-10-30: filed from runs/2026-10-30_1349_local_manual in the Test Manager app.
- 2026-10-30: status open -> wont-fix.
- 2026-10-30: Accepted behavior synchronized to TWW-108: local-only templates may be counted in totals but omitted from Twilio status rows. Cleared tests list; historic failed run remains factual..
