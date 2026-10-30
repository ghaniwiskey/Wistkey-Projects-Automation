---
id: TWW-087
title: "Viewer can browse templates with accepted control visibility"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-30
---

## Goal
A viewer can browse shared campaign pages with the accepted visible controls.

## Preconditions
- A QA viewer

## Steps
1. Log in as the QA viewer
2. Open 消息模版 and a template

## Expected
- The viewer can open the template list and a shared template.
- 從 Twilio 同步 remains available as a read-only refresh.
- Creation, edit, upload, mapping, send, reset and delete controls may be visible; that visibility is accepted, not a failed check.

## Notes
BUG-037 and BUG-045 are wont-fix at the user’s decision on 2026-10-30. Visible template-list and detail write controls are accepted behavior; read-only sync remains available. Server authorization is covered separately. This task did not rerun this UI case.
