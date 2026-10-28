---
id: TWW-097
title: "Old new-template page cannot create a template that skips Twilio"
feature: templates
priority: P1
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Templates can only be created through the 新建模板 dialog, which creates them in Twilio.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- Template name qa_legacy_<unique>

## Steps
1. Open http://localhost:3000/templates/new
2. If a form appears, enter the name and click save
3. Open /templates

## Expected
- /templates/new redirects to /templates or opens the dialog, or
- a template created there exists in Twilio with a content SID (not a local-only draft that can never be sent)

## Notes
From the code: app/(dashboard)/templates/new/page.tsx posts to /api/templates, which saves only to the database (no Twilio content; header and footer prefilled). Delete the template afterwards.
