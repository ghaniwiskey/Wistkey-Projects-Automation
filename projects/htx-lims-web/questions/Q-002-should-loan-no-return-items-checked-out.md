---
id: Q-002
title: "Should Loan / No return items checked out before 11 Nov be on the gantry whitelist?"
status: open
askedTo: "user"
env: staging
found: 2026-11-18T03:32:23.160Z
foundBy: "explorations/2026-11-18-gantry-api.md"
tests: [HLW-033]
bugs: []
updated: 2026-11-18T03:32:23.160Z
answered: ""
---
## Question
Six items checked out on Loan or No return on 8-9 Nov 2026 are not on the gantry whitelist (GET /api/Gantry), so they would raise an Unauthorized removal alert at an exit gantry. Every Loan / No return check-out since 11 Nov is whitelisted. Is this old data from before the whitelist existed (fix the data), or a bug?

## Context
2026-11-18 data check: not whitelisted 001000002, 003000001, 003000002, 002000002 (No return) and 001000012, 001000013 (Loan); checked out 08-09/11/2026. For use items are correctly not whitelisted.

## Answer
Not answered yet.

## History
- 2026-11-18: asked from explorations/2026-11-18-gantry-api.md.
