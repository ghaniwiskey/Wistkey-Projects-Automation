---
id: BUG-037
title: "Viewer still sees 新建模板 (New template) and 從 Twilio 同步 (Sync) controls; creating fails only after submit with 無權限"
severity: minor
status: open
env: local
url: "http://localhost:3000/templates"
updated: 2026-10-29T09:30:37.233Z
found: 2026-10-29T09:30:37.233Z
foundBy: "BUG retest 2026-10-29 (fix commit af9a789)"
tests: [TWW-087]
frequency: always
---
## Summary
The server now blocks viewers (BUG-002 fixed), but the UI still offers the create form and sync buttons, so a viewer fills in a whole template before learning they may not create it.

## Steps to reproduce
1. As admin create a user with role 查看者 (Viewer) and log in as that user.
2. Open 消息模版 (Message templates).
3. Click 新建模板 (New template), fill name, body and a button, untick Meta submission and click 創建模板 (Create template).

## Expected
No 新建模板 (New template) button for viewers (and sync is shown only if it is meant as read-only refresh).

## Actual
Both 從 Twilio 同步 (Sync from Twilio) and 新建模板 (New template) are shown; the form opens; submitting shows the toast 無權限 (No permission). Nothing is created in Twilio.

## Evidence
- Screenshot: ![viewer UI](../runs/2026-10-29_1630_local_manual/screenshots/TWW-087-m01-tww087-viewer-ui.png)

## Environment
- Base URL: http://localhost:3000/templates
- Env: local

## History
- 2026-10-29: filed from BUG retest 2026-10-29 (fix commit af9a789) in the Test Manager app.
