---
id: BUG-019
title: "Sessions stay valid after the user is deleted or their role changes"
severity: major
status: open
env: local
url: "http://localhost:3000/api/auth/session"
updated: 2026-10-28T07:16:23.419Z
found: 2026-10-28T07:16:23.419Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-059, TWW-060, TWW-081]
frequency: always
---
## Summary
Session tokens last 30 days and are not checked against the database. An editor's existing session keeps the EDITOR role after demotion; after deletion, the old cookie can still read templates and, because of BUG-001, another user's contacts.

## UI labels in English
- 查看者: Viewer

## Steps to reproduce
1. Log in as a QA editor in a separate session
2. As admin change the user to 查看者, read /api/auth/session
3. As admin delete the user, call /api/templates and /api/templates/<admin template>/contacts with the old cookie

## Expected
Deleted users are rejected; role changes apply immediately.

## Actual
Session role EDITOR after demotion; after deletion /api/auth/session returns the user, /api/templates 200, contacts 200 with data.

## Evidence
- Screenshot: ![28-login-session.png](../explorations/2026-10-28-core-journeys/28-login-session.png)

## Environment
- Base URL: http://localhost:3000/api/auth/session
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: logout does not revoke the token either: a session cookie copied before signout still returns the user and /api/users 200 afterwards. Linked TWW-081.
