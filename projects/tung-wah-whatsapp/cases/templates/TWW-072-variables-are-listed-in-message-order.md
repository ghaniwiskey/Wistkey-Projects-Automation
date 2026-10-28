---
id: TWW-072
title: "Variables are listed in message order"
feature: templates
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The mapping section is easy to follow.

## Preconditions
- An admin account (TWW_ADMIN_USER / TWW_ADMIN_PASS)

## Steps
1. Open a template whose body uses {{first_name}} before {{event_date}}

## Expected
- 變數映射配置 lists {{first_name}} first, then {{event_date}}

## Notes
Currently alphabetical (event_date first).
Related: BUG-027 (open).
