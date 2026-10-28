---
id: TWW-102
title: "Upload to a template that does not exist is rejected"
feature: contacts
priority: P3
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Contacts cannot be stored without a template.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)

## Data
- templateId: qa-missing-<unique>

## Steps
1. In the browser console, POST /api/upload as FormData with a valid contact file and templateId = qa-missing-<unique>

## Expected
- 404 or 400 with a short message
- No contacts or upload record are created and no file is kept

## Notes
From the code: the route saves the file to uploads/ before the database checks the template.
