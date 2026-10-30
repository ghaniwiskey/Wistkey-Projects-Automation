---
id: BUG-003
title: "Registration with an impossible birthday stores today's date"
severity: major
status: wont-fix
env: staging
url: "https://storeberry-flower.stagingl10.storeberry.xyz/register"
updated: 2026-10-30T05:45:51.373Z
found: 2026-10-27
foundBy: "explorations/2026-10-27-eshop-critical.md"
tests: []
frequency: always
---
## Summary
Registering with Birthday (MM-DD) 02-30 succeeds without a validation message, and the CRM member record shows birthday 10-27 (the registration day). Same root cause as the CRM customer edit birthday bug.

## Steps to reproduce
1. Open /register on the staging eShop
2. Fill valid name, unique @example.com email, password, and type 02-30 in Birthday (MM-DD)
3. Agree to the policy and Register
4. In the CRM, open the new member > Edit and read Birthday

## Expected
Registration is blocked with a birthday validation message.

## Actual
Registration succeeds; CRM shows Birthday 10-27 for member MEMy001164525.

## Evidence
- CRM counterpart: projects/storeberry-crm/bugs (Invalid customer birthday is silently saved as today's date).

## Environment
- Base URL: https://storeberry-flower.stagingl10.storeberry.xyz/register
- Env: staging

## History
- 2026-10-27: filed from explorations/2026-10-27-eshop-critical.md in the Test Manager app.
- 2026-10-29: status open -> wont-fix.
- 2026-10-30: Closed as wont-fix: linked cases updated to the accepted behavior (SBF-007 no longer checks the birthday); tests list emptied..
