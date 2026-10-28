---
id: TWW-072
title: "Variable mapping lists every template variable"
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
- 變數映射配置 lists both {{first_name}} and {{event_date}}
- Order is not checked: alphabetical order is accepted (BUG-027, wont-fix)

## Notes
BUG-027, closed as wont-fix (2026-10-28): the expected result above checks the accepted behavior.
