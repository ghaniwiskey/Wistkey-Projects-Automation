---
id: BUG-019
title: "Sessions stay valid after the user is deleted or their role changes"
severity: major
status: verified
env: local
url: "http://localhost:3000/api/auth/session"
updated: 2026-10-29T09:31:39.074Z
found: 2026-10-28T07:16:23.419Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-059, TWW-060]
frequency: always
---
## Summary
Login sessions are not checked against the database, so a deleted user or a user whose role was lowered keeps their old access for up to 30 days.

## Steps to reproduce
1. As admin, create a user with role 編輯者 (Editor). In a second browser (or a private window), log in as that editor.
2. As admin, change that user's role to 查看者 (Viewer). In the editor's window, open http://localhost:3000/api/auth/session
3. As admin, delete the user. In the editor's window, open http://localhost:3000/api/auth/session , http://localhost:3000/api/templates and http://localhost:3000/api/templates/<admin template id>/contacts

## Expected
Role changes apply at once; a deleted user is logged out and gets no data.

## Actual
- Step 2: the session still says role EDITOR.
- Step 3: the session still returns the user, /api/templates returns 200 (OK), and the contacts call returns 200 with data (through BUG-001).
- Sessions are 30-day tokens that are never re-checked against the database.

## Evidence
- Screenshot: ![28-login-session.png](../explorations/2026-10-28-core-journeys/28-login-session.png)

## Environment
- Base URL: http://localhost:3000/api/auth/session
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: logout does not revoke the token either: a session cookie copied before signout still returns the user and /api/users 200 afterwards. Linked TWW-081.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
- 2026-10-28: steps made reproducible on any local setup (placeholders <P>, <template id>, <n> and test data described row by row instead of our template IDs, phone and data files); Summary shortened to 1-2 sentences; our observed values kept under Actual ("Our run").
- 2026-10-29: status open -> verified; Retest passed in runs/2026-10-29_1630_local_manual (dev fix af9a789): role change and deletion apply to existing sessions (API 401). Leftovers filed separately: BUG-035 (deleted user's pages crash with 500, TWW-059) and BUG-036 (logout does not revoke the token, TWW-081 moved there)..
