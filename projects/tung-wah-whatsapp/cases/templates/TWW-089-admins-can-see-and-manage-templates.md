---
id: TWW-089
title: "Admins can see and manage templates created by other admins"
feature: templates
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-29
---

## Goal
Any admin can take over another admin's campaigns.

## Preconditions
- Two admin accounts (admin@tungwah.org and the QA admin)

## Steps
1. Log in as the QA admin
2. Open 消息模版 and a template created by admin@tungwah.org, its 聯繫人 and 回覆統計

## Expected
- The template is listed and can be opened, edited and managed

## Notes
Q-009 answered 2026-10-29: admins see and manage all templates. Passes since af9a789 (2026-10-29: the QA admin listed and used admin@tungwah.org's templates).
