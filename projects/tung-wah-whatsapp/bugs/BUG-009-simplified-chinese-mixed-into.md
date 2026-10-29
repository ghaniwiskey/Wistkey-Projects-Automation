---
id: BUG-009
title: "Simplified Chinese characters mixed into the Traditional Chinese UI (user management, template form)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-29T09:31:30.970Z
found: 2026-10-28T06:37:46.658Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-009]
frequency: always
---
## Summary
The user management page and the new template form use Simplified Chinese characters in a Traditional Chinese app.

## Steps to reproduce
1. Open 用戶管理 (User management) and 添加用户 (Add user).
2. Open 新建模板 (New template) and type a body that contains {{first_name}}.

## Expected
Traditional Chinese everywhere (the menu correctly says 用戶管理).

## Actual
Simplified forms are shown:
- User pages: 用户管理 (User management), 用户列表 (User list), 添加用户 (Add user), 添加新用户 (Add new user), 創建用户 (Create user), 系统管理员 (System administrator), 確定要刪除此用户嗎？ ("Are you sure you want to delete this user?"). Simplified 户, 系统, 管理员; Traditional 戶, 系統, 管理員.
- Template form: 变数示例值 (Variable example value; Traditional 變數示例值), Meta 审核必填 (Required for Meta review; Traditional 審核), 陈大文 (sample name Chan Tai Man; Traditional 陳大文).

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: Still fails in runs/2026-10-29_1630_local_manual: all UI labels are Traditional after af9a789, only the seeded admin name 系统管理员 (prisma/seed.ts) remains on 用戶管理..
