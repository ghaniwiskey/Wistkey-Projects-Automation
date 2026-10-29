---
id: BUG-036
title: "Logout does not invalidate the session token: a copied session cookie still works after 退出"
severity: major
status: open
env: local
url: "http://localhost:3000/api/auth/signout"
updated: 2026-10-29T09:30:37.073Z
found: 2026-10-29T09:30:37.073Z
foundBy: "BUG retest 2026-10-29 (fix commit af9a789)"
tests: [TWW-081]
frequency: always
---
## Summary
Sessions are 30-day JWT cookies that are only checked for the user's existence and role. Logging out deletes the cookie in that browser but does not revoke it, so a copy keeps working for up to 30 days. Split out of BUG-019, whose role-change and deleted-user parts are fixed.

## Steps to reproduce
1. Log in as any user and copy the next-auth.session-token cookie (F12 > Application > Cookies).
2. Click 退出 (Log out).
3. In another browser, add the copied cookie for localhost and open http://localhost:3000/api/auth/session and http://localhost:3000/api/templates.

## Expected
The copied cookie is rejected after logout (empty session, 401).

## Actual
/api/auth/session still returns the user with role and a new expiry 30 days ahead; /api/templates returns 200.

Our run (2026-10-29): QA viewer session, signout POST returned, then the copied cookie gave {"user":{..."role":"VIEWER"},"expires":"2026-11-28..."} and /api/templates 200 [].

## Evidence
- Requests: POST /api/auth/signout, then GET /api/auth/session with the old cookie -> 200 with the user

## Environment
- Base URL: http://localhost:3000/api/auth/signout
- Env: local

## History
- 2026-10-29: filed from BUG retest 2026-10-29 (fix commit af9a789) in the Test Manager app.
