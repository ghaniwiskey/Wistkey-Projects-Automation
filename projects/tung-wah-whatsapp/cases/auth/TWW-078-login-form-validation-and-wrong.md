---
id: TWW-078
title: "Login form validation and wrong password message"
feature: auth
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
Bad input is caught and failed logins reveal nothing.

## Preconditions
- An admin account (TWW_ADMIN_* or TWW_QA_ADMIN_* in .env)

## Steps
1. Open /login and click 登錄 with empty fields
2. Enter email "not-an-email"
3. Enter a valid email with a wrong password

## Expected
- Empty fields and bad email are blocked in the form
- Wrong password shows "郵箱或密碼錯誤" (same text for unknown emails); the email stays filled
