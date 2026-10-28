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
郵箱/密碼 labels are not associated with the inputs, the inputs have no autocomplete hints for password managers, and the email placeholder is the real admin account "admin@tungwah.org".

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
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
