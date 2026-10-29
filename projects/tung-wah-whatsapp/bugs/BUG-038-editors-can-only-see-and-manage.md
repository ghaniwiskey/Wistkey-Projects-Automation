---
id: BUG-038
title: "Editor should be able to get all templates from Twilio sync and create, edit, delete and send any of them"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T10:35:03.247Z
found: 2026-10-29T10:26:11.614Z
foundBy: "Role review with the product owner 2026-10-29 (after fix commit af9a789)"
tests: [TWW-012, TWW-013, TWW-084, TWW-085, TWW-088]
frequency: always
---
## Summary
Intended roles (product owner, 2026-10-29): an editor syncs from Twilio and creates, edits and deletes every template, only without user management. Contacts belong to the template, not to the person who uploaded them, so an editor should see and manage (upload, reset, delete, send) contacts uploaded by an admin or another editor. Since af9a789 every template route checks the owner, so an editor sees only templates they created and gets 未找到 (Not found) on all others, including the shared Twilio templates.

## Steps to reproduce
1. As admin, in 用戶管理 (User management) > 添加用戶 (Add user), create a user with role 編輯者 (Editor) and log in as that user.
2. Open 消息模版 (Message templates) and click 從 Twilio 同步 (Sync from Twilio).
3. Open http://localhost:3000/templates/<id of a template the admin created>, and its /contacts page.

## Expected
The editor sees every template after sync and can open, edit, upload contacts to, send, reset and delete any of them. Only 用戶管理 (User management) stays admin-only.

## Actual
- Step 2: the list is empty (暫無模板, No templates) unless the editor created templates; sync returns only the editor's own templates.
- Step 3: 模板不存在 (Template does not exist) on the page; every API (detail, contacts, export, stats, send, reset, mapping, upload, edit, delete) returns 404 未找到.
- Cause: lib/authz.ts requireTemplateOwner allows only the creator or ADMIN; /api/templates and the sync filter list only createdBy = user for non-admins.

Our run (2026-10-29): QA editor got 404 on every route of the QA admin's template and an empty sync.

## Evidence
- Retest run: ../runs/2026-10-29_1630_local_manual (TWW-012, TWW-013, TWW-084, TWW-085, TWW-088 recorded the owner-only behavior as pass under the old expectation)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-29: filed from Role review with the product owner 2026-10-29 (after fix commit af9a789) in the Test Manager app.
- 2026-10-29: Title reworded 2026-10-29 to state the intended role rule first (requirement from the product owner, not a regression of the BUG-001 fix)..
- 2026-10-29: summary notes that contacts belong to the template, not to the uploader.
