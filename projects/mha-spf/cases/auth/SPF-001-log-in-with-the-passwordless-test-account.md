---
id: SPF-001
title: "Log in with the passwordless test account"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-05
updated: 2026-10-05
---

## Goal
A user with a valid passwordless UAT account can log in with the User name only and reach the Dashboard.

## Preconditions
- Not logged in to ATS in this browser (Playwright starts every test with a fresh browser context).

## Data
- User name: `SPF-A2216GA` (.env `SPF_AGENCY_ADMIN_USER`, passwordless)

## Steps
1. Open the base URL. -> Expect: it redirects to `/Account/LoginBk` and shows "Asset Tracking System (ATS)" with **User name**, **Password**, **Login** and **WOG SSO**.
2. Type `SPF-A2216GA` into **User name** and leave **Password** empty.
3. Click **Login**.

## Expected
- The login page is gone: the URL no longer contains `/Account/Login` (lands on `/IndexBk`).
- The Dashboard is shown.
- The header shows the officer name, "Last Login" and a current role in the **Role** dropdown.
- The side menu shows the main modules (Dashboard, Asset, Stocktake, Report, Settings, User for Agency Admin).

## Notes
Automated in tests/e2e/auth/login.spec.ts (page objects in tests/pages). Ported from web-automation, where it passed 17/17 checks as an agentic run on 2026-10-05.
