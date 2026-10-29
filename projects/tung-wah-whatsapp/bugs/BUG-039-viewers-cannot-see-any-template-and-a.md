---
id: BUG-039
title: "Viewer should be able to get all templates from Twilio sync and view them read-only (currently sees no templates, and their sync changes app data)"
severity: major
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T12:06:19.864Z
found: 2026-10-29T10:26:11.761Z
foundBy: "Role review with the product owner 2026-10-29 (after fix commit af9a789)"
tests: [TWW-105, TWW-106, TWW-088]
frequency: always
---
## Summary
Intended roles (product owner, 2026-10-29): a viewer sees every template (message, contacts, reply statistics, report) and can sync from Twilio, read-only. Contacts belong to the template, not to the person who uploaded them, so a viewer should see contacts uploaded by an admin or an editor. Since af9a789 a viewer can see nothing, because templates are filtered by owner and viewers cannot own any; yet the viewer's sync still overwrites templates and deletes the ones missing in Twilio.

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
- 2026-10-29: summary notes that contacts belong to the template, not to the uploader.
