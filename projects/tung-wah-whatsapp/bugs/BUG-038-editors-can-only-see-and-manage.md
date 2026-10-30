---
id: BUG-038
title: "Editor should be able to get all templates from Twilio sync and create, edit, delete and send any of them (including their contacts)"
severity: major
status: duplicate
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-30T07:10:12.039Z
found: 2026-10-29T10:26:11.614Z
foundBy: "Role review with the product owner 2026-10-29 (after fix commit af9a789)"
tests: []
frequency: always
---
## Summary
Superseded by BUG-044 for the remaining report-download defect. This tracking split does not assert full verification of all original checks.

Partially fixed in build 1cdd076: editor shared lists, detail, contacts, sync, upload/reset/contact deletion, question editing and sending now work. Downloading another user's template report still returns 404 模板不存在 because the export route retains its creator-or-admin check. Editors should be able to download these reports too.

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
- 2026-10-29: title and summary reworded (contacts belong to the template, not to the uploader).
- 2026-10-30: Retest runs/2026-10-30_1349_local_manual: shared lists/detail/contacts/sync now work; editor upload/reset/contact delete/question edit/send passed. Report export still returns 404 模板不存在 for another owner template, reproduced twice: export/route.ts retains creator-or-admin check. TWW-012 fails; other executed role cases updated. TWW-085 partly covered, live Twilio delete by editor not exercised..
- 2026-10-30: status open -> duplicate; At user request, superseded by focused BUG-044 for the remaining shared-report export defect. Original shared access/sync/contact/send fixes were observed in runs/2026-10-30_1349_local_manual; this is a tracking split, not a claim every original check passed (live editor Twilio deletion was not exercised). Relinked TWW-012 to BUG-044; updated related TWW-013/TWW-084/TWW-085/TWW-088/TWW-116 notes and cleared this superseded retest list..
