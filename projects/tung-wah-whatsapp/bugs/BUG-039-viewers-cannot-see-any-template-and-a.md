---
id: BUG-039
title: "Viewer should be able to get all templates from Twilio sync and view them read-only, including their contacts (currently sees no templates, and their sync changes app data)"
severity: major
status: duplicate
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-30T07:10:12.227Z
found: 2026-10-29T10:26:11.761Z
foundBy: "Role review with the product owner 2026-10-29 (after fix commit af9a789)"
tests: []
frequency: always
---
## Summary
Superseded by BUG-044 for report downloads and BUG-045 for viewer detail-page write controls. This tracking split does not assert full verification of all original checks.

Partially fixed in build 1cdd076: viewers can list and read shared templates, contacts and replies, and their sync no longer writes app data. Shared report export still returns 404 模板不存在, and the detail page still exposes edit/delete/upload/mapping/send controls even though checked write APIs reject them with 403. Viewers should have report access and a read-only UI.

## Steps to reproduce
1. As admin create a user with role 查看者 (Viewer) and log in as that user.
2. Open 消息模版 (Message templates) and click 從 Twilio 同步 (Sync from Twilio).
3. Open http://localhost:3000/templates/<id of any template> and its 回覆統計 (Reply statistics).

## Expected
After sync the viewer sees every template and can open its message, contacts, reply statistics and download the report, with no way to change anything. A viewer's sync only refreshes what they see: it does not create, overwrite or delete templates, contacts or replies.

## Actual
- Step 2: 暫無模板 (No templates); the sync response is empty. Only Twilio templates the app does not have yet come back, as previews without an id that cannot be opened.
- Step 3: 模板不存在 (Template does not exist); detail, contacts, export, stats and responses return 404 未找到.
- Sync writes for viewers (code, app/api/twilio/templates/route.ts): templates that already exist are upserted from Twilio (name, body, buttons, status) and templates missing in Twilio are deleted with their contacts, uploads and replies; only creating new templates is skipped for viewers. Not yet reproduced as a viewer (needs a throwaway Twilio draft).

Our run (2026-10-29): QA viewer list [], sync [], 404 on the QA admin's template.

## Evidence
- Retest run: ../runs/2026-10-29_1630_local_manual (viewer API probes)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-29: filed from Role review with the product owner 2026-10-29 (after fix commit af9a789) in the Test Manager app.
- 2026-10-29: Title reworded 2026-10-29 to state the intended role rule first (requirement from the product owner, not a regression of the BUG-001 fix)..
- 2026-10-29: title and summary reworded (contacts belong to the template, not to the uploader).
- 2026-10-30: Retest runs/2026-10-30_1349_local_manual: shared lists/detail/contacts/replies/stats now work and viewer sync preserved a stale local draft and contact unchanged (TWW-106 pass). Report export still returns 404 模板不存在 twice. Detail UI still offers edit/delete/upload/mapping/send controls; checked viewer PATCH/DELETE APIs return 403. TWW-105 fails; related cases updated..
- 2026-10-30: status open -> duplicate; At user request, superseded by focused BUG-044 (shared-report export 404) and BUG-045 (viewer detail write controls). Shared reads and no-write sync passed in runs/2026-10-30_1349_local_manual. This is a tracking split, not full verification. Relinked TWW-105 to BUG-044/BUG-045, reused TWW-087 for read-only controls, updated TWW-088/TWW-106/TWW-112/TWW-116 notes, and cleared this superseded retest list..
