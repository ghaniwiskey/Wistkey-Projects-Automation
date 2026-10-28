---
id: BUG-031
title: "Login form: labels not linked, no autocomplete, placeholder shows the real admin email"
severity: minor
status: open
env: local
url: "http://localhost:3000/login"
updated: 2026-10-28T08:18:31.753Z
found: 2026-10-28T08:18:31.753Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-082]
frequency: always
---
## Summary
The login labels are not associated with their inputs, the inputs lack password-manager autocomplete hints, and the email placeholder exposes the real admin account rather than a generic example.

## Steps to reproduce
1. Open /login and inspect the form

## Expected
Linked labels, autocomplete="username"/"current-password", generic placeholder.

## Actual
As described.

## Evidence
- Screenshot: ![36-login-page.png](../explorations/2026-10-28-core-journeys/36-login-page.png)

## Environment
- Base URL: http://localhost:3000/login
- Env: local

## History
- 2026-10-28: Clarified the report in English and replaced personal details in the report text with placeholders; no retest or status change.
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
