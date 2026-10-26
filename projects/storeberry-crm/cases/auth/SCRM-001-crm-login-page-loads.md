---
id: SCRM-001
title: "CRM login page loads with sign-in controls"
feature: auth
priority: P0
tags: [smoke]
envs: [staging]
automated: true
created: 2026-10-23
updated: 2026-10-26
---

## Goal
The staging CRM exposes its sign-in form when a user opens the root URL.

## Steps
1. Open the staging CRM root URL.
2. Review the sign-in form controls.

## Expected
- The browser reaches `/auth/login` without an HTTP error.
- The page shows the heading "Log in to your store" and company, username/email, password, and LOGIN controls.

## Notes
No credentials are entered in this case. Automated in tests/e2e/auth/login.spec.ts (page object tests/pages/login.page.ts).
