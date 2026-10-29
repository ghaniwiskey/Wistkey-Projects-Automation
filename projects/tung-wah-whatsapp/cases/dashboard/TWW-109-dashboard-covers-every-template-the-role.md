---
id: TWW-109
title: "Dashboard covers every template the user's role can see"
feature: dashboard
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-29
---

## Goal
Admins, editors and viewers see dashboard totals and message records for every template, as the intended roles say (context.md, product owner 2026-10-29).

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A template created by admin@tungwah.org with contacts, and a QA admin, a QA editor and a QA viewer (created per test, deleted afterwards)

## Steps
1. Log in as each QA user and open 儀表板
2. Compare 總模板數, 總聯繫人數 and 消息記錄 with admin@tungwah.org's dashboard

## Expected
- Each role sees the same totals and records for all templates
- A viewer sees them read-only

## Notes
From the code (2026-10-29): /api/dashboard/stats and /api/dashboard/messages filter by createdBy = the logged-in user, so other users' templates are left out. Same root cause as BUG-038/BUG-039 on the template list. Related: Q-009.