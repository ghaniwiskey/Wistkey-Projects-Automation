---
id: TWW-088
title: "Sync shows every template to editors and viewers"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
從 Twilio 同步 gives every role the full template list.

## Preconditions
- A QA editor and a QA viewer created by the admin (delete afterwards)

## Steps
1. Log in as the QA editor (owns no templates) and click 從 Twilio 同步
2. Log in as the QA viewer and click 從 Twilio 同步

## Expected
- Both see the same templates as the admin
- The viewer's sync does not change data (TWW-106)

## Notes
Intended roles (product owner, 2026-10-29): admin = everything incl. 用戶管理; editor = sync and create/edit/delete every template, no 用戶管理; viewer = sees every template and can sync, read-only. Fails on BUG-038 (editor) and BUG-039 (viewer), both open: since af9a789 both lists are empty. Expectation changed 2026-10-29 (it used to say only own templates).
