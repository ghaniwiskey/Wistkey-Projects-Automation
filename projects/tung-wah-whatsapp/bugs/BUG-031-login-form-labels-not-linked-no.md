---
id: BUG-031
title: "Login form: labels not linked, no autocomplete, placeholder shows the real admin email"
severity: minor
status: open
env: local
url: "http://localhost:3000/login"
updated: 2026-10-28T08:47:00.399Z
found: 2026-10-28T08:18:31.753Z
foundBy: "explorations/2026-10-28-core-journeys.md"
tests: [TWW-082]
frequency: always
---
## Summary
Three problems on the login form:
- The 郵箱 (Email) and 密碼 (Password) labels are not linked to their inputs.
- The inputs have no autocomplete hints for password managers.
- The email placeholder is the real admin account "admin@tungwah.org".

## Steps to reproduce
1. Open /login and inspect the form.

## Expected
Labels linked to their inputs, autocomplete="username" and autocomplete="current-password", and a generic placeholder.

## Actual
Labels not linked, no autocomplete hints, and the placeholder "admin@tungwah.org".

## Evidence
- Screenshot: ![36-login-page.png](../explorations/2026-10-28-core-journeys/36-login-page.png)

## Environment
- Base URL: http://localhost:3000/login
- Env: local

## History
- 2026-10-28: filed from explorations/2026-10-28-core-journeys.md in the Test Manager app.
- 2026-10-28: rewrote Summary, Steps, Expected and Actual in plain English with English translations of the Chinese UI text; facts unchanged, no retest, status unchanged.
