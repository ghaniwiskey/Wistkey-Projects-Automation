---
id: BUG-005
title: "QA: make next upload fail does not fail a check-out"
severity: trivial
status: open
env: staging
url: "app: Upload queue > QA simulation"
updated: 2026-11-18T08:35:26.888Z
found: 2026-11-18T08:34:54.460Z
foundBy: "explorations/2026-11-18-handheld.md"
tests: [HLM-008]
frequency: always
---
## Summary
Dev build: after 'QA: make next upload fail' ('Next upload will fail'), the next check-out still uploads and the switch resets, so retry cannot be tested this way.

## Steps to reproduce
1. Upload queue > QA: make next upload fail
2. Check-out an item (Loan) and Confirm

## Expected
The check-out upload fails and is kept in the queue.

## Actual
'Check-out uploaded - All 1 item(s) were checked out.' (001000031, 16:25:22); the switch is off again.

## Evidence
- 

## Environment
- Base URL: app: Upload queue > QA simulation
- Env: staging

## History
- 2026-11-18: filed from explorations/2026-11-18-handheld.md in the Test Manager app.
