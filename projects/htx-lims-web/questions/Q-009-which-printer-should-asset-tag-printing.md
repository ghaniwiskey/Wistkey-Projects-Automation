---
id: Q-009
title: "Which printer should Asset Tag Printing use on UAT?"
status: closed
askedTo: "user"
env: staging
found: 2026-11-18T04:14:57.996Z
foundBy: "explorations/2026-11-18-web-testing.md"
tests: [HLW-013, HLW-038, HLW-039]
bugs: []
updated: 2026-11-18T04:20:20.152Z
answered: 2026-11-18T04:20:20.003Z
---
## Question
Asset Tag Printing has no printer to choose on UAT, so 'Print' says 'Select a printer first. Nothing was printed.' Can a Zebra printer (or a test printer) be set up so the printing cases can run?

## Context
2026-11-18: Printer list empty; QA items 001000031, 002000017, 003000025 are registered and waiting to be printed.

## Answer
Use the printer named test (user, 2026-11-18). HLW-013 and HLW-039 pass with it; HLW-038 stays blocked because the tag type is not visible in the web.

## History
- 2026-11-18: asked from explorations/2026-11-18-web-testing.md.
- 2026-11-18: answer recorded; status open -> answered.
- 2026-11-18: status answered -> closed.
