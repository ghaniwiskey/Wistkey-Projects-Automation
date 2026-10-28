---
id: TWW-087
title: "Viewer has a read-only interface"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
查看者 cannot start any write action from the UI.

## Preconditions
- A QA viewer

## Steps
1. Log in as the QA viewer
2. Open 消息模版 and a template

## Expected
- No 新建模板, 從 Twilio 同步, upload, mapping save, send, reset or delete controls

## Notes
Related: BUG-002 (open).
