---
id: TWW-057
title: "Report shows the text of free-text replies"
feature: reports
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Staff can read what members typed.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)
- A contact with a free-text reply (TWW-041)

## Steps
1. Download the report of the template

## Expected
- 回覆內容 shows the typed text (e.g. "maybe later"), optionally with the 其它 category
- 數據統計 counts it under 其他

## Notes
Related: BUG-015 verified 2026-10-29 (dev fix af9a789).
