---
id: TWW-032
title: "Search contacts by name or phone"
feature: contacts
priority: P2
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
The contacts search filters by name (case-insensitive) and phone digits.

## Preconditions
- An admin account (logged in session or TWW_ADMIN_USER / TWW_ADMIN_PASS in .env)
- A template with contacts (upload the phone-formats file)

## Steps
1. Log in as admin, open 聯繫人 of a template with several contacts
2. Search **dup**, then **Dup**, then **91234567**

## Expected
- Name search is case-insensitive and lists only matching contacts
- Phone digits find the contact
- 聯繫人列表 (N) shows the filtered count
