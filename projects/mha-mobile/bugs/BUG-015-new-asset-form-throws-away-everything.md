---
id: BUG-015
title: "New Asset form throws away everything typed when the user presses Back (no warning)"
severity: minor
status: open
env: staging
url: Mobile app New Asset (Report New Asset)
found: 2026-10-22
foundBy: "explorations/2026-10-22-bug-hunt-edges.md"
tests: []
frequency: always
---
## Summary
A half-filled Report New Asset form (condition, remarks, postal code, location remarks) is discarded by Android Back without any question; reopening New Asset shows an empty form. The FAVE screens do warn before leaving ('Are you sure you want to exit without uploading?').

## Steps to reproduce
1. Stocktaker | 332140 > New Asset
2. Fill Asset Condition, Remarks, Postal Code, location Remarks
3. Hide the keyboard, press Back
4. Open New Asset again

## Expected
A 'Discard changes?' confirmation, or the draft kept.

## Actual
Goes straight to home; the form is empty when reopened.

## Evidence
- Seen 2026-10-22 09:48 WIB; no screenshot (the result is an empty form)

## Environment
- Base URL: Mobile app New Asset (Report New Asset)
- Env: staging

## History
- 2026-10-22: filed from explorations/2026-10-22-bug-hunt-edges.md in the Test Manager app.
