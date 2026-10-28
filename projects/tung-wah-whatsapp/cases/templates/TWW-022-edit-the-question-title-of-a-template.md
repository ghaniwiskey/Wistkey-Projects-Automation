---
id: TWW-022
title: "Edit the question title of a template"
feature: templates
priority: P2
tags: [regression, writes]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The question title (report row 3) can be edited and persists.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Steps
1. Log in as admin, open a QA draft template
2. Click 編輯 next to the question title, enter **Edited QA title**, click 儲存
3. Reload the page

## Expected
- The header shows 問題：Edited QA title after reload
