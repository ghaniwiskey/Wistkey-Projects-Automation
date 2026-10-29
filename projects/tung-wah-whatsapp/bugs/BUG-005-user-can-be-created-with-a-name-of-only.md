---
id: BUG-005
title: "User can be created with a name of only spaces"
severity: minor
status: verified
env: local
url: "http://localhost:3000/users"
updated: 2026-10-29T09:31:28.273Z
found: 2026-10-28T06:37:46.139Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-005]
frequency: always
---
## Summary
A user can be created with a name made only of spaces, so the user card has an empty heading.

## Steps to reproduce
1. Open 用戶管理 (User management) > 添加用户 (Add user).
2. Enter name "   " (spaces only), a new email (e.g. qa-<n>@example.test) and a valid password (e.g. Qa123456!).
3. Click 創建用户 (Create user).

## Expected
The spaces are removed and the name is rejected as empty.

## Actual
The 姓名 (Name) field is required in the browser, but spaces pass. POST /api/users returns 201 (created) with "name":"   ". The user card shows only the 編輯者 (Editor) badge and the email.

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
