---
id: BUG-019
title: "Sessions stay valid after the user is deleted or their role changes"
severity: major
status: open
env: local
url: "http://localhost:3000/api/auth/session"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T07:16:23.419Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-059, TWW-060, TWW-081]
frequency: always
---
## Summary
Login sessions are tokens that last 30 days, and the app does not check them against the database. So:
- After an admin lowers a user's role, that user's session still says EDITOR.
- After an admin deletes a user, the old session cookie can still read templates and (through BUG-001) other users' contacts.

## Steps to reproduce
1. Log in as a QA editor in a separate session.
2. As admin, change that user's role to 查看者 (Viewer). Then read /api/auth/session in the editor's session.
3. As admin, delete the user. With the old cookie, call /api/templates and /api/templates/<admin template>/contacts.

## Expected
Deleted users are rejected; role changes apply immediately.

## Actual
- After the role change, the session role is still EDITOR.
- After deletion, /api/auth/session still returns the user, /api/templates returns 200 (OK), and the contacts call returns 200 with data.

## Evidence
- Screenshot: ![28-login-session.png](../explorations/2026-10-28-core-journeys/28-login-session.png)

## Environment
- Base URL: http://localhost:3000/api/auth/session
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: logout does not revoke the token either: a session cookie copied before signout still returns the user and /api/users 200 afterwards. Linked TWW-081.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
