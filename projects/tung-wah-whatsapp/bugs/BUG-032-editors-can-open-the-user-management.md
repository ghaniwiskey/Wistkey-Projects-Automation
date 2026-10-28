---
id: BUG-032
title: "Editors can open the user management page (/users) with an active 添加用户 button"
severity: minor
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T08:18:31.920Z
found: 2026-10-28T08:18:31.920Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-083]
frequency: always
---
## Summary
The nav hides 用戶管理 for editors, but /users renders the page and the add-user dialog; the list is empty because the API returns 403.

## Steps to reproduce
1. Log in as a QA editor
2. Open /users

## Expected
No-permission message or redirect.

## Actual
用户管理 page with 添加用户.

## Evidence
- Screenshot: ![44-role-findings.png](../explorations/2026-10-28-core-journeys/44-role-findings.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
