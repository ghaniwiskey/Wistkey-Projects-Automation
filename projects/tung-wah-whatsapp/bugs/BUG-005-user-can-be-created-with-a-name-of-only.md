---
id: BUG-005
title: "User can be created with a name of only spaces"
severity: minor
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T06:37:46.139Z
found: 2026-10-28T06:37:46.139Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-005]
frequency: always
---
## Summary
The 姓名 field is required in the browser but spaces pass; the server saves "   " and the user card has an empty heading.

## Steps to reproduce
1. Open 用戶管理 > 添加用户
2. Enter name "   ", a new email, password Qa123456!
3. Click 創建用户

## Expected
Name is trimmed and rejected as empty.

## Actual
POST /api/users 201 with "name":"   "; the card shows only the 編輯者 badge and email.

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
