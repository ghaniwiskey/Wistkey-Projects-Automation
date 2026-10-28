---
id: BUG-030
title: "Login ignores callbackUrl and shows the login form to logged-in users"
severity: minor
status: open
env: local
url: "http://localhost:3000/login?callbackUrl=%2Fusers"
updated: 2026-10-28T08:18:31.593Z
found: 2026-10-28T08:18:31.593Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-079]
frequency: always
---
## Summary
After login, the app always opens /templates instead of the originally requested page, such as /users. It also continues to show the login form to a user who is already logged in.

## Steps to reproduce
1. Log out, open /users (redirects to /login?callbackUrl=/users)
2. Log in
3. Open /login again

## Expected
Land on /users; /login redirects when logged in.

## Actual
/templates; login form shown again.

## Evidence
- Screenshot: ![43-login-findings.png](../explorations/2026-10-28-core-journeys/43-login-findings.png)

## Environment
- Base URL: http://localhost:3000/login?callbackUrl=%2Fusers
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
