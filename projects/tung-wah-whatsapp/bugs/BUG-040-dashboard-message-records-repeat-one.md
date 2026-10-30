---
id: BUG-040
title: "Dashboard message records repeat one contact across pages and never show another"
severity: minor
status: wont-fix
env: local
url: "http://localhost:3000/dashboard"
updated: 2026-10-30T05:45:54.253Z
found: 2026-10-29T12:05:28.167Z
foundBy: "Dashboard test 2026-10-29"
tests: []
frequency: always
---
## Summary
Contacts uploaded in one file share the same created time, and 消息記錄 sorts only by that time, so the page split is unstable: a contact shows on two pages and another is never listed.

## Steps to reproduce
1. As admin upload an Excel file of 1000 contacts (e.g. contacts-1000-rows.xlsx) to a template, without sending.
2. Open 儀表板 and page through 消息記錄 with the > button.
3. Compare the last row of page 10 with the first row of page 11, and search the last row of the file (e.g. Bulk 0999).

## Expected
Each contact appears on exactly one page; going through all pages lists every contact once.

## Actual
Page 10 ends with Bulk 0499 and page 11 starts with Bulk 0499 again; Bulk 0999 is on no page (only found by search). Our run (2026-10-29): 1001 contacts, 21 pages, 1001 rows fetched but only 1000 different contacts. Cause in code: app/api/dashboard/messages orders by createdAt only; adding a unique tie-breaker (id) fixes it.

## Evidence
- 

## Environment
- Base URL: http://localhost:3000/dashboard
- Env: local

## History
- 2026-10-29: filed from Dashboard test 2026-10-29 in the Test Manager app.
- 2026-10-29: status open -> wont-fix.
- 2026-10-30: Closed as wont-fix: linked cases updated to the accepted behavior (TWW-111 no longer checks repeats or gaps between pages); tests list emptied..
