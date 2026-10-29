---
id: BUG-001
title: "Editor can read contacts, download the report and trigger sends of another user's template"
severity: critical
status: verified
env: local
url: "http://localhost:3000/api/templates/<id>/contacts"
updated: 2026-10-29T10:27:02.872Z
found: 2026-10-28T06:37:45.622Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-012, TWW-013, TWW-084]
frequency: always
---
## Summary
An editor can view, download, reset and delete the contacts of a template they do not own, and the send endpoint does not stop them either. Only the template page itself checks ownership.

## Steps to reproduce
1. Log in as an admin. Create a draft template (Meta unticked) and upload an Excel file with one contact (columns 姓名 (Name), 手提電話 (Mobile phone), 會員編號 (Member number)). Note the template id in the URL: /templates/<template id>.
2. In 用戶管理 (User management) > 添加用户 (Add user), create a user with role 編輯者 (Editor). Log out and log in as the editor.
3. On 消息模版 (Message templates), click 從 Twilio 同步 (Sync from Twilio). The admin's template appears in the editor's list.
4. Click its card. The page says 模板不存在 ("Template does not exist"). This part is correct.
5. Open http://localhost:3000/templates/<template id>/contacts
6. Open http://localhost:3000/api/templates/<template id>/export
7. On the contacts page, click 全部重置 (Reset all) and confirm. Then click the trash icon of the contact and confirm.
8. Optional, send check (API only, no UI path; see TWW-013). Run it only when the template has no pending contacts, otherwise real WhatsApp messages are sent. In the browser console: `await fetch('/api/send', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({templateId: '<template id>'})}).then(r => r.status)`

## Expected
For a user who does not own the template, the contacts page and API, the export, reset, delete and send all return 403 (forbidden) or 404 (not found), the same as the template page.

## Actual
- Step 5: 聯繫人管理 (Contact management) lists the admin's contacts with their member data. The API returns 200 (OK) with the data.
- Step 6: 200 (OK); reply_report_<template id>.xlsx downloads.
- Step 7: "重置成功！" ("Reset successful!"), then the contact is deleted.
- Step 8: 400 "沒有待發送的聯繫人" ("No contacts waiting to be sent"). This error comes after the permission check, so with pending contacts the editor would send real WhatsApp messages.

Our run (reproduced twice): contacts API returned [{"name":"QA Tester","phone":"85265248661","customVars":{"會員編號":"M0001",...}}] for the admin's template qa_owner_<n>, uploaded from data/contacts-valid-hk.xlsx.

## Evidence
- Screenshot: ![sync](../explorations/2026-10-28-core-journeys/45-ui-editor-sync-lists-admin-templates.png)
- Screenshot: ![contacts](../explorations/2026-10-28-core-journeys/46-ui-editor-sees-contacts.png)
- Screenshot: ![deleted](../explorations/2026-10-28-core-journeys/47-ui-editor-deleted-contact.png)
- API responses: ../explorations/2026-10-28-core-journeys/11-editor-api-probe.txt
- Screenshot: ![api probe](../explorations/2026-10-28-core-journeys/11-editor-api-probe.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: also writes: a QA editor ran 全部重置 ("重置成功！") and deleted a contact on the admin template; the contacts page shows the data in the UI (40-editor-sees-admin-contacts.png). Linked TWW-084.
- 2026-10-28: steps rewritten as UI-only and reproduced in the browser (editor: sync, card, /contacts, report link, 全部重置, delete). Send stays API-only (TWW-013).
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix commit af9a789)..
- 2026-10-29: 2026-10-29: product owner decided editors manage all templates, so the owner-only rule this fix introduced is too strict for editors; tracked in BUG-038. Viewers must still never change data..
