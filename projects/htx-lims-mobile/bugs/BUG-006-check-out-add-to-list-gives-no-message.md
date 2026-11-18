---
id: BUG-006
title: "Check-out Add to list gives no message when due date or remarks are missing"
severity: minor
status: open
env: staging
url: "app: Check-out"
updated: 2026-11-18T08:35:27.004Z
found: 2026-11-18T08:34:54.579Z
foundBy: "explorations/2026-11-18-handheld.md"
tests: [HLM-006]
frequency: always
---
## Summary
In 'Add to check-out' with type Loan, tapping Add to list without Due date and Remarks does nothing: no message says what is missing.

## Steps to reproduce
1. Handheld: Check-out, find an IN item, Select type Loan
2. Leave Due date and Remarks empty, tap Add to list

## Expected
A message for each missing required field (Due date *, Remarks *).

## Actual
The dialog stays open with no message.

## Evidence
- 

## Environment
- Base URL: app: Check-out
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-handheld.md in the Test Manager app.
