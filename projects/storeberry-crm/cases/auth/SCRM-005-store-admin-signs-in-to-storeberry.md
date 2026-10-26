---
id: SCRM-005
title: "Store admin signs in to Storeberry Flower CRM"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-26
updated: 2026-10-26
---

## Goal
The dedicated store admin can authenticate and reach the CRM workspace.

## Data
- Company, username, and password from SCRM_COMPANY, SCRM_USERNAME, and SCRM_PASSWORD in local .env.

## Steps
1. Open the staging CRM sign-in page.
2. Enter the dedicated Storeberry Flower company name, username, and password.
3. Select LOGIN.
4. Confirm that the CRM workspace opens.

## Expected
- The browser leaves the /auth/login route and reaches the CRM Get Started workspace.
- The CRM navigation shows the Get Started link.

## Notes
Staging only. Credentials are read from local .env and never hard-coded or included in reports. Automated in tests/e2e/auth/login.spec.ts.
