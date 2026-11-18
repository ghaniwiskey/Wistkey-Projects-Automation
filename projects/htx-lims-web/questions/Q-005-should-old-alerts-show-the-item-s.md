---
id: Q-005
title: "Should old alerts show the item's current number, and stay open after the expiry date changes?"
status: open
askedTo: "user"
env: staging
found: 2026-11-18T03:57:12.629Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-045]
bugs: []
updated: 2026-11-18T03:57:12.629Z
answered: ""
---
## Question
Alerts raised before ~10 Nov name items by an old number format (e.g. 'Formaldehyde 37% (Item Number IFD-1-000035 ...)' for the item now numbered 003000012), so they cannot be searched in Item Information. And the open Expired alert for QWE (IFD-1-000018, expired 09/11/2026) stays on the Dashboard although that item's expiry is now 30/11/2027. Should alerts show the current item number, and should an alert close itself when its cause is gone?

## Context
2026-11-18 Dashboard and GET /api/inventory/alerts?includeAcknowledged=true; item 003000005 QWE expiry 2027-11-30.

## Answer
Not answered yet.

## History
- 2026-11-18: asked from explorations/2026-11-18-web-testing.md.
