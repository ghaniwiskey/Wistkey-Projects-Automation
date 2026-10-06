---
id: SPF-003
title: "Log out ends access to protected pages"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-06
updated: 2026-10-06
---

## Goal
Logout ends the session: the user lands on the login page and cannot open app pages without logging in again.

## Preconditions
- Logged in as the test account (`SPF_USER` in .env) (any role)

## Data
- Protected page: `/Asset/Asset` (Asset Listing)

## Steps
1. On the Dashboard, click **Logout** in the header.
2. Open `/Asset/Asset` directly in the address bar.

## Expected
- After step 1 the URL is `/Account/LoginBk` and the login form (User name, Login) is shown.
- After step 2 the app redirects to `/Account/LoginBk?ReturnUrl=%2FAsset%2FAsset` and shows the login form, not the Asset Listing.

## Notes
Logging out ends the shared test account session; the role fixture logs in again for later tests.

Automated in tests/e2e/auth/logout.spec.ts (page objects in tests/pages). Passed 2 runs in a row on 2026-10-06.
