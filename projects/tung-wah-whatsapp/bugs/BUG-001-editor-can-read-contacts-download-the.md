---
id: BUG-001
title: "Editor can read contacts, download the report and trigger sends of another user's template"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/templates/<id>/contacts"
updated: 2026-10-28T06:37:45.622Z
found: 2026-10-28T06:37:45.622Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-012, TWW-013, TWW-084]
frequency: always
---
## Summary
The contacts, export and send endpoints do not check template ownership. GET /api/templates/<id> correctly returns 404 for a non-owner, but /contacts and /export return the owner's contacts (names, phones, member data) and POST /api/send passes authorization.

## Steps to reproduce
UI only (no API calls needed):
1. As admin create a draft template qa_owner_<n> (Meta unticked) and upload data/contacts-valid-hk.xlsx to it.
2. In 用戶管理 > 添加用户 create a QA editor; log out and log in as the editor.
3. On 消息模版 click 從 Twilio 同步: the admin's templates appear in the list.
4. Click the qa_owner_<n> card: page says 模板不存在.
5. Add /contacts to the URL: 聯繫人管理 lists QA Tester with phone 85265248661 and member data.
6. Open the report link (template URL with /templates/ -> /api/templates/ and /export added): reply_report_<id>.xlsx downloads.
7. On the contacts page click 全部重置 (confirm): "重置成功！"; click the trash icon of QA Tester (confirm): the contact is deleted.
Send from another user's template has no UI path (see TWW-013, API).

## Expected
Contacts, export and send return 404/403 for a user who does not own the template (same as the template detail endpoint).

## Actual
Contacts: 200 with [{"name":"QA Tester","phone":"85265248661","customVars":{"會員編號":"M0001",...}}]. Export: 200, xlsx file. Send: 400 "沒有待發送的聯繫人", meaning the ownership check passed and with pending contacts the editor would send real WhatsApp messages. Reproduced twice.

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
