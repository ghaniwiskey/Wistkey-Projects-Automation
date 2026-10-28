---
id: BUG-002
title: "Viewer role is not enforced: viewers can create templates, upload contacts and send"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/twilio/templates/create"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T06:37:45.754Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-014, TWW-087, TWW-088]
frequency: always
---
## Summary
A user with the Viewer role (查看者) should only be able to read, but the server lets them do write actions: create templates, upload contacts and send. A viewer can also see every user's templates through GET /api/twilio/templates (the 從 Twilio 同步 / Sync from Twilio button).

## Steps to reproduce
UI only (no API calls needed):
1. As admin, go to 用戶管理 (User management) > 添加用户 (Add user) and create a QA viewer (role 查看者 / Viewer). Log in as the viewer.
2. On 消息模版 (Message templates), click 從 Twilio 同步 (Sync from Twilio). "同步成功！共 6 個模板" ("Sync successful! 6 templates in total") appears and all of the admin's templates are listed.
3. Click 新建模板 (New template), untick Meta, enter name qa_viewer_<n>, body "QA viewer draft", button OK, and click 創建模板 (Create template). "模板已創建！" ("Template created!") appears.
4. Open the new template and upload data/contacts-valid-hk.xlsx. "上傳成功！" ("Upload successful!") appears, with 1 聯繫人 (1 contact).
5. Delete the template to clean up. The viewer is allowed to do this too.

## Expected
Every write action returns 403 "無權限" ("No permission") to a viewer, and the viewer only sees templates it is allowed to read.

## Actual
API responses for the viewer:
- create: 400 "模板名稱和內容為必填" ("Template name and content are required"). This is a form check, so the permission check already passed.
- upload: 500 "處理Excel失敗" ("Failed to process Excel"), not a permission error.
- send: 400 "沒有待發送的聯繫人" ("No contacts waiting to be sent"), not a permission error.
- GET /api/twilio/templates: 200 (OK) with all of the admin's templates, while GET /api/templates returns [] (empty list) for the same user.

## Evidence
- Screenshot: ![viewer sync](../explorations/2026-10-28-core-journeys/48-ui-viewer-sync.png)
- Screenshot: ![viewer created](../explorations/2026-10-28-core-journeys/49-ui-viewer-created-and-uploaded.png)
- API responses: ../explorations/2026-10-28-core-journeys/11-editor-api-probe.txt
- Screenshot: ![api probe](../explorations/2026-10-28-core-journeys/11-editor-api-probe.png)

## Environment
- Base URL: http://localhost:3000/api/twilio/templates/create
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: UI check: the viewer gets the same UI as an editor (新建模板 form, sync); an editor's 從 Twilio 同步 lists all admin templates (41-editor-after-sync.png). Linked TWW-087, TWW-088.
- 2026-10-28: steps rewritten as UI-only and reproduced in the browser (viewer: sync shows admin templates, create template, upload contacts, delete own template).
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
