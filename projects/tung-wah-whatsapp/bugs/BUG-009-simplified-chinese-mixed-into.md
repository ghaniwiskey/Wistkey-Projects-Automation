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
The interface mixes Simplified and Traditional Chinese. The navigation uses Traditional Chinese, but the user-management page and new-template form contain the Simplified forms listed in the steps and actual result.

## UI labels in English
- 用戶管理: User management
- 添加用户: Add user
- 新建模板: New template

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
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
