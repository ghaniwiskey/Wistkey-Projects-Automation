---
id: BUG-005
title: "User can be created with a name of only spaces"
severity: minor
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.139Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-005]
frequency: always
---
## Summary
The 姓名 (Name) field is required in the browser, but a name made only of spaces is accepted. The server saves "   " (three spaces), and the user's card has an empty heading.

## Steps to reproduce
1. Open 用戶管理 (User management) > 添加用户 (Add user).
2. Enter name "   " (spaces only), a new email, and password Qa123456!
3. Click 創建用户 (Create user).

## Expected
The spaces are removed and the name is rejected as empty.

## Actual
POST /api/users returns 201 (created) with "name":"   ". The user card shows only the 編輯者 (Editor) badge and the email.

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
