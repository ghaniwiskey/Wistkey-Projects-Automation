---
id: BUG-032
title: "Editors can open the user management page (/users) with an active 添加用户 (Add user) button"
severity: minor
status: verified
env: local
url: "http://localhost:3000/users"
updated: 2026-10-29T09:31:30.422Z
found: 2026-10-28T08:18:31.920Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-083]
frequency: always
---
## Summary
Editors cannot see 用戶管理 (User management) in the menu, but they can still open /users directly and get the page with an active Add user button.

## Steps to reproduce
1. Log in as a user with role 編輯者 (Editor).
2. Open http://localhost:3000/users

## Expected
A no-permission message or a redirect.

## Actual
The 用户管理 (User management) page with an active 添加用户 (Add user) button. The user list is empty because the API returns 403 (forbidden).

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
