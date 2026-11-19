---
id: BUG-018
title: "Gantry > Gantry Whitelist menu link opens Gantry Setup"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/gantrysetup"
updated: 2026-11-19T06:26:06.445Z
found: 2026-11-19T06:26:06.445Z
foundBy: "explorations/2026-11-19-coverage-review.md"
tests: [HLW-064]
frequency: always
---
## Summary
Since the 19/11 deploy the Gantry Whitelist menu entry points to /gantrysetup. The whitelist page still works at /gantrywhitelist but cannot be reached from the menu.

## Steps to reproduce
1. Log in as ADMIN
2. Gantry > Gantry Whitelist

## Expected
The Gantry Whitelist page.

## Actual
Gantry Setup (URL /gantrysetup).

## Evidence
- BUG-gantry-whitelist-link.png

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/gantrysetup
- Env: staging

## History
- 2026-11-19: filed from explorations/2026-11-19-coverage-review.md in the Test Manager app.
