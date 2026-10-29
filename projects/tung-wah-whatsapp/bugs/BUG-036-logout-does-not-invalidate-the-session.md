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
1. In Chrome, log in at http://localhost:3000 as any test user.
2. Press F12 > Application > Cookies > http://localhost:3000 and copy the Value of next-auth.session-token.
3. Click 退出 (Log out) in the app.
4. Open a different browser (e.g. Edge) or a private window and go to http://localhost:3000/login.
5. Press F12 > Application > Cookies > http://localhost:3000, double-click the empty row and add a cookie named next-auth.session-token with the value you copied.
6. Open http://localhost:3000/templates (or http://localhost:3000/api/auth/session).

## Expected
After logout the copied cookie no longer works: the login page opens, and the APIs return an empty session and 401.

## Actual
Step 6: you are logged in as that user, although you logged out in step 3; /api/auth/session returns the user and role with a new expiry 30 days ahead.

Our run (2026-10-29): QA viewer, signout POST returned, then the copied cookie gave {"user":{..."role":"VIEWER"},"expires":"2026-11-28..."} and /api/templates 200 []. Retest the same day as QA admin: role ADMIN, expires 2026-11-28, /api/templates 200 (6 templates), admin-only /api/users 200.

## Evidence
- Requests: POST /api/auth/signout, then GET /api/auth/session with the old cookie -> 200 with the user

## Environment
- Base URL: http://localhost:3000/api/auth/signout
- Env: local

## History
- 2026-10-29: filed from BUG retest 2026-10-29 (fix commit af9a789) in the Test Manager app.
- 2026-10-29: steps rewritten as browser steps (DevTools > Application > Cookies, no console); facts unchanged.
