---
id: BUG-018
title: "No protection against repeated wrong passwords"
severity: major
status: open
env: local
url: "http://localhost:3000/api/auth/callback/credentials"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.295Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-058]
frequency: always
---
## Summary
Nothing slows down or blocks password guessing. 21 wrong passwords sent in about 2 seconds were all answered immediately, and the correct password still worked right after. The app is reachable from the internet through the ngrok tunnel.

## Steps to reproduce
1. Create a QA user.
2. From a script, POST 20+ wrong passwords to the credentials callback.
3. Log in with the correct password.

## Expected
After a few failed attempts, the app slows down, locks the account, or asks for extra verification.

## Actual
All wrong attempts return 401 (unauthorized) with no delay; the correct login returns 200 (OK) right after.

## Evidence
- Screenshot: ![28-login-session.png](../explorations/2026-10-28-core-journeys/28-login-session.png)

## Environment
- Base URL: http://localhost:3000/api/auth/callback/credentials
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
