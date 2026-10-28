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
tests: [TWW-014]
frequency: always
---
## Summary
A user with role VIEWER (查看者) passes authorization on the write endpoints and can list every user's templates through GET /api/twilio/templates.

## Steps to reproduce
1. As admin, set a QA user to 查看者
2. Log in as that viewer in a separate session
3. POST /api/twilio/templates/create {}
4. POST /api/upload {}
5. POST /api/send {"templateId":"<template with no pending contacts>"}
6. GET /api/twilio/templates

## Expected
All writes return 403 "無權限" for a viewer; the viewer only sees templates it may read.

## Actual
create -> 400 "模板名稱和內容為必填" (validation, so authorized); upload -> 500 "處理Excel失敗"; send -> 400 "沒有待發送的聯繫人"; GET /api/twilio/templates -> 200 with all of the admin's templates (GET /api/templates returns [] for the same user).

## Evidence
- API responses: ../explorations/2026-10-28-core-journeys/11-editor-api-probe.txt
- Screenshot: ![api probe](../explorations/2026-10-28-core-journeys/11-editor-api-probe.png)

## Environment
- Base URL: http://localhost:3000/api/twilio/templates/create
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
