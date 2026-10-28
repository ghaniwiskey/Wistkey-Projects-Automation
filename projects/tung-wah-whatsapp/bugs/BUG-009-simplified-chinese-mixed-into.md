---
id: BUG-009
title: "Simplified Chinese mixed into Traditional UI (user management, template form)"
severity: trivial
status: open
env: local
url: "http://localhost:3000/users"
updated: 2026-10-28T06:37:46.658Z
found: 2026-10-28T06:37:46.658Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-009]
frequency: always
---
## Summary
Nav says 用戶管理 but the page uses Simplified forms: 用户管理, 用户列表, 添加用户, 添加新用户, 創建用户, 系统管理员, 確定要刪除此用户嗎？. The new-template form shows 变数示例值, Meta 审核必填, 陈大文.

## Steps to reproduce
1. Open 用戶管理 and 添加用户
2. Open 新建模板 and type a body with {{first_name}}

## Expected
Traditional Chinese throughout.

## Actual
Simplified characters as listed.

## Evidence
- Screenshot: ![02-blank-name-user.png](../explorations/2026-10-28-core-journeys/02-blank-name-user.png)

## Environment
- Base URL: http://localhost:3000/users
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
