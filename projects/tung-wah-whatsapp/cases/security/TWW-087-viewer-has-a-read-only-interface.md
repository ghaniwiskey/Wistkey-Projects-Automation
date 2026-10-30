---
id: TWW-087
title: "Viewer has a read-only interface"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
查看者 cannot start any write action from the UI.

## Preconditions
- A QA viewer

## Steps
1. Log in as the QA viewer
2. Open 消息模版 and a template

## Expected
- No 新建模板, edit, upload, mapping save, send, reset or delete controls
- 從 Twilio 同步 remains available as a read-only refresh

## Notes
Viewers may use read-only sync. BUG-002 verified that the server blocks writes. BUG-037 covers New template on the template list; BUG-045 covers edit/delete/upload/mapping/send controls on template details, evidenced in runs/2026-10-30_1349_local_manual under TWW-105. This tracking update is not a new execution of TWW-087.
