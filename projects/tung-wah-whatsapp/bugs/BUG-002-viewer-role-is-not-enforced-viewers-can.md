---
id: BUG-002
title: "Viewer role is not enforced: viewers can create templates, upload contacts and send"
severity: critical
status: open
env: local
url: "http://localhost:3000/api/twilio/templates/create"
updated: 2026-10-28T06:37:45.754Z
found: 2026-10-28T06:37:45.754Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-014, TWW-087, TWW-088]
frequency: always
---
## Summary
A user with role VIEWER (查看者) passes authorization on the write endpoints and can list every user's templates through GET /api/twilio/templates.

## Steps to reproduce
UI only (no API calls needed):
1. As admin create a QA viewer in 用戶管理 > 添加用户 (role 查看者); log in as the viewer.
2. On 消息模版 click 從 Twilio 同步: "同步成功！共 6 個模板" and all admin templates appear.
3. Click 新建模板, untick Meta, name qa_viewer_<n>, body "QA viewer draft", button OK, click 創建模板: "模板已創建！".
4. Open the new template and upload data/contacts-valid-hk.xlsx: "上傳成功！", 1 聯繫人.
5. Delete the template (cleanup) - also allowed for the viewer.

## Expected
All writes return 403 "無權限" for a viewer; the viewer only sees templates it may read.

## Actual
create -> 400 "模板名稱和內容為必填" (validation, so authorized); upload -> 500 "處理Excel失敗"; send -> 400 "沒有待發送的聯繫人"; GET /api/twilio/templates -> 200 with all of the admin's templates (GET /api/templates returns [] for the same user).

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
