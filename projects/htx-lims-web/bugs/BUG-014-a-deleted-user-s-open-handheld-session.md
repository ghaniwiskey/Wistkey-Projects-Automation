---
id: BUG-014
title: "A deleted user's open handheld session keeps working"
severity: major
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/usermanagement"
updated: 2026-11-19T06:26:05.883Z
found: 2026-11-19T06:26:05.883Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-053]
frequency: always
---
## Summary
After an administrator deletes a user, a handheld already signed in as that user still downloads data (Update all data) more than a minute later. New sign-ins are refused correctly (handheld and web).

## Steps to reproduce
1. Create QA user QADEL539047 (User)
2. Sign the handheld in as QADEL539047
3. As ADMIN delete the user in System > User Management
4. Wait one minute, tap Update all data on the handheld

## Expected
The handheld session is refused (sign-in screen or error).

## Actual
"Data downloaded" succeeds as the deleted user; only a new sign-in fails ("Username or password is incorrect").

## Evidence
- HLW-053 screenshot of the handheld after deletion

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/usermanagement
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
