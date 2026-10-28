---
id: BUG-018
title: "No protection against repeated wrong passwords"
severity: major
status: open
env: local
url: "http://localhost:3000/api/auth/callback/credentials"
updated: 2026-10-28T09:08:46.326Z
found: 2026-10-28T07:16:23.295Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-058]
frequency: always
---
## Summary
There is no protection against password guessing: many wrong passwords in a row are answered instantly and never lock or slow down the account.

## Steps to reproduce
1. Create a test user (or use your own test account).
2. On /login, enter that email with a wrong password and click 登錄 (Log in). Repeat 20+ times as fast as you can.
3. Log in with the correct password.

## Expected
After a few failures, the app slows down, locks the account, or asks for extra verification.

## Actual
Every wrong attempt is answered immediately with 郵箱或密碼錯誤 ("Wrong email or password"), and the correct password works right after.

Our run: a script sent 21 wrong passwords to /api/auth/callback/credentials in about 2 seconds: all 401 (unauthorized) with no delay; the correct login then returned 200 (OK). The app was reachable from the internet through the ngrok tunnel.

## Evidence
- Screenshot: ![28-login-session.png](../explorations/2026-10-28-core-journeys/28-login-session.png)

## Environment
- Base URL: http://localhost:3000/api/auth/callback/credentials
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
