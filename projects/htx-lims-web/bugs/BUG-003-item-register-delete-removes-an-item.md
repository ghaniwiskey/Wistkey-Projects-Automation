---
id: BUG-003
title: "Item Register Delete removes an item without asking for confirmation"
severity: minor
status: open
env: staging
url: "https://htx.eastus.cloudapp.azure.com:5001/itemregister"
updated: 2026-11-18T03:56:54.325Z
found: 2026-11-18T03:56:54.325Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-037]
frequency: always
---
## Summary
Delete on a registered (unprinted) item removes it with one click, no confirmation, while PO Management and Item Type ask 'Are you sure you want to perform this operation?'.

## Steps to reproduce
1. Log in as a User
2. Registration > Item Register > register an item
3. Click Delete on its row

## Expected
A confirmation before the item is deleted, as on the other Delete buttons.

## Actual
The item is deleted at once (e.g. 003000025 at 11:38:53).

## Evidence
- Audit Trail: 'Item register deleted Item 003000025 QA chem 122612'

## Environment
- Base URL: https://htx.eastus.cloudapp.azure.com:5001/itemregister
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-web-testing.md in the Test Manager app.
