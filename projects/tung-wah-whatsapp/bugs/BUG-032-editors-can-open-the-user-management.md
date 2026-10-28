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
The navigation hides user management from editors, but an editor can open /users directly and use the add-user dialog. The user list is empty because its API correctly returns 403.

## UI labels in English
- 用户管理: User management
- 添加用户: Add user

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
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
