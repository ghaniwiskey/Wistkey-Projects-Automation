---
id: SPF-001
title: "Log in with the test account from .env"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-05
updated: 2026-10-06
---

## Goal
A user can log in with the test account configured in .env and reach the Dashboard. On UAT the account is passwordless (User name only).

## Preconditions
- Not logged in to ATS in this browser (Playwright starts every test with a fresh browser context).

## Data
- User name: the value of `SPF_USER` in .env
- Password: the value of `SPF_PASS` in .env (empty on UAT: passwordless account)

## Steps
1. Open the base URL. -> Expect: it redirects to `/Account/LoginBk` and shows "Asset Tracking System (ATS)" with **User name**, **Password**, **Login** and **WOG SSO**.
2. Type the `SPF_USER` value into **User name**. Type the `SPF_PASS` value into **Password** only if it is set (on UAT leave it empty).
3. Click **Login**.

## Expected
- The login page is gone: the URL no longer contains `/Account/Login` (lands on `/IndexBk`).
- The Dashboard is shown.
- The header shows the officer name, "Last Login" and a current role in the **Role** dropdown.
- The side menu shows the main modules (Dashboard, Asset, Stocktake, Report, Settings, User for Agency Admin).

## Notes
Automated in tests/e2e/auth/login.spec.ts (page objects in tests/pages). Ported from web-automation, where it passed 17/17 checks as an agentic run on 2026-10-05.
