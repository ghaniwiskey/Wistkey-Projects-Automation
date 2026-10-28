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
1. As admin, create a QA editor user (e.g. qa-editor-<unique>@example.test)
2. Log in as the editor in a separate session
3. GET /api/templates/cmvongu2t0005kjy3stn25txd (admin's attendance_confirmation) -> 404 "未找到"
4. GET /api/templates/cmvongu2t0005kjy3stn25txd/contacts
5. GET /api/templates/cmvongu2t0005kjy3stn25txd/export
6. POST /api/send {"templateId":"cmvongu2t0005kjy3stn25txd"} (all contacts already sent, so nothing goes out)

## Expected
Contacts, export and send return 404/403 for a user who does not own the template (same as the template detail endpoint).

## Actual
Contacts: 200 with [{"name":"QA Tester","phone":"85265248661","customVars":{"會員編號":"M0001",...}}]. Export: 200, xlsx file. Send: 400 "沒有待發送的聯繫人", meaning the ownership check passed and with pending contacts the editor would send real WhatsApp messages. Reproduced twice.

## Evidence
- API responses: ../explorations/2026-10-28-core-journeys/11-editor-api-probe.txt
- Screenshot: ![api probe](../explorations/2026-10-28-core-journeys/11-editor-api-probe.png)

## Environment
- Base URL: http://localhost:3000/api/templates/<id>/contacts
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: also writes: a QA editor ran 全部重置 ("重置成功！") and deleted a contact on the admin template; the contacts page shows the data in the UI (40-editor-sees-admin-contacts.png). Linked TWW-084.
