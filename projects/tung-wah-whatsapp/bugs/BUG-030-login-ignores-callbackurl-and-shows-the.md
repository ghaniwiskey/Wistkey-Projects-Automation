---
id: BUG-030
title: "Login ignores callbackUrl and shows the login form to logged-in users"
severity: minor
status: open
env: local
url: "http://localhost:3000/login?callbackUrl=%2Fusers"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T08:18:31.593Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-079]
frequency: always
---
## Summary
After login the user always lands on /templates, losing the page they asked for, and /login still shows the login form to a logged-in user.

## Steps to reproduce
1. Log out, then open http://localhost:3000/users. The app redirects to /login?callbackUrl=%2Fusers.
2. Log in.
3. Open http://localhost:3000/login again.

## Expected
After login the user lands on /users. Opening /login while logged in redirects away.

## Actual
The user lands on /templates (callbackUrl is ignored), and the login form is shown again.

## Evidence
- Screenshot: ![43-login-findings.png](../explorations/2026-10-28-core-journeys/43-login-findings.png)

## Environment
- Base URL: http://localhost:3000/login?callbackUrl=%2Fusers
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
