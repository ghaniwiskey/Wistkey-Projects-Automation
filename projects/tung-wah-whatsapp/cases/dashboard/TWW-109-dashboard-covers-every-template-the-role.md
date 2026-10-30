---
id: TWW-109
title: "Dashboard covers every template the user's role can see"
feature: dashboard
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-29
updated: 2026-10-30
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
Role-scoped totals and message records cover all templates for fresh admins, editors and viewers. BUG-041 verified in runs/2026-10-30_1349_local_manual: matching cards and message IDs across roles, plus a shared-template filter returning its contact. The separate local-only status-table omission is BUG-043, covered by TWW-108.
