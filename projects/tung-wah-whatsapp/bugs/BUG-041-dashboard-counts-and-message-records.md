---
id: BUG-041
title: "Dashboard counts and message records include only templates the user created, even for admins"
severity: major
status: open
env: local
url: "http://localhost:3000/dashboard"
updated: 2026-10-29T12:05:47.159Z
found: 2026-10-29T12:05:47.159Z
foundBy: "Dashboard test 2026-10-29"
tests: [TWW-108, TWW-109]
frequency: always
---
## Summary
The 儀表板 cards and 消息記錄 count only templates the logged-in user created, while the 模板審核狀態 table on the same page lists every synced template. Admins get wrong totals; editors and viewers get an empty dashboard.

## Steps to reproduce
1. Log in as an admin who did not create the Twilio templates (e.g. a new QA admin), while other templates have a message sent and replied this month.
2. Open 儀表板 (Dashboard) at http://localhost:3000/dashboard.
3. Compare the cards with the 模板審核狀態 (Template status) table, then filter 消息記錄 (Message records) by one of the listed templates.
4. Log in as an editor and as a viewer and open 儀表板.

## Expected
Cards and message records cover every template the user's role can see (admins, editors and viewers: all templates, per the product owner 2026-10-29). Filtering 消息記錄 by a template listed on the page shows its contacts.

## Actual
Admin: 本月已發送 (Sent this month) 0 and 總模板數 (Total templates) 1, while the table lists 5 templates and one of them had a message sent and replied this month. Filtering 消息記錄 by that template shows 暫無記錄 (No records) although the table shows 1 contact. Editor and viewer: every card 0 and an empty table. Our run (2026-10-29): QA admin cards 0 / 0 / N/A / 1 / 1 vs 5 templates in the table; qa_event_reminder_357859 (1 contact, 1 reply) filtered -> 暫無記錄. Cause in code: app/api/dashboard/stats and app/api/dashboard/messages filter by createdBy = the user.

## Evidence
- Screenshot of the QA admin dashboard (cards vs template table) in runs of 2026-10-29 dashboard test

## Environment
- Base URL: http://localhost:3000/dashboard
- Env: local

## History
- 2026-10-29: filed from Dashboard test 2026-10-29 in the Test Manager app.
