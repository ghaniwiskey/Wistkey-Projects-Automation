---
id: BUG-009
title: "Simplified Chinese characters mixed into the Traditional Chinese UI (user management, template form)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:46.658Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-009]
frequency: always
---
## Summary
The app uses Traditional Chinese (the script used in Hong Kong), but some screens use Simplified Chinese characters. The menu says 用戶管理 (User management, Traditional), but the page itself uses Simplified forms:
- 用户管理 (User management), 用户列表 (User list), 添加用户 (Add user), 添加新用户 (Add new user), 創建用户 (Create user), 系统管理员 (System administrator), 確定要刪除此用户嗎？ ("Are you sure you want to delete this user?"). The Simplified characters are 户 (Traditional 戶), 系统 (系統) and 管理员 (管理員).
- The new template form shows 变数示例值 (Variable example value; Traditional 變數示例值), Meta 审核必填 (Required for Meta review; Traditional 審核) and 陈大文 (the sample name Chan Tai Man; Traditional 陳大文).

## Steps to reproduce
1. Open 用戶管理 (User management) and 添加用户 (Add user).
2. Open 新建模板 (New template) and type a body that contains {{first_name}}.

## Expected
Traditional Chinese everywhere.

## Actual
The Simplified characters listed above are shown.

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
