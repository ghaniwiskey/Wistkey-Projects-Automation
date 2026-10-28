---
id: TWW-080
title: "Login does not redirect to external sites"
feature: security
priority: P1
tags: [regression]
envs: [all]
automated: false
created: 2026-10-28
updated: 2026-10-28
---

## Goal
callbackUrl cannot be used for phishing redirects.

## Preconditions
- An admin account (TWW_ADMIN_* or TWW_QA_ADMIN_* in .env)

## Steps
1. Open /login?callbackUrl=https://example.com/phish
2. Log in

## Expected
- The user lands on a page of the app, never on example.com
