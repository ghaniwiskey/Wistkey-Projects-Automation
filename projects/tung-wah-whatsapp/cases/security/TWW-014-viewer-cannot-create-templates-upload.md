---
id: TWW-014
title: "Viewer cannot create templates, upload contacts or send"
feature: security
priority: P0
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The 查看者 role is read-only.

## Steps
1. As admin, set a QA user to 查看者
2. Log in as that viewer
3. Call template create, contact upload and send with empty or harmless bodies
4. Open the templates list

## Expected
- Create, upload and send return 403 "無權限"
- The viewer sees only templates it may read; other users' templates are not listed

## Notes
Send body must use a template with no pending contacts. Empty bodies keep anything from being created in Twilio.
Related: BUG-002 (open).
