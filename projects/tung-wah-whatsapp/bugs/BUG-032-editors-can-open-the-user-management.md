---
id: BUG-032
title: "Editors can open the user management page (/users) with an active 添加用户 (Add user) button"
severity: minor
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:18:31.920Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-083]
frequency: always
---
## Summary
The menu hides 用戶管理 (User management) from editors, but an editor who opens /users directly gets the page and the add-user dialog. The user list is empty because the API returns 403 (forbidden).

## Steps to reproduce
1. Log in as a QA editor.
2. Open /users.

## Expected
A no-permission message or a redirect.

## Actual
The 用户管理 (User management) page with an active 添加用户 (Add user) button.

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
